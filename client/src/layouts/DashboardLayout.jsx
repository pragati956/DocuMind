import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

const DashboardLayout = () => {
  const [mobileSidebarOpen,
setMobileSidebarOpen] =
useState(false);
  return (
   <div
 className="
 flex
 h-dvh
 bg-[#0B0F19]
 overflow-hidden
 "
>

  <Sidebar
 mobileOpen={mobileSidebarOpen}
 setMobileOpen={
   setMobileSidebarOpen
 }
/>

  <div
   className="
   flex-1
   flex
   flex-col
   overflow-hidden
   "
  >

    <Topbar
 onMobileSidebarToggle={() =>
   setMobileSidebarOpen(
     prev => !prev
   )
 }
/>

    <main
     className="
     flex-1
     overflow-y-auto
     p-4
     sm:p-6
     "
    >
      <Outlet />
    </main>

  </div>

</div>
  );
};

export default DashboardLayout;