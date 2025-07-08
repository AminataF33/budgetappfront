"use client"

import { useState, useEffect } from "react"

interface AnalyticsData {
  monthlyData: Array<{
    month: string
    income: number
    expenses: number
  }>
  categoryExpenses: Array<{
    category: string
    amount: number
    percentage: number
    color: string
  }>
  stats: {
    avgIncome: number
    avgExpenses: number
    totalIncome: number
    totalExpenses: number
  }
  insights: Array<{
    type: string
    title: string
    description: string
    icon: string
    color: string
  }>
  period: string
}

export function useAnalytics(period = "6months") {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async (selectedPeriod: string = period) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?period=${selectedPeriod}`)

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
    fetchAnalytics(period)
  }, [period])

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
  }
}
