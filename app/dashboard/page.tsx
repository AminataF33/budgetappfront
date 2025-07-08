"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  CreditCard,
  PiggyBank,
  AlertTriangle,
  Plus,
  Bell,
  Settings,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useDashboard } from "@/hooks/useDashboard"
import { useAuth } from "@/hooks/useAuth"

export default function Dashboard() {
  const { data, loading, error, addTransaction } = useDashboard()
  const { logout } = useAuth()
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [transactionType, setTransactionType] = useState("expense")
  const [categories, setCategories] = useState([])
  const [transactionForm, setTransactionForm] = useState({
    description: "",
    amount: "",
    categoryId: "",
    accountId: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  useEffect(() => {
    fetchCategories()
  }, [transactionType])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories?type=${transactionType === "income" ? "income" : "expense"}`)
      const result = await response.json()
      setCategories(result.data)
    } catch (error) {
      console.error("Erreur chargement catégories:", error)
    }
  }

  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault()

    const amount =
      transactionType === "expense"
        ? -Math.abs(Number(transactionForm.amount))
        : Math.abs(Number(transactionForm.amount))

    const success = await addTransaction({
      ...transactionForm,
      amount,
      categoryId: Number(transactionForm.categoryId),
      accountId: Number(transactionForm.accountId),
    })

    if (success) {
      setShowAddTransaction(false)
      setTransactionForm({
        description: "",
        amount: "",
        categoryId: "",
        accountId: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      })
    }
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

  const { user, accounts, recentTransactions, budgets, goals, stats } = data

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
              <Link href="/dashboard" className="text-blue-600 font-medium">
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
              <Link href="/dashboard/goals" className="text-gray-600 hover:text-blue-600">
                Objectifs
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Nouvelle Transaction</DialogTitle>
                    <DialogDescription>Ajoutez une nouvelle transaction à votre budget</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitTransaction} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant={transactionType === "expense" ? "default" : "outline"}
                        onClick={() => setTransactionType("expense")}
                        className="w-full"
                      >
                        Dépense
                      </Button>
                      <Button
                        type="button"
                        variant={transactionType === "income" ? "default" : "outline"}
                        onClick={() => setTransactionType("income")}
                        className="w-full"
                      >
                        Revenu
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Montant (CFA)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="25000"
                        value={transactionForm.amount}
                        onChange={(e) => setTransactionForm((prev) => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Ex: Courses Auchan"
                        value={transactionForm.description}
                        onChange={(e) => setTransactionForm((prev) => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select
                        value={transactionForm.categoryId}
                        onValueChange={(value) => setTransactionForm((prev) => ({ ...prev, categoryId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="account">Compte</Label>
                      <Select
                        value={transactionForm.accountId}
                        onValueChange={(value) => setTransactionForm((prev) => ({ ...prev, accountId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un compte" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((account: any) => (
                            <SelectItem key={account.id} value={account.id.toString()}>
                              {account.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={transactionForm.date}
                        onChange={(e) => setTransactionForm((prev) => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes (optionnel)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Ajouter des notes..."
                        rows={3}
                        value={transactionForm.notes}
                        onChange={(e) => setTransactionForm((prev) => ({ ...prev, notes: e.target.value }))}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowAddTransaction(false)}>
                        Annuler
                      </Button>
                      <Button type="submit">Ajouter</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Salut {user.firstName} ! 👋</h2>
          <p className="text-blue-700">Voici un aperçu de vos finances aujourd'hui</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Solde Total</CardTitle>
              <Wallet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.totalBalance.toLocaleString()} CFA</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.5% ce mois
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Dépenses ce mois</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.monthlyExpenses.toLocaleString()} CFA</div>
              <p className="text-xs text-red-600 flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                +8.2% vs mois dernier
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Épargne</CardTitle>
              <PiggyBank className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.savings.toLocaleString()} CFA</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Objectif: 5,000,000 CFA
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Objectifs</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {goals.filter((g) => g.currentAmount >= g.targetAmount).length}/{goals.length}
              </div>
              <p className="text-xs text-blue-600 mt-1">Objectifs atteints</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Accounts Overview */}
          <Card className="lg:col-span-1 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-900">Mes Comptes</CardTitle>
              <CardDescription>Vue d'ensemble de vos comptes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {accounts.map((account: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        account.type === "checking"
                          ? "bg-blue-100"
                          : account.type === "savings"
                            ? "bg-green-100"
                            : account.type === "credit"
                              ? "bg-red-100"
                              : "bg-orange-100"
                      }`}
                    >
                      <Wallet
                        className={`h-4 w-4 ${
                          account.type === "checking"
                            ? "text-blue-600"
                            : account.type === "savings"
                              ? "text-green-600"
                              : account.type === "credit"
                                ? "text-red-600"
                                : "text-orange-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">{account.name}</p>
                      <p className="text-xs text-gray-500">{account.bank}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${account.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {account.balance >= 0 ? "+" : ""}
                    {account.balance.toLocaleString()} CFA
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Budget Overview */}
          <Card className="lg:col-span-2 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-900">Budgets du Mois</CardTitle>
              <CardDescription>Suivi de vos budgets par catégorie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {budgets.map((budget: any, index: number) => {
                const percentage = (budget.spent / budget.budget) * 100
                const isOverBudget = percentage > 100

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-blue-900">{budget.category}</span>
                        {isOverBudget && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </div>
                      <span className="text-sm text-gray-600">
                        {budget.spent.toLocaleString()} / {budget.budget.toLocaleString()} CFA
                      </span>
                    </div>
                    <Progress value={Math.min(percentage, 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{percentage.toFixed(1)}% utilisé</span>
                      <span className={isOverBudget ? "text-red-500 font-medium" : ""}>
                        {isOverBudget
                          ? `Dépassé de ${(budget.spent - budget.budget).toLocaleString()} CFA`
                          : `Reste ${(budget.budget - budget.spent).toLocaleString()} CFA`}
                      </span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="mt-8 border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-900">Transactions Récentes</CardTitle>
            <CardDescription>Vos dernières opérations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction: any) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${transaction.amount > 0 ? "bg-green-100" : "bg-red-100"}`}>
                      {transaction.amount > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">{transaction.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {transaction.category}
                        </Badge>
                        <span className="text-sm text-gray-500">{transaction.account}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount.toLocaleString()} CFA
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                asChild
              >
                <Link href="/dashboard/transactions">Voir toutes les transactions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
