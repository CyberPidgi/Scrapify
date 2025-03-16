import { ExecutionEnvironment } from '@/types/Executor';
import { waitFor } from '@/lib/helper/waitFor';
import { ClickElementTask } from '../task/ClickElement';
import { WaitForElementTask } from '../task/WaitForElement';

export async function WaitForElementExecutor(environment: ExecutionEnvironment<typeof WaitForElementTask>): Promise<boolean> {
  try {
    const selector = environment.getInput('Selector')
    if (!selector) {
      environment.log.error('Selector is required');
    }

    const visibility = environment.getInput('Visibility')
    if (!visibility) {
      environment.log.error('Selector is required');
    }

    await environment.getPage()!.waitForSelector(selector, {
       visible: visibility === 'visible',
       hidden: visibility === 'hidden'
    });

    environment.log.info(`Element with selector ${selector} is ${visibility}`);
    
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}