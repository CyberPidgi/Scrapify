import { ExecutionPhase } from "@prisma/client"

type Phase = Pick<ExecutionPhase, "creditsConsumed">

export function getPhasesTotalCost(phases: Phase[]): number {
  return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0)
}