"use client"

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

export default function AnalyticsPage() {
  const monthlyData = [
    { month: "Jan", income: 2800, expenses: 2150 },
    { month: "Fév", income: 2800, expenses: 2300 },
    { month: "Mar", income: 2800, expenses: 1950 },
    { month: "Avr", income: 2800, expenses: 2400 },
    { month: "Mai", income: 2800, expenses: 2100 },
    { month: "Juin", income: 2800, expenses: 2250 },
  ]

  const categoryExpenses = [
    { category: "Logement", amount: 1200, percentage: 55.8, color: "bg-blue-600" },
    { category: "Alimentation", amount: 450, percentage: 20.9, color: "bg-blue-500" },
    { category: "Transport", amount: 180, percentage: 8.4, color: "bg-blue-400" },
    { category: "Loisirs", amount: 320, percentage: 14.9, color: "bg-blue-300" },
  ]

  const insights = [
    {
      type: "warning",
      title: "Dépassement budget Loisirs",
      description: "Vous avez dépassé votre budget Loisirs de 70€ ce mois",
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      type: "success",
      title: "Économies sur le Transport",
      description: "Vous avez économisé 20€ sur vos frais de transport",
      icon: TrendingDown,
      color: "text-green-600",
    },
    {
      type: "info",
      title: "Tendance positive",
      description: "Vos dépenses ont diminué de 5% par rapport au mois dernier",
      icon: TrendingUp,
      color: "text-blue-600",
    },
  ]

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
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/transactions" className="text-gray-600 hover:text-blue-600">
                Transactions
              </Link>
              <Link href="/budgets" className="text-gray-600 hover:text-blue-600">
                Budgets
              </Link>
              <Link href="/analytics" className="text-blue-600 font-medium">
                Analyses
              </Link>
              <Link href="/goals" className="text-gray-600 hover:text-blue-600">
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
              <Select defaultValue="6months">
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
              <div className="text-2xl font-bold text-green-600">2 800 €</div>
              <p className="text-xs text-green-600 mt-1">+0% vs période précédente</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Dépenses moyennes</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">2 200 €</div>
              <p className="text-xs text-green-600 mt-1">-5% vs période précédente</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Épargne moyenne</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">600 €</div>
              <p className="text-xs text-green-600 mt-1">+21% vs période précédente</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Taux d'épargne</CardTitle>
              <PieChart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">21.4%</div>
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
              <CardDescription>Revenus vs Dépenses sur 6 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-blue-900">{data.month}</span>
                      <span className="text-gray-600">Épargne: {(data.income - data.expenses).toFixed(0)}€</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(data.income / 3000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-green-600 w-16">{data.income}€</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(data.expenses / 3000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-red-600 w-16">{data.expenses}€</span>
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
              <CardDescription>Dépenses du mois en cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryExpenses.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-900">{category.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{category.amount}€</span>
                        <Badge variant="secondary">{category.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${category.color} h-2 rounded-full`}
                        style={{ width: `${category.percentage}%` }}
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
              {insights.map((insight, index) => {
                const IconComponent = insight.icon
                return (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <IconComponent className={`h-5 w-5 ${insight.color}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">{insight.title}</h4>
                        <p className="text-sm text-blue-700">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
