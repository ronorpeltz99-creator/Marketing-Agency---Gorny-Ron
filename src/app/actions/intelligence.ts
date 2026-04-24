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

export async function identifyAudienceAction(answers: Record<string, string>, productId?: string) {
  const intel = new IntelligenceService();
  const supabase = await createClient();

  try {
    const data = await intel.identifyAudience(answers);
    
    // If a productId is provided, update the product metadata with the audience data
    if (productId) {
      await supabase
        .from('products')
        .update({ 
          description: `Audience: ${data.targetAudience}\n\n${data.desires.join(', ')}`
        })
        .eq('id', productId);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('[Action] Audience identification failed:', error);
    return { success: false, error: error.message };
  }
}

export async function generateCopyAction(audienceData: any, answers: Record<string, string>, productId?: string) {
  const intel = new IntelligenceService();
  const supabase = await createClient();

  try {
    const data = await intel.generateCopy(audienceData, answers);
    
    if (productId) {
       // Store copy in product metadata or a separate table if needed
       // For now, let's just update the description or a generic metadata field
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('[Action] Copy generation failed:', error);
    return { success: false, error: error.message };
  }
}
