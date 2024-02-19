import { Spinner } from "@nextui-org/react";
import { cn } from "y/lib/utils";

type Avatar = "AI" | "U";

export interface ChatBubble {
  avatar: Avatar;
  username: string;
  config: {
    loading: boolean;
    at: Date;
  };
  message?: string;
}

export interface ChatBubbleProps extends ChatBubble {}

export function ChatBubble({ avatar, username, config: { loading, at }, message }: ChatBubbleProps) {
  const getLoadingAnimation = () => {
    return (
      <div className="flex">
        <Spinner size="sm" />
      </div>
    );
  };

  const showMessage = (message: string) => {
    return <p className="text-sm font-normal text-gray-900 dark:text-white">{message}</p>;
  };

  return (
    <div className={cn("flex items-start gap-2.5", avatar === "U" && "flex-row-reverse")}>
      <div className="avatar">{avatar}</div>
      <div className={cn("flex max-w-[500px] flex-col gap-1", avatar === "U" && "text-right")}>
        <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{username}</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{at.toLocaleTimeString("en-US")}</span>
        </div>
        <div className={cn("bubble", avatar === "U" ? "user" : "ai")}>
          <>
            {loading && !message && getLoadingAnimation()}
            {message && showMessage(message)}
          </>
        </div>
      </div>
    </div>
  );
}
