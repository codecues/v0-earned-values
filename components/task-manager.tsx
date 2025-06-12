"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { Task } from "../types/evm"
import { formatCurrency } from "../utils/evm-calculations"
import { Plus, Trash2 } from "lucide-react"

interface TaskManagerProps {
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
}

export function TaskManager({ tasks, onTasksChange }: TaskManagerProps) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: "",
    plannedCost: 0,
    actualCost: 0,
    plannedStartDate: new Date(),
    plannedEndDate: new Date(),
    completed: false,
  })

  const handleAddTask = () => {
    if (newTask.name && newTask.plannedCost) {
      const task: Task = {
        id: Date.now().toString(),
        name: newTask.name,
        plannedCost: newTask.plannedCost,
        actualCost: newTask.actualCost || 0,
        plannedStartDate: newTask.plannedStartDate || new Date(),
        plannedEndDate: newTask.plannedEndDate || new Date(),
        completed: newTask.completed || false,
      }
      onTasksChange([...tasks, task])
      setNewTask({
        name: "",
        plannedCost: 0,
        actualCost: 0,
        plannedStartDate: new Date(),
        plannedEndDate: new Date(),
        completed: false,
      })
      setIsAddingTask(false)
    }
  }

  const handleToggleComplete = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, completed: !task.completed, completionDate: !task.completed ? new Date() : undefined }
        : task,
    )
    onTasksChange(updatedTasks)
  }

  const handleDeleteTask = (taskId: string) => {
    onTasksChange(tasks.filter((task) => task.id !== taskId))
  }

  const handleUpdateActualCost = (taskId: string, actualCost: number) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, actualCost } : task))
    onTasksChange(updatedTasks)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Tasks</CardTitle>
        <Button onClick={() => setIsAddingTask(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        {isAddingTask && (
          <div className="border rounded-lg p-4 mb-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taskName">Task Name</Label>
                <Input
                  id="taskName"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  placeholder="Enter task name"
                />
              </div>
              <div>
                <Label htmlFor="plannedCost">Planned Cost</Label>
                <Input
                  id="plannedCost"
                  type="number"
                  value={newTask.plannedCost}
                  onChange={(e) => setNewTask({ ...newTask, plannedCost: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newTask.plannedStartDate?.toISOString().split("T")[0]}
                  onChange={(e) => setNewTask({ ...newTask, plannedStartDate: new Date(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newTask.plannedEndDate?.toISOString().split("T")[0]}
                  onChange={(e) => setNewTask({ ...newTask, plannedEndDate: new Date(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTask}>Add Task</Button>
              <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3 flex-1">
                <Checkbox checked={task.completed} onCheckedChange={() => handleToggleComplete(task.id)} />
                <div className="flex-1">
                  <div className="font-medium">{task.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Planned: {formatCurrency(task.plannedCost)} |{task.plannedStartDate.toLocaleDateString()} -{" "}
                    {task.plannedEndDate.toLocaleDateString()}
                  </div>
                </div>
                <Badge variant={task.completed ? "default" : "secondary"}>
                  {task.completed ? "Complete" : "In Progress"}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm">
                  <Label htmlFor={`actualCost-${task.id}`} className="text-xs">
                    Actual Cost:
                  </Label>
                  <Input
                    id={`actualCost-${task.id}`}
                    type="number"
                    value={task.actualCost}
                    onChange={(e) => handleUpdateActualCost(task.id, Number(e.target.value))}
                    className="w-24 h-8"
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
