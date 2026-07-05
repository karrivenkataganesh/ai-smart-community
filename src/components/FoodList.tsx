import { useState, useEffect } from 'react';
import { Search, Filter, UtensilsCrossed } from 'lucide-react';
import { FoodCard } from './FoodCard';
import { Food, Category, supabase, isSupabaseConfigured } from '../lib/supabase';

interface FoodListProps {
  onClaim: (food: Food) => void;
  refreshTrigger: number;
  sampleData?: Food[];
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Fruits & Vegetables', icon: 'Apple', created_at: new Date().toISOString() },
  { id: '2', name: 'Baked Goods', icon: 'Croissant', created_at: new Date().toISOString() },
  { id: '3', name: 'Dairy & Eggs', icon: 'Egg', created_at: new Date().toISOString() },
  { id: '4', name: 'Prepared Meals', icon: 'UtensilsCrossed', created_at: new Date().toISOString() },
  { id: '5', name: 'Canned Goods', icon: 'Package', created_at: new Date().toISOString() },
  { id: '6', name: 'Beverages', icon: 'Coffee', created_at: new Date().toISOString() },
  { id: '7', name: 'Snacks', icon: 'Cookie', created_at: new Date().toISOString() },
  { id: '8', name: 'Other', icon: 'Package', created_at: new Date().toISOString() },
];

export function FoodList({ onClaim, refreshTrigger, sampleData }: FoodListProps) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('available');

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchCategories();
    } else {
      setCategories(defaultCategories);
    }
  }, []);

  useEffect(() => {
    if (sampleData) {
      // Use sample data when provided (Supabase not configured)
      let filtered = [...sampleData];

      if (selectedStatus !== 'all') {
        filtered = filtered.filter((f) => f.status === selectedStatus);
      }

      if (selectedCategory !== 'all') {
        filtered = filtered.filter((f) => f.category_id === selectedCategory);
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (f) =>
            f.title.toLowerCase().includes(query) ||
            (f.description?.toLowerCase().includes(query)) ||
            f.location.toLowerCase().includes(query)
        );
      }

      setFoods(filtered);
      setLoading(false);
    } else {
      fetchFoods();
    }
  }, [refreshTrigger, selectedCategory, selectedStatus, searchQuery, sampleData]);

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  }

  async function fetchFoods() {
    setLoading(true);
    let query = supabase
      .from('foods')
      .select('*, categories(*)')
      .order('created_at', { ascending: false });

    if (selectedStatus !== 'all') {
      query = query.eq('status', selectedStatus);
    } else {
      query = query.in('status', ['available', 'claimed']);
    }

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    if (searchQuery.trim()) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
    }

    const { data } = await query;
    if (data) setFoods(data as Food[]);
    setLoading(false);
  }

  const filteredFoods = foods;

  return (
    <section id="available" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-dark-100 mb-2">Available Food</h2>
        <p className="text-dark-400">Find fresh food from your neighbors</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            placeholder="Search for food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field pl-10 pr-10 appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-field px-4 appearance-none cursor-pointer min-w-[130px]"
          >
            <option value="available">Available</option>
            <option value="claimed">Claimed</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="aspect-[4/3] bg-dark-700 rounded-xl mb-4" />
              <div className="h-4 bg-dark-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-dark-700 rounded w-1/2 mb-4" />
              <div className="h-10 bg-dark-700 rounded" />
            </div>
          ))}
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-10 h-10 text-dark-500" />
          </div>
          <h3 className="text-xl font-semibold text-dark-200 mb-2">No food listings found</h3>
          <p className="text-dark-400 mb-6">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your filters'
              : 'Be the first to share food with your neighbors!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} onClaim={onClaim} />
          ))}
        </div>
      )}
    </section>
  );
}
