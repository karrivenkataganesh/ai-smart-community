import { useState } from 'react';
import { Menu, X, UtensilsCrossed, Plus } from 'lucide-react';

interface HeaderProps {
  onAddFood: () => void;
}

export function Header({ onAddFood }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-dark-700/50 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-dark-100">
                FoodShare
              </h1>
              <p className="text-xs text-dark-400 hidden sm:block">Smart Neighborhood Sharing</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#available" className="text-dark-300 hover:text-dark-100 transition-colors text-sm font-medium">
              Available Food
            </a>
            <a href="#impact" className="text-dark-300 hover:text-dark-100 transition-colors text-sm font-medium">
              Community Impact
            </a>
            <a href="#how-it-works" className="text-dark-300 hover:text-dark-100 transition-colors text-sm font-medium">
              How It Works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onAddFood}
              className="hidden sm:flex btn-primary items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Share Food
            </button>
            <button
              onClick={onAddFood}
              className="sm:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-dark-700 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-dark-300" />
              ) : (
                <Menu className="w-6 h-6 text-dark-300" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-700/50 animate-fade-in">
            <nav className="flex flex-col gap-2">
              <a
                href="#available"
                className="px-4 py-2 rounded-lg text-dark-300 hover:text-dark-100 hover:bg-dark-700/50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Available Food
              </a>
              <a
                href="#impact"
                className="px-4 py-2 rounded-lg text-dark-300 hover:text-dark-100 hover:bg-dark-700/50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Community Impact
              </a>
              <a
                href="#how-it-works"
                className="px-4 py-2 rounded-lg text-dark-300 hover:text-dark-100 hover:bg-dark-700/50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
            </nav>
          </div>
        )}
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-3xl rounded-full pointer-events-none" />
    </header>
  );
}
