# Guia de Refatoração de UI/Design

Este documento orienta a equipe a refatorar a interface seguindo o design system da empresa, mantendo compatibilidade com Next.js, Nest.js (backend), TypeScript e o conjunto de componentes shadcn/ui.

## 1) Visão Geral do Projeto
- Frontend: Next.js + TypeScript
- Tema: `next-themes` com classes e tokens (CSS variables) definidos em `globals.css`
- Componentes: shadcn/ui em `src/components/ui` com tokens de tema (bg-card, text-muted-foreground, border-border etc.)
- Tipografia: Roboto via Google Fonts, variável `--font-roboto`

## 2) Arquitetura de Tema
- Provider global: ThemeProvider configurado em `src/app/layout.tsx` (atributo `class`), permitindo dark/light/system.
- Tokens do tema: definidos em `src/app/globals.css` (CSS variables mapeadas para Tailwind via `@theme inline`).
- Regra base: NUNCA usar cores fixas do Tailwind (ex.: `bg-white`, `text-gray-500`). SEMPRE usar tokens:
  - Fundo: `bg-background`, `bg-card`, `bg-popover`
  - Texto: `text-foreground`, `text-muted-foreground`, `text-popover-foreground`
  - Bordas: `border-border`
  - Acento/Primário: `bg-accent`, `text-accent-foreground`, `bg-primary`, `text-primary-foreground`

## 3) Diretrizes de UI
- Tipografia
  - Fonte base via Roboto (`--font-roboto`). Evitar definir famílias diretamente; confiar no body global.
- Espaçamentos
  - Usar escala do Tailwind (p-2, p-4, gap-4, etc.). Evitar valores customizados in-line.
- Borda e sombras
  - Bordas: `border border-border`
  - Sombras: manter padrão suave (`shadow-sm`, `shadow`) e consistentes.
- Interações
  - Hover/Focus: usar tokens (`hover:bg-accent hover:text-accent-foreground`, `focus-visible:ring-ring`).
- Ícones
  - `lucide-react`. Tamanho padrão 16–20px (`h-4 w-4` / `h-5 w-5`).

## 4) Componentes/Padrões Existentes
- Sidebar
  - Usa tokens e `next-themes` para alternância de tema.
  - Pesquisa, colapsar e navegação com `Collapsible` e `Button` variant="ghost".
- Process Page (ex.: Inputs/Outputs/Dashboard)
  - Cards com `bg-card`, cabeçalhos com `text-foreground`, descrição em `text-muted-foreground`.
  - Tabelas com cabeçalho `bg-muted`, zebra striping e hover.
- Dropdowns e Dialogs
  - Baseados em Radix + shadcn/ui; mantêm tokens e animações via classes utilitárias.
- Charts
  - `src/components/ui/chart.tsx` aplica tokens nas tooltips/legendas.

## 5) Regras de Refatoração
- Proibido
  - `bg-white`, `bg-gray-100`, `text-gray-*`, `border-gray-*`, cores hex/hsl fixas em classes.
- Obrigatório
  - Substituir por tokens: `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `border-border`.
  - Respeitar padrões shadcn/ui para estados (hover/focus/disabled).
- Tabelas
  - Cabeçalho: `TableHeader` com `bg-muted`.
  - Linhas: zebra leve `odd:bg-muted/40`, hover `hover:bg-muted/50`, números `tabular-nums`.
- Cards e Seções
  - Container: `rounded-lg border border-border bg-card shadow-sm`.
  - Header interno: `border-b border-border`, título `text-foreground`, descrição `text-muted-foreground`.

## 6) Checklist de Migração
1. Buscar ocorrências problemáticas e substituir:
   - `bg-white` → `bg-card`
   - `text-gray-500` → `text-muted-foreground`
   - `bg-gray-100` → `bg-muted`
   - `border-gray-*` → `border-border`
2. Padronizar uso de `Button`, `Input`, `Table` do diretório `components/ui`.
3. Garantir que tooltips, dialogs, dropdowns respeitam tokens (`bg-popover`, `text-popover-foreground`).
4. Validar dark/light: alternar tema e verificar contraste.

## 7) Exemplos de Implementação
- Card de seção com tabela

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export function ExampleSection({ rows }: { rows: Array<{ name: string; value: number }> }) {
  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-foreground">Section Title</CardTitle>
        <p className="text-sm text-muted-foreground">Section description.</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-right text-muted-foreground">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i} className="odd:bg-muted/40 hover:bg-muted/50 transition-colors">
                <TableCell className="text-foreground">{r.name}</TableCell>
                <TableCell className="text-right tabular-nums text-foreground">{r.value.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

## 8) Teste e Validação (Windows)
- Iniciar o servidor: `pnpm dev`
- Alternar tema via botão na Sidebar e validar contraste.
- Checar console do navegador e terminal por warnings/erros.

## 9) Estrutura de Pastas Relevante
- `src/app/layout.tsx`: Providers globais (tema, Auth, Toaster).
- `src/app/globals.css`: Variáveis de tema e base.
- `src/components/ui/*`: Biblioteca shadcn/ui.
- `src/app/(main)/*`: Páginas e layouts principais.

## 10) Padrões de Código
- TypeScript em todos os componentes.
- Imports absolutos via alias `@/`.
- Evitar lógica de tema inline; usar tokens e providers.

## 11) Critérios de Aceite
- Dark e Light apresentam contraste legível (WCAG AA para texto básico).
- Nenhuma classe de cor fixa do Tailwind nas páginas principais.
- Tabelas com zebra e hover padronizados.
- Componentes usam shadcn/ui com tokens.