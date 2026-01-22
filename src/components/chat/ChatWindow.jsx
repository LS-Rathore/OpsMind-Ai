export default function ChatWindow({ children, header }) {
    return (
        <div className="flex h-full relative bg-[#212121] w-full">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full relative">
                {header && (
                    <div className="h-14 flex items-center px-4 justify-between z-10 lg:hidden">
                        {header}
                    </div>
                )}
                <div className="flex-1 flex flex-col relative overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}
