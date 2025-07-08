"use client"

import { useState, useEffect } from "react"

interface Transaction {
  id: number
  description: string
  amount: number
  date: string
  category: string
  account: string
  notes?: string
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async (filters?: {
    category?: string
    search?: string
    limit?: number
    offset?: number
  }) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (filters?.category) params.append("category", filters.category)
      if (filters?.search) params.append("search", filters.search)
      if (filters?.limit) params.append("limit", filters.limit.toString())
      if (filters?.offset) params.append("offset", filters.offset.toString())

      const response = await fetch(`/api/transactions?${params}`)

      if (!response.ok) {
        throw new Error("Erreur lors du chargement")
      }

      const result = await response.json()
      setTransactions(result.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

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

      await fetchTransactions()
      return true
    } catch (error) {
      console.error("Erreur ajout transaction:", error)
      return false
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    addTransaction,
  }
}
