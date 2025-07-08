"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Wallet,
  Target,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useAnalytics } from "@/hooks/useAnalytics"
import { useAuth } from "@/hooks/useAuth"

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const { data, loading, error, refetch } = useAnalytics(selectedPeriod)
  const { logout } = useAuth()

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    refetch(period)
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { monthlyData, categoryExpenses, stats, insights } = data

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-blue-900">MonBudget</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/dashboard/transactions" className="text-gray-600 hover:text-blue-600">
                Transactions
              </Link>
              <Link href="/dashboard/budgets" className="text-gray-600 hover:text-blue-600">
                Budgets
              </Link>
              <Link href="/dashboard/analytics" className="text-blue-600 font-medium">
                Analyses
              </Link>
              <Link href="/dashboard/goals" className="text-gray-600 hover:text-blue-600">
                Objectifs
              </Link>
            </nav>
            <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Exporter rapport
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Analyses Financières</h2>
          <p className="text-blue-700">Visualisez et analysez vos habitudes financières</p>
        </div>

        {/* Period Selector */}
        <Card className="mb-8 border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-900">Période d'analyse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 mois</SelectItem>
                  <SelectItem value="3months">3 mois</SelectItem>
                  <SelectItem value="6months">6 mois</SelectItem>
                  <SelectItem value="1year">1 an</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                Période personnalisée
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Revenus moyens</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.avgIncome.toLocaleString()} CFA</div>
              <p className="text-xs text-green-600 mt-1">+0% vs période précédente</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Dépenses moyennes</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.avgExpenses.toLocaleString()} CFA</div>
              <p className="text-xs text-green-600 mt-1">-5% vs période précédente</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Épargne moyenne</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {(stats.totalIncome - stats.totalExpenses).toLocaleString()} CFA
              </div>
              <p className="text-xs text-green-600 mt-1">+21% vs période précédente</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Taux d'épargne</CardTitle>
              <PieChart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalIncome > 0
                  ? (((stats.totalIncome - stats.totalExpenses) / stats.totalIncome) * 100).toFixed(1)
                  : 0}
                %
              </div>
              <p className="text-xs text-green-600 mt-1">Excellent niveau</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trend Chart */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Évolution mensuelle</span>
              </CardTitle>
              <CardDescription>Revenus vs Dépenses sur la période sélectionnée</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-blue-900">{data.month}</span>
                      <span className="text-gray-600">
                        Épargne: {(data.income - data.expenses).toLocaleString()} CFA
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${Math.min((data.income / Math.max(...monthlyData.map((d) => Math.max(d.income, d.expenses)))) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-green-600 w-20">{data.income.toLocaleString()} CFA</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{
                              width: `${Math.min((data.expenses / Math.max(...monthlyData.map((d) => Math.max(d.income, d.expenses)))) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-red-600 w-20">{data.expenses.toLocaleString()} CFA</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Répartition par catégorie</span>
              </CardTitle>
              <CardDescription>Dépenses de la période sélectionnée</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryExpenses.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-900">{category.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{category.amount.toLocaleString()} CFA</span>
                        <Badge variant="secondary">{category.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: category.color || "#3B82F6",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights and Recommendations */}
        <Card className="border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-900">Insights et Recommandations</CardTitle>
            <CardDescription>Analyses automatiques de vos habitudes financières</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <AlertCircle className={`h-5 w-5 ${insight.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">{insight.title}</h4>
                      <p className="text-sm text-blue-700">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              {insights.length === 0 && (
                <div className="col-span-3 text-center py-8">
                  <p className="text-blue-700">Aucun insight disponible pour cette période.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
