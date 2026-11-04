import TutorialCard from './TutorialCard.jsx'

function Tutorials() {

    const tutorials = [
        {
            id: 1,
            title: "JavaScript ES6",
            description: "Learn modern JavaScript features including arrow functions, template literals and destructuring.",
            rating: "5.0",
            author: "Jiya Arora",
            image: "/images/tutorial1.png"
        },
        {
            id: 2,
            title: "React Router",
            description: "Understand how React Router helps users navigate between different pages in a React application.",
            rating: "5.0",
            author: "Jiya Arora",
            image: "/images/tutorial2.png"
        },
        {
            id: 3,
            title: "Express.js",
            description: "Learn how to create routes and build server-side applications using Express.js and Node.js.",
            rating: "4.9",
            author: "Jiya Arora",
            image: "/images/tutorial3.png"
        }
    ]

    return (
        <section id="tutorials" className="bg-white py-14">

            <div className="max-w-6xl mx-auto px-8">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                    Featured Tutorials
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {tutorials.map((tutorial) => (
                        <TutorialCard
                            key={tutorial.id}
                            tutorial={tutorial}
                        />
                    ))}

                </div>

                <div className="text-center mt-10">

                    <a
                        href="#tutorials"
                        className="inline-block bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-gray-700 transition-colors"
                    >
                        See all tutorials
                    </a>

                </div>

            </div>

        </section>
    )
}

export default Tutorials