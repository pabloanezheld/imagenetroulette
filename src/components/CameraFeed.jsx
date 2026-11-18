import React, { useEffect, useState } from 'react';
import { Camera, CameraOff, FlipHorizontal, AlertCircle } from 'lucide-react';

export default function CameraFeed({
  videoRef,
  isCameraActive,
  onToggleCamera,
  isAnalyzing,
  currentResult,
  showBoundingBox = true,
  t
}) {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [isMirrored, setIsMirrored] = useState(true);
  const [streamResolution, setStreamResolution] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    async function getDevices() {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      try {
        const devList = await navigator.mediaDevices.enumerateDevices();
        const videoDevs = devList.filter(d => d.kind === 'videoinput');
        setDevices(videoDevs);
        if (videoDevs.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevs[0].deviceId);
        }
      } catch (err) {
        console.warn('Could not enumerate cameras:', err);
      }
    }
    getDevices();
  }, []);

  useEffect(() => {
    let currentStream = null;

    async function startCamera() {
      setCameraError(null);
      try {
        const constraints = {
          video: {
            deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(e => console.error('Play failed:', e));
            setStreamResolution({
              width: videoRef.current.videoWidth,
              height: videoRef.current.videoHeight,
            });
          };
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setCameraError(err.message || 'Unable to access camera.');
        if (isCameraActive) {
          onToggleCamera(false);
        }
      }
    }

    if (isCameraActive) {
      startCamera();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setStreamResolution(null);
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive, selectedDeviceId]);

  const box = currentResult?.box;

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-zinc-800 bg-zinc-950 shadow-2xl">
      {/* Top HUD Telemetry Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent font-mono text-[11px] text-zinc-300">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="font-semibold uppercase tracking-wider">
              {isCameraActive ? t.camActive : t.camStandby}
            </span>
          </div>

          {streamResolution && (
            <span className="text-zinc-400 border-l border-zinc-700 pl-3 hidden sm:inline">
              {t.res} {streamResolution.width}x{streamResolution.height}
            </span>
          )}

          {isAnalyzing && (
            <span className="text-amber-400 font-bold animate-pulse flex items-center space-x-1 border-l border-zinc-700 pl-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>{t.inferring}</span>
            </span>
          )}
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-2">
          {devices.length > 1 && isCameraActive && (
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="bg-black/60 border border-zinc-700 text-zinc-300 text-[11px] rounded px-2 py-0.5 focus:outline-none focus:border-amber-400"
            >
              {devices.map((d, i) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${i + 1}`}
                </option>
              ))}
            </select>
          )}

          {isCameraActive && (
            <button
              onClick={() => setIsMirrored(!isMirrored)}
              title={isMirrored ? "Unmirror feed" : "Mirror feed"}
              className="p-1 rounded bg-black/60 border border-zinc-700 hover:border-zinc-500 text-zinc-300 transition"
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full bg-zinc-900 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isCameraActive ? 'opacity-100' : 'opacity-0'
          } ${isMirrored ? 'scale-x-[-1]' : ''}`}
        />

        {/* Inactive Standby Screen */}
        {!isCameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-zinc-950/90 backdrop-blur-sm">
            <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-500 shadow-inner">
              <Camera className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold font-mono tracking-tight text-zinc-100 mb-2">
              {t.opticalSensorOffline}
            </h3>
            <p className="text-sm text-zinc-400 max-w-md mb-6">
              {t.opticalSensorDesc}
            </p>

            {cameraError && (
              <div className="mb-4 max-w-md px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            <button
              onClick={() => onToggleCamera(true)}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-bold text-sm tracking-wide transition transform active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>{t.activateWebcam}</span>
            </button>
          </div>
        )}

        {/* Camera Active Viewfinder Overlays */}
        {isCameraActive && (
          <>
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-40">
              <div className="w-8 h-8 border border-zinc-400/50 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
              </div>
              <div className="absolute w-24 h-[1px] bg-zinc-500/30"></div>
              <div className="absolute h-24 w-[1px] bg-zinc-500/30"></div>
            </div>

            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400/70 pointer-events-none z-10"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400/70 pointer-events-none z-10"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400/70 pointer-events-none z-10"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400/70 pointer-events-none z-10"></div>

            {isAnalyzing && (
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                <div className="w-full h-24 bg-gradient-to-b from-amber-400/0 via-amber-400/20 to-amber-400/0 animate-scanline border-b border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.5)]"></div>
              </div>
            )}

            {/* Classic ImageNet Roulette Bounding Box with Attached Synset Tag */}
            {showBoundingBox && box && currentResult && (
              <div
                style={{
                  left: `${isMirrored ? 100 - box.x - box.width : box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                }}
                className="absolute pointer-events-none z-20 border-2 border-amber-400 transition-all duration-500 shadow-[0_0_15px_rgba(251,191,36,0.35)]"
              >
                <div className="absolute -top-7 left-0 bg-amber-400 text-zinc-950 font-mono font-bold text-xs sm:text-sm px-2.5 py-0.5 whitespace-nowrap shadow-md flex items-center space-x-2 rounded-t-sm">
                  <span className="uppercase tracking-tight">{currentResult.label}</span>
                  {currentResult.confidence && (
                    <span className="text-[10px] bg-zinc-950 text-amber-400 px-1 py-0.2 rounded font-mono">
                      {Math.round(currentResult.confidence * 100)}%
                    </span>
                  )}
                </div>

                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-300"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-300"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-300"></div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom overlay status */}
      {isCameraActive && (
        <div className="absolute bottom-2 left-4 right-4 z-30 flex items-center justify-between text-[11px] font-mono text-zinc-400 pointer-events-none">
          <div className="flex items-center space-x-2 bg-black/60 px-2.5 py-1 rounded border border-zinc-800">
            <span className="text-zinc-500">HOTKEY:</span>
            <span className="text-amber-400 font-semibold">{t.hotkeyHint}</span>
          </div>
          <button
            onClick={() => onToggleCamera(false)}
            className="pointer-events-auto flex items-center space-x-1.5 px-2.5 py-1 rounded bg-black/60 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/50 transition"
          >
            <CameraOff className="w-3.5 h-3.5" />
            <span>{t.turnOffCam}</span>
          </button>
        </div>
      )}
    </div>
  );
}
