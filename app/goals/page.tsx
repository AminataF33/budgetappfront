"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Plus,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  Wallet,
  Home,
  Car,
  Plane,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"

export default function GoalsPage() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Fonds d'urgence",
      description: "Constituer un fonds d'urgence de 6 mois de salaire",
      targetAmount: 16800,
      currentAmount: 8750,
      deadline: "2024-12-31",
      category: "Sécurité",
      icon: Wallet,
      color: "bg-blue-600",
    },
    {
      id: 2,
      title: "Achat appartement",
      description: "Épargner pour l'apport d'un appartement",
      targetAmount: 50000,
      currentAmount: 12500,
      deadline: "2025-06-30",
      category: "Immobilier",
      icon: Home,
      color: "bg-green-600",
    },
    {
      id: 3,
      title: "Nouvelle voiture",
      description: "Remplacer la voiture actuelle",
      targetAmount: 25000,
      currentAmount: 18750,
      deadline: "2024-08-15",
      category: "Transport",
      icon: Car,
      color: "bg-purple-600",
    },
    {
      id: 4,
      title: "Vacances au Japon",
      description: "Voyage de 2 semaines au Japon",
      targetAmount: 4000,
      currentAmount: 2800,
      deadline: "2024-09-01",
      category: "Voyage",
      icon: Plane,
      color: "bg-orange-600",
    },
    {
      id: 5,
      title: "Formation professionnelle",
      description: "Financer une formation en développement",
      targetAmount: 3000,
      currentAmount: 3000,
      deadline: "2024-03-01",
      category: "Éducation",
      icon: GraduationCap,
      color: "bg-indigo-600",
    },
  ])

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const completedGoals = goals.filter((goal) => goal.currentAmount >= goal.targetAmount).length
  const activeGoals = goals.filter((goal) => goal.currentAmount < goal.targetAmount).length

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
              <Link href="/analytics" className="text-gray-600 hover:text-blue-600">
                Analyses
              </Link>
              <Link href="/goals" className="text-blue-600 font-medium">
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
              <div className="text-2xl font-bold text-blue-900">{totalTargetAmount.toLocaleString()} €</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Épargné</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalCurrentAmount.toLocaleString()} €</div>
              <p className="text-xs text-green-600 mt-1">
                {((totalCurrentAmount / totalTargetAmount) * 100).toFixed(1)}% du total
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">En cours</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{activeGoals}</div>
              <p className="text-xs text-gray-500 mt-1">objectifs actifs</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-900">Progression globale</CardTitle>
            <CardDescription>Vue d'ensemble de tous vos objectifs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Progression totale</span>
                <span className="text-blue-900 font-medium">
                  {totalCurrentAmount.toLocaleString()} € / {totalTargetAmount.toLocaleString()} € (
                  {((totalCurrentAmount / totalTargetAmount) * 100).toFixed(1)}%)
                </span>
              </div>
              <Progress value={(totalCurrentAmount / totalTargetAmount) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100
            const status = getGoalStatus(goal.currentAmount, goal.targetAmount, goal.deadline)
            const IconComponent = goal.icon
            const remaining = goal.targetAmount - goal.currentAmount

            return (
              <Card key={goal.id} className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${goal.color}`}>
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
                    <span className="text-2xl font-bold text-blue-900">{goal.currentAmount.toLocaleString()} €</span>
                    <span className="text-sm text-gray-600">/ {goal.targetAmount.toLocaleString()} €</span>
                  </div>

                  <Progress value={Math.min(percentage, 100)} className="h-3" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Progression</p>
                      <p className="font-semibold text-blue-900">{percentage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Restant</p>
                      <p className="font-semibold text-blue-900">
                        {remaining > 0 ? `${remaining.toLocaleString()} €` : "Atteint !"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Échéance: {formatDate(goal.deadline)}</span>
                  </div>

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
          })}
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
