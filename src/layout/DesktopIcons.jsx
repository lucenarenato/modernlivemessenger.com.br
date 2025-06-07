import Icon from "./Icon";

export default function DesktopIcons({ showChat, onChatClick }) {
    return (
        <div className="grid grid-cols-1 gap-2">
            <div className="w-20 h-20">
                {!showChat ? (
                    <Icon image="/wlm-logo.png" label="FLM" onClick={onChatClick} />
                ) : (
                    <div className="w-full h-full" />
                )}
            </div>
        </div>
    );
}
