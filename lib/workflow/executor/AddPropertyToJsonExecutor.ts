import { ExecutionEnvironment } from '@/types/Executor';
import { waitFor } from '@/lib/helper/waitFor';
import { AddPropertyToJsonTask } from '../task/AddPropertyToJson';

export async function AddPropertyToJsonExecutor(environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>): Promise<boolean> {
  try {
    const JSONData = environment.getInput('JSON')
    if (!JSONData) {
      environment.log.error('Selector is required');
    }

    const propertyName = environment.getInput('Property Name')
    if (!propertyName) {
      environment.log.error('Selector is required');
    }
    const propertyValue = environment.getInput('Property Value')
    if (!propertyValue) {
      environment.log.error('Selector is required');
    }

    const data = JSON.parse(JSONData);
    data[propertyName] = propertyValue;

    environment.setOutput('Updated JSON', JSON.stringify(data));
    
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}