import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login({ onLogin }) {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        email: '',
        password: '',
        message: '',
        loading: false
    })

    function updateForm(changes) {
        setForm((previous) => ({
            ...previous,
            ...changes
        }))
    }

    async function handleLogin(event) {
        event.preventDefault()

        if (form.loading) {
            return
        }

        updateForm({
            message: ''
        })

        const cleanEmail =
            form.email.trim().toLowerCase()

        if (!cleanEmail || !form.password) {
            updateForm({
                message:
                    'Please enter your email and password.'
            })
            return
        }

        try {
            updateForm({
                loading: true
            })

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/login`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({
                        email: cleanEmail,
                        password: form.password
                    })
                }
            )

            const data =
                await response.json()

            if (!response.ok) {
                updateForm({
                    message:
                        data.message ||
                        'Incorrect email or password.'
                })

                return
            }

            // Save JWT in browser storage
            localStorage.setItem(
                'token',
                data.token
            )

            // Save user information so the
            // session can remain after refresh
            localStorage.setItem(
                'user',
                JSON.stringify(data.user)
            )

            // Update user state in App.jsx
            onLogin(data.user)

            // Return to home page
            navigate('/', {
                replace: true
            })

        } catch (error) {
            console.error(
                'Login error:',
                error
            )

            updateForm({
                message:
                    'Unable to connect to the server. Please try again.'
            })

        } finally {
            updateForm({
                loading: false
            })
        }
    }

    return (
        <main className="min-h-[80vh] flex items-center justify-center px-6">

            <div className="w-full max-w-md border border-blue-400 p-10">

                <div className="flex justify-end mb-6">

                    <Link
                        to="/signup"
                        className="border border-blue-400 px-4 py-2 text-blue-600 hover:bg-blue-50"
                    >
                        Sign up
                    </Link>

                </div>

                <form onSubmit={handleLogin}>

                    <div className="mb-6">

                        <label
                            htmlFor="email"
                            className="block font-medium mb-2"
                        >
                            Your email
                        </label>

                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={(event) =>
                                updateForm({
                                    email:
                                        event.target.value
                                })
                            }
                            required
                            disabled={form.loading}
                            className="w-full border border-gray-300 px-4 py-3"
                        />

                    </div>

                    <div className="mb-8">

                        <label
                            htmlFor="password"
                            className="block font-medium mb-2"
                        >
                            Your password
                        </label>

                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={form.password}
                            onChange={(event) =>
                                updateForm({
                                    password:
                                        event.target.value
                                })
                            }
                            required
                            disabled={form.loading}
                            className="w-full border border-gray-300 px-4 py-3"
                        />

                    </div>

                    {form.message && (
                        <p
                            role="alert"
                            className="text-red-600 text-center mb-5"
                        >
                            {form.message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={form.loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3"
                    >
                        {form.loading
                            ? 'Logging in...'
                            : 'Login'}
                    </button>

                </form>

                <div className="text-center mt-6">

                    <Link
                        to="/signup"
                        className="text-blue-600 hover:underline"
                    >
                        Don't have an account? Sign up
                    </Link>

                </div>

            </div>

        </main>
    )
}

export default Login