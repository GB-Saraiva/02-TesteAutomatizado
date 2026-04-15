# Documento de Entregáveis — Automação de Testes com Playwright

**Aluno(a):** _Gabriel Saraiva Carvalho_  
**Data:** _12_/_04_/_2026_  
**Repositório (fork):** `https://github.com/gb-saraiva/02-TesteAutomatizado`  
**GitHub Pages:** `https://<seu-usuario>.github.io/02-TesteAutomatizado/`

---

## Entregável 1 — Fork do Repositório e GitHub Pages

| Item | Valor |
|------|-------|
| **URL do fork no GitHub** | `https://github.com/gb-saraiva/02-TesteAutomatizado` |
| **URL do site no GitHub Pages** | `https://gb-saraiva.github.io/02-TesteAutomatizado/` |
| **Site está acessível e funcional?** | ☑ Sim / ☐ Não |

**Evidência:** ![alt text](/images/image.png)

---

## Entregável 2 — Projeto Playwright com Testes

### 2.1 Teste gerado pelo Codegen

| Item | Detalhes |
|------|----------|
| **Arquivo** | `testes-playwright/tests/qs-academico-codegen.spec.ts` |
| **Ações gravadas** | ☑ Cadastro de "Ana Silva" (8, 7, 9) |
|                     | ☑ Cadastro de "Carlos Lima" (5, 4, 6) |
|                     | ☑ Busca por "Ana" |
|                     | ☑ Exclusão do segundo aluno |
| **Teste executa com sucesso?** | ☑ Sim / ☐ Não |

**Reflexão sobre o Codegen:** _(Que tipo de seletores o Codegen utilizou? São os mais indicados? Justifique.)_

> O Codegen utilizou predominantemente o seletor getByRole(), que é baseado em acessibilidade e está entre os recomendados pelo README. No entanto, para os campos de formulário, ele escolheu os roles técnicos textbox e spinbutton, como em getByRole('spinbutton', { name: 'Nota 1' }), quando o mais indicado para esse caso seria o getByLabel(), que associa o seletor diretamente ao <*label*> do campo e resulta em um código mais legível, como getByLabel('Nota 1'). Para os botões, o uso de getByRole('button', { name: '...' }) está correto e alinhado com as boas práticas. Portanto, os seletores gerados são funcionalmente válidos por não dependerem de classes CSS frágeis, mas não são os mais indicados para campos de formulário, pois o README orienta o uso de getByLabel() nesse contexto por ser mais expressivo e igualmente resiliente a mudanças visuais.

### 2.2 Testes escritos manualmente

| Item | Detalhes |
|------|----------|
| **Arquivo** | `testes-playwright/tests/qs-academico.spec.ts` |

**Checklist dos testes implementados:**

| # | Teste | Implementado | Passa? |
|---|-------|:------------:|:------:|
| 1 | Cadastrar aluno com dados válidos | ☑ | ☑ Sim / ☐ Não |
| 2 | Exibir mensagem de sucesso após cadastro | ☑ | ☑ Sim / ☐ Não |
| 3 | Rejeitar cadastro sem nome | ☑ | ☑ Sim / ☐ Não |
| 4 | Calcular a média aritmética das três notas | ☑ | ☐ Sim / ☑ Não |
| 5 | Validação de notas fora do intervalo (0–10) | ☑ | ☑ Sim / ☐ Não |
| 6 | Busca por nome (filtro) | ☑ | ☑ Sim / ☐ Não |
| 7 | Exclusão individual de aluno | ☑ | ☑ Sim / ☐ Não |
| 8 | Estatísticas (totais por situação) | ☑ | ☑ Sim / ☐ Não |
| 9 | Situação — Aprovado (média ≥ 7) | ☑ | ☑ Sim / ☐ Não |
| 10 | Situação — Reprovado (média < 5) | ☑ | ☑ Sim / ☐ Não |
| 11 | Situação — Recuperação (média ≥ 5 e < 7) | ☑ | ☑ Sim / ☐ Não |
| 12 | Múltiplos cadastros (3 alunos → 3 linhas) | ☑ | ☑ Sim / ☐ Não |

---

## Entregável 3 — Relatório HTML do Playwright

