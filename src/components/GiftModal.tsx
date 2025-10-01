import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { type Gift, supabase } from '../lib/supabase';
import { generatePixPayload } from '../lib/pix';

interface GiftModalProps {
  gift: Gift;
  onClose: () => void;
}

export default function GiftModal({ gift, onClose }: GiftModalProps) {
  const [buyerName, setBuyerName] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const pixPayload = generatePixPayload({
    pixKey: 'seu-email@exemplo.com.br',
    description: `Presente: ${gift.name}`,
    merchantName: 'Cha de Bebe',
    merchantCity: 'Sao Paulo',
    txid: gift.id.substring(0, 25),
    amount: Number(gift.price).toFixed(2),
  });

  const handleGenerateQRCode = () => {
    if (buyerName.trim().length < 3) {
      alert('Por favor, digite seu nome completo');
      return;
    }
    setShowQRCode(true);
  };

  const handleConfirmPurchase = async () => {
    if (!buyerName.trim()) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('gifts')
        .update({
          is_purchased: true,
          purchased_by: buyerName,
          purchased_at: new Date().toISOString(),
        })
        .eq('id', gift.id)
        .eq('is_purchased', false);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error confirming purchase:', error);
      alert('Erro ao confirmar a compra. Por favor, tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixPayload);
    alert('Código PIX copiado! Cole no seu aplicativo de pagamento.');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Presente Confirmado!
            </h3>
            <p className="text-gray-600">
              Muito obrigado por sua generosidade, {buyerName}!
            </p>
          </div>
        ) : (
          <>
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={gift.image_url}
                alt={gift.name}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=600';
                }}
              />
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {gift.name}
              </h3>
              <p className="text-gray-600 mb-4">{gift.description}</p>

              <div className="bg-pink-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Valor do presente</p>
                <p className="text-3xl font-bold text-pink-600">
                  R$ {Number(gift.price).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Valor fixo via PIX
                </p>
              </div>

              {!showQRCode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seu nome completo
                    </label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Digite seu nome"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleGenerateQRCode}
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Gerar QR Code PIX
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                    <div className="flex justify-center mb-4">
                      <QRCodeSVG value={pixPayload} size={200} level="M" />
                    </div>
                    <p className="text-sm text-center text-gray-600 mb-4">
                      Escaneie o QR Code ou copie o código PIX
                    </p>
                    <button
                      onClick={handleCopyPixCode}
                      className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Copiar Código PIX
                    </button>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Importante:</strong> Após realizar o pagamento, clique em "Confirmar Pagamento" abaixo.
                    </p>
                  </div>

                  <button
                    onClick={handleConfirmPurchase}
                    disabled={processing}
                    className="w-full py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processando...' : 'Confirmar Pagamento'}
                  </button>

                  <button
                    onClick={() => setShowQRCode(false)}
                    className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Voltar
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
