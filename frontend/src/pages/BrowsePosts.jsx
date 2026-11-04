import { useEffect, useMemo, useState } from 'react'

function BrowsePosts() {
    const [posts, setPosts] = useState([])
    const [viewerPlan, setViewerPlan] = useState('visitor')
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    const [postTypeFilter, setPostTypeFilter] = useState('all')
    const [planFilter, setPlanFilter] = useState('all')
    const [tagFilter, setTagFilter] = useState('')
    const [dateFilter, setDateFilter] = useState('all')
    const [sortOrder, setSortOrder] = useState('newest')

    const [hiddenPostIds, setHiddenPostIds] = useState([])
    const [expandedPostIds, setExpandedPostIds] = useState([])

    useEffect(() => {
        loadPosts()
    }, [])

    async function loadPosts() {
        setLoading(true)
        setMessage('')

        try {
            const token =
                localStorage.getItem('token')

            const headers = {}

            if (token) {
                headers.Authorization =
                    `Bearer ${token}`
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/posts`,
                {
                    method: 'GET',
                    headers
                }
            )

            const data =
                await response.json()

            if (!response.ok) {
                setMessage(
                    data.message ||
                    'Unable to load posts.'
                )
                return
            }

            setPosts(
                Array.isArray(data.posts)
                    ? data.posts
                    : []
            )

            setViewerPlan(
                data.viewerPlan ||
                'visitor'
            )

        } catch (error) {
            console.error(
                'Browse posts error:',
                error
            )

            setMessage(
                'Unable to connect to the server.'
            )

        } finally {
            setLoading(false)
        }
    }

    function hidePost(postId) {
        setHiddenPostIds(
            (previous) => [
                ...previous,
                postId
            ]
        )
    }

    function toggleExpand(postId) {
        setExpandedPostIds(
            (previous) => {
                if (
                    previous.includes(postId)
                ) {
                    return previous.filter(
                        (id) =>
                            id !== postId
                    )
                }

                return [
                    ...previous,
                    postId
                ]
            }
        )
    }

    function handleReset() {
        setPostTypeFilter('all')
        setPlanFilter('all')
        setTagFilter('')
        setDateFilter('all')
        setSortOrder('newest')

        setHiddenPostIds([])
        setExpandedPostIds([])
    }

    function getPostContent(post) {
        if (
            post.postType === 'article'
        ) {
            return (
                post.articleText ||
                post.abstract ||
                ''
            )
        }

        return (
            post.description ||
            ''
        )
    }

    function formatDate(dateValue) {
        if (!dateValue) {
            return 'Date unavailable'
        }

        const date =
            new Date(dateValue)

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return 'Date unavailable'
        }

        return date.toLocaleDateString(
            undefined,
            {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }
        )
    }

    const visiblePosts =
        useMemo(() => {
            let result =
                posts.filter(
                    (post) =>
                        !hiddenPostIds.includes(
                            post.id
                        )
                )

            // Filter by post type
            if (
                postTypeFilter !==
                'all'
            ) {
                result =
                    result.filter(
                        (post) =>
                            post.postType ===
                            postTypeFilter
                    )
            }

            // Filter by plan
            if (
                planFilter !== 'all'
            ) {
                result =
                    result.filter(
                        (post) =>
                            post.plan ===
                            planFilter
                    )
            }

            // Filter by tags
            const cleanTag =
                tagFilter
                    .trim()
                    .toLowerCase()

            if (cleanTag) {
                result =
                    result.filter(
                        (post) =>
                            Array.isArray(
                                post.tags
                            ) &&
                            post.tags.some(
                                (tag) =>
                                    String(tag)
                                        .toLowerCase()
                                        .includes(
                                            cleanTag
                                        )
                            )
                    )
            }

            // Filter by date
            if (
                dateFilter !== 'all'
            ) {
                const now =
                    new Date()

                result =
                    result.filter(
                        (post) => {
                            if (
                                !post.createdAt
                            ) {
                                return false
                            }

                            const postDate =
                                new Date(
                                    post.createdAt
                                )

                            if (
                                Number.isNaN(
                                    postDate.getTime()
                                )
                            ) {
                                return false
                            }

                            if (
                                dateFilter ===
                                'today'
                            ) {
                                return (
                                    postDate.toDateString() ===
                                    now.toDateString()
                                )
                            }

                            if (
                                dateFilter ===
                                'week'
                            ) {
                                const sevenDaysAgo =
                                    new Date()

                                sevenDaysAgo.setDate(
                                    now.getDate() -
                                    7
                                )

                                return (
                                    postDate >=
                                    sevenDaysAgo
                                )
                            }

                            return true
                        }
                    )
            }

            // Sort
            result = [
                ...result
            ].sort(
                (
                    firstPost,
                    secondPost
                ) => {
                    const firstDate =
                        firstPost.createdAt
                            ? new Date(
                                  firstPost.createdAt
                              ).getTime()
                            : 0

                    const secondDate =
                        secondPost.createdAt
                            ? new Date(
                                  secondPost.createdAt
                              ).getTime()
                            : 0

                    if (
                        sortOrder ===
                        'oldest'
                    ) {
                        return (
                            firstDate -
                            secondDate
                        )
                    }

                    return (
                        secondDate -
                        firstDate
                    )
                }
            )

            return result
        }, [
            posts,
            hiddenPostIds,
            postTypeFilter,
            planFilter,
            tagFilter,
            dateFilter,
            sortOrder
        ])

    return (
        <main className="min-h-[80vh] bg-gray-50 px-6 py-12">

            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-10">

                    <h1 className="text-4xl font-bold mb-3">
                        Browse Posts
                    </h1>

                    <p className="text-gray-600">
                        Browse Questions and Articles shared by the DEV@Deakin community.
                    </p>

                    <div className="mt-4">

                        <span className="font-semibold">
                            Your access:
                        </span>{' '}

                        <span className="text-blue-600 font-semibold capitalize">
                            {viewerPlan}
                        </span>

                    </div>

                </div>

                {/* FILTERS */}

                <div className="bg-white border border-gray-300 rounded-lg p-6 mb-8 shadow-sm">

                    <h2 className="text-xl font-bold mb-5">
                        Filter Posts
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                        <div>

                            <label className="block font-medium mb-2">
                                Post Type
                            </label>

                            <select
                                value={
                                    postTypeFilter
                                }
                                onChange={(event) =>
                                    setPostTypeFilter(
                                        event.target.value
                                    )
                                }
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                            >
                                <option value="all">
                                    All
                                </option>

                                <option value="question">
                                    Question
                                </option>

                                <option value="article">
                                    Article
                                </option>

                            </select>

                        </div>

                        <div>

                            <label className="block font-medium mb-2">
                                Plan
                            </label>

                            <select
                                value={
                                    planFilter
                                }
                                onChange={(event) =>
                                    setPlanFilter(
                                        event.target.value
                                    )
                                }
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                            >
                                <option value="all">
                                    All
                                </option>

                                <option value="free">
                                    Free
                                </option>

                                {viewerPlan ===
                                    'paid' && (
                                    <option value="paid">
                                        Paid
                                    </option>
                                )}

                            </select>

                        </div>

                        <div>

                            <label className="block font-medium mb-2">
                                Tag
                            </label>

                            <input
                                type="text"
                                value={tagFilter}
                                onChange={(event) =>
                                    setTagFilter(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. React"
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                            />

                        </div>

                        <div>

                            <label className="block font-medium mb-2">
                                Created
                            </label>

                            <select
                                value={
                                    dateFilter
                                }
                                onChange={(event) =>
                                    setDateFilter(
                                        event.target.value
                                    )
                                }
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                            >

                                <option value="all">
                                    Any time
                                </option>

                                <option value="today">
                                    Today
                                </option>

                                <option value="week">
                                    Last 7 days
                                </option>

                            </select>

                        </div>

                        <div>

                            <label className="block font-medium mb-2">
                                Sort
                            </label>

                            <select
                                value={
                                    sortOrder
                                }
                                onChange={(event) =>
                                    setSortOrder(
                                        event.target.value
                                    )
                                }
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                            >

                                <option value="newest">
                                    Newest first
                                </option>

                                <option value="oldest">
                                    Oldest first
                                </option>

                            </select>

                        </div>

                    </div>

                    <div className="mt-5 flex justify-end">

                        <button
                            type="button"
                            onClick={
                                handleReset
                            }
                            className="border border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded"
                        >
                            Reset
                        </button>

                    </div>

                </div>

                {/* ERROR */}

                {message && (
                    <p className="text-red-600 text-center mb-6">
                        {message}
                    </p>
                )}

                {/* LOADING */}

                {loading && (
                    <p className="text-center text-gray-600">
                        Loading posts...
                    </p>
                )}

                {/* EMPTY */}

                {!loading &&
                    !message &&
                    visiblePosts.length ===
                        0 && (

                    <div className="bg-white border border-gray-300 rounded-lg p-10 text-center">

                        <h2 className="text-xl font-bold mb-2">
                            No posts found
                        </h2>

                        <p className="text-gray-600">
                            Try changing your filters or resetting the page.
                        </p>

                    </div>
                )}

                {/* POSTS */}

                <div className="space-y-5">

                    {visiblePosts.map(
                        (post) => {
                            const isExpanded =
                                expandedPostIds.includes(
                                    post.id
                                )

                            const content =
                                getPostContent(
                                    post
                                )

                            const preview =
                                content.length >
                                180
                                    ? `${content.slice(
                                          0,
                                          180
                                      )}...`
                                    : content

                            return (
                                <article
                                    key={
                                        post.id
                                    }
                                    className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm"
                                >

                                    <div className="flex flex-wrap justify-between gap-4 mb-4">

                                        <div className="flex gap-2">

                                            <span className="bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-1 rounded-full uppercase">
                                                {
                                                    post.postType
                                                }
                                            </span>

                                            <span
                                                className={`text-sm font-semibold px-3 py-1 rounded-full uppercase ${
                                                    post.plan ===
                                                    'paid'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-green-100 text-green-700'
                                                }`}
                                            >
                                                {
                                                    post.plan
                                                }
                                            </span>

                                        </div>

                                        <span className="text-sm text-gray-500">
                                            {formatDate(
                                                post.createdAt
                                            )}
                                        </span>

                                    </div>

                                    <h2 className="text-2xl font-bold mb-3">
                                        {post.title}
                                    </h2>

                                    {post.postType ===
                                        'article' &&
                                        post.abstract && (

                                        <p className="text-gray-600 italic mb-3">
                                            {
                                                post.abstract
                                            }
                                        </p>

                                    )}

                                    <p className="text-gray-700 whitespace-pre-wrap mb-4">
                                        {isExpanded
                                            ? content
                                            : preview}
                                    </p>

                                    {Array.isArray(
                                        post.tags
                                    ) &&
                                        post.tags
                                            .length >
                                            0 && (

                                        <div className="flex flex-wrap gap-2 mb-4">

                                            {post.tags.map(
                                                (
                                                    tag,
                                                    index
                                                ) => (

                                                    <span
                                                        key={`${post.id}-${tag}-${index}`}
                                                        className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded"
                                                    >
                                                        #{tag}
                                                    </span>

                                                )
                                            )}

                                        </div>

                                    )}

                                    <div className="text-sm text-gray-500 mb-5">

                                        Posted by{' '}

                                        <span className="font-medium text-gray-700">
                                            {post.authorName ||
                                                'DEV@Deakin User'}
                                        </span>

                                    </div>

                                    <div className="flex gap-3">

                                        {content.length >
                                            180 && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleExpand(
                                                        post.id
                                                    )
                                                }
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
                                            >
                                                {isExpanded
                                                    ? 'Collapse'
                                                    : 'Expand'}
                                            </button>

                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                hidePost(
                                                    post.id
                                                )
                                            }
                                            className="border border-gray-400 hover:bg-gray-100 px-5 py-2 rounded"
                                        >
                                            Hide
                                        </button>

                                    </div>

                                </article>
                            )
                        }
                    )}

                </div>

            </div>

        </main>
    )
}

export default BrowsePosts