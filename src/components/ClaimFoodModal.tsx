import { useState } from 'react';
import { X, User, MessageSquare, AlertTriangle } from 'lucide-react';
import { Food, supabase, isSupabaseConfigured } from '../lib/supabase';

interface ClaimFoodModalProps {
  food: Food | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ClaimFoodModal({ food, isOpen, onClose, onSuccess }: ClaimFoodModalProps) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setNotes('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!food) return;

    if (!isSupabaseConfigured) {
      setError('Cannot claim food in demo mode. Please configure Supabase environment variables.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase
      .from('foods')
      .update({ status: 'claimed', claimed_by: name })
      .eq('id', food.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    await supabase.from('claims').insert({
      food_id: food.id,
      claimed_by_name: name,
      notes: notes || null,
    });

    resetForm();
    onSuccess();
    onClose();
    setLoading(false);
  }

  if (!isOpen || !food) return null;

  const expiresAt = new Date(food.expires_at);
  const formattedExpiry = expiresAt.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative glass-card p-8 w-full max-w-md">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-dark-800 hover:bg-dark-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-dark-300" />
        </button>

        <h2 className="text-xl font-bold text-dark-100 mb-6">Claim This Food</h2>

        {!isSupabaseConfigured && (
          <div className="glass-card border-accent-500/30 bg-accent-500/10 p-4 flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-dark-100 font-medium">Demo Mode - Read Only</p>
              <p className="text-xs text-dark-300 mt-1">
                You cannot claim food items in demo mode.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="glass-card border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-dark-100">{error}</p>
          </div>
        )}

        <div className="bg-dark-800/50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-dark-100">{food.title}</h3>
          <p className="text-sm text-dark-400 mt-1">{food.quantity}</p>
          <p className="text-sm text-dark-400">Available until: {formattedExpiry}</p>
          {food.pickup_instructions && (
            <p className="text-sm text-dark-400 mt-2">
              Pickup: {food.pickup_instructions}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-primary-400" />
              Your Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="So the neighbor knows who's coming"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-accent-400" />
              Message (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Leave a thank you message or special request..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={handleClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Claiming...' : isSupabaseConfigured ? 'Claim Food' : 'Demo Mode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
