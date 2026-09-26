import { useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Header from "./Header";
import Toast from "../ui/Toast";
import { useChat } from "../../context/ChatContext";

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { conversationId } = useParams();
  const { conversations } = useChat();

  // Dynamic header title based on current route
  let pageTitle = "Medical Information Assistant";
  if (location.pathname.startsWith("/medications")) {
    pageTitle = "Medication Reference";
  } else if (location.pathname.startsWith("/settings")) {
    pageTitle = "Settings & Preferences";
  } else if (conversationId) {
    const active = conversations.find(c => c.id === conversationId);
    pageTitle = active ? active.title : "Medical Consultation";
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          currentTitle={pageTitle}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* System Toast Notifications */}
      <Toast />
    </div>
  );
}
