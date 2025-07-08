"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, Plus, Calendar, TrendingUp, CheckCircle, Wallet, Home, Car, Plane, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useGoals } from "@/hooks/useGoals"
import { useAuth } from "@/hooks/useAuth"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const iconMap = {
  Sécurité: Wallet,
  Immobilier: Home,
  Transport: Car,
  Voyage: Plane,
  Éducation: GraduationCap,
}

const GoalCard = ({ goal }: { goal: any }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100
  const status = getGoalStatus(goal.currentAmount, goal.targetAmount, goal.deadline)
  const IconComponent = iconMap[goal.category as keyof typeof iconMap] || Target
  const remaining = goal.targetAmount - goal.currentAmount

  return (
    <Card key={goal.id} className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-600">
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-blue-900">{goal.title}</CardTitle>
              <CardDescription>{goal.description}</CardDescription>
            </div>
          </div>
          <Badge variant={status.status === "completed" ? "default" : "secondary"} className={status.color}>
            {status.badge}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-900">{goal.currentAmount.toLocaleString()} CFA</span>
          <span className="text-sm text-gray-600">/ {goal.targetAmount.toLocaleString()} CFA</span>
        </div>

        <Progress value={Math.min(progress, 100)} className="h-3" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Progression</p>
            <p className="font-semibold text-blue-900">{progress.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-600">Restant</p>
            <p className="font-semibold text-blue-900">
              {remaining > 0 ? `${remaining.toLocaleString()} CFA` : "Atteint !"}
            </p>
          </div>
        </div>

        {goal.deadline && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Échéance: {format(new Date(goal.deadline), "dd MMMM yyyy", { locale: fr })}</span>
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            Modifier
          </Button>
          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
            Ajouter fonds
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const getGoalStatus = (current: number, target: number, deadline: string) => {
  const percentage = (current / target) * 100
  const daysLeft = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  if (percentage >= 100) return { status: "completed", color: "text-green-600", badge: "Atteint" }
  if (daysLeft < 0) return { status: "overdue", color: "text-red-600", badge: "Échéance dépassée" }
  if (daysLeft < 30) return { status: "urgent", color: "text-orange-600", badge: "Urgent" }
  return { status: "active", color: "text-blue-600", badge: "En cours" }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const GoalsPage = () => {
  const { goals, loading, error } = useGoals()
  const { logout } = useAuth()

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

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const completedGoals = goals.filter((goal) => goal.currentAmount >= goal.targetAmount).length
  const activeGoals = goals.filter((goal) => goal.currentAmount < goal.targetAmount).length

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
              <Link href="/dashboard/analytics" className="text-gray-600 hover:text-blue-600">
                Analyses
              </Link>
              <Link href="/dashboard/goals" className="text-blue-600 font-medium">
                Objectifs
              </Link>
            </nav>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel objectif
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Objectifs Financiers</h2>
          <p className="text-blue-700">Planifiez et suivez vos objectifs d'épargne</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Objectifs totaux</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{goals.length}</div>
              <p className="text-xs text-blue-600 mt-1">{completedGoals} atteints</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Montant cible</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{totalTargetAmount.toLocaleString()} CFA</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Épargné</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalCurrentAmount.toLocaleString()} CFA</div>
              <p className="text-xs text-green-600 mt-1">
                {totalTargetAmount > 0 ? ((totalCurrentAmount / totalTargetAmount) * 100).toFixed(1) : 0}% du total
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-900">Progression globale</CardTitle>
              <CardDescription>Vue d'ensemble de tous vos objectifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Progression totale</span>
                  <span className="text-blue-900 font-medium">
                    {totalCurrentAmount.toLocaleString()} CFA / {totalTargetAmount.toLocaleString()} CFA (
                    {totalTargetAmount > 0 ? ((totalCurrentAmount / totalTargetAmount) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <Progress
                  value={totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0}
                  className="h-3"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>

        {/* Add New Goal */}
        <Card className="mt-8 border-blue-200 shadow-lg border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Créer un nouvel objectif</h3>
            <p className="text-blue-700 text-center mb-4">
              Définissez un nouvel objectif d'épargne pour atteindre vos rêves
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel objectif
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default GoalsPage
