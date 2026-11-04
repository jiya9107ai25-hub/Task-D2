import { useState } from 'react'

function Newsletter() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()

        if (loading) return

        setMessage('')
        setIsError(false)

        const cleanEmail = email.trim()

        const emailPattern =
            /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/

        if (
            !emailPattern.test(cleanEmail) ||
            cleanEmail.length > 254
        ) {
            setIsError(true)

            setMessage(
                'Please enter a valid email address.'
            )

            return
        }

        setLoading(true)

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/subscribe`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({
                        email: cleanEmail
                    })
                }
            )

            const data =
                await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    'Subscription failed. Please try again.'
                )
            }

            setMessage(
                data.message ||
                'Success! Your welcome email is on its way.'
            )

            setEmail('')

        } catch (error) {
            setIsError(true)

            setMessage(
                error instanceof TypeError
                    ? 'Unable to connect to the server. Please check your connection.'
                    : error instanceof SyntaxError
                        ? 'The server returned an unexpected response. Please try again.'
                        : error.message ||
                          'Something went wrong. Please try again.'
            )

        } finally {
            setLoading(false)
        }
    }

    return (
        <section
            id="subscribe"
            className="bg-gray-200 py-8 px-6"
        >
            <div className="max-w-6xl mx-auto">

                <div className="flex flex-col md:flex-row items-center justify-between gap-5">

                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                        SIGN UP FOR OUR DAILY INSIDER
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        aria-busy={loading}
                        className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
                    >

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            aria-label="Email address"
                            autoComplete="email"
                            required
                            maxLength={254}
                            disabled={loading}
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            className="bg-white border border-gray-300 rounded-lg px-4 py-3 w-full sm:w-72"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gray-800 text-white rounded-lg px-6 py-3 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? 'Subscribing...'
                                : 'Subscribe'}
                        </button>

                    </form>

                </div>

                <p
                    role="status"
                    aria-live="polite"
                    className={`text-sm mt-3 text-right ${
                        isError
                            ? 'text-red-700'
                            : 'text-green-700'
                    }`}
                >
                    {message}
                </p>

            </div>
        </section>
    )
}

export default Newsletter