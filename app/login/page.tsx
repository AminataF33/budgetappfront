"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, Eye, EyeOff, LogIn, AlertCircle, ArrowLeft, Mail, Lock, CheckCircle, Smartphone } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide"
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const success = await login(formData.email, formData.password)

      if (success) {
        router.push("/dashboard")
      } else {
        setErrors({ general: "Email ou mot de passe incorrect" })
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      setErrors({ general: "Erreur de connexion" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      return
    }

    // Simulation de l'envoi d'email
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setResetSent(true)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-blue-900">MonBudget</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/signup" className="text-blue-600 hover:text-blue-700">
                Pas de compte ? S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Bon retour !</h2>
          <p className="text-blue-700">Connectez-vous à votre compte MonBudget</p>
        </div>

        <Card className="border-blue-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-blue-900">Connexion</CardTitle>
            <CardDescription>Accédez à votre tableau de bord financier</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  Adresse email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-blue-600" />
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={errors.password ? "border-red-500" : ""}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-normal">
                    Se souvenir de moi
                  </Label>
                </div>

                <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700 p-0">
                      Mot de passe oublié ?
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
                      <DialogDescription>
                        Entrez votre adresse email pour recevoir un lien de réinitialisation
                      </DialogDescription>
                    </DialogHeader>
                    {!resetSent ? (
                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="resetEmail">Adresse email</Label>
                          <Input
                            id="resetEmail"
                            type="email"
                            placeholder="votre@email.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setShowForgotPassword(false)}>
                            Annuler
                          </Button>
                          <Button type="submit">Envoyer le lien</Button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-4">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-green-900 mb-2">Email envoyé !</h3>
                        <p className="text-green-700 mb-4">
                          Vérifiez votre boîte email et suivez les instructions pour réinitialiser votre mot de passe.
                        </p>
                        <Button onClick={() => setShowForgotPassword(false)}>Fermer</Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              {/* Bouton de connexion */}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="h-5 w-5 mr-2" />
                    Se connecter
                  </div>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Pas encore de compte ?{" "}
                  <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                    Créer un compte gratuit
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">Accès rapide</h3>
                <p className="text-sm text-blue-700">
                  Ajoutez MonBudget à votre écran d'accueil pour un accès instantané
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Account */}
        <Card className="mt-4 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <h3 className="font-medium text-green-900 mb-2">Compte de démonstration</h3>
            <p className="text-sm text-green-700 mb-3">Testez MonBudget sans créer de compte avec ces identifiants :</p>
            <div className="bg-white rounded p-3 text-sm">
              <p>
                <strong>Email :</strong> demo@monbudget.sn
              </p>
              <p>
                <strong>Mot de passe :</strong> demo123
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
              onClick={() => {
                setFormData({
                  email: "demo@monbudget.sn",
                  password: "demo123",
                  rememberMe: false,
                })
              }}
            >
              Utiliser le compte démo
            </Button>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Alert className="mt-6 border-blue-200 bg-blue-50">
          <Lock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Connexion sécurisée :</strong> Votre session est chiffrée et protégée. Déconnectez-vous toujours
            après utilisation sur un appareil partagé.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  )
}