### 3.1 Relatório ANTES da correção do defeito

**Evidência:** ![alt text](/images/erros_capturados.png)

| Métrica | Valor (qs-academico) |
|---------|-------|
| **Total de testes** | 60 |
| **Testes aprovados (passed)** | 57 |
| **Testes reprovados (failed)** | 3 |
| **Navegadores testados** | 3 |

### 3.2 Relatório DEPOIS da correção do defeito

**Evidência:** ![alt text](/images/imageCorrigido.png)

| Métrica | Valor (qs-academico) |
|---------|-------|
| **Total de testes** | 60 |
| **Testes aprovados (passed)** | 60 |
| **Testes reprovados (failed)** | 0 |
| **Navegadores testados** | 3 |

---

## Entregável 4 — Registro do Defeito Encontrado

| Campo | Descrição |
|-------|-----------|
| **Título do defeito** | Cálculo da média ignora a terceira nota |
| **Severidade** | ☑ Crítica / ☐ Alta / ☐ Média / ☐ Baixa |
| **Componente afetado** | função `calcularMedia` em `docs/js/app.js` |
| **Passos para reproduzir** | 1. Acessar o site em https://gb-saraiva.github.io/02-TesteAutomatizado/
|                            | 2. Preencher o campo "Nome do Aluno" com qualquer nome|
|                            | 3. Preencher Nota 1 = 8, Nota 2 = 6, Nota 3 = 10|
|                            | 4. Clicar em "Cadastrar" e observar o valor exibido na coluna "Média"|
| **Resultado esperado** | A média exibida deve ser 8.00, pois (8 + 6 + 10) / 3 = 8.00 |
| **Resultado obtido** | A média exibida é 7.00, pois o sistema calcula apenas (8 + 6) / 2, ignorando a Nota 3 |
| **Teste(s) que revelaram o defeito** | deve calcular a média aritmética das três notas (Grupo: Cálculo de Média) |
| **Evidência visual** | ![alt text](/images/erros_capturados.png) |

### Análise do Trace Viewer

| Aspecto | Observação |
|---------|------------|
| **Em qual asserção o teste falhou?** | await expect(celulaMedia).toHaveText('8.00') |
| **Valor esperado** | 8.00 |
| **Valor obtido** | 7.00 |
| **Screenshot do momento da falha** | _(inserir)_ |

### Exemplo de cálculo demonstrando o defeito

| Notas inseridas | Média esperada (correta) | Média exibida (com defeito) | Diferença |
|:---------------:|:------------------------:|:---------------------------:|:---------:|
| N1=8, N2=7, N3=10 | 8.33 | 7.50 | -0.83 |
| N1=6, N2=8, N3=0 | 4.66 | 7.00 | -2.34 |
| N1=7, N2=7, N3=7 | 7.00 | 7.00 | 0.00 (defeito mascarado) |

---

## Entregável 5 — Correção do Defeito

| Item | Detalhes |
|------|----------|
| **Arquivo corrigido** | `docs/js/app.js` |
| **Função corrigida** | `calcularMedia` |
| **Código original (com defeito)** | `return (nota1 + nota2) / 2;` |
| **Código corrigido** | `return (nota1 + nota2 + nota3) / 3;` |
| **Hash do commit** | `4fd6a47533e06e64f6230049ff8c4570e6c5d3ae` |
| **Mensagem do commit** | `Corrige cálculo da média aritmética para incluir a terceira nota` |

**Validação pós-correção:**

- ☑  Todos os testes passam após a correção
- ☑  O site no GitHub Pages foi atualizado (commit + push)
- ☑  O relatório HTML mostra 100% de aprovação

---

## Checklist Final de Entrega

| # | Entregável | Concluído |
|---|------------|:---------:|
| 1 | Fork do repositório + GitHub Pages funcionando | ☑ |
| 2 | Projeto Playwright com todos os testes (`qs-academico.spec.ts` e `qs-academico-codegen.spec.ts`) | ☑ |
| 3 | Screenshots/PDF do relatório HTML (antes e depois da correção) | ☑ |
| 4 | Registro do defeito encontrado (preenchido acima) | ☑ |
| 5 | Commit com a correção do defeito em `docs/js/app.js` | ☑ |
