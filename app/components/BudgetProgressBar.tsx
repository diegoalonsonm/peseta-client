'use client'

import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react'

type BudgetProgressBarProps = {
  spent: number;
  limit: number;
  categoryName: string;
  periodType: 'weekly' | 'biweekly' | 'monthly';
  periodEnd: string;
  showDetails?: boolean;
}

export default function BudgetProgressBar({
  spent,
  limit,
  categoryName,
  periodType,
  periodEnd,
  showDetails = true
}: BudgetProgressBarProps) {
  const percentUsed = Math.min((spent / limit) * 100, 100);
  const remaining = limit - spent;

  // Color logic: Green (0-70%), Yellow (70-90%), Red (90%+)
  let colorClass = 'bg-success';
  let statusColor = '#10B981';

  if (percentUsed >= 70 && percentUsed < 90) {
    colorClass = 'bg-warning';
    statusColor = '#F59E0B';
  } else if (percentUsed >= 90) {
    colorClass = 'bg-danger';
    statusColor = '#EF4444';
  }

  const isOverBudget = spent > limit;

  const getPeriodLabel = () => {
    switch(periodType) {
      case 'weekly': return 'Semanal';
      case 'biweekly': return 'Quincenal';
      case 'monthly': return 'Mensual';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CR', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="budget-progress-container">
      <div className="budget-progress-header">
        <div>
          <h6 className="budget-category-name">{categoryName}</h6>
          <span className="budget-period-label">{getPeriodLabel()}</span>
        </div>
        <div className="budget-status-icon" style={{ color: statusColor }}>
          {isOverBudget ? (
            <IconAlertCircle size={24} />
          ) : percentUsed < 90 ? (
            <IconCircleCheck size={24} />
          ) : (
            <IconAlertCircle size={24} />
          )}
        </div>
      </div>

      <div className="progress" style={{ height: '12px', marginBottom: '8px' }}>
        <div
          className={`progress-bar ${colorClass}`}
          role="progressbar"
          style={{ width: `${percentUsed}%` }}
          aria-valuenow={percentUsed}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {showDetails && (
        <div className="budget-details">
          <div className="budget-amounts">
            <span className="budget-spent">
              Gastado: ₡{spent.toLocaleString('es-CR', { minimumFractionDigits: 2 })}
            </span>
            <span className="budget-limit">
              de ₡{limit.toLocaleString('es-CR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="budget-remaining" style={{
            color: remaining >= 0 ? statusColor : '#EF4444'
          }}>
            {remaining >= 0 ? 'Disponible' : 'Excedido'}: ₡
            {Math.abs(remaining).toLocaleString('es-CR', { minimumFractionDigits: 2 })}
          </div>
          <div className="budget-period-end text-muted">
            Finaliza: {formatDate(periodEnd)}
          </div>
        </div>
      )}
    </div>
  );
}
