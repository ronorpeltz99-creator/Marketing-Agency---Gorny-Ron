'use server';

import { CreativeService } from '@/services/creative';

export async function generateCreativeImageAction(prompt: string) {
  const creative = new CreativeService();
  
  try {
    const images = await creative.generateImages(prompt);
    return { success: true, images };
  } catch (error: any) {
    console.error('[Action] Creative image generation failed:', error);
    return { success: false, error: error.message };
  }
}

export async function recreateAdImageAction(competitorUrl: string, productUrl: string) {
  const creative = new CreativeService();
  try {
    const images = await creative.recreateAdImage(competitorUrl, productUrl);
    return { success: true, images };
  } catch (error: any) {
    console.error('[Action] Ad recreation failed:', error);
    return { success: false, error: error.message };
  }
}

export async function generateVideoClipAction(imageUrl: string, type: 'hook' | 'broll' | 'standard' | 'cta') {
  const creative = new CreativeService();
  try {
    const videoUrl = await creative.generateVideoClip(imageUrl, type);
    return { success: true, url: videoUrl };
  } catch (error: any) {
    console.error('[Action] Video clip generation failed:', error);
    return { success: false, error: error.message };
  }
}
