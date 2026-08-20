import React, { useState, useEffect, useRef } from 'react';
import { SmartBin } from '../types';
import {
  QrCode,
  X,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Battery,
  Thermometer,
  Wind,
  MapPin,
  RotateCcw,
  Sparkles,
  Zap,
  ArrowRight,
  History,
  ShieldCheck,
  Search,
  FlipHorizontal,
  VideoOff,
  RefreshCw,
  Eye
} from 'lucide-react';

interface BinQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bins: SmartBin[];
  onNavigateToReport?: (binCode: string) => void;
  onNavigateToMap?: (binId: string) => void;
}

export const BinQrScannerModal: React.FC<BinQrScannerModalProps> = ({
  isOpen,
  onClose,
  bins,
  onNavigateToReport,
  onNavigateToMap
}) => {
  const [selectedBin, setSelectedBin] = useState<SmartBin | null>(null);
  const [isScanningAnimation, setIsScanningAnimation] = useState(false);
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);

  // Live Camera Video State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Stop camera stream safely
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Start live device camera stream
  const startCamera = async () => {
    setIsCameraLoading(true);
    setCameraError(null);
    stopCameraStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Device camera API is not accessible in this browser context.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera initialization notice:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission denied. Please allow camera access in your browser or select a bin manually.'
          : 'Could not access device camera. Using simulated camera mode.'
      );
      setIsCameraActive(false);
    } finally {
      setIsCameraLoading(false);
    }
  };

  // Manage Camera Life Cycle when modal opens/closes or bin is selected
  useEffect(() => {
    if (isOpen && !selectedBin) {
      startCamera();
    } else {
      stopCameraStream();
    }

    return () => {
      stopCameraStream();
    };
  }, [isOpen, selectedBin, facingMode]);

  // Barcode / QR Detection Loop using BarcodeDetector API if supported
  useEffect(() => {
    let intervalId: any;

    if (isCameraActive && videoRef.current && 'BarcodeDetector' in window) {
      try {
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code', 'code_128'] });
        
        intervalId = setInterval(async () => {
          if (videoRef.current && videoRef.current.readyState === 4 && !selectedBin) {
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes && barcodes.length > 0) {
                const rawValue = barcodes[0].rawValue;
                handleScanRawQrValue(rawValue);
              }
            } catch (e) {
              // Frame decoding skip
            }
          }
        }, 350);
      } catch (e) {
        console.warn('BarcodeDetector error:', e);
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCameraActive, selectedBin]);

  if (!isOpen) return null;

  const handleScanRawQrValue = (rawValue: string) => {
    if (!rawValue) return;
    const clean = rawValue.trim().toLowerCase();

    // Try matching code or ID
    const matched = bins.find(
      (b) =>
        b.code.toLowerCase() === clean ||
        b.id.toLowerCase() === clean ||
        clean.includes(b.code.toLowerCase()) ||
        clean.includes(b.id.toLowerCase())
    );

    if (matched) {
      handleScanBin(matched);
    } else {
      setScanError(`Scanned QR payload "${rawValue}" did not match any registered bin in the database.`);
    }
  };

  const handleScanBin = (bin: SmartBin) => {
    setIsScanningAnimation(true);
    setScanError(null);
    stopCameraStream();

    setTimeout(() => {
      setSelectedBin(bin);
      setIsScanningAnimation(false);
    }, 600);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;

    const query = manualCodeInput.trim().toLowerCase();
    const found = bins.find(
      (b) =>
        b.code.toLowerCase() === query ||
        b.id.toLowerCase() === query ||
        b.name.toLowerCase().includes(query)
    );

    if (found) {
      handleScanBin(found);
    } else {
      setScanError(`No smart bin found matching QR code "${manualCodeInput}". Try BIN-101, BIN-102, or BIN-104.`);
    }
  };

  const resetScanner = () => {
    setSelectedBin(null);
    setManualCodeInput('');
    setScanError(null);
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Generate realistic recent history timeline events for selected bin
  const getBinHistory = (bin: SmartBin) => [
    {
      time: '15 mins ago',
      event: 'Ultrasonic Telemetry Sync',
      detail: `Sensor reported live fill level at ${bin.fillLevel}% (${Math.round(
        bin.capacityLiters * (bin.fillLevel / 100)
      )}L / ${bin.capacityLiters}L).`,
      type: 'sensor'
    },
    {
      time: bin.lastCollectionTime,
      event: 'Garbage Collection Pickup',
      detail: 'Municipal Sanitation Truck emptied bin and reset fill sensor.',
      type: 'collection'
    },
    {
      time: '2 days ago',
      event: 'Automated AI Health Check',
      detail: `Battery at ${bin.batteryPct}%, gas levels normal (${bin.gasLevelPpm} ppm), temp ${bin.temperatureC}°C.`,
      type: 'health'
    },
    {
      time: '5 days ago',
      event: 'Sanitation Maintenance Inspection',
      detail: 'Lid seal and solar telemetry module verified functional.',
      type: 'maintenance'
    }
  ];

  return (
    <div id="qr-scanner-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-black shadow-md">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  Citizen Camera Scanner
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-[10px] text-emerald-300 font-bold flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span>Live Video Stream</span>
                </span>
              </div>
              <h3 className="text-lg font-black text-white">Device Camera Smart Bin QR Scanner</h3>
            </div>
          </div>

          <button
            id="close-qr-scanner-modal-btn"
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {!selectedBin ? (
            /* SCANNER INTERFACE */
            <div className="space-y-6">
              
              {/* Device Camera Viewfinder Container */}
              <div className="relative h-64 rounded-3xl bg-slate-950 overflow-hidden border-2 border-dashed border-emerald-500/60 flex flex-col items-center justify-center p-2 text-center shadow-inner">
                
                {/* Live Video Stream Element */}
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    isCameraActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Scanning Laser Beam */}
                {(isCameraActive || isScanningAnimation) && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981] animate-bounce top-1/2 z-20 pointer-events-none" />
                )}

                {/* Viewfinder Corner Brackets & Target Frame */}
                <div className="relative z-10 w-48 h-48 border-2 border-emerald-400/80 rounded-2xl flex flex-col items-center justify-center p-2 backdrop-blur-[1px] bg-slate-950/20">
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

                  {!isCameraActive && (
                    <div className="space-y-2 p-3 text-center">
                      <Camera className="w-10 h-10 text-emerald-400/70 mx-auto animate-pulse" />
                      <p className="text-[11px] text-slate-300 font-bold">
                        {isCameraLoading ? 'Initializing Camera Stream...' : 'Camera Standby'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Camera Overlay Toolbar Controls */}
                <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between text-xs text-white">
                  <div className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 font-extrabold text-[10px] flex items-center space-x-1.5">
                    <span className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span>{isCameraActive ? 'Live Camera Feed' : 'Simulated Viewfinder'}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {isCameraActive && (
                      <button
                        onClick={toggleCameraFacing}
                        className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700 font-bold text-[10px] flex items-center space-x-1 transition-all cursor-pointer"
                        title="Flip Camera"
                      >
                        <FlipHorizontal className="w-3 h-3 text-emerald-400" />
                        <span>Flip Cam</span>
                      </button>
                    )}

                    <button
                      onClick={isCameraActive ? stopCameraStream : startCamera}
                      className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700 font-bold text-[10px] flex items-center space-x-1 transition-all cursor-pointer"
                    >
                      {isCameraActive ? (
                        <>
                          <VideoOff className="w-3 h-3 text-red-400" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3 text-emerald-400" />
                          <span>Restart Cam</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Bottom Camera Hint */}
                <div className="absolute bottom-3 inset-x-4 z-20 text-center">
                  <p className="px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-[11px] font-semibold text-slate-200 inline-block border border-slate-800 shadow-md">
                    Point camera at a bin QR code or click a physical bin below to inspect
                  </p>
                </div>
              </div>

              {cameraError && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-medium flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Manual QR Search Input */}
              <form onSubmit={handleManualSearch} className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                  <Search className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Enter Bin QR Code or ID Manually</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualCodeInput}
                    onChange={(e) => setManualCodeInput(e.target.value)}
                    placeholder="e.g. BIN-101, BIN-102, BIN-104 or Central Park"
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Scan Code
                  </button>
                </div>
                {scanError && (
                  <p className="text-xs font-bold text-red-500 flex items-center space-x-1 mt-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{scanError}</span>
                  </p>
                )}
              </form>

              {/* Physical Bins Quick Tap-to-Scan Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Simulated Nearby Physical Bins
                  </h4>
                  <span className="text-[10px] text-slate-400">Tap to simulate camera scan</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {bins.slice(0, 6).map((bin) => (
                    <button
                      key={bin.id}
                      onClick={() => handleScanBin(bin)}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left transition-all space-y-1 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                          {bin.code}
                        </span>
                        <QrCode className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{bin.name}</p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-extrabold ${
                          bin.status === 'Critical'
                            ? 'bg-red-500 text-white'
                            : bin.status === 'Almost Full'
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {bin.fillLevel}% Fill
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* SCANNED BIN DETAIL VIEW */
            <div className="space-y-6 animate-fadeIn">
              
              {/* Top Banner: Recognized Bin */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-black">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      QR Code Matched Successfully
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {selectedBin.code} — {selectedBin.name}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={resetScanner}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center space-x-1 hover:bg-slate-100 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Scan Another</span>
                </button>
              </div>

              {/* Location & Stream */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 font-medium">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{selectedBin.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold text-slate-500">Stream:</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-xs">
                    {selectedBin.wasteType}
                  </span>
                </div>
              </div>

              {/* Fill Gauge Banner */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Current Fill Telemetry</span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      {selectedBin.fillLevel}% Full{' '}
                      <span className="text-xs font-normal text-slate-500">
                        ({Math.round(selectedBin.capacityLiters * (selectedBin.fillLevel / 100))}L / {selectedBin.capacityLiters}L)
                      </span>
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold ${
                      selectedBin.status === 'Critical'
                        ? 'bg-red-500 text-white'
                        : selectedBin.status === 'Almost Full'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {selectedBin.status} Status
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedBin.status === 'Critical'
                        ? 'bg-red-500'
                        : selectedBin.status === 'Almost Full'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedBin.fillLevel}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] font-medium text-slate-500 pt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Last Collection: <strong>{selectedBin.lastCollectionTime}</strong></span>
                  </span>
                  <span>Predicted Overflow: <strong>~{selectedBin.predictedOverflowHours} hours</strong></span>
                </div>
              </div>

              {/* IoT Sensor Health Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-400 text-[10px] font-bold uppercase">
                    <Battery className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Battery</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{selectedBin.batteryPct}%</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-400 text-[10px] font-bold uppercase">
                    <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                    <span>Temperature</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{selectedBin.temperatureC}°C</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-400 text-[10px] font-bold uppercase">
                    <Wind className="w-3.5 h-3.5 text-blue-500" />
                    <span>Gas / Odor</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{selectedBin.gasLevelPpm} ppm</p>
                </div>
              </div>

              {/* Recent History Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <History className="w-4 h-4 text-emerald-500" />
                  <span>Recent Bin Telemetry & Collection Logs</span>
                </h4>

                <div className="space-y-2 border-l-2 border-emerald-500/30 pl-4 ml-1">
                  {getBinHistory(selectedBin).map((item, idx) => (
                    <div key={idx} className="relative space-y-0.5">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">{item.event}</span>
                        <span className="text-[10px] font-medium text-slate-400">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    stopCameraStream();
                    onClose();
                    if (onNavigateToReport) onNavigateToReport(selectedBin.code);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer text-center"
                >
                  Report Issue with This Bin
                </button>

                <button
                  onClick={() => {
                    stopCameraStream();
                    onClose();
                    if (onNavigateToMap) onNavigateToMap(selectedBin.id);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer text-center flex items-center justify-center space-x-1"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Locate on Map</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
