import { createContext, useContext, useState, useEffect } from "react";
import { getInitials } from "../utils/userUtils";
import { formatCooldown } from "../utils/dateUtils";
import { supabase } from "../lib/supabase";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  // =========================
  // STATE
  // =========================

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [isThinking, setIsThinking] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [medications, setMedications] = useState([]);

  const [user, setUser] = useState({
    id: null,
    name: "Doctor",
    username: "",
    email: "",
    initials: "D",
    avatarUrl: null,
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("doctorai_settings");

      return saved
        ? JSON.parse(saved)
        : {
          enterToSend: true,
          showSuggestedQuestions: true,
        };
    } catch {
      return {
        enterToSend: true,
        showSuggestedQuestions: true,
      };
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  // =========================
  // TOAST
  // =========================

  const showToast = (message, type = "info") => {
    setToastMessage({
      message,
      type,
      id: Date.now(),
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // =========================
  // LOAD CONVERSATIONS
  // =========================

  const loadConversations = async (userId) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Failed to load conversations:", error);
      showToast("Failed to load conversations.", "error");
      return;
    }

    setConversations(data || []);
  };

  // =========================
  // LOAD MESSAGES
  // =========================

  const loadMessages = async (conversationId) => {
    if (!conversationId) return [];

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to load messages:", error);
      showToast("Failed to load messages.", "error");
      return [];
    }

    const formattedMessages = (data || []).map((message) => ({
      id: message.id,
      sender: message.role,
      text: message.content,
      timestamp: message.created_at,
    }));

    setMessages((prev) => ({
      ...prev,
      [conversationId]: formattedMessages,
    }));

    return formattedMessages;
  };

  // =========================
  // LOAD MEDICATIONS
  // =========================

  const loadMedications = async (userId) => {
    try {
      let query = supabase
        .from("medications")
        .select(`
          id,
          medicine_name,
          generic_name,
          common_uses,
          dosage,
          category_id,
          user_id,
          created_at,
          updated_at,
          medication_categories (
            id,
            category_name
          )
        `)
        .order("medicine_name");

      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Failed to load medications in ChatContext:", error);
        return [];
      }

      const formatted = (data || []).map((m) => ({
        id: m.id,
        name: m.medicine_name,
        genericName: m.generic_name || "",
        commonUses: m.common_uses || "",
        dosage: m.dosage || "",
        category: m.medication_categories?.category_name || "Other",
        categoryId: m.category_id,
        createdAt: m.created_at,
        updatedAt: m.updated_at,
      }));

      setMedications(formatted);
      return formatted;
    } catch (err) {
      console.error("Error loading medications in ChatContext:", err);
      return [];
    }
  };

  // =========================
  // AUTH SESSION
  // =========================

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setIsAuthenticated(!!session);

      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        const fullName =
          metadata.full_name ||
          metadata.name ||
          session.user.email?.split("@")[0] ||
          "Doctor";

        const username =
          metadata.username ||
          "";

        setUser({
          id: session.user.id,
          name: fullName,
          username: username,
          email: session.user.email || "",
          initials: getInitials(fullName),
          avatarUrl: null,
        });

        await Promise.all([
          loadConversations(session.user.id),
          loadMedications(session.user.id),
        ]);
      }

      setAuthLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);

      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        const fullName =
          metadata.full_name ||
          metadata.name ||
          session.user.email?.split("@")[0] ||
          "Doctor";

        const username =
          metadata.username ||
          "";

        setUser({
          id: session.user.id,
          name: fullName,
          username: username,
          email: session.user.email || "",
          initials: getInitials(fullName),
          avatarUrl: null,
        });

        // Delay database loading slightly so it doesn't run
        // directly inside the auth state callback.
        setTimeout(() => {
          loadConversations(session.user.id);
          loadMedications(session.user.id);
        }, 0);
      } else {
        setUser({
          id: null,
          name: "Doctor",
          username: "",
          email: "",
          initials: "D",
          avatarUrl: null,
        });

        setConversations([]);
        setMessages({});
        setMedications([]);
      }

      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =========================
  // LOCAL SETTINGS
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "doctorai_settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  // =========================
  // UPDATE SETTINGS
  // =========================

  const updateSettings = (partial) => {
    setSettings((prev) => ({
      ...prev,
      ...partial,
    }));

    showToast("Settings updated successfully", "success");
  };

  // =========================
  // UPDATE USER
  // =========================

  const updateUser = async (partial) => {
    let nextName;
    let nextUsername;

    setUser((prev) => {
      nextName =
        partial.name !== undefined
          ? partial.name
          : prev.name;
      nextUsername =
        partial.username !== undefined
          ? partial.username
          : prev.username;

      return {
        ...prev,
        ...partial,
        name: nextName,
        username: nextUsername,
        initials: getInitials(nextName),
        avatarUrl: partial.avatarUrl !== undefined ? partial.avatarUrl : prev.avatarUrl,
      };
    });

    try {
      const metadataUpdates = {};
      if (partial.name !== undefined) metadataUpdates.full_name = partial.name.trim();
      if (partial.username !== undefined) metadataUpdates.username = partial.username.trim().replace(/^@/, "");

      if (Object.keys(metadataUpdates).length > 0) {
        const { error } = await supabase.auth.updateUser({
          data: metadataUpdates,
        });

        if (error) {
          console.error("Failed to sync profile update to Supabase:", error);
          showToast("Profile updated locally (cloud sync failed)", "warning");
          return false;
        }
      }

      showToast("Profile updated successfully", "success");
      return true;
    } catch (err) {
      console.error("Error updating user:", err);
      return false;
    }
  };

  // =========================
  // AUTH TOKEN HELPER
  // =========================

  const getAuthToken = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        return session.access_token;
      }
      const { data: refreshed } = await supabase.auth.refreshSession();
      return refreshed?.session?.access_token || null;
    } catch (err) {
      console.error("Error retrieving Supabase auth token:", err);
      return null;
    }
  };

  // =========================
  // START NEW CONVERSATION
  // =========================

  const startNewConversation = async (
    promptText,
    attachment = null
  ) => {
    const trimmedText = promptText.trim();

    if (!trimmedText && !attachment?.imageData) {
      return null;
    }

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      showToast(
        "Please sign in to start a conversation.",
        "error"
      );

      return null;
    }

    const titleSource =
      trimmedText ||
      attachment?.fileName ||
      "Medical image";

    const title =
      titleSource.length > 32
        ? titleSource.slice(0, 32) + "..."
        : titleSource;

    // =========================
    // CREATE CONVERSATION
    // =========================

    const {
      data: conversation,
      error: conversationError,
    } = await supabase
      .from("conversations")
      .insert({
        user_id: currentUser.id,
        title,
      })
      .select()
      .single();

    if (conversationError) {
      console.error(
        "Failed to create conversation:",
        conversationError
      );

      showToast(
        "Failed to create conversation.",
        "error"
      );

      return null;
    }

    // =========================
    // SAVE USER MESSAGE
    // =========================

    let displayText = trimmedText;

    if (attachment?.fileName) {
      displayText = trimmedText
        ? `${trimmedText}\n\n📎 ${attachment.fileName}`
        : `📎 ${attachment.fileName}`;
    }

    const {
      data: userMessage,
      error: messageError,
    } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        role: "user",
        content: displayText,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (messageError) {
      console.error(
        "Failed to save message:",
        messageError
      );

      showToast(
        "Failed to save message.",
        "error"
      );

      return null;
    }

    // =========================
    // UPDATE LOCAL UI
    // =========================

    setConversations((prev) => [
      conversation,
      ...prev.filter(
        (item) => item.id !== conversation.id
      ),
    ]);

    setMessages((prev) => ({
      ...prev,
      [conversation.id]: [
        {
          id: userMessage.id,
          sender: "user",
          text: userMessage.content,
          timestamp: userMessage.created_at,
        },
      ],
    }));

    // =========================
    // ASK GEMINI (NON-BLOCKING)
    // =========================

    setIsThinking(true);

    // Run AI request in background so the UI can navigate to the new chat immediately
    (async () => {
      try {
        const token = await getAuthToken();

        if (!token) {
          showToast("Authentication required. Please sign in.", "error");
          return;
        }

        const response = await fetch(
          "http://localhost:3001/api/chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              message: trimmedText,
              image: attachment?.imageData || null,
              imageMimeType:
                attachment?.fileType || null,
              medications: medications,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 429) {
            const cooldownStr = data.retryAfter ? formatCooldown(data.retryAfter) : "";
            const limitMsg = cooldownStr
              ? `You've reached your AI chat limit. You can continue using Medora in ${cooldownStr}.`
              : "You've reached your AI chat limit. Please try again later.";

            showToast(limitMsg, "error");

            const nowIso = new Date().toISOString();
            const { data: aiMessage } = await supabase
              .from("messages")
              .insert({
                conversation_id: conversation.id,
                role: "assistant",
                content: limitMsg,
                created_at: nowIso,
              })
              .select()
              .single();

            setMessages((prev) => ({
              ...prev,
              [conversation.id]: [
                ...(prev[conversation.id] || []),
                {
                  id: aiMessage?.id || "rate-limit-" + Date.now(),
                  sender: "assistant",
                  text: limitMsg,
                  timestamp: nowIso,
                  isRateLimit: true,
                },
              ],
            }));

            return;
          }

          throw new Error(
            data.error ||
            "Failed to get response from MedoraAI."
          );
        }

        // =========================
        // SAVE AI RESPONSE
        // =========================

        const {
          data: aiMessage,
          error: aiMessageError,
        } = await supabase
          .from("messages")
          .insert({
            conversation_id: conversation.id,
            role: "assistant",
            content: data.response,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (aiMessageError) {
          console.error(
            "Failed to save AI message:",
            aiMessageError
          );

          showToast(
            "AI responded, but the response could not be saved.",
            "error"
          );

          return;
        }

        // =========================
        // SHOW AI RESPONSE
        // =========================

        setMessages((prev) => ({
          ...prev,
          [conversation.id]: [
            ...(prev[conversation.id] || []),
            {
              id: aiMessage.id,
              sender: "assistant",
              text: aiMessage.content,
              timestamp: aiMessage.created_at,
            },
          ],
        }));

        // =========================
        // UPDATE CONVERSATION TIME
        // =========================

        await supabase
          .from("conversations")
          .update({
            updated_at: new Date().toISOString(),
          })
          .eq("id", conversation.id);

      } catch (error) {
        console.error(
          "Failed to get Gemini response:",
          error
        );

        showToast(
          error.message ||
          "Failed to get a response from MedoraAI.",
          "error"
        );
      } finally {
        setIsThinking(false);
      }
    })();

    return conversation.id;
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = async (
    conversationId,
    text,
    attachment = null
  ) => {
    if ((!text.trim() && !attachment?.imageData) || isThinking) {
      return;
    }

    const trimmedText = text.trim();

    setIsThinking(true);

    try {
      // =========================
      // SAVE USER MESSAGE
      // =========================

      let displayText = trimmedText;

      if (attachment?.fileName) {
        displayText = trimmedText
          ? `${trimmedText}\n\n📎 ${attachment.fileName}`
          : `📎 ${attachment.fileName}`;
      }

      const {
        data: userMessage,
        error: userMessageError,
      } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          role: "user",
          content: displayText,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userMessageError) {
        console.error(
          "Failed to save user message:",
          userMessageError
        );

        showToast(
          "Failed to send message.",
          "error"
        );

        return;
      }

      // =========================
      // SHOW USER MESSAGE
      // =========================

      setMessages((prev) => ({
        ...prev,
        [conversationId]: [
          ...(prev[conversationId] || []),
          {
            id: userMessage.id,
            sender: "user",
            text: userMessage.content,
            timestamp: userMessage.created_at,
          },
        ],
      }));

      // =========================
      // UPDATE CONVERSATION TIME
      // =========================

      const { error: updateError } = await supabase
        .from("conversations")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId);

      if (updateError) {
        console.error(
          "Failed to update conversation timestamp:",
          updateError
        );
      }

      // =========================
      // SEND MESSAGE + IMAGE TO GEMINI
      // =========================

      const token = await getAuthToken();

      if (!token) {
        showToast("Authentication required. Please sign in.", "error");
        return;
      }

      const response = await fetch(
        "http://localhost:3001/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: trimmedText,
            image: attachment?.imageData || null,
            imageMimeType: attachment?.fileType || null,
            medications: medications,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const cooldownStr = data.retryAfter ? formatCooldown(data.retryAfter) : "";
          const limitMsg = cooldownStr
            ? `You've reached your AI chat limit. You can continue using Medora in ${cooldownStr}.`
            : "You've reached your AI chat limit. Please try again later.";

          showToast(limitMsg, "error");

          const nowIso = new Date().toISOString();
          const { data: aiMessage } = await supabase
            .from("messages")
            .insert({
              conversation_id: conversationId,
              role: "assistant",
              content: limitMsg,
              created_at: nowIso,
            })
            .select()
            .single();

          setMessages((prev) => ({
            ...prev,
            [conversationId]: [
              ...(prev[conversationId] || []),
              {
                id: aiMessage?.id || "rate-limit-" + Date.now(),
                sender: "assistant",
                text: limitMsg,
                timestamp: nowIso,
                isRateLimit: true,
              },
            ],
          }));

          return;
        }

        throw new Error(
          data.error ||
          "Failed to get response from MedoraAI."
        );
      }

      // =========================
      // SAVE AI RESPONSE
      // =========================

      const {
        data: aiMessage,
        error: aiMessageError,
      } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          role: "assistant",
          content: data.response,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (aiMessageError) {
        console.error(
          "Failed to save AI message:",
          aiMessageError
        );

        showToast(
          "AI responded, but the response could not be saved.",
          "error"
        );

        return;
      }

      // =========================
      // SHOW AI RESPONSE
      // =========================

      setMessages((prev) => ({
        ...prev,
        [conversationId]: [
          ...(prev[conversationId] || []),
          {
            id: aiMessage.id,
            sender: "assistant",
            text: aiMessage.content,
            timestamp: aiMessage.created_at,
          },
        ],
      }));

      // =========================
      // UPDATE CONVERSATION TIME
      // =========================

      const { error: finalUpdateError } = await supabase
        .from("conversations")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId);

      if (finalUpdateError) {
        console.error(
          "Failed to update conversation timestamp:",
          finalUpdateError
        );
      }
    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );

      showToast(
        error.message ||
        "Failed to get a response from MedoraAI.",
        "error"
      );
    } finally {
      setIsThinking(false);
    }
  };

  // =========================
  // REGENERATE MESSAGE
  // =========================

  const regenerateMessage = async (
    conversationId,
    messageId
  ) => {
    if (!conversationId || !messageId) return;

    const convMessages = messages[conversationId] || [];
    const targetIndex = convMessages.findIndex((m) => m.id === messageId);

    if (targetIndex === -1) {
      showToast("Message not found to regenerate.", "error");
      return;
    }

    // Find the preceding user message to use as prompt
    let userPromptMessage = null;
    for (let i = targetIndex - 1; i >= 0; i--) {
      if (convMessages[i].sender === "user") {
        userPromptMessage = convMessages[i];
        break;
      }
    }

    if (!userPromptMessage || !userPromptMessage.text?.trim()) {
      showToast("Cannot find the original prompt to regenerate.", "error");
      return;
    }

    setIsThinking(true);

    try {
      const token = await getAuthToken();

      if (!token) {
        showToast("Authentication required. Please sign in.", "error");
        return;
      }

      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userPromptMessage.text,
          medications: medications,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const cooldownStr = data.retryAfter ? formatCooldown(data.retryAfter) : "";
          const limitMsg = cooldownStr
            ? `You've reached your AI chat limit. You can continue using Medora in ${cooldownStr}.`
            : "You've reached your AI chat limit. Please try again later.";

          showToast(limitMsg, "error");
          return;
        }

        throw new Error(
          data.error || "Failed to get response from MedoraAI."
        );
      }

      const nowIso = new Date().toISOString();

      // Update message in Supabase
      const { error: updateError } = await supabase
        .from("messages")
        .update({
          content: data.response,
          created_at: nowIso,
        })
        .eq("id", messageId);

      if (updateError) {
        console.error("Failed to update message in Supabase:", updateError);
      }

      // Update conversation timestamp
      await supabase
        .from("conversations")
        .update({
          updated_at: nowIso,
        })
        .eq("id", conversationId);

      // Update local messages state
      setMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map((msg) =>
          msg.id === messageId
            ? {
              ...msg,
              text: data.response,
              timestamp: nowIso,
              feedback: null,
            }
            : msg
        ),
      }));

      // Update conversation list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, updated_at: nowIso }
            : conv
        )
      );

      showToast("Response regenerated successfully", "success");
    } catch (error) {
      console.error("Failed to regenerate message:", error);
      showToast(
        error.message || "Failed to regenerate response.",
        "error"
      );
    } finally {
      setIsThinking(false);
    }
  };

  // =========================
  // RENAME CONVERSATION
  // =========================

  const renameConversation = async (
    conversationId,
    newTitle
  ) => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) return;

    const { error } = await supabase
      .from("conversations")
      .update({
        title: trimmedTitle,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    if (error) {
      console.error(
        "Failed to rename conversation:",
        error
      );

      showToast(
        "Failed to rename conversation.",
        "error"
      );

      return;
    }

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? {
            ...conversation,
            title: trimmedTitle,
          }
          : conversation
      )
    );

    showToast(
      "Conversation renamed",
      "success"
    );
  };

  // =========================
  // DELETE CONVERSATION
  // =========================

  const deleteConversation = async (
    conversationId
  ) => {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", conversationId);

    if (error) {
      console.error(
        "Failed to delete conversation:",
        error
      );

      showToast(
        "Failed to delete conversation.",
        "error"
      );

      return;
    }

    setConversations((prev) =>
      prev.filter(
        (conversation) =>
          conversation.id !== conversationId
      )
    );

    setMessages((prev) => {
      const copy = { ...prev };
      delete copy[conversationId];
      return copy;
    });

    showToast(
      "Conversation deleted",
      "info"
    );
  };

  // =========================
  // CLEAR ALL CONVERSATIONS
  // =========================

  const clearAllConversations = async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) return;

    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("user_id", currentUser.id);

    if (error) {
      console.error(
        "Failed to clear conversations:",
        error
      );

      showToast(
        "Failed to clear conversation history.",
        "error"
      );

      return;
    }

    setConversations([]);
    setMessages({});

    showToast(
      "Conversation history cleared",
      "info"
    );
  };

  // =========================
  // FEEDBACK
  // =========================

  const toggleFeedback = (
    conversationId,
    messageId,
    type
  ) => {
    setMessages((prev) => {
      const convMsgs =
        prev[conversationId] || [];

      const updated = convMsgs.map((message) => {
        if (message.id === messageId) {
          return {
            ...message,
            feedback:
              message.feedback === type
                ? null
                : type,
          };
        }

        return message;
      });

      return {
        ...prev,
        [conversationId]: updated,
      };
    });

    showToast(
      type === "up"
        ? "Feedback recorded: Helpful"
        : "Feedback recorded: Needs improvement",
      "info"
    );
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      showToast(
        error.message ||
        "Failed to sign out",
        "error"
      );

      return;
    }

    setIsAuthenticated(false);
    setConversations([]);
    setMessages({});

    showToast(
      "Signed out of Medora",
      "info"
    );
  };

  // =========================
  // PROVIDER
  // =========================

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,

        isThinking,
        isAuthenticated,
        authLoading,

        user,
        settings,
        toastMessage,

        showToast,
        updateSettings,
        updateUser,

        startNewConversation,
        sendMessage,
        loadMessages,

        regenerateMessage,
        renameConversation,
        deleteConversation,
        clearAllConversations,
        toggleFeedback,

        medications,
        setMedications,
        loadMedications,

        logout,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error(
      "useChat must be used within a ChatProvider"
    );
  }

  return context;
}