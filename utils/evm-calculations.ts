import type { Task, EVMMetrics, EVMTrendData, RAGStatus } from "../types/evm"

export function calculateEVMMetrics(tasks: Task[], asOfDate: Date = new Date()): EVMMetrics {
  let plannedValue = 0
  let earnedValue = 0
  let actualCost = 0

  tasks.forEach((task) => {
    // Calculate Planned Value (PV) - sum of planned cost for tasks scheduled up to today
    if (task.plannedStartDate <= asOfDate) {
      if (task.plannedEndDate <= asOfDate) {
        // Task should be fully complete by now
        plannedValue += task.plannedCost
      } else {
        // Task is in progress, calculate proportional PV
        const totalDuration = task.plannedEndDate.getTime() - task.plannedStartDate.getTime()
        const elapsedDuration = asOfDate.getTime() - task.plannedStartDate.getTime()
        const progressRatio = Math.min(elapsedDuration / totalDuration, 1)
        plannedValue += task.plannedCost * progressRatio
      }
    }

    // Calculate Earned Value (EV) - sum of planned cost for completed tasks
    if (task.completed) {
      earnedValue += task.plannedCost
    }

    // Calculate Actual Cost (AC) - sum of actual costs
    actualCost += task.actualCost
  })

  const scheduleVariance = earnedValue - plannedValue
  const costVariance = earnedValue - actualCost
  const schedulePerformanceIndex = plannedValue > 0 ? earnedValue / plannedValue : 0
  const costPerformanceIndex = actualCost > 0 ? earnedValue / actualCost : 0

  return {
    plannedValue,
    earnedValue,
    actualCost,
    scheduleVariance,
    costVariance,
    schedulePerformanceIndex,
    costPerformanceIndex,
  }
}

export function getRAGStatus(value: number, thresholds = { good: 1.0, warning: 0.9 }): RAGStatus {
  if (value >= thresholds.good) return "green"
  if (value >= thresholds.warning) return "amber"
  return "red"
}

export function generateTrendData(tasks: Task[], days = 30): EVMTrendData[] {
  const trendData: EVMTrendData[] = []
  const today = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const metrics = calculateEVMMetrics(tasks, date)

    trendData.push({
      date: date.toISOString().split("T")[0],
      pv: metrics.plannedValue,
      ev: metrics.earnedValue,
      ac: metrics.actualCost,
      spi: metrics.schedulePerformanceIndex,
      cpi: metrics.costPerformanceIndex,
    })
  }

  return trendData
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}
