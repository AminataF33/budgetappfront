import { type NextRequest, NextResponse } from "next/server"
import Database from "better-sqlite3"
import { join } from "path"
import { requireAuth } from "@/lib/auth"

const db = new Database(join(process.cwd(), "database.db"))

export const PUT = requireAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()
    const { amount, period, startDate, endDate } = body
    const budgetId = params.id

    // Vérifier que le budget appartient à l'utilisateur
    const budget = db.prepare("SELECT id FROM budgets WHERE id = ? AND userId = ?").get(budgetId, user.id)
    if (!budget) {
      return NextResponse.json({ error: "Budget non trouvé" }, { status: 404 })
    }

    const updateBudget = db.prepare(`
      UPDATE budgets 
      SET amount = ?, period = ?, startDate = ?, endDate = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ? AND userId = ?
    `)

    updateBudget.run(amount, period, startDate, endDate, budgetId, user.id)

    return NextResponse.json({
      success: true,
      message: "Budget mis à jour avec succès",
    })
  } catch (error) {
    console.error("Erreur mise à jour budget:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du budget" }, { status: 500 })
  }
})

export const DELETE = requireAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const budgetId = params.id

    // Vérifier que le budget appartient à l'utilisateur
    const budget = db.prepare("SELECT id FROM budgets WHERE id = ? AND userId = ?").get(budgetId, user.id)
    if (!budget) {
      return NextResponse.json({ error: "Budget non trouvé" }, { status: 404 })
    }

    const deleteBudget = db.prepare("DELETE FROM budgets WHERE id = ? AND userId = ?")
    deleteBudget.run(budgetId, user.id)

    return NextResponse.json({
      success: true,
      message: "Budget supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur suppression budget:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression du budget" }, { status: 500 })
  }
})
