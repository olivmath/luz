# Aula 2.3: Comparacao com identificadores tradicionais (e-mail, CPF, UUID, enderecos blockchain)

## Abertura
Bem-vindo a aula 2.3! Agora que voce conhece a estrutura e as propriedades dos DIDs, e hora de compara-los diretamente com os identificadores que ja fazemos parte do nosso cotidiano. Essa comparacao vai deixar claro por que os identificadores existentes sao insuficientes para a identidade descentralizada e o que exatamente os DIDs trazem de novo.

### Programa da aula:
1. Identificadores centralizados: e-mail e CPF (introducao)
2. Identificadores tecnicos: UUID e enderecos blockchain (base e aprofundamento)
3. Analise comparativa sistematica com DIDs (Conceito principal da aula)

---

## 1. Identificadores centralizados: e-mail e CPF

### 1.1 Endereco de e-mail
O endereco de e-mail e provavelmente o identificador digital mais usado no mundo. Ele serve simultaneamente como identificador, canal de comunicacao e mecanismo de autenticacao (via "esqueci minha senha"). Porem, apresenta limitacoes serias do ponto de vista da identidade descentralizada.

Problemas do e-mail como identificador:
- **Controle centralizado**: O provedor (Gmail, Outlook) pode desativar sua conta a qualquer momento, eliminando seu identificador e todos os servicos vinculados.
- **Sem verificabilidade criptografica nativa**: O e-mail em si nao prova nada sobre voce. Qualquer pessoa pode criar `joao.silva@provedor.com` sem ser Joao Silva.
- **Correlacao e rastreamento**: Usar o mesmo e-mail em multiplos servicos permite que terceiros correlacionem suas atividades.
- **Dependencia de DNS**: O funcionamento depende do sistema de nomes de dominio, uma infraestrutura centralizada.

- **Exemplo**: Quando voce usa "Login com Google" em um site, esta delegando sua identidade ao Google. Se o Google decidir que voce violou seus termos de servico, voce perde acesso nao apenas ao Gmail, mas a todos os servicos onde usou esse login.

### 1.2 CPF (Cadastro de Pessoa Fisica)
O CPF e o identificador civil oficial do Brasil. E emitido pela Receita Federal e vinculado a uma unica pessoa fisica. Embora seja persistente e unico, ele tem propriedades muito diferentes de um DID.

Problemas do CPF como identificador:
- **Emissao centralizada**: Somente a Receita Federal pode emitir CPFs. Voce nao tem autonomia para criar o seu.
- **Sem controle criptografico**: Nao ha chave privada associada ao CPF. Quem conhece o numero pode usa-lo indevidamente.
- **Correlacao universal**: Como e um identificador unico e amplamente exigido, o CPF permite rastrear atividades financeiras, medicas, educacionais e comerciais de uma pessoa.
- **Nao e verificavel de forma autonoma**: Para verificar se um CPF pertence a alguem, e necessario consultar sistemas da Receita Federal.

- **Exemplo**: Fraudes com CPF sao extremamente comuns no Brasil justamente porque conhecer o numero e suficiente para usa-lo. Nao ha prova criptografica vinculando o CPF ao seu titular legitimo. Um DID, em contraste, exige posse da chave privada para qualquer acao.

---

## 2. Identificadores tecnicos: UUID e enderecos blockchain

### 2.1 UUID (Universally Unique Identifier)
O UUID e um identificador de 128 bits projetado para ser globalmente unico sem necessidade de coordenacao central. E amplamente usado em bancos de dados, APIs e sistemas distribuidos. Um UUID v4 tipico se parece com: `550e8400-e29b-41d4-a716-446655440000`.

O UUID resolve o problema da unicidade sem autoridade central, mas falta-lhe propriedades cruciais:
- **Sem resolubilidade**: Um UUID puro nao aponta para nenhum lugar. Nao ha mecanismo padronizado para resolver um UUID e obter informacoes sobre o sujeito.
- **Sem controle criptografico**: Nao ha chave privada associada. Qualquer pessoa que conhca o UUID pode afirmar ser seu titular.
- **Sem semantica de identidade**: Um UUID identifica registros em sistemas, nao pessoas ou organizacoes. Nao foi projetado para servir como identificador de identidade.

