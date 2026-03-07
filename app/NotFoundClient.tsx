"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, Search, AlertCircle, ArrowLeft, Target, Zap, Keyboard, Activity } from 'lucide-react';

export default function NotFoundClient({ locale }: { locale: string }) {

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full text-center">
        {/* 404 Number with Animation - Must be prominent for 404 detection */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-neon-teal via-electric-purple to-neon-teal bg-clip-text text-transparent animate-pulse">
            404
          </h1>
          <div className="text-lg font-semibold text-theme-primary mt-4">Error 404 - Page Not Found</div>
          <p className="text-sm text-theme-muted mt-2">
            The requested page could not be found on this server.
          </p>
        </div>

        {/* Main Message */}
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-neon-teal/20 to-electric-purple/20 border-2 border-neon-teal/30 mb-6 animate-bounce">
            <AlertCircle className="w-12 h-12 text-neon-teal" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-theme-primary mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-theme-secondary mb-3 max-w-2xl mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-theme-muted max-w-xl mx-auto">
            Don't worry - you can explore our brain training games or return to the homepage.
          </p>
        </div>

        {/* Helpful Links */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold text-theme-primary mb-6">
            What would you like to do?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
            <Link href="/">
              <Button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-neon-teal to-electric-purple hover:opacity-90 text-lg py-6">
                <Home className="w-5 h-5" />
                Go to Homepage
              </Button>
            </Link>
            <Link href="/tools">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 text-lg py-6 border-2">
                <Search className="w-5 h-5" />
                View All Tools
              </Button>
            </Link>
          </div>

          {/* Popular Categories with Icons */}
          <div className="mt-10">
            <p className="text-theme-secondary mb-6 text-lg font-medium">Explore our popular tools:</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              <Link href="/memory" className="group">
                <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 hover:border-neon-teal/50 hover:bg-theme-surface transition-all cursor-pointer">
                  <Activity className="w-8 h-8 text-neon-pink mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-semibold text-theme-primary">Memory</div>
                </div>
              </Link>
              <Link href="/reflex" className="group">
                <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 hover:border-neon-teal/50 hover:bg-theme-surface transition-all cursor-pointer">
                  <Zap className="w-8 h-8 text-neon-yellow mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-semibold text-theme-primary">Reflex</div>
                </div>
              </Link>
              <Link href="/speed" className="group">
                <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 hover:border-neon-teal/50 hover:bg-theme-surface transition-all cursor-pointer">
                  <Keyboard className="w-8 h-8 text-neon-teal mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-semibold text-theme-primary">Speed</div>
                </div>
              </Link>
              <Link href="/accuracy" className="group">
                <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 hover:border-neon-teal/50 hover:bg-theme-surface transition-all cursor-pointer">
                  <Target className="w-8 h-8 text-electric-purple mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-semibold text-theme-primary">Accuracy</div>
                </div>
              </Link>
              <Link href="/gaming" className="group">
                <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 hover:border-neon-teal/50 hover:bg-theme-surface transition-all cursor-pointer">
                  <Activity className="w-8 h-8 text-vibrant-coral mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-semibold text-theme-primary">Gaming</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Report Issue */}
        <div className="mt-12 pt-8 border-t border-theme/30">
          <p className="text-theme-muted mb-4">
            Found a broken link? Let us know!
          </p>
          <Link href="/contact">
            <Button variant="outline" className="flex items-center gap-2 mx-auto">
              <AlertCircle className="w-4 h-4" />
              Report a Problem
            </Button>
          </Link>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="text-theme-secondary hover:text-neon-teal transition-colors flex items-center gap-2 mx-auto font-medium"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

