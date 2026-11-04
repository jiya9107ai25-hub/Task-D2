import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Post({ user }) {
    const navigate = useNavigate()

    const [postType, setPostType] = useState('question')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [abstract, setAbstract] = useState('')
    const [articleText, setArticleText] = useState('')
    const [tags, setTags] = useState('')
    const [plan, setPlan] = useState('free')

    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(false)

    function resetForm() {
        setPostType('question')
        setTitle('')
        setDescription('')
        setAbstract('')
        setArticleText('')
        setTags('')
        setPlan('free')
    }

    async function handleSubmit(event) {
        event.preventDefault()

        setMessage('')
        setIsError(false)

        if (!user) {
            setIsError(true)
            setMessage(
                'You must be logged in to create a post.'
            )
            return
        }

        const cleanTitle =
            title.trim()

        if (!cleanTitle) {
            setIsError(true)
            setMessage(
                'Please enter a post title.'
            )
            return
        }

        if (
            cleanTitle.length < 3 ||
            cleanTitle.length > 150
        ) {
            setIsError(true)
            setMessage(
                'Title must contain between 3 and 150 characters.'
            )
            return
        }

        if (
            postType === 'question' &&
            !description.trim()
        ) {
            setIsError(true)
            setMessage(
                'Please describe your question.'
            )
            return
        }

        if (
            postType === 'article' &&
            !abstract.trim()
        ) {
            setIsError(true)
            setMessage(
                'Please enter an article abstract.'
            )
            return
        }

        if (
            postType === 'article' &&
            !articleText.trim()
        ) {
            setIsError(true)
            setMessage(
                'Please enter the article content.'
            )
            return
        }

        const token =
            localStorage.getItem('token')

        if (!token) {
            setIsError(true)
            setMessage(
                'Your login session could not be found. Please login again.'
            )
            return
        }

        const tagList =
            tags
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean)
                .slice(0, 3)

        try {
            setLoading(true)

            const response =
                await fetch(
                    `${import.meta.env.VITE_API_URL}/posts`,
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json',

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            postType,
                            title:
                                cleanTitle,

                            description:
                                description.trim(),

                            abstract:
                                abstract.trim(),

                            articleText:
                                articleText.trim(),

                            tags:
                                tagList,

                            plan
                        })
                    }
                )

            const data =
                await response.json()

            if (!response.ok) {
                setIsError(true)

                setMessage(
                    data.message ||
                    'Unable to create the post.'
                )

                return
            }

            setIsError(false)

            setMessage(
                'Post created successfully!'
            )

            resetForm()

        } catch (error) {
            console.error(
                'Create post error:',
                error
            )

            setIsError(true)

            setMessage(
                'Unable to connect to the server. Please try again.'
            )

        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return (
            <main className="min-h-[80vh] flex items-center justify-center px-6">

                <div className="w-full max-w-lg text-center border border-gray-300 bg-white p-10 rounded-lg shadow-sm">

                    <h1 className="text-3xl font-bold mb-4">
                        Create a Post
                    </h1>

                    <p className="text-gray-600 mb-7">
                        You must be logged in before you can submit a Question or Article.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate('/login')
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded"
                    >
                        Go to Login
                    </button>

                </div>

            </main>
        )
    }

    return (
        <main className="min-h-[80vh] bg-gray-50 px-6 py-12">

            <div className="max-w-3xl mx-auto bg-white border border-gray-300 rounded-lg shadow-sm p-8">

                <h1 className="text-3xl font-bold text-center mb-3">
                    Create a Post
                </h1>

                <p className="text-gray-600 text-center mb-8">
                    Submit a Question or Article to DEV@Deakin.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="mb-6">

                        <label className="block font-semibold mb-3">
                            Post Type
                        </label>

                        <div className="flex gap-6">

                            <label className="flex items-center gap-2">

                                <input
                                    type="radio"
                                    name="postType"
                                    value="question"
                                    checked={
                                        postType ===
                                        'question'
                                    }
                                    onChange={() =>
                                        setPostType(
                                            'question'
                                        )
                                    }
                                    disabled={loading}
                                />

                                Question

                            </label>

                            <label className="flex items-center gap-2">

                                <input
                                    type="radio"
                                    name="postType"
                                    value="article"
                                    checked={
                                        postType ===
                                        'article'
                                    }
                                    onChange={() =>
                                        setPostType(
                                            'article'
                                        )
                                    }
                                    disabled={loading}
                                />

                                Article

                            </label>

                        </div>

                    </div>

                    <div className="mb-6">

                        <label
                            htmlFor="title"
                            className="block font-semibold mb-2"
                        >
                            Title*
                        </label>

                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            maxLength="150"
                            className="w-full border border-gray-300 px-4 py-3 rounded"
                            placeholder="Enter a clear title"
                        />

                    </div>

                    {postType === 'question' && (

                        <div className="mb-6">

                            <label
                                htmlFor="description"
                                className="block font-semibold mb-2"
                            >
                                Describe your problem*
                            </label>

                            <textarea
                                id="description"
                                rows="7"
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                                className="w-full border border-gray-300 px-4 py-3 rounded resize-y"
                                placeholder="Describe your question in detail"
                            />

                        </div>

                    )}

                    {postType === 'article' && (
                        <>
                            <div className="mb-6">

                                <label
                                    htmlFor="abstract"
                                    className="block font-semibold mb-2"
                                >
                                    Abstract*
                                </label>

                                <textarea
                                    id="abstract"
                                    rows="3"
                                    value={abstract}
                                    onChange={(event) =>
                                        setAbstract(
                                            event.target.value
                                        )
                                    }
                                    disabled={loading}
                                    className="w-full border border-gray-300 px-4 py-3 rounded resize-y"
                                    placeholder="Write a short summary of your article"
                                />

                            </div>

                            <div className="mb-6">

                                <label
                                    htmlFor="articleText"
                                    className="block font-semibold mb-2"
                                >
                                    Article Text*
                                </label>

                                <textarea
                                    id="articleText"
                                    rows="10"
                                    value={articleText}
                                    onChange={(event) =>
                                        setArticleText(
                                            event.target.value
                                        )
                                    }
                                    disabled={loading}
                                    className="w-full border border-gray-300 px-4 py-3 rounded resize-y"
                                    placeholder="Write your article"
                                />

                            </div>
                        </>
                    )}

                    <div className="mb-6">

                        <label
                            htmlFor="tags"
                            className="block font-semibold mb-2"
                        >
                            Tags
                        </label>

                        <input
                            id="tags"
                            type="text"
                            value={tags}
                            onChange={(event) =>
                                setTags(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            className="w-full border border-gray-300 px-4 py-3 rounded"
                            placeholder="react, javascript, frontend"
                        />

                        <p className="text-sm text-gray-500 mt-2">
                            Enter up to 3 tags separated by commas.
                        </p>

                    </div>

                    <div className="mb-8">

                        <label className="block font-semibold mb-3">
                            Post Access*
                        </label>

                        <div className="flex gap-6">

                            <label className="flex items-center gap-2">

                                <input
                                    type="radio"
                                    name="plan"
                                    value="free"
                                    checked={
                                        plan ===
                                        'free'
                                    }
                                    onChange={() =>
                                        setPlan(
                                            'free'
                                        )
                                    }
                                    disabled={loading}
                                />

                                Free

                            </label>

                            <label className="flex items-center gap-2">

                                <input
                                    type="radio"
                                    name="plan"
                                    value="paid"
                                    checked={
                                        plan ===
                                        'paid'
                                    }
                                    onChange={() =>
                                        setPlan(
                                            'paid'
                                        )
                                    }
                                    disabled={loading}
                                />

                                Paid

                            </label>

                        </div>

                    </div>

                    {message && (

                        <p
                            role="status"
                            className={`text-center mb-6 ${
                                isError
                                    ? 'text-red-600'
                                    : 'text-green-600'
                            }`}
                        >
                            {message}
                        </p>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 rounded"
                    >
                        {loading
                            ? 'Posting...'
                            : 'Post'}
                    </button>

                </form>

            </div>

        </main>
    )
}

export default Post