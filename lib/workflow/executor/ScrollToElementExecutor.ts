import { ExecutionEnvironment } from '@/types/Executor';
import { waitFor } from '@/lib/helper/waitFor';
import { ClickElementTask } from '../task/ClickElement';
import { ScrollToElementTask } from '../task/ScrollToElement';

export async function ScrollToElementExecutor(environment: ExecutionEnvironment<typeof ScrollToElementTask>): Promise<boolean> {
  try {
    const selector = environment.getInput('Selector')
    if (!selector) {
      environment.log.error('Selector is required');
    }

    await environment.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element){
        throw new Error(`Element with selector ${selector} not found`);
      }

      const y = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: 'smooth' });

    }, selector);
    
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}