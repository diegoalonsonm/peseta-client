'use client'

import { IconAlertTriangle, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import Link from 'next/link'

type BudgetAlertBannerProps = {
  overBudgetCount: number;
  nearLimitCount: number;
}

export default function BudgetAlertBanner({
  overBudgetCount,
  nearLimitCount
}: BudgetAlertBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || (overBudgetCount === 0 && nearLimitCount === 0)) {
    return null;
  }

  return (
    <div className="alert alert-warning alert-dismissible fade show" role="alert">
      <div className="d-flex align-items-center">
        <IconAlertTriangle size={24} className="me-2" />
        <div className="flex-grow-1">
          <strong>Alertas de Presupuesto</strong>
          <p className="mb-0">
            {overBudgetCount > 0 && (
              <span>{overBudgetCount} presupuesto{overBudgetCount > 1 ? 's' : ''} excedido{overBudgetCount > 1 ? 's' : ''}. </span>
            )}
            {nearLimitCount > 0 && (
              <span>{nearLimitCount} presupuesto{nearLimitCount > 1 ? 's' : ''} cerca del límite. </span>
            )}
            <Link href="/budgets" className="alert-link">Ver detalles</Link>
          </p>
        </div>
        <button
          type="button"
          className="btn-close"
          onClick={() => setIsDismissed(true)}
          aria-label="Close"
        />
      </div>
    </div>
  );
}
