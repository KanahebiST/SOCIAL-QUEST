import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { AlertCircle, Camera, CheckCircle2, RefreshCw, ScanLine, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audio';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { barcodeValue: string; selfReported: true }) => void;
}

type ScanStage = 'scanning' | 'confirm' | 'error';

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [stage, setStage] = useState<ScanStage>('scanning');
  const [scannedValue, setScannedValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPetBottleChecked, setIsPetBottleChecked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  const stopScanning = useCallback(() => {
    readerRef.current?.reset();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopScanning();
      return;
    }

    setStage('scanning');
    setScannedValue('');
    setIsPetBottleChecked(false);
    setErrorMessage('');
    readerRef.current = new BrowserMultiFormatReader();

    readerRef.current
      .decodeFromVideoDevice(undefined, videoRef.current!, (result) => {
        if (!result) return;
        audio.playSuccess();
        setScannedValue(result.getText());
        setStage('confirm');
        stopScanning();
      })
      .catch(() => {
        setErrorMessage('カメラを起動できませんでした。カメラへのアクセスを許可してください。');
        setStage('error');
      });

    return () => stopScanning();
  }, [isOpen, stopScanning]);

  const handleConfirmClick = () => {
    if (!isPetBottleChecked) return;
    try {
      confetti({
        particleCount: 50,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#10B981', '#38BDF8', '#F59E0B'],
      });
    } catch {
      // Ignore animation errors.
    }
    onConfirm({ barcodeValue: scannedValue, selfReported: true });
    onClose();
  };

  const handleRetry = () => {
    stopScanning();
    setStage('scanning');
    setScannedValue('');
    setIsPetBottleChecked(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl pixel-box-emerald overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-slate-800">
          <h3 className="font-bold font-pixel text-sm text-slate-100 flex items-center gap-1.5">
            <ScanLine className="w-4 h-4 text-emerald-400" />
            バーコードスキャン
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200" aria-label="閉じる">
            <X className="w-5 h-5" />
          </button>
        </div>

        {stage === 'scanning' && (
          <div className="relative aspect-square bg-black">
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
            <div className="absolute inset-6 border-2 border-emerald-400/70 rounded-lg pointer-events-none" />
            <p className="absolute bottom-3 left-0 right-0 text-center text-[11px] font-pixel text-slate-200">
              商品のバーコードを枠内に収めてください
            </p>
          </div>
        )}

        {stage === 'confirm' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-bold font-pixel text-xs">バーコードを読み取りました</span>
            </div>
            <p className="text-[11px] font-pixel text-slate-400 break-all">読み取り結果: {scannedValue}</p>
            <label className="flex items-start gap-2 p-3 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isPetBottleChecked}
                onChange={(event) => setIsPetBottleChecked(event.target.checked)}
                className="mt-0.5 w-4 h-4 accent-emerald-500"
              />
              <span className="text-xs font-pixel text-slate-200">これはペットボトルの容器です（自己申告）</span>
            </label>
            <div className="flex gap-2">
              <button onClick={handleRetry} className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-pixel font-bold flex items-center justify-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" />再スキャン
              </button>
              <button onClick={handleConfirmClick} disabled={!isPetBottleChecked} className="flex-1 py-2 rounded-lg bg-emerald-500 text-slate-950 text-xs font-pixel font-bold disabled:opacity-40 disabled:cursor-not-allowed">
                記録する
              </button>
            </div>
          </div>
        )}

        {stage === 'error' && (
          <div className="p-4 space-y-3 text-center">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-xs font-pixel text-slate-300">{errorMessage}</p>
            <button onClick={onClose} className="w-full py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-pixel font-bold">
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
