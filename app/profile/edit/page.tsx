'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { Input } from '../../components/Input'
import BackButton from '../../components/BackButton'
import Breadcrumbs from '../../components/Breadcrumbs'
import PasswordStrength from '../../components/PasswordStrength'
import { IconUser, IconLock, IconDeviceFloppy, IconX } from '@tabler/icons-react'

const EditPage = () => {
    const [nameInput, setNameInput] = useState('')
    const [lastNameInput, setLastNameInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [nameData, setNameData] = useState('')
    const [lastNameData, setLastNameData] = useState('')
    const [passwordData, setPasswordData] = useState('')

    const [nameError, setNameError] = useState('')
    const [lastNameError, setLastNameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')

    const router = useRouter()

    var email = ''

    if (typeof window !== 'undefined') {
        email = localStorage.getItem('email') ?? ''
    }

    const data = {nameData, lastNameData, passwordData, email}

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${email}`).then(res => {
            setNameInput(res.data[0].name)
            setLastNameInput(res.data[0].lastName)
        }).catch(err => {
            console.log(err)
        })
    }, [email])

    const validateName = (name: string) => {
        if (name && name.trim().length < 2) {
            setNameError('El nombre debe tener al menos 2 caracteres')
            return false
        }
        setNameError('')
        return true
    }

    const validateLastName = (lastName: string) => {
        if (lastName && lastName.trim().length < 2) {
            setLastNameError('El apellido debe tener al menos 2 caracteres')
            return false
        }
        setLastNameError('')
        return true
    }

    const validatePassword = (password: string) => {
        if (password && password.length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres')
            return false
        }
        setPasswordError('')
        return true
    }

    const validateConfirmPassword = (confirmPassword: string) => {
        if (passwordData && confirmPassword !== passwordData) {
            setConfirmPasswordError('Las contraseñas no coinciden')
            return false
        }
        setConfirmPasswordError('')
        return true
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setNameData(value)
        if (value) validateName(value)
    }

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setLastNameData(value)
        if (value) validateLastName(value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPasswordData(value)
        if (value) validatePassword(value)
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setConfirmPasswordInput(value)
        if (value) validateConfirmPassword(value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validate changed fields
        const isNameValid = nameData ? validateName(nameData) : true
        const isLastNameValid = lastNameData ? validateLastName(lastNameData) : true
        const isPasswordValid = passwordData ? validatePassword(passwordData) : true
        const isConfirmPasswordValid = passwordData ? validateConfirmPassword(confirmPasswordInput) : true

        if (!isNameValid || !isLastNameValid || !isPasswordValid || !isConfirmPasswordValid) {
            return
        }

        if (passwordData && passwordData !== confirmPasswordInput) {
            Swal.fire({
                icon: 'error',
                title: 'Ups...',
                text: 'Las contraseñas no coinciden'
            })
            return
        }

        // Only send fields that have values (user explicitly filled them in)
        const updates: any = {}

        if (nameData && nameData.trim()) updates.name = nameData
        if (lastNameData && lastNameData.trim()) updates.lastName = lastNameData
        if (passwordData && passwordData.trim()) updates.password = passwordData

        // Check if user made any changes
        if (Object.keys(updates).length === 0) {
            Swal.fire({
                title: 'Sin cambios',
                text: 'No has realizado ningún cambio en tu perfil',
                icon: 'info'
            })
            return
        }

        setIsSubmitting(true)

        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${email}`, updates).then(res => {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Tu información ha sido actualizada'
            })
            router.push('/profile')
        }).catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar tu información'
            })
            console.log(err)
        }).finally(() => {
            setIsSubmitting(false)
        })
    }

    return (
        <div className="container mt-4 mb-5">
            <Breadcrumbs
                items={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Mi Perfil', href: '/profile' },
                    { label: 'Editar' }
                ]}
            />
            <BackButton href="/profile" text="Volver al perfil" />

            <div className="row mb-4 mt-3">
                <div className="col">
                    <h2 className="text-center mb-1">Editar Información</h2>
                    <p className="text-center text-muted">Actualiza tu información personal</p>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <form onSubmit={handleSubmit}>
                        {/* Personal Information Section */}
                        <div className="form-card mb-4">
                            <h3 className="form-section-title">
                                <IconUser size={24} className="me-2" />
                                Información Personal
                            </h3>

                            <Input
                                type="text"
                                id="name"
                                label="Nombre"
                                value={nameData}
                                onChange={handleNameChange}
                                error={nameError}
                                isValid={!nameError && nameData.length > 0}
                                placeholder={nameInput}
                                disabled={isSubmitting}
                                icon={<IconUser size={20} />}
                                floatingLabel={true}
                                helperText="Deja vacío para mantener el actual"
                            />

                            <Input
                                type="text"
                                id="lastName"
                                label="Apellido"
                                value={lastNameData}
                                onChange={handleLastNameChange}
                                error={lastNameError}
                                isValid={!lastNameError && lastNameData.length > 0}
                                placeholder={lastNameInput}
                                disabled={isSubmitting}
                                icon={<IconUser size={20} />}
                                floatingLabel={true}
                                helperText="Deja vacío para mantener el actual"
                            />
                        </div>

                        {/* Security Section */}
                        <div className="form-card mb-4">
                            <h3 className="form-section-title">
                                <IconLock size={24} className="me-2" />
                                Cambiar Contraseña
                            </h3>

                            <div className="mb-3">
                                <Input
                                    type="password"
                                    id="password"
                                    label="Nueva Contraseña"
                                    value={passwordData}
                                    onChange={handlePasswordChange}
                                    error={passwordError}
                                    isValid={!passwordError && passwordData.length >= 6}
                                    placeholder="Deja vacío para no cambiar"
                                    disabled={isSubmitting}
                                    icon={<IconLock size={20} />}
                                    floatingLabel={true}
                                    helperText="Mínimo 6 caracteres"
                                />
                                {passwordData && <PasswordStrength password={passwordData} />}
                            </div>

                            <Input
                                type="password"
                                id="confirmPassword"
                                label="Confirmar Nueva Contraseña"
                                value={confirmPasswordInput}
                                onChange={handleConfirmPasswordChange}
                                error={confirmPasswordError}
                                isValid={!confirmPasswordError && confirmPasswordInput.length > 0 && confirmPasswordInput === passwordData}
                                placeholder="Confirma tu nueva contraseña"
                                disabled={isSubmitting || !passwordData}
                                icon={<IconLock size={20} />}
                                floatingLabel={true}
                            />
                        </div>

                        {/* Actions */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => router.push('/profile')}
                                disabled={isSubmitting}
                            >
                                <IconX size={20} className="me-1" />
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <IconDeviceFloppy size={20} className="me-1" />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditPage