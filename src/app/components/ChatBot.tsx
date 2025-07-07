"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ClipboardCopy, ThumbsUp, ThumbsDown } from "lucide-react";
import { translations } from "@/app/translations";
import { useLanguage } from "@/app/context/LanguageContext";
import authApi from "../utils/authApi";
import { useProfile } from "@/app/context/ProfileContext";
import { useRouter } from "next/navigation";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = async () => {
    if (!isOpen) {
      setLoadingChat(true);

      try {
        // Get user profile first (for name)
        const profileRes = await authApi.get("/users/profile/");
        const profileData = profileRes.data?.profile;
        const firstName = profileData?.first_name || "";

        // Get chat history
        const historyRes = await authApi.get("/help/history/");
        const historyData = historyRes.data;

        if (
          historyData.success &&
          historyData.response &&
          Array.isArray(historyData.response.full_chat)
        ) {
          const fullChat = historyData.response.full_chat;
          if (fullChat.length > 0) {
            const parsedMessages = fullChat.flatMap(
              (pair: { user: string; assistant: string }) => [
                {
                  from: "user" as const,
                  text: pair.user,
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
                {
                  from: "bot" as const,
                  text: pair.assistant,
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ]
            );
            setMessages(parsedMessages);
          } else {
            // No messages yet → show welcome message with name
            const welcome = t.welcomeMessage.replace("{{name}}", firstName);
            setMessages([
              {
                from: "bot",
                text: welcome,
                timestamp: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);
          }
        } else {
          setMessages([
            {
              from: "bot",
              text: t.defaultError || "Something went wrong loading history.",
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        }
      } catch (err) {
        console.error("Error loading chat history:", err);
        setMessages([
          {
            from: "bot",
            text:
              t.defaultError ||
              "❌ Unable to load previous conversation. Please try again.",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } finally {
        setLoadingChat(false);
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { language } = useLanguage();
  const t = translations[language];
  const { profile } = useProfile();

  const [messages, setMessages] = useState<
    { from: "user" | "bot"; text: string; timestamp: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [likedIndex, setLikedIndex] = useState<number | null>(null);
  const [dislikedIndex, setDislikedIndex] = useState<number | null>(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();
  const isSubscribed = profile?.is_subscribed === true;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (customText?: string) => {
    const messageText = customText || input.trim();
    if (!messageText) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Show user message immediately

    if (!customText) setInput("");
    setLoading(true);

    // add the user message to UI immediately
    setMessages((prev) => [
      ...prev,
      {
        from: "user",
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    try {
      const res = await authApi.post("/help/chat/", {
        message: messageText,
        language,
      });

      const data = res.data;

      if (
        data.success &&
        data.response &&
        Array.isArray(data.response.full_chat)
      ) {
        const parsedMessages = data.response.full_chat.flatMap(
          (pair: { user: string; assistant: string }) => [
            {
              from: "user",
              text: pair.user,
              timestamp,
            },
            {
              from: "bot",
              text: pair.assistant,
              timestamp,
            },
          ]
        );
        setMessages(parsedMessages);
      } else {
        // Unexpected format or failure response
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: data?.error || "❌ Unexpected error from server.",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "❌ Network error. Please try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <div
        onClick={() => {
          if (profile?.is_subscribed) {
            handleToggle();
          } else {
            setShowUpgradeModal(true);
          }
        }}
        className="cursor-pointer"
      >
        {loadingChat ? (
          <div className="flex gap-1 w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#0463EF] to-[#16EA9E] items-center justify-center shadow-xl">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 bg-white rounded-full dot1" />
              <span className="w-2.5 h-2.5 bg-white rounded-full dot2" />
              <span className="w-2.5 h-2.5 bg-white rounded-full dot3" />
            </div>
          </div>
        ) : isOpen ? (
          <Image
            src="/images/chatbot-open.svg"
            alt="Chatbot Icon Open"
            width={85}
            height={85}
          />
        ) : (
          <Image
            src="/images/chatbot.svg"
            alt="Chatbot Icon"
            width={80}
            height={80}
            className={`${isSubscribed ? "animate-bounce" : ""}`}
          />
        )}
      </div>

      {/* Chat Box */}
      {isOpen && (
        <div className="absolute bottom-[90px] right-0 lg:w-[480px] lg:h-[690px] w-[350px] h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0463EF] to-[#16EA9E] text-white px-4 py-3 flex justify-between items-start rounded-t-xl">
            <div className="flex items-start gap-3">
              <Image
                src="/images/avtar.svg"
                alt="Bot Icon"
                width={40}
                height={40}
                className="mt-1"
              />
              <div>
                <h2 className="font-bold text-lg leading-tight">
                  {t.needHelp}
                </h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <Image
                    src="/images/online.svg" // 🔁 use your actual green dot icon path
                    alt="Online Indicator"
                    width={12}
                    height={12}
                  />
                  <span className="text-xs text-[#00fb00]">
                    {t.onlineStatus}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className="w-7 h-7 rounded-full border cursor-pointer border-white text-white flex items-center justify-center text-sm hover:bg-white hover:text-[#0463EF] transition"
              title="Close"
            >
              &minus;
            </button>
          </div>

          {/* Chat Area */}

          <div className="flex-1 p-6 space-y-6 text-sm overflow-y-auto">
            {messages.map((msg, i) =>
              msg.from === "bot" ? (
                <div
                  key={i}
                  className="flex items-start gap-2 justify-start group"
                >
                  <Image
                    src="/images/chatbot.svg"
                    alt="Bot"
                    width={40}
                    height={40}
                    className="rounded-full mt-1"
                  />
                  <div>
                    <div className="bg-gradient-to-br from-[#0463EF] to-[#16EA9E] text-white px-4 py-2 rounded-xl rounded-bl-none max-w-[270px] text-sm leading-relaxed shadow-md">
                      {msg.text}
                    </div>
                    <div className="flex justify-between gap-2 ml-1">
                      <div className="text-xs text-gray-400 mt-1 pl-1">
                        {msg.timestamp}
                      </div>
                      <div className="gap-2 flex mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Copy Button */}
                        <button
                          className={`transition cursor-pointer ${
                            copiedIndex === i
                              ? "text-green-500 scale-110 animate-pulse"
                              : "text-gray-400 hover:text-gray-600"
                          }`}
                          title={t.copy}
                          onClick={() => {
                            navigator.clipboard.writeText(msg.text);
                            setCopiedIndex(i);
                            setTimeout(() => setCopiedIndex(null), 1000);
                          }}
                        >
                          <ClipboardCopy size={18} />
                        </button>

                        {/* Like Button */}
                        <button
                          className={`transition cursor-pointer ${
                            likedIndex === i
                              ? "text-green-500 scale-110 animate-bounce"
                              : "text-gray-400 hover:text-green-500"
                          }`}
                          title={t.like}
                          onClick={() => {
                            setLikedIndex(i);
                            setTimeout(() => setLikedIndex(null), 1000);
                          }}
                        >
                          <ThumbsUp size={18} />
                        </button>

                        {/* Dislike Button */}
                        <button
                          className={`transition cursor-pointer ${
                            dislikedIndex === i
                              ? "text-red-500 scale-110 animate-pulse"
                              : "text-gray-400 hover:text-red-400"
                          }`}
                          title={t.dislike}
                          onClick={() => {
                            setDislikedIndex(i);
                            setTimeout(() => setDislikedIndex(null), 1000);
                          }}
                        >
                          <ThumbsDown size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex items-end justify-end gap-2 mt-2">
                  <div className="text-left">
                    <div className="bg-[#e6e6e6] text-gray-800 px-4 py-2 rounded-xl rounded-br-none max-w-[270px] text-sm leading-relaxed shadow-sm">
                      {msg.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex justify-end items-center gap-1 pr-1">
                      {msg.timestamp}
                      <Image
                        src="/images/check.svg"
                        alt="Check"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                  <Image
                    src={profile?.profile_image || "/images/avtar.jpg"}
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
              )
            )}
            {loading && (
              <div className="flex items-start gap-2 animate-pulse">
                <Image
                  src="/images/chatbot.svg"
                  alt="Bot"
                  width={32}
                  height={32}
                  className="rounded-full mt-1"
                />
                <div className="bg-gray-100 px-4 py-2 rounded-xl rounded-bl-none max-w-[270px] text-sm leading-relaxed shadow-inner flex items-center gap-1">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Section */}
          <div className="bg-white shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.08)] px-3 pt-3 pb-4 rounded-b-xl">
            {/* Quick Buttons */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[t.quick_wappgpt, t.quick_pricing, t.quick_faq].map(
                (item, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(item)} // ✅ item is valid inside here
                    className="bg-[#f7f7f7] text-xs px-3 py-1 cursor-pointer rounded-full shadow-sm hover:bg-[#ebebeb] transition"
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            {/* Input Field */}
            <div className="flex items-center bg-[#f3f3f3] rounded-full px-4 py-2">
              <input
                type="text"
                placeholder={t.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 text-sm bg-transparent py-1.5 outline-none text-gray-700 placeholder-gray-400"
              />

              <button
                title={t.send}
                onClick={() => sendMessage()}
                className="text-xl pl-2 pr-1 cursor-pointer"
              >
                <Image
                  src="/images/send.svg"
                  alt="Send Icon"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl lg:max-w-[640px] lg:h-[450.280029296875px] mx-2 lg:mx-0 w-full relative text-center">
            <div className="relative w-40 sm:w-48 md:w-60 lg:w-72 xl:w-80 h-40 sm:h-48 md:h-60 lg:h-72 xl:h-60 mx-auto ">
              <Image
                src="/images/prem.svg"
                alt="Warning"
                fill
                sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, (max-width: 1024px) 288px, (max-width: 1280px) 320px, 100vw"
                className="object-contain"
              />
            </div>

            <h2 className="text-2xl font-normal text-gray-800 mb-2">
              {t.upgrade_title}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t.upgrade_description}
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="lg:px-22 lg:py-3 px-8 py-2 text-[20px] bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {t.upgrade_cancel}
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false); // close modal
                  router.push("/subscription"); // navigate
                }}
                className="lg:px-22 lg:py-3 px-8 py-2 text-[20px] bg-[#04C0F2] text-white rounded-md hover:bg-[#00a5d2]"
              >
                {t.upgrade_button}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
