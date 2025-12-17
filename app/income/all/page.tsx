'use client'

import { useEffect, useState } from 'react'
import axios from "axios"
import IncomeExpenseCard from "../../components/IncomeExpenseCard"
import Link from "next/link"

const AllIncomes = () => {
    const [incomes, setIncomes] = useState([])
    const [amount, setAmount] = useState(0.0)

    axios.defaults.withCredentials = true

    useEffect(() => {
        const email = localStorage.getItem('email')

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/incomes/${email}`).then((res) => {
            setIncomes(res.data)
        }).catch((err) => {
            console.log(err)
        })

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/incomes/total/${email}`).then((res) => {
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
                    Todos los Ingresos
                </h2>
            </div>
        </div>
        <div className="row mt-2 text-center">
            <p className='h4 fw-normal'>Total ingresado: <span className='text-info-emphasis'>{amount}</span></p> 
        </div>
        <div className="row width-50 mt-3 mx-auto">
            <div className="col">
                {incomes.map((income: { id: string, description: string, categoryId: number, amount: number, date: string }) => (
                    <IncomeExpenseCard
                        key={income.id}
                        description={income.description}
                        category={income.categoryId}
                        amount={income.amount}
                        date={income.date}
                    />
                ))}            
            </div>
        </div>
    </div>
  )
}

export default AllIncomes