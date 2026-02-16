'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { ArrowRight, Check, CreditCard, QrCode, Shield, X } from 'lucide-react'
import { cn } from '@/lib/utils'

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

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
}

export function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { user, isLoaded } = useUser()
  const { annual, monthly } = useUsdToBrl()
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [loading, setLoading] = useState(false)

  const isAuthorized = user?.publicMetadata?.authorized === true

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open || !isLoaded) return null

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

  // Already subscribed
  if (isAuthorized) {
    const expiresAt = user?.publicMetadata?.expiresAt as string | undefined
    const subType = (user?.publicMetadata?.subscriptionType as string) || 'recurring'

    return (
      <div className="fixed inset-0 z-[1100] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-[480px] mx-4 max-h-[90vh] overflow-y-auto animate-fade-in-up">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
              <Check className="w-7 h-7 text-success" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Assinatura ativa</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Você tem acesso completo a todos os cursos e certificados.
            </p>

            <div className="bg-secondary/50 rounded-xl p-5 text-left space-y-3 mb-6">
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

            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-primary font-mono text-sm hover:underline cursor-pointer"
            >
              Ir para os cursos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-[480px] mx-4 max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all z-10 cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 max-sm:p-6">
          {/* Header */}
          <h2 className="font-display text-2xl font-bold text-foreground mb-1">
            Finalizar assinatura
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Preencha seus dados para prosseguir com o pagamento.
          </p>

          {/* Plan summary */}
          <div className="bg-secondary/50 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-bold text-foreground">Plano Anual</h3>
              <div className="text-right">
                {annual ? (
                  <>
                    <div className="font-display text-xl font-bold text-foreground">{formatBRL(annual)}</div>
                    <div className="font-mono text-[0.65rem] text-muted-foreground">{formatBRL(monthly!)}/mês</div>
                  </>
                ) : (
                  <div className="font-display text-xl font-bold text-foreground animate-pulse">R$ ...</div>
                )}
              </div>
            </div>
            <ul className="space-y-1.5">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* CPF/CNPJ */}
          <div className="mb-5">
            <label htmlFor="cpf-cnpj-modal" className="block font-mono text-xs text-muted-foreground mb-2">
              CPF ou CNPJ
            </label>
            <input
              id="cpf-cnpj-modal"
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
              maxLength={18}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          {/* Payment methods info */}
          <div className="mb-6 flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <QrCode className="w-3.5 h-3.5" />
              PIX
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <CreditCard className="w-3.5 h-3.5" />
              Cartão de Débito/Crédito
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            disabled={!isValidCpfCnpj || !annual || loading}
            className={cn(
              'w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer',
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

          <div className="flex items-center justify-center gap-2 mt-3 text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span className="font-mono text-[0.6rem]">Pagamento seguro processado via Asaas</span>
          </div>
        </div>
      </div>
    </div>
  )
}
