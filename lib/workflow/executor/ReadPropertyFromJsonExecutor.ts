import { ExecutionEnvironment } from '@/types/Executor';
import { waitFor } from '@/lib/helper/waitFor';
import { ReadPropertyFromJsonTask } from '../task/ReadPropertyFromJson';

export async function ReadPropertyFromJsonExecutor(environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>): Promise<boolean> {
  try {
    const JSONData = environment.getInput('JSON')
    if (!JSONData) {
      environment.log.error('Selector is required');
    }

    const propertyName = environment.getInput('Property Name')
    if (!propertyName) {
      environment.log.error('Selector is required');
    }

    const data = JSON.parse(JSONData);
    const propertyValue = data[propertyName];
    
    if (!propertyValue) {
      environment.log.error('Property not found');
      return false;
    }
    environment.setOutput('Property Value', propertyValue
    );
    
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}