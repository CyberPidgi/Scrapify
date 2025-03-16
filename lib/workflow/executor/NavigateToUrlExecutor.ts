import { ExecutionEnvironment } from '@/types/Executor';
import { waitFor } from '@/lib/helper/waitFor';
import { NavigateToUrlTask } from '../task/NavigateToUrl';

export async function NavigateToUrlExecutor(environment: ExecutionEnvironment<typeof NavigateToUrlTask>): Promise<boolean> {
  try {
    const url = environment.getInput('URL')
    if (!url) {
      environment.log.error('Selector is required');
    }

    await environment.getPage()!.goto(url);
    environment.log.info(`Navigated to ${url}`);
    
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}