import { motion } from 'framer-motion';
import { Heart, Sparkles, Cloud } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-pink-50 via-blue-50 to-white">
      <motion.div
        className="absolute top-10 left-10 text-pink-200"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Cloud className="w-24 h-24" />
      </motion.div>

      <motion.div
        className="absolute top-32 right-20 text-blue-200"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Cloud className="w-32 h-32" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-20 text-pink-200"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        <Cloud className="w-20 h-20" />
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-6"
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Heart className="w-16 h-16 text-pink-400 mx-auto fill-pink-400" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4">
            Bem-vindos ao nosso
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
              Chá de Bebê
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <p className="text-xl md:text-2xl text-gray-600">
              Celebrando a chegada do nosso pequeno tesouro
            </p>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg text-gray-500 mb-8"
          >
            Estamos muito felizes em compartilhar este momento especial com vocês.
            <br />
            Explore nossa lista de presentes, confirme sua presença e deixe uma mensagem carinhosa!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => document.getElementById('gifts')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                Ver Lista de Presentes
              </button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-pink-500 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow border-2 border-pink-500"
              >
                Confirmar Presença
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
