import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Pricing({ user, onUserUpdate }) {
    const navigate = useNavigate()

    const [showModal, setShowModal] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const [form, setForm] = useState({
        nameOnCard: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    })

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    function updateForm(changes) {
        setForm((previous) => ({
            ...previous,
            ...changes
        }))
    }

    function handleUpgradeClick() {
        setMessage('')

        if (!user) {
            setMessage(
                'Please login before upgrading your plan.'
            )
            return
        }

        if (user.plan === 'paid') {
            setMessage(
                'You are already on the Paid plan.'
            )
            return
        }

        setShowModal(true)
    }

    async function handleUpgrade(event) {
        event.preventDefault()

        setMessage('')

        const cleanName =
            form.nameOnCard.trim()

        const cleanCard =
            form.cardNumber.replace(/\s/g, '')

        const cleanExpiry =
            form.expiry.trim()

        const cleanCvv =
            form.cvv.trim()

        if (!cleanName) {
            setMessage(
                'Please enter the name on the card.'
            )
            return
        }

        if (!/^\d{16}$/.test(cleanCard)) {
            setMessage(
                'Card number must contain 16 digits.'
            )
            return
        }

        if (
            !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
                cleanExpiry
            )
        ) {
            setMessage(
                'Expiry must be in MM/YY format.'
            )
            return
        }

        if (!/^\d{3,4}$/.test(cleanCvv)) {
            setMessage(
                'Please enter a valid CVV.'
            )
            return
        }

        const token =
            localStorage.getItem('token')

        if (!token) {
            setMessage(
                'Your login session could not be found. Please login again.'
            )
            return
        }

        try {
            setLoading(true)

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/upgrade-plan`,
                {
                    method: 'PATCH',

                    headers: {
                        'Content-Type':
                            'application/json',

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        nameOnCard: cleanName,
                        cardNumber: cleanCard,
                        expiry: cleanExpiry,
                        cvv: cleanCvv
                    })
                }
            )

            const data =
                await response.json()

            if (!response.ok) {
                setMessage(
                    data.message ||
                    'Unable to upgrade your plan.'
                )
                return
            }

            localStorage.setItem(
                'user',
                JSON.stringify(data.user)
            )

            onUserUpdate(data.user)

            setShowModal(false)

            setForm({
                nameOnCard: '',
                cardNumber: '',
                expiry: '',
                cvv: ''
            })

            setMessage('')
            setShowSuccess(true)

        } catch (error) {
            console.error(
                'Upgrade error:',
                error
            )

            setMessage(
                'Unable to connect to the server. Please try again.'
            )

        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-[80vh] bg-gray-50 px-6 py-14">

            <div className="max-w-5xl mx-auto">

                <div className="text-center mb-12">

                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Choose Your Plan
                    </h1>

                    <p className="text-gray-600">
                        Choose the plan that best suits your DEV@Deakin experience.
                    </p>

                    {user && (
                        <p className="mt-4 font-semibold text-blue-600">
                            Current Plan:{' '}
                            {user.plan === 'paid'
                                ? 'Paid'
                                : 'Free'}
                        </p>
                    )}

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">

                        <h2 className="text-2xl font-bold mb-3">
                            Free
                        </h2>

                        <p className="text-4xl font-bold mb-6">
                            $0
                        </p>

                        <ul className="space-y-3 text-gray-700 mb-8">
                            <li>✓ Up to 5 posts per month</li>
                            <li>✓ Standard image uploads</li>
                            <li>✓ Access to public articles</li>
                            <li>✓ Basic DEV@Deakin features</li>
                        </ul>

                        <button
                            type="button"
                            disabled
                            className="w-full bg-gray-200 text-gray-600 py-3 rounded"
                        >
                            Free Plan
                        </button>

                    </div>

                    <div className="bg-white border-2 border-blue-500 rounded-lg p-8 shadow-md">

                        <div className="flex justify-between items-center mb-3">

                            <h2 className="text-2xl font-bold">
                                Paid
                            </h2>

                            <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                                Premium
                            </span>

                        </div>

                        <p className="text-4xl font-bold mb-6">

                            $9.99

                            <span className="text-base font-normal text-gray-500">
                                /month
                            </span>

                        </p>

                        <ul className="space-y-3 text-gray-700 mb-8">
                            <li>✓ Unlimited posts</li>
                            <li>✓ Larger image uploads</li>
                            <li>✓ Premium articles</li>
                            <li>✓ Priority features</li>
                            <li>✓ Enhanced DEV@Deakin experience</li>
                        </ul>

                        <button
                            type="button"
                            onClick={handleUpgradeClick}
                            disabled={
                                user?.plan === 'paid'
                            }
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 rounded"
                        >
                            {user?.plan === 'paid'
                                ? 'Current Plan'
                                : 'Upgrade Plan'}
                        </button>

                    </div>

                </div>

                {message && !showModal && (
                    <div className="text-center mt-8">

                        <p className="text-red-600 mb-4">
                            {message}
                        </p>

                        {!user && (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate('/login')
                                }
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
                            >
                                Go to Login
                            </button>
                        )}

                    </div>
                )}

            </div>

            {showModal && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">

                    <div className="bg-white w-full max-w-md rounded-lg p-8 shadow-xl">

                        <h2 className="text-2xl font-bold mb-2">
                            Upgrade to Paid
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Enter your payment details.
                        </p>

                        <form onSubmit={handleUpgrade}>

                            <div className="mb-4">

                                <label
                                    htmlFor="nameOnCard"
                                    className="block font-medium mb-2"
                                >
                                    Name on card
                                </label>

                                <input
                                    id="nameOnCard"
                                    type="text"
                                    value={
                                        form.nameOnCard
                                    }
                                    onChange={(event) =>
                                        updateForm({
                                            nameOnCard:
                                                event.target.value
                                        })
                                    }
                                    disabled={loading}
                                    className="w-full border border-gray-300 px-4 py-3"
                                />

                            </div>

                            <div className="mb-4">

                                <label
                                    htmlFor="cardNumber"
                                    className="block font-medium mb-2"
                                >
                                    Card number
                                </label>

                                <input
                                    id="cardNumber"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="19"
                                    value={
                                        form.cardNumber
                                    }
                                    onChange={(event) =>
                                        updateForm({
                                            cardNumber:
                                                event.target.value
                                        })
                                    }
                                    disabled={loading}
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full border border-gray-300 px-4 py-3"
                                />

                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">

                                <div>

                                    <label
                                        htmlFor="expiry"
                                        className="block font-medium mb-2"
                                    >
                                        Expiry
                                    </label>

                                    <input
                                        id="expiry"
                                        type="text"
                                        maxLength="5"
                                        value={
                                            form.expiry
                                        }
                                        onChange={(event) =>
                                            updateForm({
                                                expiry:
                                                    event.target.value
                                            })
                                        }
                                        disabled={loading}
                                        placeholder="MM/YY"
                                        className="w-full border border-gray-300 px-4 py-3"
                                    />

                                </div>

                                <div>

                                    <label
                                        htmlFor="cvv"
                                        className="block font-medium mb-2"
                                    >
                                        CVV
                                    </label>

                                    <input
                                        id="cvv"
                                        type="password"
                                        inputMode="numeric"
                                        maxLength="4"
                                        value={
                                            form.cvv
                                        }
                                        onChange={(event) =>
                                            updateForm({
                                                cvv:
                                                    event.target.value
                                            })
                                        }
                                        disabled={loading}
                                        placeholder="123"
                                        className="w-full border border-gray-300 px-4 py-3"
                                    />

                                </div>

                            </div>

                            {message && (
                                <p
                                    role="alert"
                                    className="text-red-600 text-center mb-5"
                                >
                                    {message}
                                </p>
                            )}

                            <div className="flex gap-3 mt-6">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false)
                                        setMessage('')
                                    }}
                                    disabled={loading}
                                    className="flex-1 border border-gray-300 py-3 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 rounded"
                                >
                                    {loading
                                        ? 'Upgrading...'
                                        : 'Confirm Upgrade'}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {showSuccess && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">

                    <div className="bg-white w-full max-w-md rounded-lg p-8 shadow-xl text-center">

                        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">

                            <span className="text-3xl text-green-600">
                                ✓
                            </span>

                        </div>

                        <h2 className="text-2xl font-bold mb-3">
                            Upgrade Successful!
                        </h2>

                        <p className="text-gray-600 mb-7">
                            You are now on the Paid plan.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setShowSuccess(false)
                            }
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded"
                        >
                            Done
                        </button>

                    </div>

                </div>
            )}

        </main>
    )
}

export default Pricing