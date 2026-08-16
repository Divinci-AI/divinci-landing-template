import { BrandAvatar } from "./BrandAvatar";

interface WelcomeMessageProps {
  text: string | null;
  /** The Release's uploaded avatar; falls back to brand initials when absent. */
  avatarUrl?: string | null;
}

export function WelcomeMessage({ text, avatarUrl }: WelcomeMessageProps) {
  if (!text) return null;
  return (
    <div className="flex items-start gap-3">
      {/* Shared with the live transcript and the showcase header, so the
          same assistant cannot show two different faces on one page. */}
      <BrandAvatar
        avatarUrl={avatarUrl}
        size="h-9 w-9"
        className="bg-df-green-dark text-sm font-bold text-df-on-chrome"
      />
      <div className="welcome-bubble rounded-2xl rounded-tl-sm bg-df-bubble-user/75 px-4 py-3 text-sm leading-relaxed text-df-text shadow-sm transition-colors duration-200">
        {text}
      </div>
    </div>
  );
}
