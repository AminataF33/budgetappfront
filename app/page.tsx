"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, TrendingUp, Shield, Smartphone, BarChart3, Target, CheckCircle, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const features = [
    {
      icon: Wallet,
      title: "Gestion Multi-Comptes",
      description: "Gérez vos comptes bancaires sénégalais (BOA, SGBS, CBAO, etc.) en un seul endroit",
    },
    {
      icon: TrendingUp,
      title: "Suivi des Dépenses",
      description: "Analysez vos habitudes de consommation et optimisez votre budget familial",
    },
    {
      icon: Target,
      title: "Objectifs d'Épargne",
      description: "Planifiez vos projets : Tabaski, voyage, achat de terrain, mariage...",
    },
    {
      icon: BarChart3,
      title: "Analyses Détaillées",
      description: "Visualisez vos finances avec des graphiques clairs et des conseils personnalisés",
    },
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Vos données financières sont chiffrées et stockées localement",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Accédez à vos finances depuis votre téléphone, même hors ligne",
    },
  ]

  const testimonials = [
    {
      name: "Aminata Diallo",
      role: "Commerçante, Dakar",
      content: "MonBudget m'aide à gérer les recettes de mon commerce et à épargner pour agrandir ma boutique.",
      rating: 5,
    },
    {
      name: "Moussa Ndiaye",
      role: "Fonctionnaire, Thiès",
      content: "Grâce à cette app, j'ai pu économiser pour la Tabaski et les frais scolaires de mes enfants.",
      rating: 5,
    },
    {
      name: "Fatou Seck",
      role: "Étudiante, Saint-Louis",
      content: "Parfait pour gérer mon budget étudiant et mes transferts d'argent familiaux.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-blue-900">MonBudget</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600">
                Fonctionnalités
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600">
                Témoignages
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600">
                Tarifs
              </a>
            </nav>
            <div className="flex space-x-4">
              <Button variant="ghost" className="text-blue-600" asChild>
                <Link href="/login">Se connecter</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/signup">S'inscrire</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-blue-900 leading-tight">
                  Gérez votre budget comme un{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    pro
                  </span>
                </h1>
                <p className="text-xl text-blue-700 leading-relaxed">
                  L'application de gestion financière pensée pour les Sénégalais. Suivez vos dépenses, épargnez
                  intelligemment et atteignez vos objectifs financiers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3" asChild>
                  <Link href="/signup">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-blue-300 text-blue-600 text-lg px-8 py-3 bg-transparent"
                  asChild
                >
                  <Link href="/login">Voir la démo</Link>
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-blue-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>100% Gratuit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Données sécurisées</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Hors ligne</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-900">Tableau de bord</h3>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      +15% ce mois
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-600 text-sm">Solde total</p>
                      <p className="text-2xl font-bold text-blue-900">2,450,000 CFA</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-600 text-sm">Épargne</p>
                      <p className="text-2xl font-bold text-green-900">850,000 CFA</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Budget Alimentation</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Tout ce dont vous avez besoin pour gérer vos finances
            </h2>
            <p className="text-xl text-blue-700 max-w-3xl mx-auto">
              Des fonctionnalités pensées pour les réalités financières sénégalaises
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-blue-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Ce que disent nos utilisateurs</h2>
            <p className="text-xl text-blue-700">Plus de 10,000 Sénégalais nous font confiance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-blue-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-blue-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-blue-900">{testimonial.name}</p>
                    <p className="text-sm text-blue-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à transformer votre gestion financière ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des milliers de Sénégalais qui ont déjà pris le contrôle de leurs finances
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3" asChild>
            <Link href="/signup">
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">MonBudget</h3>
              </div>
              <p className="text-blue-200">L'application de gestion financière pensée pour les Sénégalais.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <a href="#" className="hover:text-white">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Sécurité
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <a href="#" className="hover:text-white">
                    Centre d'aide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <a href="#" className="hover:text-white">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; 2024 MonBudget. Tous droits réservés. Fait avec ❤️ au Sénégal.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
