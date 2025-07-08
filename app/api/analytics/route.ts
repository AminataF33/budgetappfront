import { type NextRequest, NextResponse } from "next/server"
import Database from "better-sqlite3"
import { join } from "path"
import { requireAuth } from "@/lib/auth"

const db = new Database(join(process.cwd(), "database.db"))

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "6months"

    // Calculer les dates selon la période
    const endDate = new Date()
    const startDate = new Date()

    switch (period) {
      case "1month":
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case "3months":
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case "6months":
        startDate.setMonth(startDate.getMonth() - 6)
        break
      case "1year":
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
    }

    // Données mensuelles
    const monthlyData = db
      .prepare(`
      SELECT 
        strftime('%Y-%m', date) as month,
        SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as expenses
      FROM transactions 
      WHERE userId = ? AND date >= ? AND date <= ?
      GROUP BY strftime('%Y-%m', date)
      ORDER BY month
    `)
      .all(user.id, startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0])

    // Dépenses par catégorie
    const categoryExpenses = db
      .prepare(`
      SELECT 
        c.name as category,
        c.color,
        SUM(ABS(t.amount)) as amount,
        ROUND((SUM(ABS(t.amount)) * 100.0 / (
          SELECT SUM(ABS(amount)) 
          FROM transactions 
          WHERE userId = ? AND amount < 0 AND date >= ? AND date <= ?
        )), 1) as percentage
      FROM transactions t
      JOIN categories c ON t.categoryId = c.id
      WHERE t.userId = ? AND t.amount < 0 AND t.date >= ? AND t.date <= ?
      GROUP BY c.id, c.name, c.color
      ORDER BY amount DESC
    `)
      .all(
        user.id,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
        user.id,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
      )

    // Statistiques générales
    const stats = db
      .prepare(`
      SELECT 
        AVG(CASE WHEN amount > 0 THEN amount ELSE 0 END) as avgIncome,
        AVG(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as avgExpenses,
        SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as totalExpenses
      FROM transactions 
      WHERE userId = ? AND date >= ? AND date <= ?
    `)
      .get(user.id, startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0])

    // Insights automatiques
    const insights = []

    // Vérifier les dépassements de budget
    const budgetOverruns = db
      .prepare(`
      SELECT 
        c.name as category,
        b.amount as budget,
        SUM(ABS(t.amount)) as spent
      FROM budgets b
      JOIN categories c ON b.categoryId = c.id
      LEFT JOIN transactions t ON t.categoryId = b.categoryId 
        AND t.userId = b.userId 
        AND t.amount < 0
        AND t.date >= b.startDate 
        AND t.date <= b.endDate
      WHERE b.userId = ?
      GROUP BY b.id, c.name, b.amount
      HAVING spent > budget
    `)
      .all(user.id)

    budgetOverruns.forEach((overrun) => {
      insights.push({
        type: "warning",
        title: `Dépassement budget ${overrun.category}`,
        description: `Vous avez dépassé votre budget ${overrun.category} de ${(overrun.spent - overrun.budget).toLocaleString()} CFA`,
        icon: "AlertTriangle",
        color: "text-orange-600",
      })
    })

    return NextResponse.json({
      success: true,
      data: {
        monthlyData,
        categoryExpenses,
        stats,
        insights,
        period,
      },
    })
  } catch (error) {
    console.error("Erreur analytics:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des analyses" }, { status: 500 })
  }
})
