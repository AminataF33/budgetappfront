"use client"

import { useState, useEffect } from "react"

interface DashboardData {
  user: any
  accounts: any[]
  recentTransactions: any[]
  budgets: any[]
  goals: any[]
  stats: {
    totalBalance: number
    monthlyExpenses: number
    savings: number
  }
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/dashboard")

      if (!response.ok) {
        throw new Error("Erreur lors du chargement")
      }

      const result = await response.json()
      setData(result.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const addTransaction = async (transactionData: any) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout")
      }

      // Recharger les données
      await fetchDashboard()
      return true
    } catch (error) {
      console.error("Erreur ajout transaction:", error)
      return false
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
    addTransaction,
  }
}