- **Exemplo**: Imagine um UUID usado como ID de usuario em um banco de dados. Se o banco de dados for destruido, o UUID perde todo significado — nao ha como "resolver" o UUID para encontrar o usuario em outro sistema.

### 2.2 Enderecos blockchain
Enderecos em blockchains como Bitcoin e Ethereum sao derivados de chaves publicas criptograficas. Um endereco Ethereum como `0x742d35Cc6634C0532925a3b844Bc9e7595f2bD68` e gerado a partir de uma chave publica, que por sua vez corresponde a uma chave privada.

Enderecos blockchain compartilham algumas propriedades com DIDs:
- **Controle criptografico**: O titular da chave privada controla o endereco.
- **Descentralizacao na criacao**: Qualquer pessoa pode gerar um endereco sem pedir permissao.
- **Persistencia**: O endereco existe enquanto a blockchain existir.

Porem, ha diferencas fundamentais:
- **Sem resolubilidade padronizada**: Um endereco blockchain nao resolve para um documento estruturado com metadados, servicos e multiplas chaves.
- **Sem rotacao de chaves**: Se a chave privada for comprometida, o endereco e perdido. Nao ha como atualizar a chave associada.
- **Acoplamento a uma unica rede**: Um endereco Ethereum so funciona no ecossistema Ethereum. Nao ha interoperabilidade nativa com outras redes.

- **Exemplo**: Se sua chave privada Ethereum for comprometida, voce precisa criar um novo endereco e migrar todos os seus ativos. Com um DID baseado em `did:ethr`, voce pode rotacionar a chave e manter o mesmo identificador.

---

## 3. Analise comparativa sistematica com DIDs

### 3.1 Tabela comparativa
Vamos organizar a comparacao em uma tabela com as propriedades essenciais:

```
| Propriedade              | E-mail | CPF    | UUID   | Endereco BTC/ETH | DID    |
|--------------------------|--------|--------|--------|------------------|--------|
| Descentralizado          | Nao    | Nao    | Sim    | Sim              | Sim    |
| Persistente              | Nao    | Sim    | Sim*   | Sim              | Sim    |
| Resolvivel               | Sim**  | Nao    | Nao    | Parcial          | Sim    |
| Controle criptografico   | Nao    | Nao    | Nao    | Sim              | Sim    |
| Rotacao de chaves        | N/A    | N/A    | N/A    | Nao              | Sim*** |
| Interoperavel            | Sim    | Nao    | Parcial| Nao              | Sim    |
| Privacidade por design   | Nao    | Nao    | Sim    | Parcial          | Sim    |
```

(*) UUID e persistente apenas se o sistema que o utiliza persistir.
(**) E-mail e resolvivel via MX records, mas nao para um documento de identidade.
(***) Depende do metodo DID.

### 3.2 O que os DIDs combinam de forma unica
A analise comparativa revela que nenhum identificador tradicional combina todas as propriedades simultaneamente:

- O **e-mail** e resolvivel e interoperavel, mas nao e descentralizado nem oferece controle criptografico.
- O **CPF** e persistente e unico, mas e centralizado e nao possui verificabilidade criptografica.
- O **UUID** e descentralizado na criacao e preserva privacidade, mas nao e resolvivel nem oferece controle criptografico.
- O **endereco blockchain** e descentralizado e tem controle criptografico, mas nao suporta rotacao de chaves nem resolve para um documento estruturado.

O DID e o primeiro tipo de identificador projetado para combinar todas essas propriedades em um unico padrao interoperavel. Ele herda a descentralizacao e o controle criptografico dos enderecos blockchain, a unicidade dos UUIDs, e adiciona resolubilidade padronizada e rotacao de chaves.

