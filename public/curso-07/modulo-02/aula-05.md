# Aula 2.5: Verifiable Credentials (VCs) e Verifiable Presentations (VPs)

## Abertura
Bem-vindo a aula 2.5! Nas aulas anteriores, voce aprendeu sobre DIDs e DID Documents — a infraestrutura de identificacao descentralizada. Agora, vamos explorar o que da utilidade pratica a essa infraestrutura: as Verifiable Credentials (VCs) e Verifiable Presentations (VPs). Esses sao os documentos digitais que permitem provar fatos sobre voce de forma verificavel, segura e sob seu controle.

### Programa da aula:
1. O modelo de credenciais no mundo fisico e digital (introducao)
2. Anatomia de uma Verifiable Credential (base e aprofundamento)
3. Verifiable Presentations e divulgacao seletiva (Conceito principal da aula)

---

## 1. O modelo de credenciais no mundo fisico e digital

### 1.1 Credenciais no mundo fisico
No mundo fisico, usamos credenciais o tempo todo. Sua carteira de motorista prova que voce esta habilitado a dirigir. Seu diploma prova que voce concluiu um curso. Seu cartao de vacinacao prova que voce foi imunizado. Todas essas credenciais seguem o mesmo modelo basico:

1. Um **emissor** confiavel (DETRAN, universidade, posto de saude) cria a credencial.
2. O **titular** (voce) recebe e guarda a credencial.
3. Um **verificador** (policial, empregador, companhia aerea) examina a credencial e decide se confia nela.

Esse modelo funciona ha seculos, mas tem limitacoes no mundo digital. Como voce prova online que tem um diploma, sem que o verificador precise ligar para a universidade? Como voce evita que a credencial seja falsificada?

- **Exemplo**: Quando voce mostra sua CNH a um policial, ele verifica elementos de seguranca fisicos (holograma, foto). No mundo digital, nao ha hologramas — precisamos de algo equivalente. A assinatura digital do emissor cumpre esse papel.

### 1.2 O problema da verificacao digital
No modelo atual da internet, a verificacao de credenciais digitais geralmente exige contato direto com o emissor. Para verificar um diploma, o empregador precisa contatar a universidade. Para verificar um cadastro, o servico precisa consultar uma API do governo.

Isso cria problemas:
- **Dependencia do emissor**: Se o emissor estiver offline ou deixar de existir, a credencial nao pode ser verificada.
- **Privacidade comprometida**: O emissor fica sabendo cada vez que a credencial e verificada, podendo rastrear o titular.
- **Falta de padronizacao**: Cada emissor tem seu proprio formato, dificultando a interoperabilidade.

- **Exemplo**: Se voce compartilha seu diploma por PDF, nada impede que alguem altere o PDF. Se voce usa um link de verificacao da universidade, a universidade sabe cada vez que alguem verifica seu diploma — e se o site sair do ar, a verificacao falha.

---

## 2. Anatomia de uma Verifiable Credential

