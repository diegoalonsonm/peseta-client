'use client'

import { Budget } from '@/types'
import BudgetProgressBar from './BudgetProgressBar'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import {
  IconChefHat, IconBus, IconFirstAidKit, IconSchool, IconBuildingCarousel,
  IconShirt, IconHome, IconBulb, IconCoin, IconChartLine, IconGift,
  IconPigMoney, IconBuildingBank, IconCoins, IconGrain,
  IconShieldCheck, IconDeviceTv, IconScissors, IconPaw,
  IconArmchair, IconCreditCard, IconBriefcase, IconBuildingStore
} from '@tabler/icons-react'

type BudgetCardProps = {
  budget: Budget;
  onEdit?: (budget: Budget) => void;
  onDelete?: (budgetId: string) => void;
}

export default function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const getCategoryIcon = (categoryId: number) => {
    const size = 48;
    switch (categoryId) {
      case 1: return <IconChefHat size={size} />;
      case 2: return <IconBus size={size} />;
      case 3: return <IconFirstAidKit size={size} />;
      case 4: return <IconSchool size={size} />;
      case 5: return <IconBuildingCarousel size={size} />;
      case 6: return <IconShirt size={size} />;
      case 7: return <IconHome size={size} />;
      case 8: return <IconBulb size={size} />;
      case 9: return <IconCoin size={size} />;
      case 10: return <IconChartLine size={size} />;
      case 11: return <IconGift size={size} />;
      case 14: return <IconShieldCheck size={size} />;
      case 15: return <IconGrain size={size} />;
      case 16: return <IconDeviceTv size={size} />;
      case 17: return <IconScissors size={size} />;
      case 18: return <IconPaw size={size} />;
      case 19: return <IconArmchair size={size} />;
      case 20: return <IconCreditCard size={size} />;
      case 21: return <IconBriefcase size={size} />;
      case 22: return <IconBuildingStore size={size} />;
      default: return <IconGrain size={size} />;
    }
  };

  const getCategoryColor = (categoryId: number) => {
    switch (categoryId) {
      case 1: return '#F59E0B';
      case 2: return '#3B82F6';
      case 3: return '#EF4444';
      case 4: return '#8B5CF6';
      case 5: return '#EC4899';
      case 6: return '#06B6D4';
      case 7: return '#14B8A6';
      case 8: return '#F59E0B';
      case 9: return '#10B981';
      case 10: return '#059669';
      case 11: return '#EC4899';
      case 14: return '#3B82F6';
      case 15: return '#64748B';
      case 16: return '#8B5CF6';
      case 17: return '#EC4899';
      case 18: return '#F97316';
      case 19: return '#059669';
      case 20: return '#DC2626';
      case 21: return '#8B5CF6';
      case 22: return '#3B82F6';
      default: return '#64748B';
    }
  };

  return (
    <div className="card budget-card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <div className="budget-icon me-3" style={{ color: getCategoryColor(budget.categoryId) }}>
              {getCategoryIcon(budget.categoryId)}
            </div>
            <div>
              <h5 className="mb-0">{budget.categoryName}</h5>
              <small className="text-muted">
                {budget.periodType === 'weekly' ? 'Semanal' :
                 budget.periodType === 'biweekly' ? 'Quincenal' : 'Mensual'}
              </small>
            </div>
          </div>
          <div className="budget-actions">
            {onEdit && (
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => onEdit(budget)}
              >
                <IconEdit size={18} />
              </button>
            )}
            {onDelete && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(budget.id)}
              >
                <IconTrash size={18} />
              </button>
            )}
          </div>
        </div>

        <BudgetProgressBar
          spent={budget.totalSpent}
          limit={budget.limitAmount}
          categoryName={budget.categoryName}
          periodType={budget.periodType}
          periodEnd={budget.periodEnd}
          showDetails={true}
        />
      </div>
    </div>
  );
}