### 3.3 Quando usar cada identificador
DIDs nao substituem todos os outros identificadores — cada um tem seu lugar:

- **Use e-mail** para comunicacao e recuperacao de conta em servicos centralizados.
- **Use CPF** quando exigido por regulamentacao fiscal ou governamental.
- **Use UUID** como chave primaria em bancos de dados internos.
- **Use enderecos blockchain** para transacoes financeiras em redes especificas.
- **Use DIDs** quando precisar de identidade verificavel, persistente, interoperavel e sob controle do sujeito.

- **Exemplo**: Uma universidade pode emitir um diploma digital referenciando o DID do aluno. O diploma pode ser verificado por qualquer empregador no mundo, sem contatar a universidade, sem depender de um e-mail que pode mudar, e sem expor o CPF do aluno.

---

## Conclusao
Nesta aula, voce comparou DIDs com quatro tipos de identificadores tradicionais e entendeu que cada um deles resolve apenas parte do problema da identidade digital. O e-mail e resolvivel mas centralizado; o CPF e persistente mas sem controle criptografico; o UUID e descentralizado mas nao resolvivel; e o endereco blockchain tem controle criptografico mas nao suporta rotacao de chaves. Somente o DID combina descentralizacao, persistencia, resolubilidade, controle criptografico e interoperabilidade em um unico padrao.

---

## Licao de Casa
1. Escolha um servico digital que voce usa diariamente (rede social, banco, e-commerce). Identifique quais identificadores ele usa para reconhecer voce e analise as limitacoes de cada um segundo os criterios desta aula.
2. Pesquise um caso real de vazamento de dados envolvendo CPFs no Brasil. Explique como o uso de DIDs poderia ter mitigado o impacto desse vazamento.
3. Crie sua propria tabela comparativa adicionando pelo menos dois identificadores que nao foram abordados nesta aula (por exemplo: numero de telefone, passaporte, handle de rede social). Avalie-os nas mesmas propriedades.

---

## Proxima Aula
Na proxima aula, vamos abrir e examinar a anatomia de um DID Document. Voce vai entender como as chaves publicas, metodos de verificacao e endpoints de servico sao estruturados dentro desse documento fundamental. Ate la!

---

## Questionario

**1. Qual e a principal limitacao do e-mail como identificador de identidade descentralizada?**
a) E muito longo para ser usado como identificador
b) E controlado por um provedor centralizado que pode revogar o acesso
c) Nao pode ser usado em dispositivos moveis
d) Exige pagamento mensal para ser mantido
**Resposta: b**

**2. Por que o CPF e vulneravel a fraudes de identidade?**
a) Porque ele expira a cada cinco anos
b) Porque e emitido por multiplas autoridades diferentes
c) Porque conhecer o numero e suficiente para usa-lo, sem necessidade de prova criptografica
d) Porque o formato numerico e facil de adivinhar
**Resposta: c**

**3. Qual propriedade essencial dos DIDs esta ausente nos UUIDs?**
a) Unicidade global
b) Resolubilidade e controle criptografico
c) Capacidade de ser gerado sem autoridade central
d) Representacao como string alfanumerica
**Resposta: b**

**4. Qual e a principal vantagem de um DID sobre um endereco blockchain?**
a) DIDs sao mais curtos que enderecos blockchain
b) DIDs permitem rotacao de chaves e resolvem para um documento estruturado com metadados
c) DIDs funcionam sem internet
d) DIDs sao gratuitos enquanto enderecos blockchain sao pagos
**Resposta: b**

**5. Em qual cenario o uso de um DID e mais apropriado do que os identificadores tradicionais?**
a) Como chave primaria em um banco de dados interno de uma empresa
b) Para receber transferencias de criptomoedas em uma rede especifica
c) Para emissao de um diploma digital verificavel de forma autonoma por qualquer parte, sem depender da instituicao emissora
d) Para enviar mensagens de texto entre dois telefones
**Resposta: c**
