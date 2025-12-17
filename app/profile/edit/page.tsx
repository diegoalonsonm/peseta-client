'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const EditPage = () => {
    const [nameInput, setNameInput] = useState('')
    const [lastNameInput, setLastNameInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('')

    const [nameData, setNameData] = useState('')
    const [lastNameData, setLastNameData] = useState('')
    const [passwordData, setPasswordData] = useState('')

    var email = ''

    if (typeof window !== 'undefined') {
        email = localStorage.getItem('email') ?? ''
    }

    const data = {nameData, lastNameData, passwordData, email}
    
    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${email}`).then(res => {
            setNameInput(res.data[0].name)
            setLastNameInput(res.data[0].lastName)
            setPasswordInput(res.data[0].password)
        }).catch(err => {
            console.log(err)
        })
    }, [email])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (passwordData !== confirmPasswordInput) {
            Swal.fire({
                icon: 'error',
                title: 'Ups...',
                text: 'Las contraseñas no coinciden'
            })
            return
        }

        if (passwordData === '' || confirmPasswordInput === '') {
            setPasswordData(passwordInput)
        }

        if (nameData === '') {
            setNameData(nameInput)
        }

        if (lastNameData === '') {
            setLastNameData(lastNameInput)
        }

        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${email}`, data).then(res => {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Tu información ha sido actualizada'
            })
        }).catch(err => {
            console.log(err)
        })

    }

    return (
        <div className="container">
            <div className="row text-center mt-3">
                <div className="col">
                    <h2>
                        Edita tu información
                    </h2>
                </div>
            </div>
            <div className="row mx-auto width-50 mt-2">
                <div className="col">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="name">Nombre</label>
                            <input type="text" className="form-control" id="name" placeholder={nameInput} 
                                onChange={e => setNameData(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="lastName">Apellido</label>
                            <input type="text" className="form-control" id="lastName" placeholder={lastNameInput}
                                onChange={e => setLastNameData(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" className="form-control" id="password" placeholder="Contraseña" 
                                onChange={e => setPasswordData(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                            <input type="password" className="form-control" id="confirmPassword" placeholder="Confirmar Contraseña"
                                onChange={e => setConfirmPasswordInput(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-info text-white">Enviar cambios</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditPage