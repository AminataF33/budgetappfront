import mongoose from "mongoose"

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return

  try {
    await mongoose.connect(process.env.MONGODB_URI || "")
    console.log("✅ MongoDB connecté")
  } catch (err) {
    console.error("❌ Erreur de connexion MongoDB", err)
    throw err
  }
}

export default connectDB
