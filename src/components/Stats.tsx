import { TrendingUp, Users, Leaf, Clock } from 'lucide-react';

interface StatsProps {
  totalShared: number;
  totalClaimed: number;
  activeListings: number;
  activeNeighbors: number;
}

export function Stats({ totalShared, totalClaimed, activeListings, activeNeighbors }: StatsProps) {
  const stats = [
    {
      label: 'Foods Shared',
      value: totalShared,
      icon: Leaf,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-500/20 to-emerald-600/20',
    },
    {
      label: 'Items Claimed',
      value: totalClaimed,
      icon: TrendingUp,
      gradient: 'from-primary-500 to-primary-600',
      bgGradient: 'from-primary-500/20 to-primary-600/20',
    },
    {
      label: 'Available Now',
      value: activeListings,
      icon: Clock,
      gradient: 'from-accent-500 to-accent-600',
      bgGradient: 'from-accent-500/20 to-accent-600/20',
    },
    {
      label: 'Active Neighbors',
      value: activeNeighbors,
      icon: Users,
      gradient: 'from-cyan-500 to-cyan-600',
      bgGradient: 'from-cyan-500/20 to-cyan-600/20',
    },
  ];

  return (
    <section id="impact" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-dark-100 mb-2">Community Impact</h2>
        <p className="text-dark-400">Together we're reducing waste and building connections</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-4 sm:p-6 relative overflow-hidden group"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />
            <div className="relative">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-dark-100 mb-1">{stat.value}</p>
              <p className="text-sm text-dark-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
