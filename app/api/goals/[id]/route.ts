import { type NextRequest, NextResponse } from "next/server"
import Database from "better-sqlite3"
import { join } from "path"
import { requireAuth } from "@/lib/auth"

const db = new Database(join(process.cwd(), "database.db"))

export const PUT = requireAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()
    const { title, description, targetAmount, currentAmount, deadline, category } = body
    const goalId = params.id

    // Vérifier que l'objectif appartient à l'utilisateur
    const goal = db.prepare("SELECT id FROM goals WHERE id = ? AND userId = ?").get(goalId, user.id)
    if (!goal) {
      return NextResponse.json({ error: "Objectif non trouvé" }, { status: 404 })
    }

    const updateGoal = db.prepare(`
      UPDATE goals 
      SET title = ?, description = ?, targetAmount = ?, currentAmount = ?, deadline = ?, category = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ? AND userId = ?
    `)

    updateGoal.run(title, description, targetAmount, currentAmount, deadline, category, goalId, user.id)

    return NextResponse.json({
      success: true,
      message: "Objectif mis à jour avec succès",
    })
  } catch (error) {
    console.error("Erreur mise à jour objectif:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'objectif" }, { status: 500 })
  }
})

export const DELETE = requireAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const goalId = params.id

    // Vérifier que l'objectif appartient à l'utilisateur
    const goal = db.prepare("SELECT id FROM goals WHERE id = ? AND userId = ?").get(goalId, user.id)
    if (!goal) {
      return NextResponse.json({ error: "Objectif non trouvé" }, { status: 404 })
    }

    const deleteGoal = db.prepare("DELETE FROM goals WHERE id = ? AND userId = ?")
    deleteGoal.run(goalId, user.id)

    return NextResponse.json({
      success: true,
      message: "Objectif supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur suppression objectif:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de l'objectif" }, { status: 500 })
  }
})
