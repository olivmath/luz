'use client'

import { useState, useEffect } from 'react'

const USD_PRICE = 300

export function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function useUsdToBrl() {
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
