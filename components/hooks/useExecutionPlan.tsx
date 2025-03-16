import { useReactFlow } from '@xyflow/react'
import { useCallback } from 'react'
import { FlowToExecutionPlan, FlowToExecutionPlanValidationError } from '@/lib/workflow/ExecutionPlan'
import { AppNode } from '@/types/appNode'
import useFlowValidation from './useFlowValidation'
import { toast } from 'sonner'

const useExecutionPlan = () => {
  const { toObject } = useReactFlow()
  const { setInvalidInputs, clearErrors } = useFlowValidation()

  const handleError = useCallback((error: any) => {
    switch (error.type){
      case FlowToExecutionPlanValidationError.INVALID_INPUTS:
        toast.error("Not all input values are set")
        setInvalidInputs(error.invalidInputs)
        break;

      case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
        toast.error("No entry point found")
        break;

      default:
        toast.error("Something went wrong")
    }
   }, [setInvalidInputs])

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject()
    const { executionPlan, error } = FlowToExecutionPlan(nodes as AppNode[], edges)

    if (error){
      handleError(error);
      return null;
    }

    clearErrors()
    return executionPlan
  }, [toObject, handleError, clearErrors]);

  return generateExecutionPlan
}

export default useExecutionPlan
