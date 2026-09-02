import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { RecyclingSpot, UserProfile } from '../types';
import { RECYCLING_SPOTS } from '../data/initialData';
import { validateRecyclingQR } from '../utils/gameHelpers';
import { audio } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  X,
  Camera,
  QrCode,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onConfirmVerification: (data: {
    spot: RecyclingSpot;
    amount: number;
    memo?: string;
  }) => void;
  onOpenTestQRModal?: (spotId?: string) => void;
  preselectedSpot?: RecyclingSpot;
}

type ScanStage = 'scanning' | 'verifying' | 'error' | 'confirm' | 'success';

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirmVerification,
  onOpenTestQRModal,
  preselectedSpot,
}) => {
  const [stage, setStage] = useState<ScanStage>('scanning');
  const [verifiedSpot, setVerifiedSpot] = useState<RecyclingSpot | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [bottleAmount, setBottleAmount] = useState<number>(1);
  const [memo, setMemo] = useState<string>('');
  const [lastEarnedXp, setLastEarnedXp] = useState<number>(10);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Handle scanned raw string
  const handleDecodedString = useCallback(
    (decodedText: string) => {
      stopCamera();
      setStage('verifying');
      audio.playClick();

      setTimeout(() => {
        const validation = validateRecyclingQR(decodedText, RECYCLING_SPOTS, user);

        if (!validation.valid || !validation.spot) {
          setErrorMessage(validation.error || 'このQRコードはSOCIAL QUESTで認証できません。');
          setStage('error');
          audio.playError();
        } else {
          setVerifiedSpot(validation.spot);
          setBottleAmount(1);
          setStage('confirm');
          audio.playSuccess();
        }
      }, 500);
    },
    [stopCamera, user]
  );

  // Scan loop with jsQR
  const startScanLoop = useCallback(() => {
    const scan = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code && code.data) {
            handleDecodedString(code.data);
            return;
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(scan);
    };

    animationFrameId.current = requestAnimationFrame(scan);
  }, [handleDecodedString]);

  // Start camera stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setErrorMessage('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('お使いの環境ではカメラアクセスができません。下のテストボタンをご利用ください。');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        startScanLoop();
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('QRコードを読み取るにはカメラアクセスを許可してください。');
      } else {
        setCameraError('カメラの起動に失敗しました。下のテストQRまたはスポット選択でテスト可能です。');
      }
    }
  }, [startScanLoop]);

  // Lifecycle when modal opens / closes
  useEffect(() => {
    if (isOpen) {
      if (preselectedSpot) {
        const validation = validateRecyclingQR(preselectedSpot.id, RECYCLING_SPOTS, user);
        if (validation.valid && validation.spot) {
          setVerifiedSpot(validation.spot);
          setStage('confirm');
          setBottleAmount(1);
        } else {
          setVerifiedSpot(preselectedSpot);
          setErrorMessage(validation.error || 'このリサイクルスポットでは本日の認証が完了しています。');
          setStage('error');
        }
      } else {
        setStage('scanning');
        setVerifiedSpot(null);
        setErrorMessage('');
        startCamera();
      }
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, preselectedSpot, startCamera, stopCamera, user]);

  if (!isOpen) return null;

  const handleRetryScan = () => {
    setStage('scanning');
    setErrorMessage('');
    startCamera();
  };

  const handleSimulateTestQR = (spotId: string = 'TEST-RECYCLE-001') => {
    const payload = JSON.stringify({
      type: 'recycling_spot',
      spotId,
    });
    handleDecodedString(payload);
  };

  const handleCompleteRecycle = () => {
    if (!verifiedSpot) return;

    const totalXp = (verifiedSpot.rewardXP || 10) * bottleAmount;
    setLastEarnedXp(totalXp);
    setStage('success');
    audio.playSuccess();

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#10B981', '#34D399', '#3B82F6', '#F59E0B', '#6366F1'],
      });
    } catch {
      // Ignore
    }

    onConfirmVerification({
      spot: verifiedSpot,
      amount: bottleAmount,
      memo: memo.trim() ? memo.trim() : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-slate-900 pixel-box-emerald text-slate-100 rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh]"
        id="qr-scanner-modal-card"
      >
        <canvas ref={canvasRef} className="hidden" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center justify-center text-base">
              ♻️
            </div>
            <div>
              <h3 className="font-bold font-pixel text-sm text-emerald-300 leading-tight">リサイクルQR認証</h3>
              <p className="text-[10px] text-slate-400 font-pixel">現実の回収BOXスキャンでXP獲得</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
            id="close-qr-scanner-modal-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* --- STAGE 1: SCANNING VIEW --- */}
        {stage === 'scanning' && (
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Viewfinder Instructions Banner */}
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2 text-emerald-300 text-xs font-pixel">
              <QrCode className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>回収ボックスのQRコードを枠内に合わせてください</span>
            </div>

            {/* Camera Viewport / Frame */}
            <div className="relative w-full aspect-square sm:h-64 bg-slate-950 flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />

              {/* Viewfinder Target Box Overlay */}
              <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
                <div className="relative w-48 h-48 border-2 border-dashed border-emerald-400/80 rounded-lg flex items-center justify-center">
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                  <div className="w-full h-0.5 bg-emerald-400 animate-pulse" />
                </div>
              </div>

              {/* Camera Error / Permission Banner */}
              {cameraError && (
                <div className="absolute inset-0 bg-slate-950/95 text-white p-5 flex flex-col items-center justify-center text-center space-y-2.5">
                  <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-500 text-amber-400 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold font-pixel text-xs text-amber-300">カメラにアクセスできません</h4>
                  <p className="text-[11px] font-pixel text-slate-400 max-w-xs">{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold font-pixel text-slate-950 transition pixel-btn flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>再試行</span>
                  </button>
                </div>
              )}
            </div>

            {/* Test Simulation Controls & Spot Shortcuts */}
            <div className="p-4 bg-slate-950 space-y-2.5 flex-1 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-pixel text-amber-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>テスト用シミュレーション</span>
                </span>
                {onOpenTestQRModal && (
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      onOpenTestQRModal();
                    }}
                    className="text-[10px] font-bold font-pixel text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline"
                  >
                    <QrCode className="w-3 h-3" />
                    <span>QR画像を表示</span>
                  </button>
                )}
              </div>

              {/* Quick Test Station Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateTestQR('TEST-RECYCLE-001')}
                  className="p-2 rounded-xl bg-slate-900 border border-emerald-500/50 hover:border-emerald-400 text-left transition pixel-btn"
                  id="test-scan-btn-1"
                >
                  <div className="flex items-center gap-1 text-emerald-300 font-bold font-pixel text-xs">
                    <span>🧪</span>
                    <span className="truncate">Test Eco Station</span>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">TEST-RECYCLE-001</div>
                  <div className="text-[10px] text-amber-400 font-pixel font-bold mt-0.5">+10 XP テスト</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateTestQR('RECYCLE-TKY-001')}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-400 text-left transition pixel-btn"
                  id="test-scan-btn-2"
                >
                  <div className="flex items-center gap-1 text-slate-200 font-bold font-pixel text-xs">
                    <span>♻️</span>
                    <span className="truncate">Shibuya Eco Box</span>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">RECYCLE-TKY-001</div>
                  <div className="text-[10px] text-amber-400 font-pixel font-bold mt-0.5">+10 XP 渋谷</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STAGE 2: VERIFYING PROGRESS --- */}
        {stage === 'verifying' && (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-bold font-pixel text-sm text-slate-100">QRコードを検証中...</h4>
            <p className="text-xs font-pixel text-slate-400 max-w-xs">
              スポットデータと本日の利用制限を確認しています
            </p>
          </div>
        )}

        {/* --- STAGE 3: ERROR VIEW --- */}
        {stage === 'error' && (
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-500 text-rose-400 flex items-center justify-center text-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[9px] font-bold font-press-start text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40">
                認証エラー
              </span>
              <h4 className="font-bold font-pixel text-base text-slate-100 mt-2">認証できませんでした</h4>
              <p className="text-xs font-pixel text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <div className="w-full pt-2">
              <button
                type="button"
                onClick={handleRetryScan}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-pixel text-xs pixel-btn flex items-center justify-center gap-1.5"
                id="retry-qr-scan-btn"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>もう一度スキャンする</span>
              </button>
            </div>
          </div>
        )}

        {/* --- STAGE 4: SPOT CONFIRMATION --- */}
        {stage === 'confirm' && verifiedSpot && (
          <div className="p-5 flex flex-col flex-1 overflow-y-auto space-y-3.5">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/50 pixel-box">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-xl shrink-0">
                  {verifiedSpot.icon || '♻️'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold font-pixel border border-emerald-500/50">
                    <ShieldCheck className="w-3 h-3" />
                    <span>公式認証スポット</span>
                  </div>
                  <h4 className="font-bold font-pixel text-sm text-slate-100 truncate mt-0.5">
                    {verifiedSpot.name}
                  </h4>
                  <p className="text-[11px] font-pixel text-slate-400 flex items-center gap-1 truncate mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{verifiedSpot.location}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bottle Count Selector */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold font-pixel text-slate-200 block">投入したペットボトルの本数</label>
                <span className="text-[10px] font-pixel text-slate-500">1本につき +{verifiedSpot.rewardXP} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBottleAmount((prev) => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-slate-200 pixel-btn"
                  id="decrement-bottle-btn"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-bold font-pixel text-base text-amber-300" id="bottle-amount-display">
                  {bottleAmount}
                </span>
                <button
                  type="button"
                  onClick={() => setBottleAmount((prev) => Math.min(10, prev + 1))}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-slate-200 pixel-btn"
                  id="increment-bottle-btn"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Optional Memo */}
            <div>
              <label className="block text-xs font-bold font-pixel text-slate-200 mb-1">
                一言メモ（任意）
              </label>
              <input
                type="text"
                placeholder="例: ラベルを剥がして駅前BOXへ投入"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                maxLength={40}
                className="w-full px-3 py-2 text-xs font-pixel text-slate-200 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-emerald-400 focus:outline-none placeholder-slate-600"
                id="qr-recycle-memo-input"
              />
            </div>

            {/* Complete Action Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleCompleteRecycle}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-pixel text-xs pixel-btn flex items-center justify-center gap-1.5 shadow-lg"
                id="confirm-recycle-complete-btn"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>リサイクルを完了する (+{(verifiedSpot.rewardXP || 10) * bottleAmount} XP)</span>
              </button>
            </div>
          </div>
        )}

        {/* --- STAGE 5: CELEBRATORY SUCCESS VIEW --- */}
        {stage === 'success' && verifiedSpot && (
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-3.5 flex-1 animate-scale-up">
            <div className="w-16 h-16 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center text-3xl shadow-lg animate-bounce">
              ♻️
            </div>

            <div>
              <span className="text-[9px] font-bold font-press-start text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-500/50">
                実機認証完了
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-press-start text-emerald-300 mt-2">
                リサイクル達成！
              </h3>
              <p className="text-slate-300 text-xs font-pixel mt-1">
                「あなたの行動が未来の森を育てました。」
              </p>
            </div>

            <div className="px-5 py-2.5 rounded-xl bg-slate-950 border border-amber-400 text-amber-300 font-bold font-pixel text-xl shadow-md inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              <span>+{lastEarnedXp} SOCIAL XP</span>
            </div>

            <div className="w-full pt-2">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-pixel text-xs pixel-btn transition"
                id="close-success-recycle-btn"
              >
                完了して戻る
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
