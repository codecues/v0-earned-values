"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { EVMMetrics } from "../types/evm"
import { formatCurrency } from "../utils/evm-calculations"
import { TrendingUp, TrendingDown, DollarSign, Target, Activity } from "lucide-react"

interface MetricsSummaryProps {
  metrics: EVMMetrics
}

export function MetricsSummary({ metrics }: MetricsSummaryProps) {
  const metricCards = [
    {
      title: "Planned Value (PV)",
      value: formatCurrency(metrics.plannedValue),
      description: "Budgeted cost of work scheduled",
      icon: Target,
      color: "text-blue-600",
    },
    {
      title: "Earned Value (EV)",
      value: formatCurrency(metrics.earnedValue),
      description: "Budgeted cost of work performed",
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Actual Cost (AC)",
      value: formatCurrency(metrics.actualCost),
      description: "Actual cost of work performed",
      icon: DollarSign,
      color: "text-orange-600",
    },
    {
      title: "Schedule Variance (SV)",
      value: formatCurrency(metrics.scheduleVariance),
      description: "EV - PV",
      icon: metrics.scheduleVariance >= 0 ? TrendingUp : TrendingDown,
      color: metrics.scheduleVariance >= 0 ? "text-green-600" : "text-red-600",
    },
    {
      title: "Cost Variance (CV)",
      value: formatCurrency(metrics.costVariance),
      description: "EV - AC",
      icon: metrics.costVariance >= 0 ? TrendingUp : TrendingDown,
      color: metrics.costVariance >= 0 ? "text-green-600" : "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
