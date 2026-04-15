import { test, expect } from "@playwright/test";

test.describe("QS Acadêmico — Testes do Sistema de Notas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  // ========== GRUPO 1: Cadastro de Alunos ==========

  test.describe("Cadastro de Alunos", () => {
    // ===== Validações =====

    test("não deve cadastrar aluno sem nome", async ({ page }) => {
      await page.getByLabel("Nota 1").fill("7");
      await page.getByLabel("Nota 2").fill("8");
      await page.getByLabel("Nota 3").fill("6");

      await page.getByRole("button", { name: "Cadastrar" }).click();

      await expect(
        page.locator("#tabela-alunos tbody td.texto-central"),
      ).toBeVisible();
    });

    test("deve rejeitar o cadastro de aluno com nota maior que 10", async ({
      page,
    }) => {
      await page.getByLabel("Nome do Aluno").fill("Aluno Inválido");

      await page.getByLabel("Nota 1").fill("11");
      await page.getByLabel("Nota 2").fill("5");
      await page.getByLabel("Nota 3").fill("5");

      await page.getByRole("button", { name: "Cadastrar" }).click();

      await expect(page.getByText("Nenhum aluno cadastrado.")).toBeVisible();
    });

    test("deve rejeitar o cadastro de aluno com nota negativa", async ({
      page,
    }) => {
      await page.getByLabel("Nome do Aluno").fill("Nota Negativa");
      await page.getByLabel("Nota 1").fill("-1");
      await page.getByLabel("Nota 2").fill("5");
      await page.getByLabel("Nota 3").fill("5");

      await page.getByRole("button", { name: "Cadastrar" }).click();

      await expect(page.getByText("Nenhum aluno cadastrado.")).toBeVisible();
    });

    // ===== Fluxo principal =====

    test("deve cadastrar um aluno com dados válidos", async ({ page }) => {
      await page.getByLabel("Nome do Aluno").fill("João Silva");
      await page.getByLabel("Nota 1").fill("7");
      await page.getByLabel("Nota 2").fill("8");
      await page.getByLabel("Nota 3").fill("6");

      await page.getByRole("button", { name: "Cadastrar" }).click();

      const linhas = page.locator("#tabela-alunos tbody tr");
      const linhaJoao = linhas.filter({ hasText: "João Silva" });

      await expect(linhas).toHaveCount(1);
      await expect(linhaJoao).toHaveCount(1);
    });

    test("deve permitir o cadastro de múltiplos alunos e exibi-los na tabela", async ({
      page,
    }) => {
      const alunos = [
        { nome: "Aluno Zero", n1: "0", n2: "0", n3: "0" },
        { nome: "Aluno Um", n1: "1", n2: "1", n3: "1" },
        { nome: "Aluno Dois", n1: "2", n2: "2", n3: "2" },
        { nome: "Aluno Três", n1: "3", n2: "3", n3: "3" },
        { nome: "Aluno Quatro", n1: "4", n2: "4", n3: "4" },
        { nome: "Aluno Cinco", n1: "5", n2: "5", n3: "5" },
      ];

      for (const aluno of alunos) {
        await page.getByLabel("Nome do Aluno").fill(aluno.nome);
        await page.getByLabel("Nota 1").fill(aluno.n1);
        await page.getByLabel("Nota 2").fill(aluno.n2);
        await page.getByLabel("Nota 3").fill(aluno.n3);
        await page.getByRole("button", { name: "Cadastrar" }).click();
      }

      const linhas = page.locator("#tabela-alunos tbody tr");

      await expect(linhas).toHaveCount(6);
    });

    // ===== Feedback =====

    test("deve exibir mensagem de sucesso após cadastro", async ({ page }) => {
      await page.getByLabel("Nome do Aluno").fill("Ana Costa");
      await page.getByLabel("Nota 1").fill("9");
      await page.getByLabel("Nota 2").fill("8");
      await page.getByLabel("Nota 3").fill("10");

      await page.getByRole("button", { name: "Cadastrar" }).click();

      await expect(page.locator("#mensagem")).toContainText(
        "cadastrado com sucesso",
      );
    });

    // ===== Operações =====

    test("deve filtrar alunos por nome corretamente", async ({ page }) => {
      await page.getByLabel("Nome do Aluno").fill("Ana Silva");
      await page.getByLabel("Nota 1").fill("9");
      await page.getByLabel("Nota 2").fill("8");
      await page.getByLabel("Nota 3").fill("10");
      await page.getByRole("button", { name: "Cadastrar" }).click();

      await page.getByLabel("Nome do Aluno").fill("Carlos Lima");
      await page.getByLabel("Nota 1").fill("5");
      await page.getByLabel("Nota 2").fill("6");
      await page.getByLabel("Nota 3").fill("4");
      await page.getByRole("button", { name: "Cadastrar" }).click();

      await page.getByLabel("Buscar por nome").fill("Ana");   

      const linhasTabela = page.locator("#tabela-alunos tbody tr");

      await expect(linhasTabela).toHaveCount(1);
      await expect(linhasTabela).toContainText("Ana Silva");
      await expect(linhasTabela).not.toContainText("Carlos Lima");
    });

    test("deve excluir um aluno cadastrado com sucesso", async ({ page }) => {
      await page.getByLabel("Nome do Aluno").fill("Aluno para Excluir");
      await page.getByLabel("Nota 1").fill("8");
      await page.getByLabel("Nota 2").fill("8");
      await page.getByLabel("Nota 3").fill("8");
      await page.getByRole("button", { name: "Cadastrar" }).click();

      const linhas = page.locator("#tabela-alunos tbody tr");
      await expect(linhas).toHaveCount(1);

      await page.getByRole("button", { name: "Excluir" }).click();

      await expect(page.getByText("Nenhum aluno cadastrado.")).toBeVisible();
    });

    // ===== Regras de negócio =====

    test('deve exibir situação "Aprovado" para média maior ou igual a 7', async ({
      page,
    }) => {
      await page.getByLabel("Nome do Aluno").fill("Aluno Aprovado");
      await page.getByLabel("Nota 1").fill("8");
      await page.getByLabel("Nota 2").fill("7");
      await page.getByLabel("Nota 3").fill("9");
      await page.getByRole("button", { name: "Cadastrar" }).click();

      const linha = page
        .locator("#tabela-alunos tbody tr")
        .filter({ hasText: "Aluno Aprovado" });
      await expect(linha.locator(".badge")).toHaveText("Aprovado");
    });

    test('deve exibir situação "Recuperação" para média entre 5 e 6.9', async ({
      page,
    }) => {
      await page.getByLabel("Nome do Aluno").fill("Aluno Recuperação");
      await page.getByLabel("Nota 1").fill("6");
      await page.getByLabel("Nota 2").fill("5");
      await page.getByLabel("Nota 3").fill("6");
      await page.getByRole("button", { name: "Cadastrar" }).click();

      const linha = page
        .locator("#tabela-alunos tbody tr")
        .filter({ hasText: "Aluno Recuperação" });
      await expect(linha.locator(".badge")).toHaveText("Recuperação");
    });

    test('deve exibir situação "Reprovado" para média menor que 5', async ({
      page,
    }) => {
      await page.getByLabel("Nome do Aluno").fill("Aluno Reprovado");
      await page.getByLabel("Nota 1").fill("4");
      await page.getByLabel("Nota 2").fill("3");
      await page.getByLabel("Nota 3").fill("2");
      await page.getByRole("button", { name: "Cadastrar" }).click();

      const linha = page
        .locator("#tabela-alunos tbody tr")
        .filter({ hasText: "Aluno Reprovado" });
      await expect(linha.locator(".badge")).toHaveText("Reprovado");
    });

    test("deve atualizar os cards de estatísticas corretamente ao cadastrar alunos com diferentes situações", async ({
      page,
    }) => {
      await page.getByLabel("Nome do Aluno").fill("Aluno Aprovado");
      await page.getByLabel("Nota 1").fill("9");
      await page.getByLabel("Nota 2").fill("9");
      await page.getByLabel("Nota 3").fill("9");
      await page.getByRole("button", { name: "Cadastrar" }).click();

      await page.getByLabel("Nome do Aluno").fill("Aluno Recuperação");
      await page.getByLabel("Nota 1").fill("6");
      await page.getByLabel("Nota 2").fill("6");
      await page.getByLabel("Nota 3").fill("6");
      await page.getByRole("button", { name: "Cadastrar" }).click();

      await page.getByLabel("Nome do Aluno").fill("Aluno Reprovado");
      await page.getByLabel("Nota 1").fill("3");
      await page.getByLabel("Nota 2").fill("3");
      await page.getByLabel("Nota 3").fill("3");
      await page.getByRole("button", { name: "Cadastrar" }).click();

      const cardAprovados = page.locator("#stat-aprovados");
      await expect(cardAprovados).toHaveText("1");

      const cardRecuperacao = page.locator("#stat-recuperacao");
      await expect(cardRecuperacao).toHaveText("1");

      const cardReprovados = page.locator("#stat-reprovados");
      await expect(cardReprovados).toHaveText("1");
    });
  });

  // ========== GRUPO 2: Cálculo de Média ==========

  test.describe("Cálculo de Média", () => {
    test("deve calcular a média aritmética das três notas", async ({
      page,
    }) => {
      await page.getByLabel("Nome do Aluno").fill("Pedro Santos");
      await page.getByLabel("Nota 1").fill("8");
      await page.getByLabel("Nota 2").fill("6");
      await page.getByLabel("Nota 3").fill("10");

      await page.getByRole("button", { name: "Cadastrar" }).click();

      const celulaMedia = page
        .locator("#tabela-alunos tbody tr")
        .first()
        .locator("td")
        .nth(4);
      await expect(celulaMedia).toHaveText("8.00");
    });
  });

  // ========== GRUPO 3: Interface e Estado Inicial ==========

  test.describe("Interface e Estado Inicial", () => {
    test("deve ter o título correto na aba do navegador", async ({ page }) => {
        await expect(page).toHaveTitle(/QS Acadêmico/);
    });

    test("deve exibir a seção de cadastro visível", async ({ page }) => {
        await expect(page.locator("#secao-cadastro")).toBeVisible();
    });

    test("campo nome deve ter o placeholder correto", async ({ page }) => {
        await expect(page.getByLabel("Nome do Aluno")).toHaveAttribute(
        "placeholder",
        "Digite o nome completo"
        );
    });

    test("deve exibir mensagem de tabela vazia ao iniciar", async ({ page }) => {
        await expect(
        page.getByText("Nenhum aluno cadastrado.")
        ).toBeVisible();
    });

    test("contador total deve iniciar em zero", async ({ page }) => {
        await expect(page.locator("#stat-total")).toHaveText("0");
    });
  });

  // ========== GRUPO 4: Limpar Tudo ==========

  test.describe("Limpar Tudo", () => {
    test("deve remover todos os alunos ao confirmar o diálogo", async ({
        page,
    }) => {
        await page.getByLabel("Nome do Aluno").fill("Aluno Temporário");
        await page.getByLabel("Nota 1").fill("7");
        await page.getByLabel("Nota 2").fill("7");
        await page.getByLabel("Nota 3").fill("7");
        await page.getByRole("button", { name: "Cadastrar" }).click();

        const linhas = page.locator("#tabela-alunos tbody tr");
        await expect(linhas).toHaveCount(1);

        // Handler DEVE ser registrado ANTES de clicar
        page.on("dialog", async (dialog) => {
        await dialog.accept();
        });
        await page.getByRole("button", { name: "Limpar Tudo" }).click();

        await expect(page.getByText("Nenhum aluno cadastrado.")).toBeVisible();
    });

    test("não deve remover alunos ao cancelar o diálogo", async ({ page }) => {
        await page.getByLabel("Nome do Aluno").fill("Aluno Permanente");
        await page.getByLabel("Nota 1").fill("8");
        await page.getByLabel("Nota 2").fill("8");
        await page.getByLabel("Nota 3").fill("8");
        await page.getByRole("button", { name: "Cadastrar" }).click();

        page.on("dialog", async (dialog) => {
        await dialog.dismiss(); // equivale a clicar "Cancelar"
        });
        await page.getByRole("button", { name: "Limpar Tudo" }).click();

        const linhas = page.locator("#tabela-alunos tbody tr");
        await expect(linhas).toHaveCount(1);
    });
  });
});
