import { cn } from "@/lib/utils";

export function BotAvatar({ avatar, className }: { avatar: string; className?: string }) {
  const isUrl = /^https?:\/\//.test(avatar);
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-accent-foreground ring-1 ring-border",
        className,
      )}
    >
      {isUrl ? <img src={avatar} alt="" className="size-full object-cover" /> : <span aria-hidden>{avatar || "🤖"}</span>}
    </div>
  );
}
