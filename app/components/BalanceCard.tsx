import { IconTrendingUp, IconTrendingDown, IconEqual } from '@tabler/icons-react'

type BalanceCardProps = {
  balance: number
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  const isPositive = balance > 0
  const isNeutral = balance === 0
  const isNegative = balance < 0

  return (
    <div className={`balance-card ${isPositive ? 'balance-positive' : isNegative ? 'balance-negative' : 'balance-neutral'}`}>
      <div className="balance-card-header">
        <h1 className="balance-title">Tu Balance</h1>
        <div className="balance-trend-icon">
          {isPositive && <IconTrendingUp size={32} />}
          {isNegative && <IconTrendingDown size={32} />}
          {isNeutral && <IconEqual size={32} />}
        </div>
      </div>

      <div className="balance-amount-container">
        <span className="balance-currency">₡</span>
        <span className="balance-amount">{Math.abs(balance).toFixed(2)}</span>
      </div>

      <div className="balance-status">
        {isPositive && (
          <span className="balance-status-text">
            Tu balance es positivo - ¡Excelente gestión financiera!
          </span>
        )}
        {isNegative && (
          <span className="balance-status-text">
            Tu balance es negativo - Revisa tus gastos
          </span>
        )}
        {isNeutral && (
          <span className="balance-status-text">
            Tu balance está equilibrado
          </span>
        )}
      </div>
    </div>
  )
}

export default BalanceCard
