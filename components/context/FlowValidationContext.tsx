import { AppNodeMissingInputs } from "@/types/appNode";
import { Dispatch, SetStateAction, createContext, useState } from "react";

type FlowValidationContextType = {
  invalidInputs: AppNodeMissingInputs[];
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
  clearErrors: () => void;
}

export const FlowValidationContext = createContext<FlowValidationContextType | null>(null)

export function FlowValidationContextProvider({ children }: { children: React.ReactNode }) {
  const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>([]);

  const clearErrors = () => {
    setInvalidInputs([]);
  }

  return (
  <FlowValidationContext.Provider
    value={{
      invalidInputs: invalidInputs,
      setInvalidInputs: setInvalidInputs,
      clearErrors: clearErrors
    }}
  >
    {children}
  </FlowValidationContext.Provider>
  )
}