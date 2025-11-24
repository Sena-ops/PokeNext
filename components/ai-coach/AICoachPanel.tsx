"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeamStore } from '@/store/team-store';
import { useAppStore } from '@/store/app-store';
import { StrategyEngine } from '@/lib/ai-coach/strategy-engine';
import { ChatMessage } from '@/types/app';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, RotateCcw, BookOpen } from 'lucide-react';
import { AnalysisCard } from './AnalysisCard';

const professorOakAvatar = '👨‍🔬';

const quickQuestions = [
  'Analise meu time atual',
  'Qual a maior fraqueza do time?',
  'Como posso melhorar a defesa?',
  'Sugira mudanças estratégicas',
  'Que tipos devo adicionar?',
];

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'coach',
  content:
    'Olá, treinador! Eu sou o Professor Oak, seu assistente de estratégia Pokémon. Estou aqui para analisar seu time e dar sugestões de como melhorar! \n\nPosso analisar cobertura de tipos, balanceamento de roles, sinergias e muito mais. Como posso ajudar hoje?',
  timestamp: new Date().toISOString(),
};

export function AICoachPanel() {
  const { currentTeam } = useTeamStore();
  const { coachHistory, addCoachMessage, clearCoachHistory } = useAppStore();
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (coachHistory.length > 0) {
      setMessages([welcomeMessage, ...coachHistory]);
    }
  }, [coachHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    addCoachMessage(userMessage);
    setInput('');
    setIsAnalyzing(true);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Analyze team and generate response
    const analysis = StrategyEngine.analyzeTeam(currentTeam);
    const response = generateResponse(content.toLowerCase(), analysis);

    const coachMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'coach',
      content: response,
      timestamp: new Date().toISOString(),
      analysis: content.toLowerCase().includes('analise') ? analysis : undefined,
    };

    setMessages((prev) => [...prev, coachMessage]);
    addCoachMessage(coachMessage);
    setIsAnalyzing(false);
  };

  const generateResponse = (query: string, analysis: any): string => {
    const teamSize = currentTeam.filter((p) => p !== null).length;

    if (teamSize === 0) {
      return 'Você ainda não tem Pokémon no seu time! Adicione alguns Pokémon primeiro para eu poder analisar.';
    }

    if (query.includes('analise') || query.includes('analyze')) {
      return `Analisando seu time de ${teamSize} Pokémon...\n\n✅ **Pontuação geral:** ${analysis.teamScore}/100\n\nVeja a análise detalhada abaixo!`;
    }

    if (query.includes('fraqueza') || query.includes('weakness')) {
      if (analysis.weaknesses.length === 0) {
        return 'Excelente! Seu time não tem fraquezas críticas no momento.';
      }

      const topWeakness = analysis.weaknesses[0];
      return `Sua maior fraqueza é contra o tipo **${topWeakness.type}**, que afeta ${topWeakness.count} dos seus Pokémon (${topWeakness.affectedPokemon.join(', ')}).\n\n💡 **Sugestão:** Adicione um Pokémon resistente ou imune a ${topWeakness.type}, como tipos que resistam a esse elemento.`;
    }

    if (query.includes('defesa') || query.includes('defense')) {
      const tanks = analysis.roleBalance.physicalTanks + analysis.roleBalance.specialTanks;
      if (tanks === 0) {
        return 'Seu time não tem tanks defensivos! 🛡️\n\nConsidere adicionar Pokémon com alta defesa e HP, como Blissey, Toxapex, ou Ferrothorn. Eles podem absorver dano e dar sustentabilidade ao time.';
      }

      return `Você tem ${tanks} tank(s) no time. ${analysis.roleBalance.recommendation}\n\nPara melhorar ainda mais a defesa, foque em Pokémon com boa distribuição de stats defensivos e resistências de tipo variadas.`;
    }

    if (query.includes('tipo') || query.includes('type')) {
      const missingTypes = [
        'water',
        'fire',
        'grass',
        'electric',
        'ice',
        'fighting',
        'poison',
        'ground',
        'flying',
        'psychic',
        'bug',
        'rock',
        'ghost',
        'dragon',
        'dark',
        'steel',
        'fairy',
      ].filter(
        (type) => !analysis.strengths.find((s: any) => s.type === type)
      );

      if (missingTypes.length === 0) {
        return 'Impressionante! Você tem uma cobertura de tipos muito boa!';
      }

      return `Seu time poderia se beneficiar adicionando os seguintes tipos: **${missingTypes.slice(0, 3).join(', ')}**\n\nIsso aumentaria sua cobertura ofensiva e daria mais opções contra diferentes oponentes.`;
    }

    if (query.includes('sugest') || query.includes('melhor') || query.includes('mudan')) {
      if (analysis.suggestions.length === 0) {
        return 'Seu time está bem equilibrado! Continue refinando as estratégias e testando em batalhas.';
      }

      const topSuggestion = analysis.suggestions[0];
      return `📋 **Principal sugestão:**\n\n${topSuggestion.title}\n\n${topSuggestion.description}\n\n**Impacto esperado:** +${topSuggestion.expectedImpact} pontos\n\n${topSuggestion.reason}`;
    }

    // Default response
    return `Hmm, interessante pergunta! Com base no seu time atual:\n\n🎯 **Pontuação:** ${analysis.teamScore}/100\n⚠️ **Fraquezas:** ${analysis.weaknesses.length} tipos problemáticos\n✨ **Sinergias:** ${analysis.synergies.length} combinações detectadas\n\nTente perguntar especificamente sobre fraquezas, defesa, tipos ou sugestões para respostas mais detalhadas!`;
  };

  const handleReset = () => {
    setMessages([welcomeMessage]);
    clearCoachHistory();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
      {/* Chat Panel */}
      <Card className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{professorOakAvatar}</div>
            <div>
              <h3 className="font-bold text-lg">Professor Oak</h3>
              <p className="text-sm text-muted-foreground">AI Strategy Coach</p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={handleReset} title="Limpar conversa">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-pokemon-blue text-white'
                      : 'bg-muted'
                  }`}
                >
                  {message.role === 'coach' && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{professorOakAvatar}</span>
                      <Badge variant="secondary" className="text-xs">
                        Coach
                      </Badge>
                    </div>
                  )}

                  <div className="prose dark:prose-invert prose-sm max-w-none">
                    <p className="whitespace-pre-line m-0">{message.content}</p>
                  </div>

                  {message.analysis && (
                    <div className="mt-3 text-xs opacity-80">
                      📊 Análise detalhada disponível no painel ao lado
                    </div>
                  )}

                  <div className="text-xs opacity-60 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-sm">Professor Oak está analisando...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="p-3 border-t bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-medium text-muted-foreground">Perguntas rápidas:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(question)}
                disabled={isAnalyzing}
                className="text-xs"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre estratégia, fraquezas, sugestões..."
              disabled={isAnalyzing}
            />
            <Button type="submit" disabled={!input.trim() || isAnalyzing} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>

      {/* Analysis Panel */}
      <div className="overflow-y-auto h-full">
        {messages.findLast((m) => m.analysis)?.analysis ? (
          <AnalysisCard analysis={messages.findLast((m) => m.analysis)!.analysis!} />
        ) : (
          <Card className="p-12 text-center h-full flex flex-col items-center justify-center">
            <Sparkles className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">Análise Detalhada</h3>
            <p className="text-muted-foreground max-w-md">
              Peça uma análise completa do seu time para ver estatísticas detalhadas,
              fraquezas, sinergias e sugestões estratégicas aqui.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
