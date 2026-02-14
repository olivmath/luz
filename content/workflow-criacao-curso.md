# Workflow de Criação de Cursos

## Processo de Trabalho

### 1. Preparação
- Ler e entender todo o material de referência depositado
- Organizar a sequência lógica dos cursos (renomear pastas se necessário)
- Definir a estrutura de módulos e aulas

### 2. Criação das Aulas (Paralelo)
- **1 agente por módulo** - cada agente cria as 3 aulas do seu módulo
- Cada aula deve seguir o template: `content/aula-template.md`
- Cada aula deve ter **5 questões de múltipla escolha** no final
- Os agentes rodam em paralelo para máxima eficiência

### 3. Revisão de Coesão (Sequencial)
- **1 agente de revisão por curso** - roda após todos os módulos estarem prontos
- Verifica coesão e harmonia do curso como um todo (da aula 1 até a última)
- Garante que:
  - A progressão de dificuldade é natural
  - Não há repetição desnecessária entre aulas
  - As referências cruzadas são consistentes
  - O "Próxima Aula" de cada aula conecta corretamente com a seguinte
  - A "Lição de Casa" é relevante ao conteúdo da aula
  - As questões de múltipla escolha cobrem os pontos principais

## Estrutura de Aula (Template)

```markdown
# Aula X: TITULO

## Abertura
Bem-vindo à nossa X aula! Vamos introduzir o conceito de ...

### Programa da aula:
1. Topico 1 (introdução)
2. Topico 2 (base e aprofundamento)
3. Topico 3 (Conceito principal da aula)

---

## 1. Topico 1 (introdução)
### Subtopico 1
### Subtopico 2

---

## 2. Topico 2 (base e aprofundamento)
### Subtopico 1
### Subtopico 2

---

## 3. Topico 3 (Conceito principal da aula)
### Subtopico 1
### Subtopico 2

---

## Conclusão

---

## Lição de Casa
1.
2.
3.

---

## Questões de Múltipla Escolha

### Questão 1
**Pergunta?**
- a)
- b)
- c)
- d)
**Resposta correta: X**

### Questão 2 ... (até 5)

---

## Próxima Aula
Na próxima aula, vamos entender o papel da ... Até lá!
```

## Estrutura dos Cursos Agro

```
content/agro/
├── fundamentos/        # Curso 1: Sistema Financeiro do Agro
├── intermediario/      # Curso 2: Estruturação e Mercado Avançado
├── avancado/           # Curso 3: Web3 e RWA - Fundamentos
└── especialista/       # Curso 4: Web3 e RWA - Arquitetura Avançada
```

## Comando Rápido

Para criar um novo curso, referencie este arquivo:
> "Crie o curso X seguindo o workflow de `content/workflow-criacao-curso.md`"
