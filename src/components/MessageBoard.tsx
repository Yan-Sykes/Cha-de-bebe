import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Send } from 'lucide-react';
import { supabase, type Message } from '../lib/supabase';

export default function MessageBoard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState({ guest_name: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMessages();

    const subscription = supabase
      .channel('messages_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        loadMessages();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadMessages() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.guest_name.trim() || !newMessage.message.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('messages').insert([newMessage]);

      if (error) throw error;

      setNewMessage({ guest_name: '', message: '' });
      alert('Mensagem enviada com sucesso!');
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Erro ao enviar mensagem. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="messages" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="w-10 h-10 text-pink-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Mural de Mensagens
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            Deixe uma mensagem carinhosa para os futuros papais
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seu Nome
              </label>
              <input
                type="text"
                required
                value={newMessage.guest_name}
                onChange={(e) =>
                  setNewMessage({ ...newMessage, guest_name: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition-colors"
                placeholder="Digite seu nome"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sua Mensagem
              </label>
              <textarea
                required
                value={newMessage.message}
                onChange={(e) =>
                  setNewMessage({ ...newMessage, message: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition-colors resize-none"
                placeholder="Escreva uma mensagem carinhosa..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {submitting ? 'Enviando...' : 'Enviar Mensagem'}
            </motion.button>
          </form>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-400 border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">
              Seja o primeiro a deixar uma mensagem carinhosa!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 relative"
              >
                <div className="absolute top-4 right-4">
                  <Heart className="w-6 h-6 text-pink-300 fill-pink-300" />
                </div>

                <p className="text-gray-700 mb-4 pr-8">{message.message}</p>

                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-pink-600">
                    {message.guest_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(message.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
