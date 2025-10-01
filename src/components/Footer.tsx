import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-100 to-blue-100 py-8 px-4">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
          <p className="text-gray-700 font-medium">
            Feito com amor para o nosso pequeno tesouro
          </p>
          <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
        </div>
        <p className="text-gray-600 text-sm">
          {new Date().getFullYear()} • Chá de Bebê
        </p>
      </div>
    </footer>
  );
}
