'use client'

import { useEffect, useState } from 'react'
import axios from "axios"
import IncomeExpenseCard from "../../components/IncomeExpenseCard"
import EmptyState from "../../components/EmptyState"
import { IconReceipt } from "@tabler/icons-react"

const AllExpenses = () => {
    const [expenses, setExpenses] = useState([])
    const [amount, setAmount] = useState(0.0)

    axios.defaults.withCredentials = true

    useEffect(() => {
        const email = localStorage.getItem('email')

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/expenses/${email}`).then((res) => {
            setExpenses(res.data)
        }).catch((err) => {
            console.log(err)
        })

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/expenses/totalAmount/${email}`).then((res) => {
            setAmount(res.data[0].totalAmount)
        }).catch((err) => {
            console.log(err)
        })

    }, [])

  return (
    <div className='container'>
        <div className="row mt-2 text-center">
            <div className="col">
                <h2>
                    Todos los Gastos
                </h2>
            </div>
        </div>
        {expenses.length > 0 && (
            <div className="row mt-2 text-center">
                <p className='h4 fw-normal'>Total gastado: <span className='text-info-emphasis'>{amount}</span></p>
            </div>
        )}
        <div className="row width-50 mt-3 mx-auto">
            <div className="col">
                {expenses.length > 0 ? (
                    expenses.map((expense: { id: string, description: string, categoryId: number, amount: number, date: string }) => (
                        <IncomeExpenseCard
                            key={expense.id}
                            description={expense.description}
                            category={expense.categoryId}
                            amount={expense.amount}
                            date={expense.date}
                        />
                    ))
                ) : (
                    <EmptyState
                        icon={<IconReceipt />}
                        title="No hay gastos registrados"
                        message="Aún no has registrado ningún gasto. ¿Quieres empezar a controlar tus finanzas?"
                        actionText="Agregar primer gasto"
                        actionLink="/expense"
                    />
                )}
            </div>
        </div>
    </div>
  )
}

export default AllExpenses