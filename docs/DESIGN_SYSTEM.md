# Design System — Aero Imports

Identidade visual exclusiva, pensada para transmitir precisão, tecnologia
e confiança — o mesmo território sensorial do produto que a marca vende
(voo, telemetria, ótica, engenharia de precisão).

## Paleta

| Token          | Hex        | Uso                                          |
|----------------|------------|-----------------------------------------------|
| `ink`          | `#0B0F14`  | Fundo escuro (hero, rodapé, admin)            |
| `aero` (700)   | `#0E3A5F`  | Cor primária da marca (azul premium)          |
| `signal`       | `#2C7BE0`  | Ações, links, destaques (azul metálico vivo)  |
| `steel`        | `#7C8B9A`  | Texto secundário, linhas, ícones inativos     |
| `fog`          | `#EEF1F4`  | Fundos claros de seção                        |
| `cloud`        | `#FFFFFF`  | Fundo principal / texto sobre `ink`           |

Regra: nunca usar preto puro (`#000`) ou branco puro sobre grandes áreas —
sempre `ink`/`cloud` para manter a sensação "premium", não "template".

## Tipografia

- **Display — Space Grotesk**: usada apenas em títulos grandes (H1/H2) e no
  logotipo provisório. Geométrica, técnica, remete a instrumentação —
  usada com moderação, nunca em blocos de texto.
- **Corpo — Inter**: leitura confortável em parágrafos, formulários, UI.
- **Utilitária — JetBrains Mono**: especificações técnicas de produto
  (peso, alcance, resolução), preços parcelados, códigos SKU e labels de
  telemetria (ver "Elemento de assinatura"). Reforça a leitura de "ficha
  técnica de precisão" sem parecer decorativo.

## Elemento de assinatura — "Flight Trace"

Uma linha fina que se desenha ao rolar a página (como um traçado de
telemetria/rota de voo), com um marcador que avança e pequenas legendas
no estilo `ALT · 120M` / `LAT 25.43° S` entre seções. Não é decoração
genérica: é uma referência direta ao HUD de voo de um drone DJI, ligando
a UI diretamente ao produto vendido. Usado com moderação — no máximo
1–2 vezes por página, nunca como padrão repetido em todo card.

Implementado em `src/components/ui/FlightTrace.tsx`.

## Movimento

- Reveal suave (fade + translateY 24px) ao entrar na viewport.
- Parallax leve (≤ 40px) apenas no hero.
- Hover em cards de produto: leve elevação (`shadow-elevate`) + zoom de
  imagem 1.04x — nunca girar, nunca exagerar.
- `prefers-reduced-motion` sempre respeitado (ver `globals.css`).

## Grid & espaçamento

- Largura máxima de conteúdo: `1440px`.
- Respiro generoso entre seções: mínimo `py-24` (desktop) / `py-16` (mobile).
- Nunca mais que 2 níveis de sombra simultâneos na mesma tela.
