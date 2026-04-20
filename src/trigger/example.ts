import { task } from "@trigger.dev/sdk/v3";

export const exampleJob = task({
  id: "example-job",
  run: async (payload: { message: string }) => {
    console.log("Example job started with message:", payload.message);
    
    // Simulate some work
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    return {
      finished: true,
      received: payload.message,
    };
  },
});
