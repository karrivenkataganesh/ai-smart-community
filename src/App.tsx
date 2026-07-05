import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { FoodList } from './components/FoodList';
import { AddFoodModal } from './components/AddFoodModal';
import { ClaimFoodModal } from './components/ClaimFoodModal';
import { HowItWorks } from './components/HowItWorks';
import { Food, supabase, isSupabaseConfigured } from './lib/supabase';

// Sample data for demo when Supabase is not configured
const sampleFoods: Food[] = [
  {
    id: '1',
    title: 'Fresh Garden Tomatoes',
    description: 'Homegrown tomatoes from my backyard garden. Perfect for salads!',
    quantity: '6 tomatoes',
    location: '123 Oak Street, Front Porch',
    pickup_instructions: 'Ring doorbell, I will leave them on the porch',
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    image_url: 'https://images.pexels.com/photos/1300975/pexels-photo-1300975.jpeg?auto=compress&cs=tinysrgb&w=400',
    category_id: '1',
    status: 'available',
    claimed_by: null,
    created_at: new Date().toISOString(),
    categories: { id: '1', name: 'Fruits & Vegetables', icon: 'Apple', created_at: new Date().toISOString() },
  },
  {
    id: '2',
    title: 'Homemade Sourdough Bread',
    description: 'Fresh baked this morning. Sourdough loaf, perfect condition.',
    quantity: '1 loaf',
    location: '456 Maple Ave, Side Door',
    pickup_instructions: 'Text me when you arrive',
    expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    image_url: 'https://images.pexels.com/photos/209196/pexels-photo-209196.jpeg?auto=compress&cs=tinysrgb&w=400',
    category_id: '2',
    status: 'available',
    claimed_by: null,
    created_at: new Date().toISOString(),
    categories: { id: '2', name: 'Baked Goods', icon: 'Croissant', created_at: new Date().toISOString() },
  },
  {
    id: '3',
    title: 'Mixed Salad Greens',
    description: 'Fresh mixed greens - arugula, spinach, and lettuce mix',
    quantity: '2 bags',
    location: '789 Pine Road, Mailbox',
    pickup_instructions: 'Available anytime, just take from the cooler',
    expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    category_id: '1',
    status: 'available',
    claimed_by: null,
    created_at: new Date().toISOString(),
    categories: { id: '1', name: 'Fruits & Vegetables', icon: 'Apple', created_at: new Date().toISOString() },
  },
];

function App() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({
    totalShared: 3,
    totalClaimed: 12,
    activeListings: 3,
    activeNeighbors: 5,
  });

  const fetchStats = useCallback(async () => {
    if (!isSupabaseConfigured) {
      // Use sample stats when Supabase is not configured
      setStats({
        totalShared: 3,
        totalClaimed: 12,
        activeListings: 3,
        activeNeighbors: 5,
      });
      return;
    }

    const [foodsResult, claimsResult] = await Promise.all([
      supabase.from('foods').select('status'),
      supabase.from('claims').select('claimed_by_name'),
    ]);

    const foods = foodsResult.data || [];
    const claims = claimsResult.data || [];

    const totalShared = foods.length + claims.length;
    const totalClaimed = claims.length;
    const activeListings = foods.filter((f) => f.status === 'available').length;
    const uniqueNeighbors = new Set(claims.map((c) => c.claimed_by_name)).size;

    setStats({
      totalShared,
      totalClaimed,
      activeListings,
      activeNeighbors: Math.max(uniqueNeighbors, activeListings > 0 ? 1 : 0),
    });
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshTrigger]);

  const handleClaim = (food: Food) => {
    setSelectedFood(food);
    setClaimModalOpen(true);
  };

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 blur-3xl rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/5 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/3 blur-3xl rounded-full" />
      </div>

      <Header onAddFood={() => setAddModalOpen(true)} />

      {/* Configuration warning - only show when NOT configured */}
      {!isSupabaseConfigured && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-lg w-full mx-4">
          <div className="glass-card border-accent-500/30 bg-accent-500/10 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-dark-100 font-medium">Demo Mode</p>
              <p className="text-xs text-dark-300 mt-1">
                Supabase is not configured. Showing sample data. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable full functionality.
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="relative pt-20">
        {/* Hero Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              AI for Smarter Communities
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-100 mb-6 leading-tight">
              Share Food,{" "}
              <span className="bg-gradient-to-r from-primary-400 via-emerald-400 to-accent-400 bg-clip-text text-transparent">
                Build Community
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-dark-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with neighbors to share surplus food, reduce waste, and create a more sustainable community together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setAddModalOpen(true)} className="btn-primary text-base">
                Share Food Now
              </button>
              <a href="#available" className="btn-secondary text-base">
                Browse Available Food
              </a>
            </div>
          </div>
        </section>

        <Stats {...stats} />
        <FoodList
          onClaim={handleClaim}
          refreshTrigger={refreshTrigger}
          sampleData={!isSupabaseConfigured ? sampleFoods : undefined}
        />
        <HowItWorks />

        {/* Footer */}
        <footer className="border-t border-dark-800 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-dark-400 text-sm">
              FoodShare - Built for the AI for Better Living hackathon
            </p>
            <p className="text-dark-500 text-xs mt-2">
              Reducing food waste, one neighborhood at a time
            </p>
          </div>
        </footer>
      </main>

      <AddFoodModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <ClaimFoodModal
        food={selectedFood}
        isOpen={claimModalOpen}
        onClose={() => {
          setClaimModalOpen(false);
          setSelectedFood(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default App;
