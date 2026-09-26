import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import { MessageSquare, MoreHorizontal, Edit2, Trash2, Check, X } from "lucide-react";

export default function ConversationItem({ conversation, onSelect }) {
  const { conversationId } = useParams();
  const { renameConversation, deleteConversation } = useChat();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  const isActive = conversationId === conversation.id;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleSaveRename = (e) => {
    e?.preventDefault();
    if (editTitle.trim()) {
      renameConversation(conversation.id, editTitle);
    } else {
      setEditTitle(conversation.title);
    }
    setIsEditing(false);
  };

  const handleCancelRename = (e) => {
    e?.stopPropagation();
    setEditTitle(conversation.title);
    setIsEditing(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    deleteConversation(conversation.id);
    if (isActive) {
      navigate("/chat");
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSaveRename} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#181818] border border-slate-300 dark:border-[#333333]">
        <input
          ref={inputRef}
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Confirm rename"
          className="text-slate-700 dark:text-white hover:text-teal-400 p-0.5"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          aria-label="Cancel rename"
          onClick={handleCancelRename}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </form>
    );
  }

  return (
    <div
      className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ${
        isActive
          ? "bg-slate-200/70 dark:bg-[#1c1c1c] text-slate-900 dark:text-white font-medium shadow-xs border border-slate-300/80 dark:border-[#2a2a2a]"
          : "text-slate-700 dark:text-white hover:bg-slate-200/50 dark:hover:bg-[#151515] hover:text-black dark:hover:text-white"
      }`}
    >
      <Link
        to={`/chat/${conversation.id}`}
        onClick={onSelect}
        className="flex items-center gap-2.5 min-w-0 flex-1 truncate text-inherit"
      >
        <MessageSquare className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white"}`} />
        <span className="truncate text-inherit">{conversation.title}</span>
      </Link>

      {/* Action menu button */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label="Conversation options"
          className={`p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#252525] transition-opacity ${
            isMenuOpen || isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#181818] rounded-lg shadow-lg border border-slate-200 dark:border-[#2a2a2a] py-1 z-30 text-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(false);
                setIsEditing(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#222222] hover:text-slate-900 dark:hover:text-white"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Rename</span>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
