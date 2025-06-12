"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { EVMTrendData } from "../types/evm"

interface TrendChartProps {
  data: EVMTrendData[]
  title: string
  type: "cost" | "performance"
}

export function TrendChart({ data, title, type }: TrendChartProps) {
  const chartConfig =
    type === "cost"
      ? {
          pv: {
            label: "Planned Value",
            color: "hsl(var(--chart-1))",
          },
          ev: {
            label: "Earned Value",
            color: "hsl(var(--chart-2))",
          },
          ac: {
            label: "Actual Cost",
            color: "hsl(var(--chart-3))",
          },
        }
      : {
          spi: {
            label: "Schedule Performance Index",
            color: "hsl(var(--chart-1))",
          },
          cpi: {
            label: "Cost Performance Index",
            color: "hsl(var(--chart-2))",
          },
        }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              {type === "cost" ? (
                <>
                  <Line type="monotone" dataKey="pv" stroke="var(--color-pv)" strokeWidth={2} name="Planned Value" />
                  <Line type="monotone" dataKey="ev" stroke="var(--color-ev)" strokeWidth={2} name="Earned Value" />
                  <Line type="monotone" dataKey="ac" stroke="var(--color-ac)" strokeWidth={2} name="Actual Cost" />
                </>
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="spi"
                    stroke="var(--color-spi)"
                    strokeWidth={2}
                    name="Schedule Performance Index"
                  />
                  <Line
                    type="monotone"
                    dataKey="cpi"
                    stroke="var(--color-cpi)"
                    strokeWidth={2}
                    name="Cost Performance Index"
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
