import { createContext, useContext, useState, useEffect } from "react";
import { initialConversations, mockUser } from "../data/mockConversations";
import { initialMessages, generateMockAiResponse } from "../data/mockMessages";
import { getInitials } from "../utils/userUtils";
import { supabase } from "../lib/supabase";
const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem("doctorai_conversations");
      return saved ? JSON.parse(saved) : initialConversations;
    } catch {
      return initialConversations;
    }
  });
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setIsAuthenticated(!!session);

      if (session?.user) {
        const fullName =
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] ||
          "Doctor";

        setUser((prev) => ({
          ...prev,
          name: fullName,
          email: session.user.email,
          initials: getInitials(fullName),
          avatarUrl: null,
        }));
      }

      setAuthLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);

      if (session?.user) {
        const fullName =
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] ||
          "Doctor";

        setUser((prev) => ({
          ...prev,
          name: fullName,
          email: session.user.email,
          initials: getInitials(fullName),
          avatarUrl: null,
        }));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("doctorai_messages");
      return saved ? JSON.parse(saved) : initialMessages;
    } catch {
      return initialMessages;
    }
  });

  const [isThinking, setIsThinking] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("doctorai_user");
      const parsed = saved ? JSON.parse(saved) : {};
      const merged = { ...mockUser, ...parsed };
      merged.initials = getInitials(merged.name || "John Doe");
      merged.avatarUrl = null;
      return merged;
    } catch {
      return mockUser;
    }
  });
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("doctorai_settings");
      return saved ? JSON.parse(saved) : { enterToSend: true, showSuggestedQuestions: true };
    } catch {
      return { enterToSend: true, showSuggestedQuestions: true };
    }
  });

  const [toastMessage, setToastMessage] = useState(null);



  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      showToast(error.message || "Failed to sign out", "error");
      return;
    }

    setIsAuthenticated(false);
    showToast("Signed out of Medora", "info");
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("doctorai_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("doctorai_conversations", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem("doctorai_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("doctorai_settings", JSON.stringify(settings));
  }, [settings]);

  const showToast = (message, type = "info") => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const updateSettings = (partial) => {
    setSettings(prev => ({ ...prev, ...partial }));
    showToast("Settings updated successfully", "success");
  };

  const updateUser = (partial) => {
    setUser(prev => {
      const nextName = partial.name !== undefined ? partial.name : prev.name;
      const nextInitials = partial.initials || getInitials(nextName);
      return {
        ...prev,
        ...partial,
        initials: nextInitials,
        avatarUrl: null
      };
    });
    showToast("Profile updated successfully", "success");
  };

  const startNewConversation = (promptText) => {
    const newId = `conv-${Date.now()}`;
    const title = promptText.length > 32 ? promptText.slice(0, 32) + "..." : promptText;
    const timeStr = "Just now";

    const newConv = {
      id: newId,
      title: title,
      group: "Today",
      timestamp: timeStr,
      updatedAt: new Date().toISOString()
    };

    const userMsg = {
      id: `m-${Date.now()}-1`,
      sender: "user",
      text: promptText,
      timestamp: timeStr
    };

    setConversations(prev => [newConv, ...prev]);
    setMessages(prev => ({
      ...prev,
      [newId]: [userMsg]
    }));

    setIsThinking(true);

    setTimeout(() => {
      const aiReply = {
        id: `m-${Date.now()}-2`,
        sender: "assistant",
        text: generateMockAiResponse(promptText),
        timestamp: "Just now"
      };

      setMessages(prev => ({
        ...prev,
        [newId]: [...(prev[newId] || [userMsg]), aiReply]
      }));
      setIsThinking(false);
    }, 1100);

    return newId;
  };

  const sendMessage = (conversationId, text) => {
    if (!text.trim() || isThinking) return;

    const userMsg = {
      id: `m-${Date.now()}-1`,
      sender: "user",
      text: text.trim(),
      timestamp: "Just now"
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), userMsg]
    }));

    setIsThinking(true);

    setTimeout(() => {
      const aiReply = {
        id: `m-${Date.now()}-2`,
        sender: "assistant",
        text: generateMockAiResponse(text),
        timestamp: "Just now"
      };

      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), aiReply]
      }));
      setIsThinking(false);
    }, 1100);
  };

  const regenerateMessage = (conversationId, messageId) => {
    const convMsgs = messages[conversationId] || [];
    const targetIdx = convMsgs.findIndex(m => m.id === messageId);
    if (targetIdx === -1) return;

    // Find prior user prompt
    const prevUserMsg = convMsgs.slice(0, targetIdx).reverse().find(m => m.sender === "user");
    const promptText = prevUserMsg ? prevUserMsg.text : "medical guidance";

    setIsThinking(true);
    showToast("Regenerating medical response...", "info");

    setTimeout(() => {
      const newResponseText = generateMockAiResponse(promptText + " more comprehensive details");
      setMessages(prev => {
        const updated = [...(prev[conversationId] || [])];
        if (updated[targetIdx]) {
          updated[targetIdx] = {
            ...updated[targetIdx],
            text: newResponseText,
            timestamp: "Just now (Regenerated)"
          };
        }
        return {
          ...prev,
          [conversationId]: updated
        };
      });
      setIsThinking(false);
      showToast("Response regenerated", "success");
    }, 1000);
  };

  const renameConversation = (conversationId, newTitle) => {
    if (!newTitle.trim()) return;
    setConversations(prev =>
      prev.map(c => c.id === conversationId ? { ...c, title: newTitle.trim() } : c)
    );
    showToast("Conversation renamed", "success");
  };

  const deleteConversation = (conversationId) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    setMessages(prev => {
      const copy = { ...prev };
      delete copy[conversationId];
      return copy;
    });
    showToast("Conversation deleted", "info");
  };

  const clearAllConversations = () => {
    setConversations([]);
    setMessages({});
    showToast("Conversation history cleared", "info");
  };

  const toggleFeedback = (conversationId, messageId, type) => {
    setMessages(prev => {
      const convMsgs = prev[conversationId] || [];
      const updated = convMsgs.map(m => {
        if (m.id === messageId) {
          return {
            ...m,
            feedback: m.feedback === type ? null : type
          };
        }
        return m;
      });
      return { ...prev, [conversationId]: updated };
    });
    showToast(type === "up" ? "Feedback recorded: Helpful" : "Feedback recorded: Needs improvement", "info");
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,
        isThinking,
        user,
        settings,
        toastMessage,
        showToast,
        updateSettings,
        updateUser,
        startNewConversation,
        sendMessage,
        regenerateMessage,
        renameConversation,
        deleteConversation,
        clearAllConversations,
        toggleFeedback,
        isAuthenticated,
        logout
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
