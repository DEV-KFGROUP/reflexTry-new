export function HeroSection() {

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 pb-6">
      {/* Hero Section - Optimized for LCP */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        {/* LCP Element - Render immediately without animation delay */}
        <div className="inline-block">
          <span className="px-4 py-1.5 rounded-full border border-neon-teal/30 bg-neon-teal/10 text-neon-teal text-sm font-medium">
            Next-Gen Accuracy Tools
          </span>
        </div>

        {/* Hero Title - Critical LCP element, render immediately */}
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
          <span className="text-white block mb-2">
            Test Your Limits.
          </span>
          <span
            className="block"
            style={{
              background: 'linear-gradient(to right, #00f0ff, #00e5ff, #9d00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: '#00f0ff' // Fallback color if gradient doesn't work
            }}
          >
            Refine Your Skills.
          </span>
        </h1>

        {/* LCP Element - Server-rendered for immediate display */}
        <p className="text-xl text-theme-secondary max-w-2xl mx-auto">
          Challenge your cognitive limits with our suite of free tools. Prove your speed, precision, and problem-solving abilities today!
        </p>
      </div>
    </div>
  );
}

