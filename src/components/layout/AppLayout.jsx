import { useState, useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Header from "./Header";
import Toast from "../ui/Toast";
import SetUsernameModal from "./SetUsernameModal";
import { useChat } from "../../context/ChatContext";

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);
  const location = useLocation();
  const { conversationId } = useParams();
  const { conversations, user, isAuthenticated, authLoading } = useChat();

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const isNewUserPrompt = Boolean(location.state?.showUsernameModal || location.state?.isNewAccount);
      const hasDismissed = sessionStorage.getItem("medora_skipped_username_prompt");

      if (isNewUserPrompt || (!user.username && !hasDismissed)) {
        setUsernameModalOpen(true);
      }
    }
  }, [authLoading, isAuthenticated, user?.username, location.state]);

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

      {/* Set Username Modal for new accounts */}
      <SetUsernameModal
        isOpen={usernameModalOpen}
        onClose={() => setUsernameModalOpen(false)}
      />

      {/* System Toast Notifications */}
      <Toast />
    </div>
  );
}
