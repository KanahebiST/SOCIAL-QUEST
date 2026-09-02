import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { RecyclingSpot } from '../types';
import { RECYCLING_SPOTS } from '../data/initialData';
import { X, QrCode, Copy, Check, MapPin, Sparkles } from 'lucide-react';
import { audio } from '../utils/audio';

interface TestQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSpotToScan?: (spot: RecyclingSpot) => void;
  initialSpotId?: string;
}

export const TestQRCodeModal: React.FC<TestQRCodeModalProps> = ({
  isOpen,
  onClose,
  onSelectSpotToScan,
  initialSpotId,
}) => {
  const [selectedSpotId, setSelectedSpotId] = useState<string>(initialSpotId || RECYCLING_SPOTS[0].id);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const currentSpot = RECYCLING_SPOTS.find((s) => s.id === selectedSpotId) || RECYCLING_SPOTS[0];

  const payload = JSON.stringify({
    type: 'recycling_spot',
    spotId: currentSpot.id,
  });

  useEffect(() => {
    if (initialSpotId) {
      setSelectedSpotId(initialSpotId);
    }
  }, [initialSpotId]);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(payload, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR code generation error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [payload]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    audio.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-md bg-slate-900 pixel-box-emerald text-slate-100 rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh]"
        id="test-qrcode-modal"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-pixel text-sm text-emerald-300">公式リサイクルQRコード</h3>
              <p className="text-[10px] text-slate-400 font-pixel">実機テスト・別端末スキャン用コード</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
            id="close-test-qr-modal-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Spot Selector Tabs */}
        <div className="p-3.5 bg-slate-950 border-b border-slate-800">
          <label className="block text-xs font-bold font-pixel text-slate-200 mb-1">
            スポットを選択
          </label>
          <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-1">
            {RECYCLING_SPOTS.map((spot) => {
              const isSelected = spot.id === selectedSpotId;
              return (
                <button
                  key={spot.id}
                  onClick={() => {
                    setSelectedSpotId(spot.id);
                    audio.playClick();
                  }}
                  className={`p-2 rounded-xl text-left text-xs transition border flex items-center gap-2 pixel-btn ${
                    isSelected
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-base">{spot.icon || '♻️'}</span>
                  <div className="truncate flex-1">
                    <div className="truncate font-pixel text-xs">{spot.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-slate-500 font-mono">{spot.id}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* QR Code Display & Info */}
        <div className="p-5 flex flex-col items-center justify-center overflow-y-auto text-center space-y-3.5">
          <div className="p-3 bg-white rounded-xl border-2 border-emerald-500 shadow-md inline-block">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Recycling Spot QR Code"
                className="w-44 h-44 object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-slate-400 text-xs font-pixel">
                QRコード生成中...
              </div>
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold font-pixel border border-emerald-500/50 mb-0.5">
              <span>{currentSpot.icon || '♻️'}</span>
              <span>{currentSpot.id}</span>
            </div>
            <h4 className="font-bold font-pixel text-sm text-slate-100">{currentSpot.name}</h4>
            <p className="text-xs font-pixel text-slate-400 flex items-center justify-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentSpot.location}</span>
            </p>
          </div>

          <div className="w-full bg-slate-950 p-2 rounded-xl text-[10px] text-slate-400 font-mono flex items-center justify-between border border-slate-800">
            <span className="truncate mr-2 text-left">{payload}</span>
            <button
              onClick={handleCopy}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1 font-pixel shrink-0 text-[9px] pixel-btn"
              title="JSONペイロードをコピー"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? '完了' : 'コピー'}</span>
            </button>
          </div>

          {/* Quick Simulation Button for Testing */}
          {onSelectSpotToScan && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectSpotToScan(currentSpot);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-pixel text-xs pixel-btn flex items-center justify-center gap-1.5 shadow-md"
              id="simulate-scan-from-test-qr-btn"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>このスポットでQR認証をテスト実行</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
