# PokeNext - Complete Pokémon Team Analyzer 🎮⚡

Uma aplicação Next.js 14 completa e expandida para construir, analisar e explorar times de Pokémon com recursos avançados de informação, análise estratégica e simulação.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Tests](https://img.shields.io/badge/Tests-Vitest-yellow)

## ✨ Funcionalidades Principais

### 🏠 Homepage
- Hero section animada com gradiente estilo Pokéball
- Cards de features com animações em Framer Motion
- Design moderno e responsivo

### 🎨 Team Builder (`/team-builder`)
- **Grid de 6 slots** para montar seu time
- **Busca inteligente** com autocomplete e debounce de 300ms
- **Visualização detalhada** de cada Pokémon com stats, tipos e sprites animados
- **Salvar/Carregar times** no localStorage
- **Exportar/Importar** times via JSON
- Interface drag-and-drop intuitiva

### 📊 Team Analysis (`/team-analysis`)
- **Score de Sinergia** (0-100) com indicadores visuais animados
- **Gráfico Radar** mostrando stats médias do time
- **Matriz de Cobertura de Tipos** (18x18) com heatmap colorido
- **Análise de Fraquezas** críticas do time
- **Recomendações** automáticas para melhorar o time

## 🆕 Novas Features Avançadas

### 📖 Move Encyclopedia (`/moves`)
**Listagem completa de movimentos Pokémon**
- Paginação eficiente (20 moves por página)
- Filtros por tipo, damage class e power
- Busca por nome
- Cards visuais com informações principais
- Prefetch on hover para performance

**Página de Detalhes (`/moves/[name]`)**
- Efeito completo e descrição
- Power, accuracy, PP, priority
- Lista de Pokémon que aprendem o move
- Máquinas TM/HM por versão
- Flavor text do jogo

**PokeAPI Endpoints Usados:**
- `GET /move` - Lista de moves
- `GET /move/{name}` - Detalhes do move

### ✨ Ability Atlas (`/abilities`)
**Catálogo de habilidades Pokémon**
- Listagem paginada de todas as abilities
- Busca por nome
- Geração de origem
- Contagem de Pokémon que possuem cada ability

**Página de Detalhes (`/abilities/[name]`)**
- Efeito completo da habilidade
- Descrições em múltiplas versões
- Lista de Pokémon com ability regular vs. hidden
- Flavor text e informações adicionais

**PokeAPI Endpoints Usados:**
- `GET /ability` - Lista de abilities
- `GET /ability/{name}` - Detalhes da ability

### 🗺️ Encounter Explorer (`/explorer/encounters/[pokemon]`)
**Localizador de encontros e habitats**
- Todos os locais onde um Pokémon pode ser encontrado
- Métodos de encontro (Walking, Surfing, Fishing, etc.)
- Chances percentuais por versão
- Níveis mínimos e máximos
- Habitat natural do Pokémon

**PokeAPI Endpoints Usados:**
- `GET /pokemon/{id}/encounters` - Locais de encontro
- `GET /pokemon-species/{id}` - Habitat e espécie
- `GET /location-area/{id}` - Detalhes da área

### 🌳 Evolution Visualizer (`/evolution/[chainId]`)
**Grafo interativo de evolução**
- Visualização em árvore da cadeia evolutiva
- Triggers de evolução (level, item, trade, happiness, etc.)
- Sprites oficiais de cada estágio
- Links clicáveis para cada Pokémon
- Identificação de baby Pokémon
- Layout horizontal com múltiplos branches

**PokeAPI Endpoints Usados:**
- `GET /evolution-chain/{id}` - Cadeia evolutiva completa

### 💕 Breeding Planner (`/breeding`)
**Planejador de criação com lógica de compatibilidade**
- Seleção de dois pais com busca interativa
- **Cálculo de compatibilidade:**
  - Verificação de egg groups compartilhados
  - Suporte especial para Ditto
  - Identificação de Pokémon que não podem reproduzir (No Eggs group)
- **Egg Moves:**
  - Lista de moves que podem ser herdados
  - Identificação de qual pai possui cada move
  - Moves que ambos pais conhecem
- **Informações adicionais:**
  - Egg cycles para eclosão
  - Gender ratios com visualização gráfica
  - Espécie resultante

**PokeAPI Endpoints Usados:**
- `GET /pokemon-species/{id}` - Egg groups e breeding info
- `GET /pokemon/{id}` - Moves completos para cálculo de egg moves
- `GET /egg-group/{id}` - Informações do grupo (se necessário)

**Transformações de Dados:**
- Agregação de moves com `method=egg` de ambos os pais
- Cálculo combinatório de compatibilidade por egg groups
- Conversão de gender_rate (0-8) para porcentagens

### 🎯 Team Analysis Enhancement (`/team/suggest`)
**Sistema de auto-sugestão de times**
- **Análise de Roles:**
  - Sweeper (alto atk + speed)
  - Special Attacker (alto sp.atk + speed)
  - Tank (alto HP + defesas)
  - Wall (alta defesa física)
  - Balanced (stats equilibrados)
- **Type Coverage Score:**
  - Identifica gaps na cobertura de tipos
  - Sugere Pokémon que preenchem lacunas
  - Prioriza diversidade de tipos
- **Team Balance:**
  - Calcula variância de stats
  - Sugere Pokémon para equilibrar o time
- **Justificativas:**
  - Cada sugestão vem com explicação
  - Role identificado
  - Tipos que adiciona ao time
- **Rarity Bonus:**
  - Legendários e Mythicals recebem bonus
  - Baseado em total de stats (>580)

**PokeAPI Endpoints Usados:**
- `GET /pokemon` - Pool de Pokémon para sugestões
- `GET /type/{id}` - Damage relations para coverage

**Algoritmos Implementados:**
- Role scoring baseado em stats ponderados
- Coverage gap analysis
- Team balance variance calculation

### 🖼️ Sprite Gallery (`/gallery/[pokemon]`)
**Galeria completa de sprites e artwork**
- Categorias:
  - Official Artwork (alta resolução)
  - Game Sprites (front/back, default/shiny)
  - Gender differences (male/female variants)
  - Showdown sprites
- **Features:**
  - Filtro por categoria
  - Download individual de cada sprite
  - Grid responsivo
  - Lazy loading de imagens

**PokeAPI Endpoints Usados:**
- `GET /pokemon/{id}` - Todos os sprites disponíveis

### 📚 Flavor & Lore Hub (`/flavor/[pokemon]`)
**Central de lore e Pokédex entries**
- **Pokédex Entries:**
  - Flavor texts de todas as versões
  - Filtro por versão do jogo
  - Textos em inglês formatados
- **Informações da Espécie:**
  - Genus (e.g., "Seed Pokémon")
  - Badges especiais (Legendary, Mythical, Baby)
  - Capture rate
  - Base happiness
  - Growth rate
  - Habitat
- **Form Descriptions:**
  - Descrições de formas alternativas
  - Informações sobre variantes

**PokeAPI Endpoints Usados:**
- `GET /pokemon-species/{id}` - Flavor texts e metadata completa

### 🎲 Encounter Simulator (`/encounter-sim`)
**Simulador estatístico de encontros**
- **Configuração:**
  - Número de trials (100-10,000)
  - Seleção de versão do jogo
  - Método de encontro
- **Simulação:**
  - Algoritmo probabilístico baseado em encounter rates reais
  - Distribuição de níveis
  - Cálculo de shiny encounters
- **Visualização:**
  - Gráfico de barras (Recharts) com distribuição
  - Estatísticas detalhadas por Pokémon
  - Histogram de níveis
  - Média de nível encontrado
- **Resultados:**
  - Número de encontros por Pokémon
  - Probabilidade percentual
  - Range de níveis
  - Shinies encontrados (simulados)

**PokeAPI Endpoints Usados:**
- `GET /location-area/{id}` - Encontros e taxas


## 🚀 Tecnologias

- **Next.js 14** - App Router e Server Components
- **TypeScript** - Tipagem estática completa
- **Tailwind CSS** - Estilização utility-first
- **Shadcn/ui** - Componentes de UI reutilizáveis
- **Framer Motion** - Animações fluidas
- **Recharts** - Gráficos interativos 
- **Zustand** - Gerenciamento de estado
- **TanStack Query** - Cache, prefetch e fetch de dados
- **Vitest** - Framework de testes
- **PokeAPI** - Dados completos dos Pokémon

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Rodar testes
npm run test

# Rodar testes com UI
npm run test:ui

# Lint
npm run lint
```

## 🧪 Testes

Cobertura de testes implementada com Vitest:

### Testes de Utilitários
1. **`breeding.test.ts`** - Lógica de breeding
   - Compatibilidade de egg groups
   - Cálculo de egg moves
   - Caso especial do Ditto
   - Gender ratios
   
2. **`palette.test.ts`** - Extração de cores
   - Paleta de tipos
   - Gradientes
   - Contraste de cores
   - Ajuste de brightness

3. **`encounter-simulator.test.ts`** - Simulação probabilística
   - Distribuição de encontros
   - Cálculo de probabilidades
   - Validação de trials
   - Métodos de encontro

4. **`team-suggest.test.ts`** - Sugestões de time
   - Role identification
   - Type coverage analysis
   - Team balance calculation
   - Suggestion generation


## 🎯 Rotas Completas

### Navegação Principal
- `/` - Homepage
- `/team-builder` - Construtor de times
- `/team-analysis` - Análise de times

### Enciclopédia
- `/moves` - Listagem de moves
- `/moves/[name]` - Detalhes do move
- `/abilities` - Listagem de abilities  
- `/abilities/[name]` - Detalhes da ability

### Exploradores
- `/explorer/encounters/[pokemon]` - Locais de encontro
- `/evolution/[chainId]` - Cadeia evolutiva
- `/gallery/[pokemon]` - Galeria de sprites
- `/flavor/[pokemon]` - Lore e Pokédex entries

### Ferramentas
- `/breeding` - Planejador de breeding
- `/team/suggest` - Sugestões automáticas de time
- `/encounter-sim` - Simulador de encontros

## 📊 PokeAPI Integration

### Endpoints Utilizados

| Endpoint | Uso | Cache Strategy |
|----------|-----|----------------|
| `/pokemon` | Lista e detalhes de Pokémon | 1 hora (ISR) |
| `/pokemon-species` | Flavor text, egg groups, evolution chain | 1 hora (ISR) |
| `/move` | Lista e detalhes de moves | 1 hora (ISR) |
| `/ability` | Lista e detalhes de abilities | 1 hora (ISR) |
| `/evolution-chain` | Cadeias evolutivas | 1 hora (ISR) |
| `/pokemon/{id}/encounters` | Locais de encontro | 1 hora (ISR) |
| `/location-area` | Detalhes de áreas | 1 hora (ISR) |
| `/egg-group` | Grupos de ovos | 1 hora (ISR) |
| `/type` | Damage relations | 24 horas (ISR) |
| `/generation` | Listagem de gerações | 24 horas (ISR) |
| `/version-group` | Grupos de versões | 24 horas (ISR) |

### Cache & Performance
- **TanStack Query** para client-side caching
- **Next.js ISR** para páginas estáticas com revalidação
- **Prefetch on hover** em cards de Pokémon
- **Lazy loading** de imagens e componentes pesados

### Limitações & Defaults Configuráveis

#### Shiny Rate
- **Problema:** PokeAPI não fornece taxas de shiny
- **Solução:** Default configurável: 1/4096 (Gen 6+)
- **Documentação:** Claramente indicado na UI e README
- **Configuração:** Ajustável no Encounter Simulator

## 🎨 Design System

### Paleta de Cores
- **Pokemon Red**: `#EE1515`
- **Pokemon Black**: `#222224`
- **Pokemon White**: `#F5F5F5`
- **Pokemon Yellow**: `#FFCB05`

### Type Colors
Cada tipo tem cor oficial do Pokémon com contraste otimizado:
```typescript
TYPE_COLORS = {
  fire: { bg: '#F08030', text: '#FFFFFF' },
  water: { bg: '#6890F0', text: '#FFFFFF' },
  // ... 18 tipos com cores oficiais
}
```

### Componentes Reutilizáveis
- `TypeBadge` - Badge com cor do tipo
- `PokemonCard` - Card de Pokémon com prefetch
- `StatBar` - Barra de stat animada
- `TypeCoverageMatrix` - Heatmap de tipos
- `EvolutionGraph` - Grafo SVG de evolução
- `SpriteGallery` - Grid de sprites
- `FlavorPanel` - Painel de flavor texts

## 📱 Responsividade

Design mobile-first totalmente responsivo:
- **Mobile:** 1 coluna
- **Tablet:** 2-3 colunas  
- **Desktop:** 3-6 colunas

Breakpoints Tailwind:
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px

## 🔧 Estrutura do Projeto

```
/app                    # Rotas Next.js (App Router)
  /moves               # Move encyclopedia
  /abilities           # Ability atlas
  /explorer            # Encounters & habitats
  /evolution           # Evolution chains
  /breeding            # Breeding planner
  /team                # Team analysis & suggestions
  /gallery             # Sprite gallery
  /flavor              # Lore hub
  /encounter-sim       # Encounter simulator
/components            # Componentes React
  /ui                  # Shadcn components
  /pokemon             # Pokemon-specific components
  /analysis            # Analysis components
  /moves               # Move components (novo!)
  /abilities           # Ability components (novo!)
  /encounters          # Encounter components (novo!)
  /evolution           # Evolution components (novo!)
  /breeding            # Breeding components (novo!)
  /team                # Team components (novo!)
  /gallery             # Gallery components (novo!)
  /flavor              # Flavor components (novo!)
  /simulator           # Simulator components (novo!)
/lib                   # Utilitários e helpers
  /api                 # API clients
  /analysis            # Lógica de análise
  /utils               # Utility functions (novo!)
    - breeding.ts      # Breeding logic
    - palette.ts       # Color extraction
    - encounter-simulator.ts # Simulation engine
    - team-suggest.ts  # Team suggestion algorithm
  /constants           # Constantes
/types                 # TypeScript types
  - pokemon.ts         # Tipos principais
  - pokeapi.d.ts       # PokeAPI types (novo!)
/hooks                 # Hooks customizados
/store                 # Zustand stores
/__tests__             # Testes Vitest (novo!)
  /utils               # Testes de utilitários
```

## ✅ Checklist de QA

### Performance
- [ ] Lighthouse score >90 na homepage
- [ ] Lighthouse score >85 em páginas de Pokémon
- [ ] Prefetch funcionando em cards hover
- [ ] TanStack Query devtools mostrando cache hits
- [ ] Imagens com lazy loading
- [ ] Bundle size otimizado (<300KB gzipped)

### Accessibility
- [ ] Tab order lógico em todos os formulários
- [ ] ARIA labels em botões e inputs
- [ ] Contraste mínimo 4.5:1 (WCAG AA)
- [ ] Keyboard navigation completa
- [ ] Screen reader friendly
- [ ] Focus indicators visíveis

### Funcionalidade
- [ ] Todas as rotas carregam sem erro
- [ ] Busca de Pokémon funciona
- [ ] Team builder salva/carrega corretamente
- [ ] Breeding planner calcula compatibilidade
- [ ] Encounter simulator gera estatísticas
- [ ] Team suggest retorna 6 sugestões
- [ ] Filtros de moves/abilities funcionam
- [ ] Downloads de sprites funcionam

### Testes
- [ ] `npm run test` passa todos os testes
- [ ] Cobertura >80% em utilitários
- [ ] Testes de breeding compatibilidade passam
- [ ] Testes de simulador probabilístico passam
- [ ] Testes de palette extraction passam
- [ ] Testes de team suggest passam


## 🚀 Deploy

### Vercel (Recomendado)
```bash
vercel --prod
```

### Build Manual
```bash
npm run build
npm start
```
## 📝 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🙏 Créditos

- Dados dos Pokémon: [PokeAPI](https://pokeapi.co/)
- Ícones: [Lucide React](https://lucide.dev/)
- UI Components: [Shadcn/ui](https://ui.shadcn.com/)
- Charts: [Recharts](https://recharts.org/)
- Testing: [Vitest](https://vitest.dev/)

---

Feito com ❤️ e ⚡ por um treinador Pokémon

**Gotta analyze 'em all!** 🎮
