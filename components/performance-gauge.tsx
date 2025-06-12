"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RAGStatus } from "../types/evm"

interface PerformanceGaugeProps {
  title: string
  value: number
  status: RAGStatus
  description: string
}

export function PerformanceGauge({ title, value, status, description }: PerformanceGaugeProps) {
  const percentage = Math.min(value * 100, 150) // Cap at 150% for display
  const rotation = (percentage / 150) * 180 - 90 // Convert to gauge rotation

  const statusColors = {
    red: "text-red-600 border-red-200 bg-red-50",
    amber: "text-amber-600 border-amber-200 bg-amber-50",
    green: "text-green-600 border-green-200 bg-green-50",
  }

  const gaugeColors = {
    red: "#ef4444",
    amber: "#f59e0b",
    green: "#10b981",
  }

  return (
    <Card className={`${statusColors[status]}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-2">
          <div className="relative w-32 h-16">
            <svg viewBox="0 0 100 50" className="w-full h-full">
              {/* Background arc */}
              <path d="M 10 40 A 30 30 0 0 1 90 40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
              {/* Progress arc */}
              <path
                d="M 10 40 A 30 30 0 0 1 90 40"
                stroke={gaugeColors[status]}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(percentage / 150) * 126} 126`}
                className="transition-all duration-500"
              />
              {/* Needle */}
              <line
                x1="50"
                y1="40"
                x2="50"
                y2="15"
                stroke="#374151"
                strokeWidth="2"
                transform={`rotate(${rotation} 50 40)`}
                className="transition-transform duration-500"
              />
              {/* Center dot */}
              <circle cx="50" cy="40" r="3" fill="#374151" />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{value.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
