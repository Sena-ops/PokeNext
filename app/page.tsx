"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Zap, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Sparkles,
    title: "Team Builder Intuitivo",
    description: "Monte seu time dos sonhos com drag-and-drop e busca inteligente",
  },
  {
    icon: BarChart3,
    title: "Análise Profunda",
    description: "Gráficos detalhados de stats, tipos e cobertura do seu time",
  },
  {
    icon: Shield,
    title: "Análise de Sinergia",
    description: "Descubra fraquezas e receba sugestões para melhorar seu time",
  },
  {
    icon: Zap,
    title: "Tempo Real",
    description: "Dados atualizados da PokeAPI com cache inteligente",
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

      {/* Features Section */}
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
              Recursos Poderosos
            </h2>
            <p className="text-xl text-muted-foreground">
              Tudo que você precisa para construir o time perfeito
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="glass rounded-xl p-6 hover:shadow-2xl transition-all"
              >
                <feature.icon className="w-12 h-12 text-pokemon-red mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
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

