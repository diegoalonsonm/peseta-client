"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { LineChart } from '../components/LineChart'
import { BarChart } from '../components/BarChart'
import { PieChart } from '../components/PieChart'
import Breadcrumbs from '../components/Breadcrumbs'
import { IconChartLine, IconChartBar, IconChartPie, IconCoin, IconReceipt, IconWallet } from '@tabler/icons-react'

const Stats = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [balance, setBalance] = useState(0)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  axios.defaults.withCredentials = true

  useEffect(() => {
    const email = localStorage.getItem('email')

    if (!email) {
      router.push('/login')
      return
    }

    setIsLoading(true)

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    // Fetch summary data
    Promise.all([
      axios.get(`${API_URL}/incomes/total/${email}`),
      axios.get(`${API_URL}/expenses/totalAmount/${email}`),
      axios.get(`${API_URL}/users/balance/${email}`)
    ]).then(([incomeRes, expenseRes, balanceRes]) => {
      setTotalIncome(parseFloat(incomeRes.data[0]?.totalAmount) || 0)
      setTotalExpense(parseFloat(expenseRes.data[0]?.totalAmount) || 0)
      setBalance(parseFloat(balanceRes.data) || 0)
    }).catch((err) => {
      console.log(err)
      if (err.response?.status === 401) {
        router.push('/login')
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }, [router])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="loading-text mt-3">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Estadísticas' }
        ]}
      />

      <div className={`sticky-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <h2 className="mb-0">Estadísticas Financieras</h2>
          <div className="year-selector-container">
            <label htmlFor="year-select" className="me-2 mb-0">Año:</label>
            <select
              id="year-select"
              className="year-selector"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 my-4">
        <div className="col-12 col-md-4">
          <div className="stat-card stat-card-income">
            <div className="stat-card-icon">
              <IconCoin size={32} />
            </div>
            <div className="stat-card-content">
              <h6 className="stat-card-label">Ingresos Totales</h6>
              <p className="stat-card-value">₡{totalIncome.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="stat-card stat-card-expense">
            <div className="stat-card-icon">
              <IconReceipt size={32} />
            </div>
            <div className="stat-card-content">
              <h6 className="stat-card-label">Gastos Totales</h6>
              <p className="stat-card-value">₡{totalExpense.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className={`stat-card ${balance >= 0 ? 'stat-card-balance-positive' : 'stat-card-balance-negative'}`}>
            <div className="stat-card-icon">
              <IconWallet size={32} />
            </div>
            <div className="stat-card-content">
              <h6 className="stat-card-label">Balance</h6>
              <p className="stat-card-value">₡{balance.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="row g-4 mb-5">
        {/* Line Chart - Income vs Expense */}
        <div className="col-12 col-lg-8">
          <div className="chart-container">
            <div className="chart-header">
              <IconChartLine size={24} className="me-2" />
              <h4 className="chart-title">Ingresos vs Gastos Mensuales</h4>
            </div>
            <div className="chart-body" style={{ height: '350px' }}>
              <LineChart year={selectedYear} />
            </div>
          </div>
        </div>

        {/* Pie Chart - Expense Categories */}
        <div className="col-12 col-lg-4">
          <div className="chart-container">
            <div className="chart-header">
              <IconChartPie size={24} className="me-2" />
              <h4 className="chart-title">Distribución de Gastos</h4>
            </div>
            <div className="chart-body" style={{ height: '350px' }}>
              <PieChart year={selectedYear} />
            </div>
          </div>
        </div>

        {/* Bar Chart - Top 5 Categories */}
        <div className="col-12">
          <div className="chart-container">
            <div className="chart-header">
              <IconChartBar size={24} className="me-2" />
              <h4 className="chart-title">Top 5 Categorías de Gastos</h4>
            </div>
            <div className="chart-body" style={{ height: '350px' }}>
              <BarChart year={selectedYear} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats
