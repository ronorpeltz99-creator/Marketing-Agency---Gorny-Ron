import { NotificationService } from "../../services/notifications";

/**
 * Tool: Send System Alert
 * Notifies the team about important events or errors.
 */
export async function sendAlert(message: string, priority: 'low' | 'high' = 'low') {
  const notifications = new NotificationService();
  try {
    const result = await notifications.sendAlert(message, priority);
    return {
      success: true,
      message: `Alert sent successfully: ${message}`,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
