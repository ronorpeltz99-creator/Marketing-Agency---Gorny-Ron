'use server';

import { AgentOrchestrator } from '@/agents/orchestrator';
import { createClient } from '@/utils/supabase/server';

export async function startPipelineAction(productUrl: string, budget: number, manualMode: boolean) {
  const supabase = await createClient();
  const orchestrator = new AgentOrchestrator();

  // 1. Create the test record in DB
  const { data: test, error } = await supabase
    .from('active_tests')
    .insert({
      product_url: productUrl,
      daily_budget: budget,
      status: 'IDLE',
      metadata: { started_at: new Date().toISOString() }
    })
    .select()
    .single();

  if (error || !test) {
    throw new Error(error?.message || 'Failed to create test');
  }

  // 2. Start the pipeline in the background (we don't await the full run here to keep UI responsive)
  orchestrator.runFullPipeline(test.id, productUrl, budget, manualMode);

  return { testId: test.id };
}

export async function approveStrategyAction(testId: string) {
  const orchestrator = new AgentOrchestrator();
  return orchestrator.handleUserApproval(testId, {});
}
