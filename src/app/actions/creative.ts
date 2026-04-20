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
