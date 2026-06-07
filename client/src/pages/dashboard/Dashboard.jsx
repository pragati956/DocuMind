import { useState } from "react";

// import Sidebar from "../../components/dashboard/Sidebar";
// import Topbar from "../../components/dashboard/Topbar";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatsSection from "../../components/dashboard/StatsSection";
import RecentDocuments from "../../components/dashboard/RecentDocuments";
import AiSummaries from "../../components/dashboard/AiSummaries";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import UploadModal from "../../components/dashboard/UploadModal";

const Dashboard = () => {
    // const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#0B0F19] overflow-hidden">

            {/* <Sidebar
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            /> */}

            <div className="flex-1 flex flex-col overflow-hidden">

                {/* <Topbar
                    onUpload={() => setUploadOpen(true)}
                /> */}

                <main className="flex-1 overflow-y-auto p-6">

                    <WelcomeBanner
                        onUpload={() => setUploadOpen(true)}
                    />

                    <StatsSection />

                    <div className="grid xl:grid-cols-[1fr_380px] gap-6 mt-6">

                        <div>
                           <RecentDocuments
  onUpload={() =>
    setUploadOpen(true)
  }
/>
                            <AiSummaries />
                        </div>

                        <ActivityFeed />

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
