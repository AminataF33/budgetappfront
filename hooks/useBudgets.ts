"use client"

import { useState, useEffect } from "react"

interface Budget {
  id: number
  category: string
  budget: number
  spent: number
  color: string
  period: string
  startDate: string
  endDate: string
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/budgets")

      if (!response.ok) {
        throw new Error("Erreur lors du chargement")
      }

      const result = await response.json()
      setBudgets(result.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const addBudget = async (budgetData: any) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout")
      }

      await fetchBudgets()
      return true
    } catch (error) {
      console.error("Erreur ajout budget:", error)
      return false
    }
  }

  const updateBudget = async (id: number, budgetData: any) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour")
      }

      await fetchBudgets()
      return true
    } catch (error) {
      console.error("Erreur mise à jour budget:", error)
      return false
    }
  }

  const deleteBudget = async (id: number) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      await fetchBudgets()
      return true
    } catch (error) {
      console.error("Erreur suppression budget:", error)
      return false
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  return {
    budgets,
    loading,
    error,
    refetch: fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
  }
}
