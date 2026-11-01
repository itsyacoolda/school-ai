import React from 'react';
import { 
  X, 
  Cpu, 
  HardDrive, 
  Zap, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Sparkles,
  Bot
} from 'lucide-react';
import { ModelEngineType, WebLLMLoadingProgress } from '../types';
import { AVAILABLE_RAM_MODELS } from '../services/webLlmService';

interface EngineStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEngine: ModelEngineType;
  onEngineChange: (engine: ModelEngineType) => void;
  isWebGpuSupported: boolean;
  isRamEngineReady: boolean;
  isRamEngineLoading: boolean;
  loadingProgress?: WebLLMLoadingProgress;
  activeModelId: string;
  onSelectModel: (modelId: string) => void;
}

export const EngineStatusModal: React.FC<EngineStatusModalProps> = ({
  isOpen,
  onClose,
  currentEngine,
  onEngineChange,
  isWebGpuSupported,
  isRamEngineReady,
  isRamEngineLoading,
  loadingProgress,
  activeModelId,
  onSelectModel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                AI Engine & Multi-Model Architecture
              </h2>
              <p className="text-xs text-emerald-200">
                Client In-RAM WebGPU Execution (Qwen, Llama 3.2, SmolLM2) + Cloud Server
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-700">
          
          {/* Hardware & WebGPU Status Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-700" /> WebGPU Client RAM Engine
              </span>
              {isWebGpuSupported ? (
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> WebGPU Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> WebGPU Unavailable
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Run open-weights language models (<strong>Qwen 2.5</strong>, <strong>Llama 3.2</strong>, or <strong>SmolLM2</strong>) directly inside your PC's browser memory using WebGPU shaders. No token quotas, zero network leaks, and 100% private Socratic academic coaching.
            </p>

            {/* In-RAM Engine Status */}
            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-500">In-RAM State: </span>
                {isRamEngineReady ? (
                  <span className="font-bold text-emerald-700">Model Ready in RAM</span>
                ) : isRamEngineLoading ? (
                  <span className="font-bold text-amber-600">Allocating RAM & Compiling Shaders...</span>
                ) : (
                  <span className="font-bold text-slate-600">Ready to Load</span>
                )}
              </div>
              <div className="text-slate-500">
                Active Engine: <strong className="text-slate-900">{currentEngine === 'ram-qwen' ? 'In-RAM Client' : 'Cloud Server'}</strong>
              </div>
            </div>

            {/* Progress Bar if loading */}
            {isRamEngineLoading && loadingProgress && (
              <div className="pt-2 space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span className="truncate max-w-[80%]">{loadingProgress.text || 'Loading weights...'}</span>
                  <span>{loadingProgress.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${loadingProgress.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3 Multi-Model In-RAM Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-700" /> Select In-RAM Language Model
            </h3>
            <div className="grid gap-2.5">
              {AVAILABLE_RAM_MODELS.map((model) => {
                const isSelected = activeModelId === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model.id);
                      onEngineChange('ram-qwen');
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected && currentEngine === 'ram-qwen'
                        ? 'border-emerald-700 bg-emerald-50/70 ring-2 ring-emerald-700'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs sm:text-sm">
                        <span>{model.displayName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600">
                          {model.provider}
                        </span>
                        {model.recommended && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        ~{model.estimatedRamMB} MB RAM
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{model.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Engine Mode Switcher */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" /> Active Output Mode Toggle
              </span>
              <span className="text-[11px] text-slate-500">Instant Bidirectional Switch</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onEngineChange('ram-qwen');
                  if (!isRamEngineReady && isWebGpuSupported) {
                    onSelectModel(activeModelId);
                  }
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  currentEngine === 'ram-qwen'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>In-RAM Engine</span>
              </button>

              <button
                type="button"
                onClick={() => onEngineChange('cloud-gemini')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  currentEngine === 'cloud-gemini'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Cloud Server</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-xs"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
