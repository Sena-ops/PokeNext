# 🚀 PokeNext - Advanced Features

Aplicação Next.js avançada com 5 funcionalidades inovadoras usando a PokeAPI.

## ✨ Funcionalidades Implementadas

### 1. 🏆 Achievement System (Sistema de Conquistas)

Sistema completo de gamificação com XP, níveis e badges.

**Arquivos:**
- `/lib/achievements/achievement-system.ts` - Engine de conquistas
- `/hooks/useAchievements.ts` - Hook customizado
- `/components/achievements/AchievementPanel.tsx` - Painel principal
- `/components/achievements/AchievementCard.tsx` - Card de conquista
- `/components/achievements/AchievementToast.tsx` - Notificação animada
- `/components/achievements/ProfileCard.tsx` - Card de perfil do usuário
- `/app/achievements/page.tsx` - Página de conquistas

**Conquistas Disponíveis:**
- **Builder**: Primeiros Passos, Mestre dos Times, Especialista de Tipos, Time Arco-Íris, etc.
- **Battler**: Primeira Vitória, Imparável (5 wins), Invencível (10 wins), Veterano
- **Social**: Compartilhando Estratégias, Time Popular, Time Viral, Time da Semana
- **Collector**: Início da Jornada, Colecionador, Mestre da Pokédex, Nostálgico
- **Explorer**: Observador do Clima, Mestre do Clima, Aluno do Professor Oak

**Sistema de XP:**
- 100 XP = 1 nível
- Título muda conforme o nível (Novato → Júnior → Veterano → Ace → Líder → Campeão → Mestre)
- Progresso visual com barra animada
- Pontos por categoria

### 2. 🤖 AI Strategy Coach

Professor Oak como coach virtual que analisa times e dá sugestões estratégicas.

**Arquivos:**
- `/lib/ai-coach/strategy-engine.ts` - Engine de análise estratégica
- `/components/ai-coach/AICoachPanel.tsx` - Interface de chat
- `/components/ai-coach/AnalysisCard.tsx` - Cards de análise detalhada
- `/app/ai-coach/page.tsx` - Página do coach

**Análises Fornecidas:**
- **Team Score**: Pontuação de 0-100
- **Fraquezas**: Tipos críticos/altos/médios/baixos com Pokémon afetados
- **Pontos Fortes**: Cobertura de tipos do time
- **Role Balance**: Distribuição de Sweepers, Tanks, Speedsters, etc.
- **Sinergias**: Combinações efetivas entre Pokémon
- **Estratégia de Batalha**: Recomendações táticas
- **Counter Teams**: Times perigosos e contra-estratégias

**Interface de Chat:**
- Perguntas rápidas pré-definidas
- Respostas contextuais do Professor Oak
- Análise em tempo real ao mudar o time
- Histórico de conversas persistente

### 3. ⚔️ Battle Simulator

Sistema completo de simulação de batalhas Pokémon.

**Arquivos:**
- `/lib/battle/battle-engine.ts` - Engine de batalha
- `/components/battle/BattleSimulator.tsx` - Interface de batalha
- `/app/battle-sim/page.tsx` - Página de simulação

**Funcionalidades:**
- **Cálculo de Dano Real**: Fórmula oficial de Pokémon (Gen 5+)
- **Type Effectiveness**: Matriz completa de efetividade
- **STAB**: Same Type Attack Bonus (1.5x)
- **Critical Hits**: 6.25% de chance
- **Weather Effects**: Boost de Rain/Sun em tipos específicos
- **Speed & Priority**: Ordem de ataques baseada em velocidade e prioridade
- **Battle Log**: Registro completo de todos os eventos
- **Auto Simulate**: Modo automático com controle de velocidade (1x, 2x, 4x)
- **Health Bars**: Barras de HP animadas estilo jogo
- **Battle History**: Histórico de batalhas no perfil

### 4. 👥 Social Hub

Centro social para compartilhar e descobrir times da comunidade.

**Arquivos:**
- `/lib/social/team-sharing.ts` - Sistema de compartilhamento
- `/components/social/TeamCard.tsx` - Card de time compartilhado
- `/components/social/TeamShowcase.tsx` - Galeria de times
- `/app/social-hub/page.tsx` - Hub social

**Funcionalidades:**
- **Team Code**: Código único para cada time (formato base36)
- **Share Options**: Twitter, Discord, QR Code
- **Like System**: Sistema de curtidas com localStorage
- **Tags Automáticas**: Tags geradas baseadas em tipos (mono-type, balanced, etc.)
- **Filtros**: Por nome, autor, tipo, data
- **Ordenação**: Recente, Popular, Em Alta
- **Team of the Week**: Time mais votado da semana
- **Try Team**: Carregar time de outro usuário

### 5. 🌦️ Weather Events

Sistema de eventos baseados no clima real.

**Arquivos:**
- `/lib/weather/weather-pokemon.ts` - Engine de clima
- `/components/weather/WeatherWidget.tsx` - Widget de clima
- `/app/weather-events/page.tsx` - Página de eventos

**Funcionalidades:**
- **API de Clima Real**: Integração com OpenWeatherMap
- **Pokémon do Dia**: Seleção baseada no clima atual
- **Type Boosts**: Bônus de +20% para tipos específicos:
  - ☀️ Clear → Fire, Grass
  - 🌧️ Rain → Water, Electric
  - ❄️ Snow → Ice
  - ☁️ Clouds → Flying, Dragon
  - ⛈️ Thunderstorm → Electric
- **Weather Events**: Eventos especiais de 1 hora
- **Auto Refresh**: Atualização a cada 30 minutos
- **Location-Based**: Baseado em coordenadas (ou modo demo)

