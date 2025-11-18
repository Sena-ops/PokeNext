# PokéTeam Synergy Analyzer 🎮⚡

Uma aplicação Next.js 14 completa para construir e analisar times de Pokémon com foco em sinergia, cobertura de tipos e estratégia competitiva.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ✨ Funcionalidades

### 🏠 Homepage
- Hero section animada com gradiente estilo Pokéball
- Cards de features com animações em Framer Motion
- Design moderno e responsivo

### 🎨 Team Builder
- **Grid de 6 slots** para montar seu time
- **Busca inteligente** com autocomplete e debounce de 300ms
- **Visualização detalhada** de cada Pokémon com stats, tipos e sprites animados
- **Salvar/Carregar times** no localStorage
- **Exportar/Importar** times via JSON
- Interface drag-and-drop intuitiva

### 📊 Team Analysis
- **Score de Sinergia** (0-100) com indicadores visuais animados
- **Gráfico Radar** mostrando stats médias do time
- **Matriz de Cobertura de Tipos** (18x18) com heatmap colorido
- **Análise de Fraquezas** críticas do time
- **Recomendações** automáticas para melhorar o time

## 🚀 Tecnologias

- **Next.js 14** - App Router e Server Components
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Shadcn/ui** - Componentes de UI reutilizáveis
- **Framer Motion** - Animações fluidas
- **Recharts** - Gráficos interativos
- **Zustand** - Gerenciamento de estado
- **TanStack Query** - Cache e fetch de dados
- **PokeAPI** - Dados dos Pokémon

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Adicionar dependências adicionais necessárias
npm install next-themes @radix-ui/react-slot tailwindcss-animate

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

## 🎯 Como Usar

1. **Construir Time**: Acesse `/team-builder` e busque Pokémon pelo nome
2. **Adicionar ao Time**: Clique em um slot vazio e selecione um Pokémon
3. **Salvar Time**: Dê um nome ao seu time e clique em "Salvar Time"
4. **Analisar**: Vá para `/team-analysis` para ver análises detalhadas
5. **Exportar**: Copie o código JSON do seu time para compartilhar

## 🔍 Análise de Sinergia

A pontuação de sinergia é calculada baseada em:

- **Cobertura Ofensiva** (0-30 pontos): Quantos tipos o time consegue atingir com super efetividade
- **Fraquezas Defensivas** (-20 a 0 pontos): Penalização por vulnerabilidades críticas
- **Equilíbrio de Stats** (0-20 pontos): Balanceamento geral das estatísticas do time

## 🎨 Temas

A aplicação suporta temas **dark** e **light** com transições suaves. Use o botão no canto superior direito para alternar.

## 📱 Responsivo

Design mobile-first totalmente responsivo:
- Mobile: 1-2 colunas
- Tablet: 2-3 colunas
- Desktop: 3-6 colunas

## 🔧 Estrutura do Projeto

```
/app                    # Rotas e páginas Next.js
  /team-builder        # Página de construção de time
  /team-analysis       # Página de análise
/components            # Componentes React
  /ui                  # Componentes Shadcn
  /pokemon            # Componentes específicos de Pokémon
  /analysis           # Componentes de análise
/lib                   # Utilitários e helpers
  /api                # Clients de API
  /analysis           # Lógica de análise
/types                # Tipos TypeScript
/hooks                # Hooks customizados
/store                # Zustand stores
```

## 🎨 Paleta de Cores

- **Pokemon Red**: `#EE1515`
- **Pokemon Black**: `#222224`
- **Pokemon White**: `#F5F5F5`
- **Pokemon Yellow**: `#FFCB05`

## 📊 Type Chart

A aplicação inclui um type chart completo com todas as 18 tipos de Pokémon e suas efetividades.

## 🔮 Funcionalidades Futuras

- [ ] Sugestões de Pokémon baseadas em gaps de cobertura
- [ ] Comparação entre múltiplos times salvos
- [ ] Integração com dados de movimentos e habilidades
- [ ] Modo competitivo com tiers (OU, UU, etc)
- [ ] Compartilhamento de times via URL

## 📝 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🙏 Créditos

- Dados dos Pokémon: [PokeAPI](https://pokeapi.co/)
- Ícones: [Lucide React](https://lucide.dev/)
- UI Components: [Shadcn/ui](https://ui.shadcn.com/)

---

Feito com ❤️ e ⚡ por um treinador Pokémon

