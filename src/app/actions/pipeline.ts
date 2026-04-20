'use server';

import { tasks } from '@trigger.dev/sdk/v3';
import { createClient } from '@/utils/supabase/server';
import type { runPipeline, resumePipeline } from '@/trigger/pipeline';

export async function startPipelineAction(productUrl: string, budget: number, manualMode: boolean) {
  const supabase = await createClient();

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

  const handle = await tasks.trigger<typeof runPipeline>('run-full-pipeline', {
    testId: test.id,
    productUrl,
    dailyBudget: budget,
    manualMode,
  });

  return { testId: test.id, triggerId: handle.id };
}

export async function approveStrategyAction(testId: string) {
  const supabase = await createClient();
  const { data: test } = await supabase.from('active_tests').select('*').eq('id', testId).single();

  if (!test) throw new Error('Test not found');

  const handle = await tasks.trigger<typeof resumePipeline>('resume-pipeline', {
    testId,
    marketData: test.metadata.marketData,
    supplierData: test.metadata.supplierData,
    dailyBudget: test.daily_budget,
  });

  return { triggerId: handle.id };
}
