import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SuggestedPrompts from "./SuggestedPrompts";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { messages, isThinking, sendMessage, startNewConversation, settings } = useChat();

  const [inputPrefill, setInputPrefill] = useState("");
  const messagesEndRef = useRef(null);

  const activeMessages = conversationId ? messages[conversationId] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages.length, isThinking]);

  const handleSendMessage = (text) => {
    if (!conversationId) {
      // Start a brand new conversation and navigate
      const newId = startNewConversation(text);
      navigate(`/chat/${newId}`);
    } else {
      sendMessage(conversationId, text);
    }
    setInputPrefill("");
  };

  const handleSelectSuggestedPrompt = (promptText) => {
    // Put into input so user can inspect/edit or send directly
    setInputPrefill(promptText);
  };

  const isEmptyState = !conversationId || activeMessages.length === 0;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto chat-scroll">
        {isEmptyState ? (
          <div className="min-h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">

            {/* Title & Subtitle */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              How can I help you today?
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-lg mb-8 leading-relaxed">
              Ask questions about symptoms, medications, health conditions, or general medical topics.
            </p>

            {/* Suggested Prompts */}
            {settings.showSuggestedQuestions && (
              <div className="w-full">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  Suggested Questions
                </p>
                <SuggestedPrompts onSelectPrompt={handleSelectSuggestedPrompt} />
              </div>
            )}
          </div>
        ) : (
          <div className="py-4 divide-y divide-transparent">
            {activeMessages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                conversationId={conversationId}
              />
            ))}
            {isThinking && <TypingIndicator />}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Fixed Chat Input at bottom */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isThinking}
        initialText={inputPrefill}
      />
    </div>
  );
}
