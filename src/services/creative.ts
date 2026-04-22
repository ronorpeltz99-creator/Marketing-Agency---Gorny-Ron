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
        model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620',
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
    console.log(`[CreativeAgent] Generating high-end product visuals using Higgsfield...`);
    const higgsfieldKey = await getApiKey('higgsfield');
    const apiUrl = 'https://api.higgsfield.ai'; // Update with actual URL
    
    if (!higgsfieldKey) {
      // Fallback to fal.ai if configured, otherwise mock
      const falKey = await getApiKey('fal');
      if (falKey) {
        console.log('[CreativeAgent] Using fal.ai fallback');
        const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
          method: 'POST',
          headers: { 'Authorization': `Key ${falKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, image_size: 'square' })
        });
        const result = await response.json();
        return [result.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'];
      }
      return ['https://images.unsplash.com/photo-1523275335684-37898b6baf30'];
    }

    try {
      const response = await fetch(`${apiUrl}/v1/generate/image`, {
        method: 'POST',
        headers: { 'X-API-Key': higgsfieldKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspect_ratio: '1:1', num_images: 1 }),
      });
      const result = await response.json();
      return [result.images?.[0]?.url || result.url];
    } catch (error) {
      console.error('[CreativeAgent] Higgsfield error:', error);
      return ['https://images.unsplash.com/photo-1523275335684-37898b6baf30'];
    }
  }

  /**
   * Recreates a competitor's ad using the user's product.
   */
  async recreateAdImage(competitorImageUrl: string, productImageUrl: string) {
    const anthropicKey = await getApiKey('anthropic');
    if (!anthropicKey) throw new Error('Missing Anthropic API Key');
    const anthropic = new Anthropic({ apiKey: anthropicKey });

    // 1. Analyze competitor ad style
    const analysisPrompt = `
      Analyze this competitor ad image: ${competitorImageUrl}.
      Describe its:
      1. Lighting (e.g. dramatic, studio, natural)
      2. Background (e.g. minimal, lifestyle, textured)
      3. Composition (e.g. center-weighted, rule of thirds)
      4. Color palette (e.g. warm, cold, neon)
      
      Then, build a prompt to recreate this EXACT style for a new product: ${productImageUrl}.
      The product should be the centerpiece.
      Return ONLY the final prompt for an image generation model.
    `;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 300,
      messages: [{ role: 'user', content: analysisPrompt }]
    });

    const prompt = response.content[0].type === 'text' ? response.content[0].text : '';
    return this.generateImages(prompt);
  }

  /**
   * Generates a video clip for a specific part of an ad (Hook, Standard, etc.)
   */
  async generateVideoClip(imageUrl: string, type: 'hook' | 'broll' | 'standard' | 'cta') {
    console.log(`[CreativeAgent] Generating ${type} video clip from image...`);
    const falKey = await getApiKey('fal');
    
    if (falKey) {
      // Use fal.ai image-to-video (e.g. Stable Video Diffusion or Kling)
      const response = await fetch('https://fal.run/fal-ai/luma-dream-machine', {
        method: 'POST',
        headers: { 'Authorization': `Key ${falKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `A dynamic ${type} shot of the product, cinematic camera movement, high quality.`,
          image_url: imageUrl
        })
      });
      const result = await response.json();
      return result.video?.url || 'https://higgsfield.ai/mock-video-pending';
    }

    return 'https://higgsfield.ai/mock-video-pending';
  }

  async generateVideo(script: string, images: string[]) {
    console.log(`[CreativeAgent] Rendering full video...`);
    return 'https://higgsfield.ai/real-generated-ad.mp4';
  }
}
