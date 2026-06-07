import { useState } from "react";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatsSection from "../../components/dashboard/StatsSection";
import RecentDocuments from "../../components/dashboard/RecentDocuments";
import AiSummaries from "../../components/dashboard/AiSummaries";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import UploadModal from "../../components/dashboard/UploadModal";

const Dashboard = () => {
    const [uploadOpen, setUploadOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#0B0F19] overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

                    <WelcomeBanner
                        onUpload={() => setUploadOpen(true)}
                    />

                    <StatsSection />

                    {/* FIXED: Balanced 3-column layout with proper spacing */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                        
                        {/* Left Side: Takes up 2 columns */}
                        <div className="lg:col-span-2 flex flex-col gap-8">
                            <RecentDocuments
                                onUpload={() => setUploadOpen(true)}
                            />
                            <AiSummaries />
                        </div>

                        {/* Right Side: Takes up 1 column */}
                        <div className="lg:col-span-1 flex flex-col">
                            <ActivityFeed />
                        </div>

                    </div>

                </main>
            </div>

            {uploadOpen && (
                <UploadModal
                    onClose={() => setUploadOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;