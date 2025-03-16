import { ExecutionEnvironment } from '@/types/Executor';
import { waitFor } from '@/lib/helper/waitFor';
import { ClickElementTask } from '../task/ClickElement';
import { DeliverViaWebhookTask } from '../task/DeliverViaWebhook';

export async function DeliverViaWebhookExecutor(environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>): Promise<boolean> {
  try {
    const targetUrl = environment.getInput('Target URL')
    if (!targetUrl) {
      environment.log.error('Selector is required');
    }

    const body = environment.getInput('Body')
    if (!body) {
      environment.log.error('Body is required');
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const statusCode = response.status;
    if (statusCode !== 200) {
      environment.log.error(`Request failed with status code ${statusCode}`);
      return false;
    }

    const responseBody = await response.json();
    environment.log.info(`Request successful with response: ${JSON.stringify(responseBody)}`);
    
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}