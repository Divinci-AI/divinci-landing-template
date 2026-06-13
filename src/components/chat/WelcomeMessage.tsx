interface WelcomeMessageProps {
  text: string | null;
}

export function WelcomeMessage({ text }: WelcomeMessageProps) {
  if (!text) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-df-green-dark text-sm font-bold text-white">
        DF
      </div>
      <div className="welcome-bubble rounded-2xl rounded-tl-sm bg-df-bubble-user/75 px-4 py-3 text-sm leading-relaxed text-df-text shadow-sm transition-colors duration-200">
        {text}
      </div>
    </div>
  );
}
