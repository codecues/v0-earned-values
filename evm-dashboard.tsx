"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MetricsSummary } from "./components/metrics-summary"
import { PerformanceGauge } from "./components/performance-gauge"
import { TaskManager } from "./components/task-manager"
import type { Task, EVMMetrics, EVMTrendData } from "./types/evm"
import { calculateEVMMetrics, getRAGStatus, generateTrendData, formatPercentage } from "./utils/evm-calculations"
import { Calendar, RefreshCw } from "lucide-react"

// Sample data for demonstration
const sampleTasks: Task[] = [
  {
    id: "1",
    name: "Project Planning",
    plannedCost: 10000,
    actualCost: 12000,
    plannedStartDate: new Date(2024, 0, 1),
    plannedEndDate: new Date(2024, 0, 15),
    completed: true,
    completionDate: new Date(2024, 0, 16),
  },
  {
    id: "2",
    name: "Requirements Analysis",
    plannedCost: 15000,
    actualCost: 14000,
    plannedStartDate: new Date(2024, 0, 16),
    plannedEndDate: new Date(2024, 1, 1),
    completed: true,
    completionDate: new Date(2024, 1, 2),
  },
  {
    id: "3",
    name: "System Design",
    plannedCost: 20000,
    actualCost: 18000,
    plannedStartDate: new Date(2024, 1, 2),
    plannedEndDate: new Date(2024, 1, 20),
    completed: false,
  },
  {
    id: "4",
    name: "Development Phase 1",
    plannedCost: 30000,
    actualCost: 5000,
    plannedStartDate: new Date(2024, 1, 21),
    plannedEndDate: new Date(2024, 2, 15),
    completed: false,
  },
  {
    id: "5",
    name: "Testing",
    plannedCost: 12000,
    actualCost: 0,
    plannedStartDate: new Date(2024, 2, 16),
    plannedEndDate: new Date(2024, 3, 1),
    completed: false,
  },
]

export default function EVMDashboard() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [metrics, setMetrics] = useState<EVMMetrics>()
  const [trendData, setTrendData] = useState<EVMTrendData[]>([])

  useEffect(() => {
    const calculatedMetrics = calculateEVMMetrics(tasks, currentDate)
    setMetrics(calculatedMetrics)

    const trends = generateTrendData(tasks, 30)
    setTrendData(trends)
  }, [tasks, currentDate])

  const handleRefresh = () => {
    setCurrentDate(new Date())
  }

  if (!metrics) return <div>Loading...</div>

  const spiStatus = getRAGStatus(metrics.schedulePerformanceIndex)
  const cpiStatus = getRAGStatus(metrics.costPerformanceIndex)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EVM Dashboard</h1>
            <p className="text-gray-600">Earned Value Management Calculation Engine</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm text-gray-600">As of: {currentDate.toLocaleDateString()}</span>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Project Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{tasks.filter((t) => t.completed).length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{tasks.filter((t) => !t.completed).length}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatPercentage(tasks.filter((t) => t.completed).length / tasks.length)}
                </div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EVM Metrics Summary */}
        <MetricsSummary metrics={metrics} />

        {/* Performance Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PerformanceGauge
            title="Schedule Performance Index (SPI)"
            value={metrics.schedulePerformanceIndex}
            status={spiStatus}
            description={`${spiStatus === "green" ? "Ahead of" : spiStatus === "amber" ? "On" : "Behind"} schedule`}
          />
          <PerformanceGauge
            title="Cost Performance Index (CPI)"
            value={metrics.costPerformanceIndex}
            status={cpiStatus}
            description={`${cpiStatus === "green" ? "Under" : cpiStatus === "amber" ? "On" : "Over"} budget`}
          />
        </div>

        {/* Task Management */}
        <TaskManager tasks={tasks} onTasksChange={setTasks} />

        {/* Performance Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Schedule Performance</span>
                  <Badge
                    variant={spiStatus === "green" ? "default" : spiStatus === "amber" ? "secondary" : "destructive"}
                  >
                    {spiStatus.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600">
                  SPI = {metrics.schedulePerformanceIndex.toFixed(3)}
                  {metrics.schedulePerformanceIndex > 1
                    ? " (Ahead of schedule)"
                    : metrics.schedulePerformanceIndex < 1
                      ? " (Behind schedule)"
                      : " (On schedule)"}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Cost Performance</span>
                  <Badge
                    variant={cpiStatus === "green" ? "default" : cpiStatus === "amber" ? "secondary" : "destructive"}
                  >
                    {cpiStatus.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600">
                  CPI = {metrics.costPerformanceIndex.toFixed(3)}
                  {metrics.costPerformanceIndex > 1
                    ? " (Under budget)"
                    : metrics.costPerformanceIndex < 1
                      ? " (Over budget)"
                      : " (On budget)"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
