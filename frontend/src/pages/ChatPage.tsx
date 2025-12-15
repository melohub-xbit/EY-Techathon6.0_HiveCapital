import { ChatInterface } from "@/components/ChatInterface";
import { DashboardLayout } from "@/components/DashboardLayout";

export const ChatPage = () => {
  return (
    <DashboardLayout title="AI Assistant" subtitle="Loan Application">
      <div className="h-[calc(100vh-theme(spacing.32))] -m-6 flex flex-col">
        <ChatInterface />
      </div>
    </DashboardLayout>
  );
};
