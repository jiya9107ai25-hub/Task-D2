import ArticleCard from './ArticleCard.jsx'

function Articles() {

    const articles = [
        {
            id: 1,
            title: "React vs Vue",
            description: "Understanding two popular frontend frameworks.",
            rating: "5.0",
            author: "Jiya Arora",
            image: "/images/article1.png"
        },
        {
            id: 2,
            title: "Node.js for Beginners",
            description: "An introduction to Node.js and how JavaScript can be used to build server-side applications.",
            rating: "5.0",
            author: "Jiya Arora",
            image: "/images/article2.png"
        },
        {
            id: 3,
            title: "Understanding React Hooks",
            description: "Learn how React Hooks such as useState and useEffect help manage state and side effects in functional components.",
            rating: "4.9",
            author: "Jiya Arora",
            image: "/images/article3.png"
        }
    ]

    return (
        <section id="articles" className="bg-gray-50 py-14">

            <div className="max-w-6xl mx-auto px-8">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                    Featured Articles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {articles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                        />
                    ))}

                </div>

                <div className="text-center mt-10">

                    <a
                        href="#articles"
                        className="inline-block bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-gray-700 transition-colors"
                    >
                        See all articles
                    </a>

                </div>

            </div>

        </section>
    )
}

export default Articles