## 🎯 Dashboard Principal

Hub central que integra todas as funcionalidades.

**Arquivo:** `/app/dashboard/page.tsx`

**Seções:**
- **Profile Card**: Avatar, nível, XP, título, quick stats
- **Weather Widget**: Clima atual e Pokémon do dia
- **Quick Actions**: Atalhos para todas as features
- **Current Team**: Preview do time atual
- **Battle History**: Últimas batalhas e win rate
- **Activity Feed**: Feed de atividades recentes

## 🗄️ Store Global

**Arquivo:** `/store/app-store.ts`

Gerencia todo o estado da aplicação:
```typescript
interface AppState {
  userProfile: UserProfile;
  battleHistory: Battle[];
  achievements: Achievement[];
  weatherData: WeatherData | null;
  sharedTeams: SharedTeam[];
  teamVotes: TeamVote[];
  coachHistory: ChatMessage[];
}
```

**Persistência:** Usa Zustand com middleware `persist` para salvar no localStorage.

## 📊 Tipos TypeScript

**Arquivo:** `/types/app.ts`

Tipos completos para:
- Achievement System
- Battle Simulator
- Social Hub
- AI Coach
- Weather Events
- Notifications

## 🎨 Design & Animações

**Bibliotecas Utilizadas:**
- **Framer Motion**: Todas as animações e transições
- **Tailwind CSS**: Estilos responsivos
- **Shadcn/ui**: Componentes base
- **Recharts**: Gráficos radar no AI Coach
- **Lucide Icons**: Ícones modernos
- **QRCode**: Geração de QR codes
- **Canvas Confetti**: Efeito de confetti nas conquistas

**Padrões de Design:**
- Skeleton loaders durante carregamento
- Micro-interações em todos os botões
- Gradientes animados para elementos especiais
- Shine effects em conquistas desbloqueadas
- Particle effects para ações especiais
- Dark mode nativo
- Cores vibrantes no tema escuro

## 🔧 Configuração

### Dependências Instaladas

```bash
npm install canvas-confetti qrcode @radix-ui/react-progress
```

### Variáveis de Ambiente

Crie `.env.local`:

```env
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Nota:** O Weather Events funciona sem API key (modo demo com clima aleatório).

## 🚀 Como Usar

### Iniciar Desenvolvimento

```bash
npm run dev
```

### Testar Funcionalidades

1. **Achievements**: Crie times, vença batalhas para desbloquear
2. **AI Coach**: Monte um time e peça análise
3. **Battle Simulator**: Inicie uma batalha com seu time
4. **Social Hub**: Compartilhe seu time e explore outros
5. **Weather Events**: Veja o clima atual e Pokémon especiais

## 📁 Estrutura de Arquivos

```
/app
  /achievements     → Página de conquistas
  /ai-coach         → AI Strategy Coach
  /battle-sim       → Battle Simulator
  /social-hub       → Social Hub
  /weather-events   → Weather Events
  /dashboard        → Dashboard principal

/components
  /achievements     → Componentes de conquistas
  /ai-coach         → Componentes do coach
  /battle           → Componentes de batalha
  /social           → Componentes sociais
  /weather          → Componentes de clima
  /ui               → Componentes base (shadcn)

/lib
  /achievements     → Sistema de conquistas
  /ai-coach         → Engine de estratégia
  /battle           → Engine de batalha
  /social           → Sistema de sharing
  /weather          → Sistema de clima

/hooks
  useAchievements.ts → Hook de conquistas

/store
  app-store.ts      → Store global Zustand
  team-store.ts     → Store de times (existente)

/types
  app.ts            → Tipos das novas features
  pokemon.ts        → Tipos existentes
```

## 🎮 Funcionalidades Extras

### Hooks Customizados

- `useAchievements()`: Gerencia conquistas, XP, níveis
  - Verifica automaticamente novas conquistas
  - Retorna estatísticas completas
  - Gerencia notificações

### Sistema de Notificações

- Toast animado para conquistas
- Confetti effect ao desbloquear
- Auto-dismiss após 5 segundos
- Múltiplos toasts empilhados

### Gamificação Completa

- Sistema de XP e níveis
- Títulos progressivos
- Conquistas em 5 categorias
- Tracking de estatísticas
- Profile card visual

## 🔮 Próximas Melhorias Sugeridas

1. **Multiplayer**: Batalhas online real-time
2. **Tournaments**: Sistema de torneios
3. **Team Import**: Importar times do Showdown
4. **Move Learning**: Sistema de aprendizado de moves
5. **IV/EV Calculator**: Calculadora de stats
6. **Breeding Chains**: Cadeias de breeding otimizadas
7. **Damage Calculator**: Calculadora avançada
8. **Replay System**: Sistema de replay de batalhas
9. **Voice Coach**: Narração por voz do Professor Oak
10. **Mobile App**: PWA ou React Native

## 📝 Notas Técnicas

### Performance

- React Query para cache da PokeAPI
- Lazy loading de imagens
- Memoização de cálculos pesados
- Debounce em buscas
- Virtual scrolling para listas grandes

### Acessibilidade

- ARIA labels em todos os botões
- Keyboard navigation
- Focus visible
- Alt text em imagens
- Contraste adequado

### SEO

- Metadata em todas as páginas
- Open Graph tags
- Sitemap
- Robots.txt

## 🤝 Contribuindo

Features implementadas seguem os padrões:
- TypeScript strict mode
- ESLint rules
- Prettier formatting
- Component-driven architecture
- Separation of concerns

## 📄 Licença

MIT License - Veja LICENSE para detalhes.

---

**Desenvolvido com ❤️ usando Next.js 14, TypeScript, Tailwind CSS e PokeAPI**
