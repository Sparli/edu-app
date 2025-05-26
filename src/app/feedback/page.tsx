import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import Feedback from "@/app/sections/Feedback"; // Or components if you placed it there

export default function FeedbackPage() {
  return (
    <div className="flex min-h-screen bg-[#Ffffff]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <Feedback />
      </div>
    </div>
  );
}
