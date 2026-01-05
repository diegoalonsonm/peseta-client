'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import IncomeExpenseCard from "./components/IncomeExpenseCard";
import EmptyState from "./components/EmptyState";
import Spinner from "./components/Spinner";
import BalanceCard from "./components/BalanceCard";
import Link from "next/link";
import { IconReceipt, IconCoin } from "@tabler/icons-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [expenses, setExpenses] = useState([])
  const [incomes, setIncomes] = useState([])
  const [balance, setBalance] = useState(0.0)
  const router = useRouter()

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const email = localStorage.getItem('email')

    // Check authentication first
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/`).then((res) => {
      if (res.status === 401) {
        router.push('/login')
        return
      }

      // If authenticated, fetch all data in parallel
      Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/balance/${email}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/expenses/lastFive/${email}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/incomes/lastFive/${email}`)
      ]).then(([balanceRes, expensesRes, incomesRes]) => {
        setBalance(balanceRes.data)
        setExpenses(expensesRes.data)
        setIncomes(incomesRes.data)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setIsLoading(false)
      })
    }).catch((err) => {
      console.log(err)
      router.push('/login')
    })
  }, [router])

  if (isLoading) {
    return (
      <main className="container">
        <div className="loading-container">
          <Spinner size="lg" color="primary" />
          <p className="loading-text">Cargando tu información...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container">
      <div className="mx-auto my-5">
        <BalanceCard balance={balance} />
        <div className="row">
          <div className="col-12 col-md-6">
            <h4 className="mt-5 mb-3">
              Tus últimos 5 gastos
            </h4>
            <div>
              {expenses.length > 0 ? (
                <>
                  {expenses.map((expense: { id: string, description: string, categoryId: number, amount: number, date: string }) => (
                    <IncomeExpenseCard
                      key={expense.id}
                      description={expense.description}
                      category={expense.categoryId}
                      amount={expense.amount}
                      date={expense.date}
                    />
                  ))}
                  <div className="mt-3">
                    <Link className="btn btn-info text-white" href="/expense">
                      Agregar nuevo gasto
                    </Link>
                    <Link className="btn btn-secondary ms-2" href="/expense/all">
                      Ver todos los gastos
                    </Link>
                  </div>
                </>
              ) : (
                <EmptyState
                  icon={<IconReceipt />}
                  title="No hay gastos aún"
                  message="¿Listo para registrar tu primer gasto y empezar a controlar tus finanzas?"
                  actionText="Agregar primer gasto"
                  actionLink="/expense"
                />
              )}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <h4 className="mt-5 mb-3">
              Tus últimos 5 ingresos
            </h4>
            <div>
              {incomes.length > 0 ? (
                <>
                  {incomes.map((income: { id: string, description: string, categoryId: number, amount: number, date: string }) => (
                    <IncomeExpenseCard
                      key={income.id}
                      description={income.description}
                      category={income.categoryId}
                      amount={income.amount}
                      date={income.date}
                    />
                  ))}
                  <div className="mt-3">
                    <Link className="btn btn-info text-white" href="/income">
                      Agregar nuevo ingreso
                    </Link>
                    <Link className="btn btn-secondary ms-2" href="/income/all">
                      Ver todos los ingresos
                    </Link>
                  </div>
                </>
              ) : (
                <EmptyState
                  icon={<IconCoin />}
                  title="No hay ingresos aún"
                  message="Comienza agregando tu primer ingreso para tener un mejor control de tus finanzas."
                  actionText="Agregar primer ingreso"
                  actionLink="/income"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
