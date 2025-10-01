import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift as GiftIcon, ShoppingBag, X } from 'lucide-react';
import { supabase, type Gift } from '../lib/supabase';
import GiftModal from './GiftModal';

export default function GiftList() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  useEffect(() => {
    loadGifts();

    const subscription = supabase
      .channel('gifts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gifts' }, () => {
        loadGifts();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadGifts() {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setGifts(data || []);
    } catch (error) {
      console.error('Error loading gifts:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="gifts" className="py-20 px-4 bg-gradient-to-b from-white to-pink-50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <GiftIcon className="w-10 h-10 text-pink-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Lista de Presentes
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            Escolha um presente e contribua via PIX de forma rápida e segura
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-400 border-t-transparent" />
          </div>
        ) : gifts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Nenhum presente cadastrado ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts.map((gift, index) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative"
              >
                <div
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${
                    gift.is_purchased
                      ? 'opacity-75 cursor-not-allowed'
                      : 'cursor-pointer hover:shadow-xl'
                  }`}
                  onClick={() => !gift.is_purchased && setSelectedGift(gift)}
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={gift.image_url}
                      alt={gift.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=600';
                      }}
                    />
                    {gift.is_purchased && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-white px-6 py-3 rounded-full">
                          <p className="text-green-600 font-bold">✓ Presenteado</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {gift.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {gift.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-pink-500">
                        R$ {Number(gift.price).toFixed(2)}
                      </span>
                      {!gift.is_purchased && (
                        <button className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors">
                          Presentear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedGift && (
          <GiftModal gift={selectedGift} onClose={() => setSelectedGift(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
