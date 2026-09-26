import { useChat } from "../../context/ChatContext";
import ConversationItem from "./ConversationItem";

export default function ConversationList({ onSelect }) {
  const { conversations } = useChat();

  if (!conversations || conversations.length === 0) {
    return (
      <div className="py-6 px-3 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-500">No conversations yet.</p>
        <p className="text-[11px] text-slate-400/80 mt-1">Start a new chat to begin.</p>
      </div>
    );
  }

  // Group conversations
  const groups = {
    "Today": [],
    "Yesterday": [],
    "Previous 7 Days": [],
    "Older": []
  };

  conversations.forEach(conv => {
    const grp = conv.group && groups[conv.group] ? conv.group : "Today";
    groups[grp].push(conv);
  });

  const activeGroupKeys = ["Today", "Yesterday", "Previous 7 Days", "Older"].filter(
    key => groups[key].length > 0
  );

  return (
    <div className="space-y-4">
      {activeGroupKeys.map(groupName => (
        <div key={groupName} className="space-y-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            {groupName}
          </p>
          <div className="space-y-0.5">
            {groups[groupName].map(conv => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
