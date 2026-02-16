'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { ArrowRight, Check, CreditCard, QrCode, RotateCcw, ShoppingCart, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const USD_PRICE = 300

const FEATURES = [
  'Acesso ilimitado a todos os 12 cursos',
  'Certificados de conclusão',
  'Solicitar novos cursos e conteúdos',
  'Acesso antecipado a novos cursos',
  'Suporte prioritário por e-mail',
]

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function useUsdToBrl() {
  const [rate, setRate] = useState<number | null>(null)

  useEffect(() => {
    fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL')
      .then((r) => r.json())
      .then((data) => setRate(parseFloat(data.USDBRL.bid)))
      .catch(() => setRate(null))
  }, [])

  const annual = rate ? USD_PRICE * rate : null
  const monthly = annual ? annual / 12 : null

  return { rate, annual, monthly }
}

function formatCpfCnpj(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

export default function CheckoutPage() {
  const { user, isLoaded } = useUser()
  const { annual, monthly } = useUsdToBrl()
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [billingType, setBillingType] = useState<'recurring' | 'one-time'>('recurring')
  const [loading, setLoading] = useState(false)

  const isAuthorized = user?.publicMetadata?.authorized === true

  if (!isLoaded) return null

  const handleCheckout = async () => {
    setLoading(true)
    // TODO: POST /api/checkout com cpfCnpj, billingType
    // Redirecionar para invoiceUrl do Asaas
    setTimeout(() => {
      alert('Checkout mockado! Na integração real, você será redirecionado para o Asaas.')
      setLoading(false)
    }, 1500)
  }

  const cpfDigits = cpfCnpj.replace(/\D/g, '')
  const isValidCpfCnpj = cpfDigits.length === 11 || cpfDigits.length === 14

  // Already subscribed view
  if (isAuthorized) {
    const expiresAt = user?.publicMetadata?.expiresAt as string | undefined
    const subType = (user?.publicMetadata?.subscriptionType as string) || 'recurring'

    return (
      <div className="min-h-screen pt-[var(--header-h)]">
        <div className="max-w-[560px] mx-auto px-8 max-md:px-5 py-16">
          <div className="animate-fade-in-up text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Assinatura ativa</h1>
            <p className="text-muted-foreground mb-8">
              Você tem acesso completo a todos os cursos e certificados.
            </p>

            <div className="bg-card border border-border rounded-xl p-6 text-left space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-muted-foreground">Plano</span>
                <span className="font-mono text-sm text-foreground">Anual</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-muted-foreground">Tipo</span>
                <span className="font-mono text-sm text-foreground">
                  {subType === 'recurring' ? 'Recorrente' : 'Pagamento único'}
                </span>
              </div>
              {expiresAt && (
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-muted-foreground">Expira em</span>
                  <span className="font-mono text-sm text-foreground">
                    {new Date(expiresAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-success/10 text-success font-mono text-xs rounded-full border border-success/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Ativo
                </span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary font-mono text-sm hover:underline"
            >
              Ir para os cursos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-[var(--header-h)]">
      <div className="max-w-[560px] mx-auto px-8 max-md:px-5 py-16">
        {/* Header */}
        <div className="animate-fade-in-up mb-10">
          <Link href="/#planos" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">
            &larr; Voltar aos planos
          </Link>
          <h1 className="font-display text-3xl max-sm:text-2xl font-bold text-foreground mb-2">
            Finalizar assinatura
          </h1>
          <p className="text-muted-foreground">
            Preencha seus dados para prosseguir com o pagamento.
          </p>
        </div>

        {/* Plan summary */}
        <div className="animate-fade-in-up bg-card border border-border rounded-xl p-6 mb-8" style={{ animationDelay: '60ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">Plano Anual</h2>
            <div className="text-right">
              {annual ? (
                <>
                  <div className="font-display text-2xl font-bold text-foreground">{formatBRL(annual)}</div>
                  <div className="font-mono text-xs text-muted-foreground">{formatBRL(monthly!)}/mês</div>
                </>
              ) : (
                <div className="font-display text-2xl font-bold text-foreground animate-pulse">R$ ...</div>
              )}
            </div>
          </div>
          <ul className="space-y-2">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* CPF/CNPJ */}
        <div className="animate-fade-in-up mb-6" style={{ animationDelay: '120ms' }}>
          <label htmlFor="cpf-cnpj" className="block font-mono text-xs text-muted-foreground mb-2">
            CPF ou CNPJ
          </label>
          <input
            id="cpf-cnpj"
            type="text"
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
            maxLength={18}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        {/* Billing type toggle */}
        <div className="animate-fade-in-up mb-8" style={{ animationDelay: '180ms' }}>
          <span className="block font-mono text-xs text-muted-foreground mb-3">
            Tipo de cobrança
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setBillingType('recurring')}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all cursor-pointer',
                billingType === 'recurring'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border bg-card hover:border-border/80',
              )}
            >
              <RotateCcw className={cn('w-5 h-5', billingType === 'recurring' ? 'text-primary' : 'text-muted-foreground')} />
              <div>
                <div className={cn('font-mono text-sm font-medium', billingType === 'recurring' ? 'text-foreground' : 'text-muted-foreground')}>
                  Recorrente
                </div>
                <div className="font-mono text-[0.65rem] text-muted-foreground mt-0.5">
                  Renova automaticamente
                </div>
              </div>
            </button>
            <button
              onClick={() => setBillingType('one-time')}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all cursor-pointer',
                billingType === 'one-time'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border bg-card hover:border-border/80',
              )}
            >
              <ShoppingCart className={cn('w-5 h-5', billingType === 'one-time' ? 'text-primary' : 'text-muted-foreground')} />
              <div>
                <div className={cn('font-mono text-sm font-medium', billingType === 'one-time' ? 'text-foreground' : 'text-muted-foreground')}>
                  Pagamento único
                </div>
                <div className="font-mono text-[0.65rem] text-muted-foreground mt-0.5">
                  Acesso por 1 ano
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Payment methods info */}
        <div className="animate-fade-in-up mb-8 flex items-center gap-4 text-muted-foreground" style={{ animationDelay: '240ms' }}>
          <div className="flex items-center gap-2 font-mono text-xs">
            <QrCode className="w-4 h-4" />
            PIX
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <CreditCard className="w-4 h-4" />
            Cartão de crédito
          </div>
        </div>

        {/* CTA */}
        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <button
            onClick={handleCheckout}
            disabled={!isValidCpfCnpj || !annual || loading}
            className={cn(
              'w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all duration-200 cursor-pointer',
              isValidCpfCnpj && annual && !loading
                ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            )}
          >
            {loading ? (
              <span className="animate-pulse">Processando...</span>
            ) : (
              <>
                Ir para pagamento
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            <span className="font-mono text-[0.65rem]">Pagamento seguro processado via Asaas</span>
          </div>
        </div>
      </div>
    </div>
  )
}
