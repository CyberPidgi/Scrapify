import { ExecutionEnvironment } from '@/types/Executor';
import { FillInputTask } from '../task/FillInput';
import { waitFor } from '@/lib/helper/waitFor';

export async function FillInputExecutor(environment: ExecutionEnvironment<typeof FillInputTask>): Promise<boolean> {
  try {
    const selector = environment.getInput('Selector')
    if (!selector) {
      environment.log.error('Selector is required');
    }

    const value = environment.getInput('Value')
    if (!value) {
      environment.log.error('Selector is required');
    }

    await environment.getPage()!.type(selector, value);
    
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}