import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, Users, Mail, Phone, Utensils } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function RSVPForm() {
  const [formData, setFormData] = useState({
    guest_name: '',
    email: '',
    phone: '',
    will_attend: true,
    number_of_guests: 1,
    dietary_restrictions: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.guest_name || !formData.email) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('rsvps').insert([formData]);

      if (error) throw error;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-rsvp-email`;

      try {
        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(formData),
        });
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
      }

      setSuccess(true);
      setFormData({
        guest_name: '',
        email: '',
        phone: '',
        will_attend: true,
        number_of_guests: 1,
        dietary_restrictions: '',
      });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Erro ao enviar confirmação. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-20 px-4 bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="w-10 h-10 text-pink-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Confirme sua Presença
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            Será uma honra ter você conosco neste dia especial!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {success ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Confirmação Recebida!
              </h3>
              <p className="text-gray-600">
                Obrigado por confirmar sua presença. Estamos ansiosos para celebrar com você!
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.guest_name}
                  onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition-colors"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition-colors"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition-colors"
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Você vai comparecer? *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="will_attend"
                        checked={formData.will_attend === true}
                        onChange={() => setFormData({ ...formData, will_attend: true })}
                        className="w-4 h-4 text-pink-500 focus:ring-pink-400"
                      />
                      <span className="text-gray-700">Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="will_attend"
                        checked={formData.will_attend === false}
                        onChange={() => setFormData({ ...formData, will_attend: false })}
                        className="w-4 h-4 text-pink-500 focus:ring-pink-400"
                      />
                      <span className="text-gray-700">Não</span>
                    </label>
                  </div>
                </div>

                {formData.will_attend && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Acompanhantes
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.number_of_guests}
                      onChange={(e) =>
                        setFormData({ ...formData, number_of_guests: parseInt(e.target.value) || 1 })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition-colors"
                    />
                  </div>
                )}
              </div>

              {formData.will_attend && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Utensils className="w-4 h-4" />
                    Restrições Alimentares
                  </label>
                  <textarea
                    value={formData.dietary_restrictions}
                    onChange={(e) =>
                      setFormData({ ...formData, dietary_restrictions: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition-colors resize-none"
                    placeholder="Alergias, restrições ou preferências alimentares..."
                  />
                </div>
              )}

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Enviando...' : 'Confirmar Presença'}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
