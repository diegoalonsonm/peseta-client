export type ButtonProps = {
    type: "submit" | "button" | "reset" | undefined,
    text: string,
    className: string,
    onClick?: () => void,
    icon?: React.JSX.Element
}

export type InputProps = {
    type: string,
    id: string,
    label?: string,
    className?: string,
    ariaDescribedby?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value?: string,
    placeholder?: string,
    required?: boolean,
    error?: string,
    isValid?: boolean,
    disabled?: boolean,
    min?: string,
    step?: string,
    icon?: React.ReactNode,
    helperText?: string,
    floatingLabel?: boolean
}

export type LayoutProps = {
    lang: string,
    children: React.ReactNode,
    className: string
}

export type IncomeExpenseProps = {
    id?: string,
    amount: number,
    description: string,
    date: string,
    category: number
}

export type PeriodType = 'weekly' | 'biweekly' | 'monthly';

export type Budget = {
    id: string;
    userId: string;
    categoryId: number;
    categoryName: string;
    limitAmount: number;
    periodType: PeriodType;
    startDate: string;
    totalSpent: number;
    remaining: number;
    percentUsed: number;
    periodStart: string;
    periodEnd: string;
    isOverBudget: boolean;
    isNearLimit: boolean;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export type BudgetFormData = {
    categoryId: number;
    limitAmount: string;
    periodType: PeriodType;
    startDate: string;
};

export type BudgetAlerts = {
    totalAlerts: number;
    overBudget: Budget[];
    nearLimit: Budget[];
};