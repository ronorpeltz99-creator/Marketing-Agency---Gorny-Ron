import { CreativeService } from "../../services/creative";

/**
 * Tool: Generate Ad Image
 * Uses AI to create high-converting ad visuals.
 */
export async function generateAdImage(prompt: string) {
  const creative = new CreativeService();
  try {
    const result = await creative.generateImages(prompt);
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
