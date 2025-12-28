import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, BookOpen, Shield, Star } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-town-sky to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="text-center max-w-2xl mx-auto">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-cyan-500 shadow-glow mb-6 animate-float">
            <span className="text-5xl">🏰</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 animate-slide-up">
            Welcome to <span className="text-primary">SpellTown</span>!
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            The fun way to learn spelling! Play games, earn rewards, and build your very own town.
          </p>

          {/* CTA Button */}
          <Button
            variant="game"
            size="xl"
            onClick={() => navigate('/play')}
            className="text-2xl gap-3 h-20 px-12 animate-slide-up"
            style={{ animationDelay: '200ms' }}
          >
            <Play className="h-8 w-8" />
            Start Playing!
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: <BookOpen className="h-8 w-8" />, title: '8 Fun Games', desc: 'Learn spelling through play', color: 'from-primary to-cyan-500' },
            { icon: <Star className="h-8 w-8" />, title: 'Earn Rewards', desc: 'Collect coins & XP', color: 'from-amber-400 to-orange-500' },
            { icon: <Shield className="h-8 w-8" />, title: 'Kid Safe', desc: 'No ads, parent controls', color: 'from-success to-emerald-400' },
          ].map((feature, i) => (
            <div 
              key={i} 
              className="bg-card rounded-2xl p-6 shadow-card text-center animate-slide-up"
              style={{ animationDelay: `${300 + i * 100}ms` }}
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8 text-sm text-muted-foreground">
        Grades K-5 • Safe for kids • No account required to try
      </div>
    </div>
  );
}
