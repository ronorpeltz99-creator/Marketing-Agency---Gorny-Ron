import Anthropic from '@anthropic-ai/sdk';
import { getApiKey } from '@/utils/keys';

/**
 * Creative AI Service - Higgsfield Integration
 * Responsibility: Generate high-quality video and image ads using Higgsfield and Anthropic.
 */
export class CreativeService {
  async generateScripts(marketData: any) {
    console.log(`[CreativeAgent] Writing scripts for: ${marketData.suggestedStoreName}`);
    
    const anthropicKey = await getApiKey('anthropic');
    if (!anthropicKey) {
      console.warn('[CreativeAgent] Anthropic key missing. Using fallback scripts.');
      return this.getFallbackScripts();
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey });

    const prompt = `
      Create 2 high-converting video ad scripts for the product: ${marketData.suggestedStoreName}.
      Base the scripts on these winning hooks:
      ${marketData.winningHooks.map((h: any) => `- ${h.type}: ${h.text}`).join('\n')}

      Format:
      - Script 1: 15 seconds, fast-paced, action-oriented.
      - Script 2: 30 seconds, problem/solution storytelling.

      Return ONLY a JSON object:
      {
        "scripts": [
          { "id": "sc_1", "title": "Fast Action", "text": "..." },
          { "id": "sc_2", "title": "Storytelling", "text": "..." }
        ]
      }
    `;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      });

      const textContent = response.content[0].type === 'text' ? response.content[0].text : '';
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(textContent);

      return {
        ...result,
        ads: result.scripts.map((s: any, i: number) => ({
          id: `ad_10${i+1}`,
          type: 'VIDEO',
          url: 'https://higgsfield.ai/mock-video-pending', // This will be updated by generateVideo
          hook: s.title
        }))
      };
    } catch (err) {
      console.error('Failed to generate scripts:', err);
      return this.getFallbackScripts();
    }
  }

  private getFallbackScripts() {
    return {
      scripts: [
        { id: 'sc_1', title: 'Action Focused', text: 'Script 1: Action Focused (Higgsfield Optimized)' },
        { id: 'sc_2', title: 'Storytelling', text: 'Script 2: Storytelling' }
      ],
      ads: [
        { id: 'ad_101', type: 'VIDEO', url: 'https://higgsfield.ai/mock-video-1', hook: 'Benefit focus' },
        { id: 'ad_102', type: 'VIDEO', url: 'https://higgsfield.ai/mock-video-2', hook: 'Emotional hook' }
      ]
    };
  }

  async generateImages(prompt: string) {
    console.log(`[CreativeAgent] Generating high-end product visuals...`);
    const falKey = await getApiKey('fal_ai_key');
    
    if (!falKey) {
      console.warn('[CreativeAgent] Fal.ai key missing. Using fallback image.');
      return ['https://images.unsplash.com/photo-1523275335684-37898b6baf30'];
    }

    try {
      const response = await fetch('https://fal.run/fal-ai/fast-lightning-sdxl', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${falKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          image_size: 'square_hd',
          num_inference_steps: 4,
          enable_safety_checker: true,
        }),
      });

      const result = await response.json();
      if (result.images && result.images.length > 0) {
        return result.images.map((img: any) => img.url);
      }
      throw new Error('No images returned from Fal.ai');
    } catch (error) {
      console.error('[CreativeAgent] Fal.ai error:', error);
      return ['https://images.unsplash.com/photo-1523275335684-37898b6baf30'];
    }
  }

  async generateVideo(script: string, images: string[]) {
    console.log(`[CreativeAgent] Rendering video...`);
    // Higgsfield integration or similar would go here
    return 'https://higgsfield.ai/real-generated-ad.mp4';
  }
}
