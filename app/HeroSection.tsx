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
          Free Brain Training Games & Cognitive Tests
        </h1>

        <div className="text-lg text-theme-secondary max-w-2xl mx-auto space-y-4">
          <p>
            <strong>Key Takeaway:</strong> Brain training involves exercises designed to improve cognitive skills like memory, speed, and accuracy. 
          </p>
          <p>
            Whether you are a competitive gamer looking to improve reaction times, a student aiming to boost working memory, or just seeking to keep your mind sharp, these tools offer scientifically-inspired exercises to measure and enhance your mental agility.
          </p>
        </div>
      </div>
    </div>
  );
}

