# Aula 2.2: Propriedades essenciais: persistencia, resolubilidade e controle criptografico

## Abertura
Bem-vindo a aula 2.2! Na aula anterior, voce aprendeu o que e um DID e como sua estrutura sintatica funciona. Agora, vamos aprofundar nas tres propriedades que fazem de um DID algo verdadeiramente diferente dos identificadores tradicionais: persistencia, resolubilidade e controle criptografico. Sem essas propriedades, um DID seria apenas mais uma string arbitraria.

### Programa da aula:
1. Persistencia e durabilidade de identificadores (introducao)
2. Resolubilidade: do DID ao DID Document (base e aprofundamento)
3. Controle criptografico e soberania do sujeito (Conceito principal da aula)

---

## 1. Persistencia e durabilidade de identificadores

### 1.1 O que significa persistencia
Persistencia, no contexto de DIDs, significa que o identificador continua valido e funcional ao longo do tempo, independentemente de mudancas em organizacoes, infraestruturas ou provedores de servico. Um DID persistente nao "quebra" porque uma empresa fechou ou porque um dominio expirou.

- **Exemplo**: Considere uma URL como `https://empresa-xyz.com/perfil/joao`. Se a empresa fechar, a URL deixa de funcionar. Um DID persistente, por outro lado, e projetado para sobreviver a essas mudancas — especialmente quando ancorado em registros distribuidos como blockchains.

A persistencia e fundamental para cenarios de longo prazo, como diplomas academicos, registros medicos ou identidades corporativas que precisam ser verificaveis por decadas.

### 1.2 Niveis de persistencia
Nem todos os metodos DID oferecem o mesmo nivel de persistencia. Podemos classificar em tres niveis:

- **Persistencia forte**: Metodos baseados em blockchains publicas (como `did:ion` ou `did:ethr`). O identificador persiste enquanto a rede existir, sem depender de nenhuma entidade individual.
- **Persistencia media**: Metodos como `did:web`, que dependem de infraestrutura web. Se o dominio expirar ou o servidor for desligado, o DID pode se tornar irresolvivel.
- **Persistencia efemera**: Metodos como `did:peer`, projetados para interacoes temporarias entre duas partes. Nao ha expectativa de persistencia de longo prazo.

- **Exemplo**: Um diploma universitario emitido com referencia a um `did:ion` pode ser verificado daqui a 30 anos, desde que a rede Bitcoin continue operando. Ja um `did:peer` usado para uma sessao de chat encriptada pode ser descartado apos a conversa.

---

## 2. Resolubilidade: do DID ao DID Document

### 2.1 O processo de resolucao
Resolubilidade e a capacidade de, dado um DID, obter o DID Document correspondente. Esse processo e chamado de DID Resolution e e analogo a resolucao DNS — onde um nome de dominio e convertido em um endereco IP.

O fluxo de resolucao funciona assim:
1. Um verificador recebe um DID (por exemplo, `did:ethr:0xabc...`).
2. O verificador identifica o metodo (`ethr`) e aciona o DID Resolver apropriado.
3. O resolver consulta o registro subjacente (neste caso, a blockchain Ethereum).
4. O registro retorna o DID Document associado.
5. O verificador agora tem acesso as chaves publicas, endpoints de servico e metadados do sujeito.

- **Exemplo**: Pense na resolucao de um DID como consultar um catalogo telefonico descentralizado. Voce fornece o "nome" (DID) e recebe as "informacoes de contato" (DID Document) — mas ninguem controla o catalogo sozinho.

### 2.2 Universal Resolver
A comunidade SSI desenvolveu o Universal Resolver, uma ferramenta que agrega multiplos drivers de resolucao em uma unica interface. Em vez de implementar um resolver para cada metodo DID, voce pode usar o Universal Resolver como ponto de entrada unificado.

O Universal Resolver aceita qualquer DID e roteia a solicitacao para o driver correto com base no metodo. Ele e disponibilizado como uma API REST e tambem como imagem Docker para uso local.

```
GET /1.0/identifiers/did:ethr:0xabc123...
```

A resposta e um DID Resolution Result contendo:
- O DID Document completo
- Metadados de resolucao (como timestamps e status)
- Metadados do DID Document (como versionamento)

