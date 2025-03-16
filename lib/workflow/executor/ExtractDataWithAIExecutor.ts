import { ExecutionEnvironment } from '@/types/Executor';
import { waitFor } from '@/lib/helper/waitFor';
import { ClickElementTask } from '../task/ClickElement';
import { ExtractDataWithAITask } from '../task/ExtractDataWithAI';
import prisma from '@/lib/prisma';
import { symmetricDecrypt } from '@/lib/encryption';
import { OpenAI } from 'openai'

export async function ExtractDataWithAIExecutor(environment: ExecutionEnvironment<typeof ExtractDataWithAITask>): Promise<boolean> {
  try {
    const credentialName = environment.getInput('Credentials')
    if (!credentialName) {
      environment.log.error('Credential is required');
      return false;
    }

    const prompt = environment.getInput('Prompt')
    if (!prompt) {
      environment.log.error('Prompt is required');
      return false;
    }

    const content = environment.getInput('Content')
    if (!content) {
      environment.log.error('Content is required');
      return false;
    }

    const credential = await prisma.credential.findUnique({
      where: { id: credentialName },
    });

    if (!credential) {
      environment.log.error('Credential not found');
      return false;
    }

    const plainCredentialValue = symmetricDecrypt(credential!.value);
    if (!plainCredentialValue) {
      environment.log.error('Failed to decrypt credential');
      return false;
    }

    console.log(plainCredentialValue);
    const result = JSON.stringify({
      usernameSelector: "#username",
      passwordSelector: "#password",
      loginSelector: "body > div > form > input.btn.btn-primary",
    })

    // const openai = new OpenAI({
    //   apiKey: plainCredentialValue,
    // })
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "You are a webscraper helper  that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you want to extract. The response should always be only the extracte data as a JSSON arry or object, without any additional words or explanations. Analyze  the input carefullly and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text."
    //     },
    //     {
    //       role: "user",
    //       content: content
    //     },
    //     {
    //       role: "user",
    //       content: prompt
    //     }
    //   ],
    //   temperature: 1,
    //   max_tokens: 100
    // })

    // environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`)
    // environment.log.info(`Completion tokens: ${response.usage?.completion_tokens}`)

    // const result = response.choices[0].message?.content
    // if (!result) {
    //   environment.log.error('Failed to extract data');
    //   return false;
    // }

    environment.setOutput('Extracted Data', result);
    
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}