'use server';

import { IntelligenceService } from '@/services/intelligence';
import { createClient } from '@/utils/supabase/server';

export async function analyzeProductAction(productUrl: string) {
  const intel = new IntelligenceService();
  
  try {
    const marketData = await intel.analyzeCompetitors(productUrl);
    
    // Optional: Save results to Supabase for the current user/session
    // For now, we just return the data to the UI
    
    return { success: true, data: marketData };
  } catch (error: any) {
    console.error('[Action] Product analysis failed:', error);
    return { success: false, error: error.message };
  }
}
