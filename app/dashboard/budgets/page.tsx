"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, AlertTriangle, CheckCircle, TrendingUp, Wallet, Target } from "lucide-react"
import Link from "next/link"
import { useBudgets } from "@/hooks/useBudgets"
import { useAuth } from "@/hooks/useAuth"

const BudgetsPage = () => {
  const { budgets, loading, error } = useBudgets()
  const { logout } = useAuth()
  const router = useRouter()

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

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.budget, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const overBudgetCount = budgets.filter((budget) => budget.spent > budget.budget).length

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100
    if (percentage > 100) return { status: "over", color: "text-red-600", icon: AlertTriangle }
    if (percentage > 80) return { status: "warning", color: "text-orange-600", icon: AlertTriangle }
    return { status: "good", color: "text-green-600", icon: CheckCircle }
  }

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
              <Link href="/dashboard/budgets" className="text-blue-600 font-medium">
                Budgets
              </Link>
              <Link href="/dashboard/analytics" className="text-gray-600 hover:text-blue-600">
                Analyses
              </Link>
              <Link href="/dashboard/goals" className="text-gray-600 hover:text-blue-600">
                Objectifs
              </Link>
            </nav>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleLogout}>
              <Plus className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Gestion des Budgets</h2>
          <p className="text-blue-700">Suivez et contrôlez vos dépenses par catégorie</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Budget Total</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{totalBudget.toLocaleString()} CFA</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Dépensé</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalSpent.toLocaleString()} CFA</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Restant</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{(totalBudget - totalSpent).toLocaleString()} CFA</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Dépassements</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overBudgetCount}</div>
              <p className="text-xs text-gray-500">catégorie(s)</p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress Overview */}
        <Card className="mb-8 border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-900">Vue d'ensemble</CardTitle>
            <CardDescription>Progression globale de vos budgets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Total utilisé</span>
                <span className="text-blue-900 font-medium">
                  {totalSpent.toLocaleString()} CFA / {totalBudget.toLocaleString()} CFA (
                  {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <Progress value={totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Budget Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget) => {
            const percentage = budget.budget > 0 ? (budget.spent / budget.budget) * 100 : 0
            const status = getBudgetStatus(budget.spent, budget.budget)
            const StatusIcon = status.icon

            return (
              <Card key={budget.id} className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-blue-900 flex items-center space-x-2">
                      <span>{budget.category}</span>
                      <StatusIcon className={`h-4 w-4 ${status.color}`} />
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-900">{budget.spent.toLocaleString()} CFA</span>
                    <Badge variant={status.status === "over" ? "destructive" : "secondary"}>
                      {percentage.toFixed(1)}%
                    </Badge>
                  </div>

                  <Progress value={Math.min(percentage, 100)} className="h-2" />

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Budget: {budget.budget.toLocaleString()} CFA</span>
                    <span className={status.color}>
                      {status.status === "over"
                        ? `Dépassé de ${(budget.spent - budget.budget).toLocaleString()} CFA`
                        : `Reste ${(budget.budget - budget.spent).toLocaleString()} CFA`}
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      Voir détails
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      Ajuster budget
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Add New Budget */}
        <Card className="mt-8 border-blue-200 shadow-lg border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Créer un nouveau budget</h3>
            <p className="text-blue-700 text-center mb-4">
              Ajoutez une nouvelle catégorie de budget pour mieux contrôler vos dépenses
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau budget
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default BudgetsPage
