import { Injectable, Logger } from '@nestjs/common';
import { LLMMessage, LLMCompletionOptions } from '../interfaces/ai.interfaces';

@Injectable()
export class LlmClientService {
  private readonly logger = new Logger(LlmClientService.name);

  getApiKey(): string | null {
    const key = process.env.AI_PROVIDER_KEY || process.env.OPENAI_API_KEY;
    if (key && key.trim().length > 0) {
      return key.trim();
    }
    return null;
  }

  isConfigured(): boolean {
    return this.getApiKey() !== null;
  }

  getBaseUrl(): string {
    return process.env.AI_BASE_URL || 'https://api.openai.com/v1';
  }

  getModel(): string {
    return process.env.AI_MODEL || 'gpt-4o-mini';
  }

  async generateChatCompletion(
    messages: LLMMessage[],
    options: LLMCompletionOptions = {},
  ): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('AI Provider is not configured. Please supply AI_PROVIDER_KEY or OPENAI_API_KEY.');
    }

    const model = options.model || this.getModel();
    const timeoutMs = options.timeoutMs || Number(process.env.AI_TIMEOUT_MS) || 30000;
    const maxRetries = Number(process.env.AI_MAX_RETRIES) || 2;

    const payload: Record<string, any> = {
      model,
      messages,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.maxTokens ?? 2000,
    };

    if (options.responseFormat === 'json') {
      payload.response_format = { type: 'json_object' };
    }

    let attempt = 0;
    let lastError: any = null;

    while (attempt <= maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(`${this.getBaseUrl()}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const status = response.status;
          const errorBody = await response.text();
          this.logger.warn(`LLM request failed with status ${status}: ${errorBody.slice(0, 200)}`);

          if (status === 429) {
            // Rate limit: exponential backoff
            attempt++;
            if (attempt <= maxRetries) {
              const backoffMs = Math.pow(2, attempt) * 1000;
              await new Promise((resolve) => setTimeout(resolve, backoffMs));
              continue;
            }
            throw new Error(`AI Provider rate limit exceeded (429).`);
          }

          throw new Error(`AI Provider HTTP Error: ${status} ${response.statusText}`);
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error('Empty response received from AI Provider');
        }

        return content;
      } catch (err: any) {
        lastError = err;
        if (err.name === 'AbortError') {
          this.logger.warn(`AI Provider request timed out after ${timeoutMs}ms (attempt ${attempt + 1})`);
        } else {
          this.logger.warn(`AI Provider error: ${err.message}`);
        }

        attempt++;
        if (attempt <= maxRetries) {
          const delay = Math.pow(2, attempt) * 500;
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    }

    throw lastError || new Error('Failed to complete AI request after retries');
  }

  async generateEmbedding(text: string): Promise<number[] | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    try {
      const response = await fetch(`${this.getBaseUrl()}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.AI_EMBEDDING_MODEL || 'text-embedding-3-small',
          input: text.slice(0, 8000),
        }),
      });

      if (!response.ok) return null;
      const data = await response.json();
      return data?.data?.[0]?.embedding || null;
    } catch (err) {
      this.logger.debug('Embedding generation failed or not available');
      return null;
    }
  }
}
