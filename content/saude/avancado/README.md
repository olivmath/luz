# Curso 2: Arquitetura, Prototipagem e Implementação

**Nível:** Avançado
**Carga Horária Estimada:** 24 horas (6 módulos)
**contentDir:** curso-13
**courseId:** saude-blockchain-avancado

## Objetivo

Capacitar para a ação, ensinando a arquitetar, construir e planejar a implementação de soluções descentralizadas, com forte componente prático (hands-on).

## Público-alvo

Engenheiros de software, arquitetos de soluções, gestores de TI, gestores hospitalares, profissionais de saúde interessados em implementar soluções com blockchain e DID na saúde brasileira.

---

## Estrutura (6 módulos, 20 aulas)

### Módulo 1: Arquitetura de Sistemas com Blockchain e DIDs (4 aulas)
- **Aula 1.1** — Padrões Arquiteturais para Saúde
  - Modelos de arquitetura híbrida on-chain/off-chain. Onde armazenar dados clínicos e o que ancorar na blockchain.
- **Aula 1.2** — Camada de Identidade e DID Methods
  - Métodos DID aplicáveis (did:ethr, did:ion, did:web). Stack: Hyperledger Indy e Aries.
- **Aula 1.3** — Integração com a RNDS e APIs FHIR
  - Soluções que consultam a RNDS via FHIR e complementam com blockchain para consentimento e auditoria.
- **Aula 1.4** — Segurança Avançada e Conformidade
  - Chaves biométricas, rotação de chaves, recuperação de controle, proteção pós-quântica e RIPD.

### Módulo 2: Prototipagem Prática — Hands-on Intensivo (4 aulas)
- **Aula 2.1** — Setup do Ambiente de Desenvolvimento
  - Configuração: Node.js, Veramo/DIDKit, rede de testes, servidor FHIR mock.
- **Aula 2.2** — Hands-on 1: Emissão e Verificação de Credenciais
  - Criação de DIDs para médico e paciente. Emissão de VC de receita médica (FHIR Prescription).
- **Aula 2.3** — Hands-on 2: Consentimento e Auditoria
  - Paciente apresenta VC ao farmacêutico. Registro do evento na blockchain como log imutável.
- **Aula 2.4** — Integração com APIs Reais
  - Integração de protótipo com API mock da RNDS (sandbox) para buscar e validar recurso FHIR.

### Módulo 3: Jornada de Implementação: Desafios e Estratégias (3 aulas)
- **Aula 3.1** — Estratégia, Roadmap e Desafios Brasileiros
  - Análise do PL 2.631/2020, roadmap SUS 2026+, conectividade rural, capacitação profissional e sistemas legados.
- **Aula 3.2** — Modelos de Governança e Sustentabilidade
  - Definição de papéis (controlador, operador) em rede blockchain. Modelos de negócio e sustentabilidade.
- **Aula 3.3** — ROI e Métricas de Impacto
  - Redução de fraudes (40% em pilotos Datasus), redução de exames duplicados (20%), eficiência operacional.

### Módulo 4: Projetos de Alta Complexidade e Tendências Futuras (3 aulas)
- **Aula 4.1** — Supply Chain de Medicamentos com Blockchain
  - Pilotos da ANVISA para rastreabilidade de medicamentos, combate à falsificação e garantia de procedência.
- **Aula 4.2** — Lições da Pandemia e Governança de Dados em Larga Escala
  - Repositório COVID-19 Data Sharing (FAPESP) e colaboração público-privada em dados.
- **Aula 4.3** — O Futuro: zkDIDs, Medicina de Precisão e IPS Brasil
  - Evolução para zkDIDs, IA com identidade soberana, medicina personalizada e International Patient Summary.

### Módulo 5: Workshop de Prototipagem e Apresentação de Projetos (3 aulas)
- **Aula 5.1** — Definição do MVP
  - Alunos definem escopo mínimo viável para problema real (jornada UBS→rede privada, laudo com verificação).
- **Aula 5.2** — Desenvolvimento Guiado do Protótipo
  - Sessão prática para avançar no código do protótipo, com suporte dos instrutores.
- **Aula 5.3** — Pitch e Validação das Soluções
  - Apresentação do protótipo e modelo de negócio. Feedback sobre viabilidade e aderência regulatória.

### Módulo 6: Estratégias para Escalabilidade e Fomento (3 aulas)
- **Aula 6.1** — Arquiteturas Escaláveis
  - Camadas L2, sidechains e redes permissionadas para performance e privacidade em âmbito nacional.
- **Aula 6.2** — Fontes de Fomento e Editais
  - Oportunidades: editais da Finep, Ministério da Saúde, PROADI-SUS e parcerias público-privadas.
- **Aula 6.3** — Open Source, Comunidade e Visão de Futuro
  - Importância do código aberto, padrões abertos, futuro da saúde digital até 2030 e o cidadão como dono dos dados.
