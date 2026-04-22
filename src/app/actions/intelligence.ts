'use server';

import { IntelligenceService } from '@/services/intelligence';
import { createClient } from '@/utils/supabase/server';

export async function analyzeProductAction(productUrl: string) {
  const intel = new IntelligenceService();
  
  try {
    const marketData = await intel.analyzeCompetitors(productUrl);
    return { success: true, data: marketData };
  } catch (error: any) {
    console.error('[Action] Product analysis failed:', error);
    return { success: false, error: error.message };
  }
}

export async function identifyAudienceAction(answers: Record<string, string>) {
  const intel = new IntelligenceService();
  try {
    const data = await intel.identifyAudience(answers);
    return { success: true, data };
  } catch (error: any) {
    console.error('[Action] Audience identification failed:', error);
    return { success: false, error: error.message };
  }
}

export async function generateCopyAction(audienceData: any, answers: Record<string, string>) {
  const intel = new IntelligenceService();
  try {
    const data = await intel.generateCopy(audienceData, answers);
    return { success: true, data };
  } catch (error: any) {
    console.error('[Action] Copy generation failed:', error);
    return { success: false, error: error.message };
  }
}
