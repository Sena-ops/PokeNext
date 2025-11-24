"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  BarChart3,
  Shield,
  BookOpen,
  Heart,
  MapPin,
  GitBranch,
  Image,
  Scroll,
  Users,
  Target,
  Trophy,
  Swords,
  Cloud,
  Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const mainFeatures = [
  {
    icon: Layout,
    title: "Dashboard",
    description: "Painel central com todas as suas estatísticas e progresso",
    href: "/dashboard"
  },
  {
    icon: Sparkles,
    title: "AI Strategy Coach",
    description: "Professor Oak analisa seu time e dá sugestões estratégicas",
    href: "/ai-coach"
  },
  {
    icon: Swords,
    title: "Battle Simulator",
    description: "Simule batalhas Pokémon completas com cálculo de dano real",
    href: "/battle-sim"
  },
  {
    icon: Users,
    title: "Social Hub",
    description: "Compartilhe times e descubra estratégias da comunidade",
    href: "/social-hub"
  },
  {
    icon: Trophy,
    title: "Conquistas",
    description: "Desbloqueie achievements, ganhe XP e suba de nível",
    href: "/achievements"
  },
  {
    icon: Cloud,
    title: "Weather Events",
    description: "Pokémon e bônus baseados no clima real da sua região",
    href: "/weather-events"
  },
];

const encyclopediaFeatures = [
  {
    icon: BookOpen,
    title: "Move Encyclopedia",
    description: "Explore todos os movimentos com filtros e detalhes completos",
    href: "/moves"
  },
  {
    icon: Sparkles,
    title: "Ability Atlas",
    description: "Catálogo de habilidades com efeitos e Pokémon que as possuem",
    href: "/abilities"
  },
  {
    icon: Scroll,
    title: "Flavor & Lore",
    description: "Pokédex entries e história de cada Pokémon",
    href: "/flavor"
  },
];

const toolsFeatures = [
  {
    icon: Heart,
    title: "Breeding Planner",
    description: "Planeje criações com compatibilidade e egg moves",
    href: "/breeding"
  },
  {
    icon: MapPin,
    title: "Encounter Explorer",
    description: "Descubra onde encontrar cada Pokémon",
    href: "/explorer/encounters"
  },
  {
    icon: GitBranch,
    title: "Evolution Chains",
    description: "Visualize cadeias evolutivas completas",
    href: "/evolution"
  },
  {
    icon: Zap,
    title: "Encounter Simulator",
    description: "Simule encontros e veja probabilidades",
    href: "/encounter-sim"
  },
  {
    icon: Image,
    title: "Sprite Gallery",
    description: "Baixe sprites e artwork oficial",
    href: "/gallery"
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pokemon-red via-pokemon-black to-pokemon-red pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('/pokeball-pattern.svg')] opacity-10"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              PokéTeam Synergy
              <span className="block text-pokemon-yellow">Analyzer</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-200 mb-8"
            >
              Construa o time Pokémon perfeito com análise avançada de sinergia,
              cobertura de tipos e estratégia competitiva.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <Link href="/team-builder">
                <Button size="lg" className="bg-pokemon-yellow text-pokemon-black hover:bg-yellow-400 text-lg px-8">
                  Começar Agora
                </Button>
              </Link>
              <Link href="/team-analysis">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 text-lg px-8">
                  Ver Análise
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated Pokeball - otimizado com will-change */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-32 -right-32 w-96 h-96 opacity-10 will-change-transform"
          style={{ willChange: 'transform' }}
        >
          <div className="w-full h-full rounded-full border-8 border-white relative">
            <div className="absolute top-1/2 left-0 right-0 h-8 bg-white -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full border-8 border-pokemon-black"></div>
          </div>
        </motion.div>
      </section>

      {/* Main Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Recursos Principais
            </h2>
            <p className="text-xl text-muted-foreground">
              Construa e analise seu time perfeito
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {mainFeatures.map((feature, index) => (
              <Link key={feature.title} href={feature.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="h-full cursor-pointer hover:shadow-xl transition-all border-2 hover:border-pokemon-red">
                    <CardHeader>
                      <feature.icon className="w-12 h-12 text-pokemon-red mb-4" />
                      <CardTitle className="text-2xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Encyclopedia Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              Enciclopédia
            </h3>
            <p className="text-muted-foreground mb-6">
              Explore dados completos de moves, abilities e lore
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {encyclopediaFeatures.map((feature, index) => (
              <Link key={feature.title} href={feature.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="h-full cursor-pointer hover:shadow-xl transition-all hover:border-blue-500">
                    <CardHeader>
                      <feature.icon className="w-10 h-10 text-blue-600 mb-3" />
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Tools Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-600" />
              Ferramentas Avançadas
            </h3>
            <p className="text-muted-foreground mb-6">
              Simuladores, planejadores e exploradores
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {toolsFeatures.map((feature, index) => (
              <Link key={feature.title} href={feature.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="h-full cursor-pointer hover:shadow-xl transition-all hover:border-yellow-500">
                    <CardHeader className="p-4">
                      <feature.icon className="w-8 h-8 text-yellow-600 mb-2" />
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pokemon-red to-pokemon-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para Dominar?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de treinadores que já estão construindo times imbatíveis
          </p>
          <Link href="/team-builder">
            <Button size="lg" className="bg-pokemon-yellow text-pokemon-black hover:bg-yellow-400 text-lg px-8">
              Construir Meu Time
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

