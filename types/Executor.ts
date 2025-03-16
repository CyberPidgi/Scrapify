import { Browser, Page } from "puppeteer";
import { WorkflowTask } from "./workflow";
import { LogCollector } from "./log";

export type Environment = {
  browser?: Browser;
  phases: {
    [key: string]: {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    }
  }
  page?: Page;
}

export type ExecutionEnvironment<T extends WorkflowTask> = {
  // ensures using TypeScript we access the right input name
  getInput(name: T["inputs"][number]["name"]): string;
  
  getBrowser(): Browser | undefined;
  setBrowser(browser: Browser): void;
  getPage(): Page | undefined;
  setPage(page: Page): void;

  setOutput(name: T["outputs"][number]["name"], value: string): void;

  log: LogCollector;
}