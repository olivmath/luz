# Design: Checkout com Asaas

**Data:** 2026-02-16
**Status:** Aprovado

## Resumo

Integrar o gateway de pagamento Asaas para processar assinaturas do plano anual da LUZ Platform. O checkout usa link externo do Asaas (invoiceUrl) com PIX e cartão de crédito. Webhook do Asaas atualiza `publicMetadata.authorized` no Clerk automaticamente.

## Decisões

| Decisão | Escolha |
|---------|---------|
| Gateway | Asaas |
| Métodos de pagamento | PIX + Cartão de crédito |
| UX do checkout | Link externo Asaas (invoiceUrl) |
| Modelo de cobrança | Ambos: assinatura recorrente anual OU pagamento único |
| Preço | Dinâmico (USD 1.000 × câmbio do dia) |

## Fluxo do usuário

```
Landing Page (/#planos) → "Assinar agora"
  → Se não logado → Clerk Sign-in → volta
  → Se logado → /checkout
      → Coleta CPF/CNPJ
      → Escolhe: recorrente ou pagamento único
      → Clica "Ir para pagamento"
      → POST /api/checkout (cria customer + cobrança no Asaas)
      → Redirect → invoiceUrl (Asaas hospeda PIX/cartão)
      → Usuário paga
      → Webhook PAYMENT_RECEIVED → POST /api/webhooks/asaas
      → Backend seta publicMetadata.authorized = true no Clerk
      → Usuário volta ao site com acesso
```

## Telas

### 1. `/checkout` (nova)

- Header: "Finalizar assinatura"
- Resumo do plano: nome, preço em BRL (dinâmico), features
- Campo: CPF/CNPJ (com máscara)
- Toggle: "Assinatura recorrente (renova automaticamente)" vs "Pagamento único (acesso por 1 ano)"
- Botão: "Ir para pagamento" → cria cobrança e redireciona
- Estado: se já assinante → mostra status + botão gerenciar

### 2. Landing page (modificação)

- Botão "Assinar agora" do plano pago → aponta pra `/checkout` (se logado) ou sign-in (se não logado)

### 3. Perfil (modificação)

- Nova seção/tab "Assinatura" mostrando:
  - Status: Ativo/Inativo
  - Tipo: Recorrente ou Avulso
  - Expira em: data
  - Botão: "Gerenciar assinatura" (link pro portal Asaas)

## API Routes

### `POST /api/checkout`

1. Valida auth (Clerk)
2. Busca cotação USD→BRL
3. Cria customer no Asaas (ou reutiliza existente via `asaasCustomerId` no metadata)
4. Cria cobrança ou assinatura no Asaas
5. Retorna `{ invoiceUrl }` → frontend redireciona

### `POST /api/webhooks/asaas`

1. Valida `authToken` do webhook
2. Evento `PAYMENT_RECEIVED`:
   - Busca usuário Clerk pelo `externalReference` (userId)
   - Seta `publicMetadata.authorized = true` + `expiresAt` + `asaasCustomerId`
3. Evento `PAYMENT_OVERDUE` / `customer.subscription.deleted`:
   - Seta `publicMetadata.authorized = false`

## Dados no Clerk publicMetadata

```json
{
  "authorized": true,
  "asaasCustomerId": "cus_xxxxx",
  "asaasSubscriptionId": "sub_xxxxx",
  "subscriptionType": "recurring | one-time",
  "expiresAt": "2027-02-16T00:00:00Z"
}
```

## Middleware

- Adicionar `/checkout` como rota protegida (requer auth, mas não requer authorized)

## Variáveis de ambiente necessárias

```
ASAAS_API_KEY=<sandbox ou production>
ASAAS_WEBHOOK_TOKEN=<token customizado>
ASAAS_ENV=sandbox|production
```

## Escopo desta implementação

### Fase 1 (agora): Telas mockadas
- Página `/checkout` com UI completa (sem API real)
- Seção "Assinatura" no perfil (dados mock)
- Landing page apontando pro checkout

### Fase 2 (próxima): Integração real
- API routes `/api/checkout` e `/api/webhooks/asaas`
- Integração real com Asaas API
- Webhook handler
- Atualização do Clerk publicMetadata