- **Exemplo**: Servicos como o DIF Universal Resolver (https://dev.uniresolver.io) permitem que voce teste a resolucao de DIDs de diferentes metodos diretamente no navegador.

---

## 3. Controle criptografico e soberania do sujeito

### 3.1 Fundamentos do controle criptografico
O controle criptografico e a propriedade que diferencia fundamentalmente um DID de qualquer outro identificador. Quando voce cria um DID, voce gera um par de chaves criptograficas: uma chave privada (que voce mantem em segredo) e uma chave publica (que e publicada no DID Document).

A chave privada prova que voce e o controlador do DID. Com ela, voce pode:
- **Assinar digitalmente** mensagens e documentos, provando que vieram de voce.
- **Autenticar-se** perante qualquer parte, sem senhas ou intermediarios.
- **Autorizar mudancas** no DID Document, como rotacionar chaves ou adicionar endpoints.
- **Emitir credenciais** vinculadas ao seu DID.

- **Exemplo**: Quando voce assina uma Verifiable Credential com sua chave privada, qualquer pessoa pode verificar a assinatura usando a chave publica listada no seu DID Document. Nenhuma autoridade central e necessaria para essa verificacao.

### 3.2 Rotacao de chaves e recuperacao
Um aspecto critico do controle criptografico e a capacidade de rotacionar chaves. Se sua chave privada for comprometida, voce precisa poder atualizar o DID Document com uma nova chave publica, mantendo o mesmo DID.

Isso e possivel porque o DID e o DID Document sao entidades separadas. O DID e o identificador estavel; o DID Document e o registro mutavel que contem as chaves atuais. Atualizar o documento nao muda o identificador.

Mecanismos de recuperacao variam por metodo:
- Em `did:ethr`, o smart contract permite que o controlador atualize as chaves associadas.
- Em `did:ion`, operacoes de atualizacao sao ancoradas na blockchain Bitcoin.
- Em `did:key`, nao ha rotacao possivel — o DID e derivado diretamente da chave, entao uma nova chave gera um novo DID.

### 3.3 Soberania versus responsabilidade
O controle criptografico traz soberania, mas tambem responsabilidade. Se voce perder sua chave privada sem ter configurado mecanismos de recuperacao, podera perder o controle do seu DID permanentemente. Nao ha um "esqueci minha senha" em um sistema verdadeiramente descentralizado.

Essa tensao entre autonomia e usabilidade e um dos grandes desafios praticos da identidade descentralizada. Solucoes como social recovery (onde contatos de confianca podem ajudar na recuperacao), multi-sig (multiplas chaves necessarias) e custodia hibrida estao sendo desenvolvidas para equilibrar seguranca e praticidade.

- **Exemplo**: O sistema de social recovery funciona assim: voce designa cinco "guardioes". Se perder sua chave, tres dos cinco podem autorizar a emissao de uma nova chave para voce, sem que nenhum deles tenha acesso individual a sua identidade.

---

## Conclusao
Nesta aula, voce aprendeu que as tres propriedades essenciais dos DIDs — persistencia, resolubilidade e controle criptografico — trabalham juntas para criar identificadores verdadeiramente descentralizados. A persistencia garante durabilidade ao longo do tempo. A resolubilidade permite que qualquer parte obtenha as informacoes necessarias para interagir com o sujeito. E o controle criptografico coloca o poder nas maos do titular, eliminando a dependencia de autoridades centrais. Essas propriedades sao o que separa os DIDs de todos os identificadores que vieram antes.

---

## Licao de Casa
1. Pesquise o metodo `did:key` e o metodo `did:ion`. Compare-os em termos de persistencia, resolubilidade e controle criptografico. Qual e mais adequado para um diploma universitario? Justifique.
2. Acesse o Universal Resolver (https://dev.uniresolver.io) e resolva pelo menos dois DIDs de metodos diferentes. Documente o que voce encontrou em cada DID Document retornado.
3. Escreva um cenario hipotetico em que a perda de uma chave privada causa problemas graves. Em seguida, proponha uma solucao de recuperacao que equilibre seguranca e usabilidade.

---

## Proxima Aula
Na proxima aula, vamos comparar DIDs com identificadores tradicionais como e-mail, CPF, UUID e enderecos blockchain. Voce vai entender claramente o que torna os DIDs unicos e por que os identificadores existentes nao sao suficientes para a identidade descentralizada. Ate la!

---

## Questionario

**1. O que significa "persistencia" no contexto de um DID?**
a) O DID e armazenado em cache no navegador do usuario
b) O identificador continua valido e funcional ao longo do tempo, independentemente de mudancas em organizacoes ou infraestrutura
c) O DID e copiado automaticamente para multiplos servidores
d) O identificador e atualizado periodicamente para manter-se seguro
**Resposta: b**

**2. Qual metodo DID oferece persistencia efemera, projetado para interacoes temporarias?**
a) did:ion
b) did:ethr
c) did:peer
d) did:web
**Resposta: c**

**3. O que e o Universal Resolver?**
a) Um protocolo de criptografia para DIDs
b) Uma ferramenta que agrega multiplos drivers de resolucao DID em uma unica interface
c) Um metodo DID baseado em blockchain
d) Um padrao W3C para validacao de credenciais
**Resposta: b**

**4. Por que a rotacao de chaves e possivel sem alterar o DID?**
a) Porque o DID e regenerado automaticamente a cada rotacao
b) Porque a chave privada nunca muda
c) Porque o DID e o DID Document sao entidades separadas — o DID e estavel e o documento e mutavel
d) Porque todos os metodos DID usam a mesma chave publica
**Resposta: c**

**5. Qual e um dos grandes desafios praticos do controle criptografico em identidade descentralizada?**
a) A velocidade de resolucao dos DIDs
b) A incompatibilidade entre navegadores web
c) A tensao entre autonomia do usuario e usabilidade, especialmente em cenarios de perda de chave
d) O custo de armazenamento das chaves publicas na blockchain
**Resposta: c**
