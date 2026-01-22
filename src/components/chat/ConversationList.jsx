import { Plus, MessageSquare, Trash2, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';
import { isToday, isYesterday, subDays, isAfter } from 'date-fns';

export default function ConversationList({ conversations, activeId, onSelect, onDelete }) {

    // Group conversations
    const groups = {
        today: [],
        yesterday: [],
        previous7Days: [],
        older: []
    };

    conversations.forEach(conv => {
        const date = new Date(conv.updatedAt || Date.now()); // Fallback to now if missing
        if (isToday(date)) {
            groups.today.push(conv);
        } else if (isYesterday(date)) {
            groups.yesterday.push(conv);
        } else if (isAfter(date, subDays(new Date(), 7))) {
            groups.previous7Days.push(conv);
        } else {
            groups.older.push(conv);
        }
    });

    const renderGroup = (title, items) => {
        if (items.length === 0) return null;
        return (
            <div className="mb-6">
                <h3 className="px-3 text-xs font-semibold text-gray-500 mb-2">{title}</h3>
                <div className="space-y-0.5">
                    {items.map((conv) => (
                        <div
                            key={conv.id}
                            className={clsx(
                                "group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm relative",
                                activeId === conv.id
                                    ? "bg-[#212121] text-gray-100"
                                    : "text-gray-300 hover:bg-[#212121]"
                            )}
                            onClick={() => onSelect(conv.id)}
                        >
                            <div className="flex-1 min-w-0 truncate text-[13px]">
                                {conv.title || 'New Conversation'}
                            </div>

                            {(activeId === conv.id || window.matchMedia('(hover: hover)').matches) && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(conv.id);
                                    }}
                                    className={clsx(
                                        "opacity-0 group-hover:opacity-100 p-1 hover:text-white transition-opacity absolute right-2",
                                        activeId === conv.id ? "opacity-100 text-gray-400" : "text-gray-500"
                                    )}
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 overflow-y-auto px-2 py-2">
            {renderGroup('Today', groups.today)}
            {renderGroup('Yesterday', groups.yesterday)}
            {renderGroup('Previous 7 Days', groups.previous7Days)}
            {renderGroup('Older', groups.older)}
        </div>
    );
}
