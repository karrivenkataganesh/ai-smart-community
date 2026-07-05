import { Upload, Search, Heart, CheckCircle } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: 'Share Your Food',
      description: 'Have extra food? Post it to the community with details about pickup location and availability.',
      color: 'from-emerald-500 to-emerald-600',
      shadowColor: 'shadow-emerald-500/25',
    },
    {
      icon: Search,
      title: 'Browse Available Items',
      description: 'Neighbors can browse available food items and find something they need nearby.',
      color: 'from-primary-500 to-primary-600',
      shadowColor: 'shadow-primary-500/25',
    },
    {
      icon: Heart,
      title: 'Claim & Connect',
      description: 'Claim food you want and connect with your neighbor for pickup.',
      color: 'from-accent-500 to-accent-600',
      shadowColor: 'shadow-accent-500/25',
    },
    {
      icon: CheckCircle,
      title: 'Reduce Waste Together',
      description: 'Every shared item means less food waste and a stronger, more connected community.',
      color: 'from-cyan-500 to-cyan-600',
      shadowColor: 'shadow-cyan-500/25',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-dark-100 mb-2">How It Works</h2>
        <p className="text-dark-400">Simple steps to share and receive food in your neighborhood</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={step.title} className="relative">
            <div className="glass-card p-6 text-center h-full flex flex-col items-center">
              <div className="relative mb-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg ${step.shadowColor}`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-dark-800 border-2 border-dark-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-dark-300">{index + 1}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-dark-100 mb-2">{step.title}</h3>
              <p className="text-sm text-dark-400 leading-relaxed">{step.description}</p>
            </div>

            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <div className="w-6 h-0.5 bg-gradient-to-r from-dark-600 to-primary-500/50" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
