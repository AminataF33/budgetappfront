"use client"

import { useState, useEffect } from "react"

interface Goal {
  id: number
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  createdAt: string
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/goals")

      if (!response.ok) {
        throw new Error("Erreur lors du chargement")
      }

      const result = await response.json()
      setGoals(result.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const addGoal = async (goalData: any) => {
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goalData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout")
      }

      await fetchGoals()
      return true
    } catch (error) {
      console.error("Erreur ajout objectif:", error)
      return false
    }
  }

  const updateGoal = async (id: number, goalData: any) => {
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goalData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour")
      }

      await fetchGoals()
      return true
    } catch (error) {
      console.error("Erreur mise à jour objectif:", error)
      return false
    }
  }

  const deleteGoal = async (id: number) => {
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      await fetchGoals()
      return true
    } catch (error) {
      console.error("Erreur suppression objectif:", error)
      return false
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  return {
    goals,
    loading,
    error,
    refetch: fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
  }
}
