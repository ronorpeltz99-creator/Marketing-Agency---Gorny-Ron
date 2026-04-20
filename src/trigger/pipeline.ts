import { task } from "@trigger.dev/sdk/v3";

export const runPipeline = task({
  id: "run-full-pipeline",
  maxDuration: 300,
  retry: { maxAttempts: 3 },
  run: async (payload: {
    testId: string;
    productUrl: string;
    dailyBudget: number;
    manualMode: boolean;
  }) => {
    const { AgentOrchestrator } = await import("@/agents/orchestrator");
    const orchestrator = new AgentOrchestrator();

    await orchestrator.runFullPipeline(
      payload.testId,
      payload.productUrl,
      payload.dailyBudget,
      payload.manualMode
    );

    return { success: true, testId: payload.testId };
  },
});

export const resumePipeline = task({
  id: "resume-pipeline",
  maxDuration: 300,
  retry: { maxAttempts: 3 },
  run: async (payload: {
    testId: string;
    marketData: any;
    supplierData: any;
    dailyBudget: number;
  }) => {
    const { AgentOrchestrator } = await import("@/agents/orchestrator");
    const orchestrator = new AgentOrchestrator();

    await orchestrator.resumeFromSourcing(
      payload.testId,
      payload.marketData,
      payload.supplierData,
      payload.dailyBudget
    );

    return { success: true, testId: payload.testId };
  },
});
