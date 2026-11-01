import * as webllm from '@mlc-ai/web-llm';
import { WebLLMLoadingProgress, RamModelConfig } from '../types';

// Supported client-side models for in-RAM WebGPU execution with exact MLC model IDs
export const AVAILABLE_RAM_MODELS: RamModelConfig[] = [
  {
    id: 'Qwen3-4B-q4f16_1-MLC',
    displayName: 'Qwen 3 (4B LLM)',
    family: 'qwen',
    provider: 'Alibaba Cloud',
    estimatedRamMB: 2800,
    description: 'The official Qwen3 4B academic reasoning model. Runs 100% locally in user RAM via WebGPU with unlimited tokens.',
    recommended: true,
  },
  {
    id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    displayName: 'Meta Llama 3.2 (3B)',
    family: 'llama',
    provider: 'Meta AI',
    estimatedRamMB: 2200,
    description: 'High-speed instruction following and STEM concept coaching in local memory.',
    recommended: false,
  },
  {
    id: 'SmolLM2-1.7B-Instruct-q4f16_1-MLC',
    displayName: 'SmolLM2 (1.7B Fast)',
    family: 'smollm',
    provider: 'Hugging Face',
    estimatedRamMB: 1400,
    description: 'Ultra-fast and lightweight edge model for instant conceptual hints and quick step verification.',
    recommended: false,
  },
  {
    id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    displayName: 'Qwen 2.5 (1.5B Light)',
    family: 'qwen',
    provider: 'Alibaba Cloud',
    estimatedRamMB: 1200,
    description: 'Compact Qwen variant for laptops and lower-memory systems.',
    recommended: false,
  },
];

class WebLLMService {
  private engine: webllm.MLCEngineInterface | null = null;
  private currentModelId: string = 'Qwen3-4B-q4f16_1-MLC';
  private isInitializing: boolean = false;
  private isReady: boolean = false;
  private progressCallback: ((progress: WebLLMLoadingProgress) => void) | null = null;

  public isWebGPUSupported(): boolean {
    return typeof navigator !== 'undefined' && 'gpu' in navigator;
  }

  public getModelId(): string {
    return this.currentModelId;
  }

  public getIsReady(): boolean {
    return this.isReady;
  }

  public getIsInitializing(): boolean {
    return this.isInitializing;
  }

  public setProgressCallback(cb: (progress: WebLLMLoadingProgress) => void) {
    this.progressCallback = cb;
  }

  public async initializeEngine(modelId: string = this.currentModelId): Promise<boolean> {
    if (!this.isWebGPUSupported()) {
      console.warn('WebGPU not supported in this browser environment.');
      return false;
    }

    if (this.engine && this.currentModelId === modelId && this.isReady) {
      return true;
    }

    this.currentModelId = modelId;
    this.isInitializing = true;
    this.isReady = false;

    try {
      const initProgressCallback = (report: webllm.InitProgressReport) => {
        if (this.progressCallback) {
          this.progressCallback({
            progress: Math.min(100, Math.round(report.progress * 100)),
            text: report.text,
            timeElapsed: report.timeElapsed,
          });
        }
      };

      this.engine = await webllm.CreateMLCEngine(modelId, {
        initProgressCallback,
        logLevel: 'INFO',
      });

      this.isReady = true;
      this.isInitializing = false;
      return true;
    } catch (err: any) {
      console.warn('Failed to initialize In-RAM WebLLM engine:', err);
      this.isInitializing = false;
      this.isReady = false;
      throw err;
    }
  }

  public async generateChatStream(
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    systemPrompt: string,
    onChunk: (delta: string, fullText: string, speedTokPerSec: number) => void
  ): Promise<string> {
    if (!this.engine || !this.isReady) {
      const initialized = await this.initializeEngine(this.currentModelId);
      if (!initialized || !this.engine) {
        throw new Error('WebLLM Engine could not be initialized.');
      }
    }

    const conversation: webllm.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
    ];

    const startTime = performance.now();
    let accumulatedText = '';
    let tokenCount = 0;

    const completion = await this.engine.chat.completions.create({
      messages: conversation,
      temperature: 0.6,
      max_tokens: 1500,
      stream: true,
    });

    for await (const chunk of completion) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        accumulatedText += delta;
        tokenCount += 1;
        const elapsedSec = (performance.now() - startTime) / 1000;
        const speed = elapsedSec > 0 ? Math.round(tokenCount / elapsedSec) : 0;
        onChunk(delta, accumulatedText, speed);
      }
    }

    return accumulatedText;
  }
}

export const webLlmService = new WebLLMService();
