export interface Task {
  id: string
  name: string
  plannedCost: number
  actualCost: number
  plannedStartDate: Date
  plannedEndDate: Date
  completed: boolean
  completionDate?: Date
}

export interface EVMMetrics {
  plannedValue: number
  earnedValue: number
  actualCost: number
  scheduleVariance: number
  costVariance: number
  schedulePerformanceIndex: number
  costPerformanceIndex: number
}

export interface EVMTrendData {
  date: string
  pv: number
  ev: number
  ac: number
  spi: number
  cpi: number
}

export type RAGStatus = "red" | "amber" | "green"
