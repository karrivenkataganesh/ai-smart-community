import { useState } from 'react';
import { MapPin, Clock, Package, Check, AlertTriangle } from 'lucide-react';
import { Food } from '../lib/supabase';

interface FoodCardProps {
  food: Food;
  onClaim: (food: Food) => void;
}

const categoryImages: Record<string, string> = {
  'Fruits & Vegetables': 'https://images.pexels.com/photos/1300975/pexels-photo-1300975.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Baked Goods': 'https://images.pexels.com/photos/209196/pexels-photo-209196.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Dairy & Eggs': 'https://images.pexels.com/photos/162712/pexels-photo-162712.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Prepared Meals': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Canned Goods': 'https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Beverages': 'https://images.pexels.com/photos/1024330/pexels-photo-1024330.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Snacks': 'https://images.pexels.com/photos/62709/GettyImages-62709.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Other': 'https://images.pexels.com/photos/5966604/pexels-photo-5966604.jpeg?auto=compress&cs=tinysrgb&w=400',
};

const defaultImage = 'https://images.pexels.com/photos/62709/GettyImages-62709.jpeg?auto=compress&cs=tinysrgb&w=400';

export function FoodCard({ food, onClaim }: FoodCardProps) {
  const [imageError, setImageError] = useState(false);

  const timeLeft = getTimeLeft(new Date(food.expires_at));
  const isExpiringSoon = timeLeft.includes('hour') && !timeLeft.includes('hours');
  const category = food.categories?.name || 'Other';
  const image = imageError ? categoryImages[category] : (food.image_url || categoryImages[category] || defaultImage);

  const isClaimed = food.status === 'claimed';
  const isExpired = food.status === 'expired';

  return (
    <div
      className={`glass-card-hover overflow-hidden flex flex-col ${
        isClaimed ? 'opacity-60' : ''
      } ${isExpired ? 'opacity-40' : ''}`}
    >
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={food.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        </div>

        {isClaimed && (
          <div className="absolute inset-0 bg-dark-900/80 flex items-center justify-center">
            <div className="bg-primary-500/20 border border-primary-500/30 rounded-full p-4">
              <Check className="w-8 h-8 text-primary-400" />
            </div>
          </div>
        )}

        {isExpired && (
          <div className="absolute inset-0 bg-dark-900/80 flex items-center justify-center">
            <div className="bg-dark-700/50 border border-dark-600 rounded-full p-4">
              <AlertTriangle className="w-8 h-8 text-dark-400" />
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge-primary backdrop-blur-md">
            {category}
          </span>
          {isExpiringSoon && !isClaimed && !isExpired && (
            <span className="badge-warning backdrop-blur-md">
              Expiring Soon
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span className={`badge ${
            isClaimed
              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
              : isExpired
              ? 'bg-dark-700 text-dark-400 border border-dark-600'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          } backdrop-blur-md`}>
            {isClaimed ? 'Claimed' : isExpired ? 'Expired' : 'Available'}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-dark-100 mb-1">{food.title}</h3>
        {food.description && (
          <p className="text-dark-400 text-sm mb-3 line-clamp-2">{food.description}</p>
        )}

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2 text-sm text-dark-300">
            <Package className="w-4 h-4 text-primary-400" />
            <span>{food.quantity}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-dark-300">
            <MapPin className="w-4 h-4 text-accent-400" />
            <span>{food.location}</span>
          </div>
          {!isExpired && (
            <div className="flex items-center gap-2 text-sm text-dark-300">
              <Clock className={`w-4 h-4 ${isExpiringSoon ? 'text-accent-400' : 'text-dark-500'}`} />
              <span className={isExpiringSoon ? 'text-accent-400 font-medium' : ''}>
                {isClaimed ? 'Claimed' : timeLeft}
              </span>
            </div>
          )}
        </div>

        {!isClaimed && !isExpired && (
          <button
            onClick={() => onClaim(food)}
            className="btn-primary w-full text-sm"
          >
            Claim This Food
          </button>
        )}

        {isClaimed && food.claimed_by && (
          <p className="text-center text-sm text-dark-400">
            Claimed by {food.claimed_by}
          </p>
        )}
      </div>
    </div>
  );
}

function getTimeLeft(expiresAt: Date): string {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    if (remainingHours > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours > 1 ? 's' : ''} left`;
    }
    return `${days} day${days > 1 ? 's' : ''} left`;
  }

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} left`;
  }

  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
  }

  return 'Expiring soon';
}
