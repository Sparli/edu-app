import DashboardCards from "@/app/components/DashboardCards";
import QuickGenerate from "@/app/components/QuickGenerate";

export default function DashboardPage() {
  return (
    <>
      <DashboardCards />
      <hr className="text-[#E5E7EB]" />
      <QuickGenerate />
    </>
  );
}
