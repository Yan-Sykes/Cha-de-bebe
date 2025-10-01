import { Baby, Gift, MessageCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function Header({ onNavigate, activeSection }: HeaderProps) {
  const navItems = [
    { id: 'home', label: 'Início', icon: Baby },
    { id: 'rsvp', label: 'Confirmar', icon: Calendar },
    { id: 'gifts', label: 'Presentes', icon: Gift },
    { id: 'messages', label: 'Mensagens', icon: MessageCircle },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Baby className="w-8 h-8 text-pink-400" />
            <span className="text-xl font-bold text-gray-800">Chá de Bebê</span>
          </motion.div>

          <div className="flex gap-2 md:gap-6">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-pink-100 text-pink-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
