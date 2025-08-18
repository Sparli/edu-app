"use client";

import Navbar from "@/app/components/Navbar";
import { useSearchParams } from "next/navigation";
import type { Language, Level, Subject, Difficulty } from "../types/content";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import GeneratedContent from "@/app/components/GeneratedContent";
import { useState, useEffect, useRef, useCallback } from "react";
import authApi from "../utils/authApi";
import { useRouter } from "next/navigation";
import type { GenerateRequest } from "@/app/types/content";
import { saveGenerated, loadGenerated } from "@/app/utils/cacheContent";
import type { AxiosError } from "axios";
import type { GeneratedContent as IContent } from "../types/content";
import Generate from "../components/Generate";
import { clearReflectionCache } from "../utils/cache";
import { clearSavedSessionData } from "../utils/clearSession"; // adjust path as needed
import { useProfile } from "@/app/context/ProfileContext";
import { getUserProfile } from "@/app/utils/getUserProfile";

// Simple debounce utility
const debounceAsync = <Args extends unknown[]>(
  func: (...args: Args) => Promise<void>,
  wait: number
): ((...args: Args) => Promise<void>) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Args) =>
    new Promise((resolve, reject) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try {
          await func(...args);
          resolve();
        } catch (err) {
          console.error("Debounced function error:", err);
          reject(err);
        }
      }, wait);
    });
};

