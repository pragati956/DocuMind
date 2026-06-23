import { useState } from "react";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatsSection from "../../components/dashboard/StatsSection";
import RecentDocuments from "../../components/dashboard/RecentDocuments";
import AiSummaries from "../../components/dashboard/AiSummaries";
import UploadModal from "../../components/dashboard/UploadModal";

const Dashboard = () => {
    const [uploadOpen, setUploadOpen] = useState(false);

    return (
        <div className="flex h-dvh bg-[#0B0F19] overflow-hidden">  
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <WelcomeBanner onUpload={() => setUploadOpen(true)} />
                    <StatsSection />

                    {/* Extended to fill the deleted Activity Feed space */}
                    <div className="flex flex-col gap-8 mt-8 w-full">
                        <RecentDocuments onUpload={() => setUploadOpen(true)} />
                        <AiSummaries />
                    </div>
                </main>
            </div>

            {uploadOpen && (
                <UploadModal onClose={() => setUploadOpen(false)} />
            )}
        </div>
    );
};

export default Dashboard;