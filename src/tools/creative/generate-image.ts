import { AICreativeService } from "../../services/creative";

/**
 * Tool: Generate Ad Image
 * Uses AI to create high-converting ad visuals.
 */
export async function generateAdImage(prompt: string) {
  const creative = new AICreativeService();
  try {
    const result = await creative.generateImage(prompt);
    return {
      success: true,
      message: `AI Image generated for prompt: ${prompt}`,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