export default function GenerateClient() {
  const router = useRouter();
  const [content, setContent] = useState<IContent | null>(null);
  const [meta, setMeta] = useState<GenerateRequest | null>(null);
  const { language } = useLanguage();
  const t = translations[language];
  const resultRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetching = useRef(false); // Prevent multiple fetches
  const { setProfile } = useProfile();
  // const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const triggerError = (msg: string) => {
    setError(msg);
  };

  // Initialize form from search params
  useEffect(() => {
    // Load generated content if present in cache, even if not freshly generated
    const language = searchParams.get("language");
    const level = searchParams.get("level");
    const subject = searchParams.get("subject");
    const difficulty = searchParams.get("difficulty");
    const topic = searchParams.get("topic");

    if (language && level && subject && difficulty && topic) {
      const meta: GenerateRequest = {
        language: language as Language,
        level: level as Level,
        subject: subject as Subject,
        difficulty: difficulty as Difficulty,
        topic: topic.trim(),
        user_datetime: new Date().toISOString(), // won't affect cache key
      };

      const cached = loadGenerated(meta);
      if (cached) {
        console.log("[Refresh Restore] Loaded from sessionStorage");
        setMeta(meta); // re-sync form
        setContent(cached);
      }
    }
  }, [searchParams]);

  const cache = useRef<Map<string, IContent>>(new Map());

  // Debounced fetch function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchGeneratedContent = useCallback(
    debounceAsync(async (meta: GenerateRequest) => {
      if (isFetching.current) return; // Prevent concurrent fetches
      isFetching.current = true;
      setLoading(true);
      setError(null);

      const key = `${meta.language}|${meta.level}|${meta.subject}|${
        meta.difficulty
      }|${meta.topic.trim()}`;

      // Check in-memory cache
      if (cache.current.has(key)) {
        setContent(cache.current.get(key)!);
        setLoading(false);
        isFetching.current = false;
        return;
      }

      // Check sessionStorage cache
      const cached = loadGenerated(meta);
      if (cached) {
        setContent(cached);
        cache.current.set(key, cached);
        setLoading(false);
        isFetching.current = false;
        return;
      }

      // Network fetch
      sessionStorage.setItem("lesson_feedback_submitted", "false");
      clearReflectionCache();
      clearSavedSessionData();

      try {
        const { data: resData } = await authApi.post(
          "/content/generate/",
          meta
        );

        if (!resData.success) {
          triggerError(resData.error || "Something went wrong.");
          setLoading(false);
          isFetching.current = false;
          return;
        }

        const { generated_content: generated, is_valid } = resData.data;

        if (!is_valid) {
          setContent(null);
          triggerError("The topic is not related to the selected subject.");
          setLoading(false);
          isFetching.current = false;
          return;
        }

        setContent({ ...generated, valid_topic: resData.data.valid_topic });
        saveGenerated(meta, {
          ...generated,
          valid_topic: resData.data.valid_topic,
        });
        cache.current.set(key, {
          ...generated,
          valid_topic: resData.data.valid_topic,
        });
      } catch (err) {
        const axiosError = err as AxiosError<{
          error?: string;
          reason?: string;
        }>;
        triggerError(
          axiosError.response?.data?.error ||
            "A network error occurred while generating content."
        );
      } finally {
        setLoading(false);
        isFetching.current = false;
        if (window.innerWidth < 768 && resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 300), // 300ms debounce
    []
  );

  // Fetch content when meta changes
  useEffect(() => {
    const language = searchParams.get("language");
    const level = searchParams.get("level");
    const subject = searchParams.get("subject");
    const difficulty = searchParams.get("difficulty");
    const topic = searchParams.get("topic");
    const trigger = searchParams.get("trigger");

    if (language && level && subject && difficulty && topic) {
      const meta: GenerateRequest = {
        language: language as Language,
        level: level as Level,
        subject: subject as Subject,
        difficulty: difficulty as Difficulty,
        topic: topic.trim(),
        user_datetime: new Date().toISOString(),
      };

      setMeta(meta); // ⚠️ Ensure this is set first

      if (trigger === "1") {
        (async () => {
          await fetchGeneratedContent(meta);

          const updated = await getUserProfile();
          if (updated) {
            setProfile({
              ...updated,
              profile_image: updated.profile_image ?? undefined,
            });
            console.log(
              "[Client] Updated quota after generation:",
              updated.daily_quota_used
            );
          }
        })();

        // ✅ Remove trigger from URL immediately after fetch
        const cleaned = new URLSearchParams(searchParams.toString());
        cleaned.delete("trigger");
        router.replace(`/generate?${cleaned.toString()}`, { scroll: false });
      } else {
        // Load from cache only
        const cached = loadGenerated(meta);
        if (cached) {
          setContent(cached);
          console.log("[Refresh Restore] Loaded from sessionStorage");
        }
      }
    }
  }, [searchParams, fetchGeneratedContent, router, setProfile]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("userInitiatedGenerate");
    };
  }, []);

  // Debounced handleGenerate
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleGenerate = useCallback(
    debounceAsync(async (form: GenerateRequest): Promise<void> => {
      const params = new URLSearchParams({
        language: form.language,
        level: form.level,
        subject: form.subject,
        difficulty: form.difficulty,
        topic: form.topic,
      });

      params.set("trigger", "1"); // ✅ Re-append trigger

      const query = params.toString();
      const current = searchParams.toString();

      if (query !== current) {
        router.replace(`/generate?${query}`, { scroll: false });
      }

      setMeta(form);
    }, 300),
    [router, searchParams]
  );

  const GeneratedContentSkeleton = () => (
    <div className="bg-[#F7F9FC] p-4 rounded-xl shadow-md w-full lg:min-w-[850px] h-full animate-pulse flex items-center justify-center">
      <div className="animate-spin h-10 w-10 rounded-full border-t-4 border-cyan-500 border-opacity-60" />
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#ffffff]">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <hr className="text-[#E5E7EB] mt-2" />

        <div className="flex-1 overflow-y-auto">
          <div className="pr-4 lg:pr-10">
            <h1 className="lg:text-[33px] text-xl text-[#000000] font-semibold mb-1 mt-6 ml-4 lg:ml-10">
              {t.generate_page_title}
            </h1>
            <p className="text-[#4B5563] text-lg lg:text-2xl ml-4 lg:ml-10">
              {t.generate_page_subtitle}
            </p>
            <p className="text-[#9CA3AF] text-base ml-4 lg:ml-10">
              {t.generate_page_desc}.
            </p>
            <div className="flex flex-col lg:flex-row gap-6 p-4 lg:ml-10">
              <Generate
                onGenerate={handleGenerate}
                initialData={meta || undefined}
                loading={loading}
              />
              <div ref={resultRef}>
                {loading ? (
                  <GeneratedContentSkeleton />
                ) : error && meta ? (
                  <GeneratedContent
                    content={{
                      lesson: [],
                      quiz: {
                        mcqs: {},
                        true_false: {},
                      },
                      reflection: "",
                    }}
                    meta={{
                      topic: meta.topic,
                      subject: meta.subject,
                      level: meta.level,
                      language: meta.language,
                    }}
                    error={error}
                  />
                ) : meta && content ? (
                  <GeneratedContent
                    content={content}
                    meta={{
                      topic: meta.topic,
                      subject: meta.subject,
                      level: meta.level,
                      language: meta.language,
                    }}
                    error={null}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