### 2.1 Estrutura de uma VC
Uma Verifiable Credential, conforme definida pela W3C Verifiable Credentials Data Model, e um documento digital assinado criptograficamente que contem afirmacoes (claims) sobre um sujeito. Sua estrutura inclui:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "https://exemplo.com/credenciais/3732",
  "type": ["VerifiableCredential", "DiplomaCredential"],
  "issuer": "did:example:universidade123",
  "issuanceDate": "2024-06-15T00:00:00Z",
  "credentialSubject": {
    "id": "did:example:aluno456",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bacharelado em Ciencia da Computacao",
      "institution": "Universidade Federal Exemplo"
    }
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2024-06-15T12:00:00Z",
    "verificationMethod": "did:example:universidade123#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z58DAdFfa9SkqZMVPxAQpic7ndTn..."
  }
}
```

Vamos examinar cada componente:
- **`@context`**: Vocabulario que define a semantica dos campos.
- **`id`**: Identificador unico da credencial.
- **`type`**: Tipos da credencial (sempre inclui `VerifiableCredential` mais tipos especificos).
- **`issuer`**: O DID do emissor da credencial.
- **`issuanceDate`**: Data de emissao.
- **`credentialSubject`**: As afirmacoes sobre o sujeito, incluindo o DID do titular.
- **`proof`**: A prova criptografica — a assinatura digital do emissor.

### 2.2 O bloco proof e a verificacao
O bloco `proof` e o que transforma um documento JSON comum em uma credencial verificavel. Ele contem:

- **`type`**: O algoritmo de assinatura utilizado.
- **`verificationMethod`**: Referencia a chave publica do emissor no DID Document dele. O verificador resolve o DID do emissor, obtem a chave publica e usa-a para validar a assinatura.
- **`proofPurpose`**: Indica que a assinatura foi feita com proposito de `assertionMethod` (afirmacao).
- **`proofValue`**: A assinatura digital propriamente dita.

O fluxo de verificacao funciona assim:
1. O verificador recebe a VC.
2. Extrai o DID do emissor (`did:example:universidade123`).
3. Resolve o DID para obter o DID Document do emissor.
4. Localiza a chave publica referenciada em `verificationMethod`.
5. Usa a chave publica para validar `proofValue` contra o conteudo da credencial.
6. Se a assinatura e valida, a credencial e autentica e nao foi adulterada.

- **Exemplo**: Esse processo e analogo a verificar um selo notarial. O "selo" e a assinatura digital, o "cartorio" e o DID Document do emissor, e qualquer pessoa pode verificar sem precisar ir ao cartorio fisicamente.

---

## 3. Verifiable Presentations e divulgacao seletiva

### 3.1 O que e uma Verifiable Presentation
Uma Verifiable Presentation (VP) e um envelope que contem uma ou mais Verifiable Credentials, empacotadas e assinadas pelo titular para apresentacao a um verificador especifico. A VP adiciona uma camada de controle do titular sobre quais credenciais compartilhar e com quem.

```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiablePresentation"],
  "holder": "did:example:aluno456",
  "verifiableCredential": [{
    "...credencial completa aqui..."
  }],
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2024-07-01T10:00:00Z",
    "verificationMethod": "did:example:aluno456#key-1",
    "proofPurpose": "authentication",
    "challenge": "abc123xyz",
    "domain": "https://empregador.com",
    "proofValue": "z3FXQehWq8mKt5..."
  }
}
```

Observe que a VP tem sua propria `proof`, assinada pelo titular (nao pelo emissor). Isso prova que:
- O titular consentiu em compartilhar as credenciais.
- A apresentacao foi criada para um verificador especifico (campo `domain`).
- A apresentacao responde a uma solicitacao especifica (campo `challenge`).

- **Exemplo**: O campo `challenge` funciona como um nonce — um valor unico enviado pelo verificador. Isso impede ataques de replay, onde alguem reutilizaria uma apresentacao antiga.

### 3.2 Divulgacao seletiva
Um dos recursos mais poderosos das VCs e VPs e a divulgacao seletiva (selective disclosure). Ela permite que o titular revele apenas parte das informacoes contidas na credencial, sem expor tudo.

Cenarios praticos de divulgacao seletiva:
- Provar que voce tem mais de 18 anos sem revelar sua data de nascimento exata.
- Provar que voce e formado em uma universidade sem revelar o curso especifico.
- Provar que voce mora em determinada cidade sem revelar o endereco completo.

Tecnicas para implementar divulgacao seletiva incluem:
- **SD-JWT (Selective Disclosure JSON Web Token)**: Cada campo da credencial e codificado separadamente, permitindo revelar campos individuais.
- **BBS+ Signatures**: Esquema criptografico avancado que permite criar provas derivadas de uma credencial, revelando apenas campos selecionados sem invalidar a assinatura.
- **Zero-Knowledge Proofs (ZKPs)**: Provas matematicas que demonstram a veracidade de uma afirmacao sem revelar os dados subjacentes.

- **Exemplo**: Com BBS+ Signatures, uma credencial de identidade que contem nome, data de nascimento, endereco e nacionalidade pode gerar uma prova derivada que revela apenas a nacionalidade. O verificador pode confirmar que a prova veio de uma credencial legitimamente assinada pelo emissor, sem jamais ver os outros campos.

### 3.3 O ciclo completo: emissao, armazenamento e verificacao
Para consolidar, vamos tracar o ciclo completo de vida de uma credencial verificavel:

1. **Emissao**: O emissor (universidade) cria uma VC contendo afirmacoes sobre o sujeito (diploma do aluno), assina com sua chave privada e entrega ao titular.
2. **Armazenamento**: O titular armazena a VC em sua carteira digital (wallet). A carteira pode ser um aplicativo mobile, uma extensao de navegador ou um dispositivo de hardware.
3. **Solicitacao**: Um verificador (empregador) solicita uma prova de formacao, enviando um challenge.
4. **Apresentacao**: O titular seleciona a VC relevante, cria uma VP (opcionalmente com divulgacao seletiva), assina com sua chave privada e envia ao verificador.
5. **Verificacao**: O verificador valida a assinatura da VP (confirmando que veio do titular), valida a assinatura da VC interna (confirmando que veio do emissor) e verifica se o emissor e confiavel.

Em nenhum momento o emissor e contatado durante a verificacao. O titular tem controle total sobre quando e com quem compartilha suas credenciais. Essa e a essencia da identidade auto-soberana em acao.

---

## Conclusao
Nesta aula, voce aprendeu que Verifiable Credentials sao documentos digitais assinados criptograficamente que permitem provar fatos sobre um sujeito sem depender do emissor durante a verificacao. Verifiable Presentations adicionam controle do titular, permitindo empacotar credenciais para verificadores especificos. E a divulgacao seletiva garante que o titular possa revelar apenas as informacoes necessarias, preservando sua privacidade. Juntos, DIDs, VCs e VPs formam a base completa do ecossistema de identidade descentralizada.

---

## Licao de Casa
1. Escreva manualmente uma Verifiable Credential em JSON para um cenario de sua escolha (certificado de curso, comprovante de residencia, carteira de vacinacao). Inclua todos os campos obrigatorios e um bloco proof ficticio.
2. Descreva um cenario pratico onde a divulgacao seletiva seria essencial para proteger a privacidade do titular. Explique quais campos seriam revelados e quais seriam ocultados.
3. Pesquise a diferenca entre SD-JWT e BBS+ Signatures. Em um paragrafo, explique qual abordagem voce escolheria para um sistema de identidade estudantil e por que.

---

## Proxima Aula
Na proxima aula, vamos iniciar o Modulo 3 explorando os papeis no ecossistema de identidade descentralizada: Emissor, Titular e Verificador. Voce vai entender as responsabilidades, incentivos e desafios de cada ator nesse modelo de confianca triangular. Ate la!

---

## Questionario

**1. Quais sao os tres papeis fundamentais no modelo de credenciais (fisicas e digitais)?**
a) Criador, Distribuidor e Consumidor
b) Emissor, Titular e Verificador
c) Autoridade, Intermediario e Usuario
d) Produtor, Armazenador e Leitor
**Resposta: b**

**2. O que o bloco `proof` em uma Verifiable Credential contem?**
a) A senha do titular para acessar a credencial
b) Uma copia do DID Document do emissor
c) A assinatura digital do emissor, que permite verificar a autenticidade e integridade da credencial
d) O historico de todas as vezes que a credencial foi apresentada
**Resposta: c**

**3. Qual e a principal diferenca entre uma Verifiable Credential (VC) e uma Verifiable Presentation (VP)?**
a) A VC e emitida pelo verificador e a VP pelo emissor
b) A VC contem afirmacoes assinadas pelo emissor; a VP e um envelope assinado pelo titular que contem uma ou mais VCs
c) A VC e publica e a VP e privada
d) A VC usa criptografia simetrica e a VP usa criptografia assimetrica
**Resposta: b**

**4. O que e divulgacao seletiva (selective disclosure)?**
a) A capacidade do emissor de escolher quais credenciais emitir
b) A capacidade do verificador de solicitar apenas credenciais de emissores aprovados
c) A capacidade do titular de revelar apenas parte das informacoes de uma credencial, sem expor todos os dados
d) A capacidade do sistema de selecionar automaticamente o melhor metodo de criptografia
**Resposta: c**

**5. Por que o campo `challenge` e importante em uma Verifiable Presentation?**
a) Ele define o nivel de dificuldade criptografica da assinatura
b) Ele e um valor unico enviado pelo verificador que previne ataques de replay, garantindo que a apresentacao foi criada especificamente para aquela solicitacao
c) Ele armazena a chave privada do titular de forma temporaria
d) Ele determina o prazo de validade da apresentacao
**Resposta: b**
