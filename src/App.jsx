import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ChatProvider } from "./context/ChatContext";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Medications from "./pages/Medications";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            {/* Public standalone pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Application pages wrapped in AppLayout */}
            <Route element={<AppLayout />}>
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:conversationId" element={<Chat />} />
              <Route path="/medications" element={<Medications />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </ThemeProvider>
  );
}
