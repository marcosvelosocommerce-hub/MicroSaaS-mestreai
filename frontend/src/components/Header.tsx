import { GraduationCap } from 'lucide-react';

export const Header = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text">
          Mestre IA
        </h1>
      </div>
      <p className="text-muted-foreground">
        Sua assistente inteligente para resumos de aulas
      </p>
    </header>
  );
};