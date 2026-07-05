import { useState, useEffect } from 'react';
import { X, Camera, MapPin, Clock, Package, Tag, AlertTriangle } from 'lucide-react';
import { Category, FoodInsert, supabase, isSupabaseConfigured } from '../lib/supabase';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

export function AddFoodModal({ isOpen, onClose, onSuccess }: AddFoodModalProps) {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FoodInsert>({
    title: '',
    description: '',
    quantity: '',
    location: '',
    pickup_instructions: '',
    expires_at: '',
    image_url: '',
    category_id: '',
  });

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (isSupabaseConfigured) {
        fetchCategories();
      } else {
        setCategories(defaultCategories);
      }
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        title: '',
        description: '',
        quantity: '',
        location: '',
        pickup_instructions: '',
        expires_at: tomorrow.toISOString().slice(0, 16),
        image_url: '',
        category_id: '',
      });
    }
  }, [isOpen]);

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isSupabaseConfigured) {
      setError('Cannot share food in demo mode. Please configure Supabase environment variables.');
      return;
    }

    setLoading(true);
    setError(null);

    const foodData: FoodInsert = {
      title: formData.title,
      description: formData.description || undefined,
      quantity: formData.quantity,
      location: formData.location,
      pickup_instructions: formData.pickup_instructions || undefined,
      expires_at: new Date(formData.expires_at).toISOString(),
      image_url: formData.image_url || undefined,
      category_id: formData.category_id || undefined,
    };

    const { error: insertError } = await supabase.from('foods').insert(foodData);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    onSuccess();
    onClose();
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="sticky top-0 bg-dark-900/95 backdrop-blur-xl border-b border-dark-700/50 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-dark-100">Share Food with Neighbors</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-dark-800 hover:bg-dark-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-dark-300" />
            </button>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div className="px-6 pt-4">
            <div className="glass-card border-accent-500/30 bg-accent-500/10 p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-dark-100 font-medium">Demo Mode - Read Only</p>
                <p className="text-xs text-dark-300 mt-1">
                  You cannot add new food items in demo mode. Configure Supabase to enable full functionality.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="px-6 pt-4">
            <div className="glass-card border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-dark-100">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Food Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Fresh tomatoes from my garden"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell neighbors more about this food..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary-400" />
                Quantity *
              </label>
              <input
                type="text"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g., 5 tomatoes, 2 lbs"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-accent-400" />
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="input-field appearance-none cursor-pointer"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Pickup Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., 123 Oak Street, front porch"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Pickup Instructions
            </label>
            <textarea
              value={formData.pickup_instructions}
              onChange={(e) => setFormData({ ...formData, pickup_instructions: e.target.value })}
              placeholder="Any special instructions for pickup..."
              rows={2}
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-400" />
                Available Until *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.expires_at}
                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2 flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Sharing...' : isSupabaseConfigured ? 'Share Food' : 'Demo Mode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
