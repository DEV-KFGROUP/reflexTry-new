export function HeroSection() {

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-10 pb-10">
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-block">
          <span className="px-4 py-1.5 rounded-full border border-border bg-white text-muted-foreground text-sm font-medium">
            Brain training tools
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-foreground">
          Improve focus, speed, memory and accuracy.
        </h1>

        <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
          A simple collection of practice tools to help you train consistently and track progress over time.
        </p>
      </div>
    </div>
  );
}

