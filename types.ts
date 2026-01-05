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
    step?: string
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