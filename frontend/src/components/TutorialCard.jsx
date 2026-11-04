function TutorialCard({ tutorial }) {
    return (
        <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">

            <img
                src={tutorial.image}
                alt={tutorial.title}
                className="w-full h-48 object-contain bg-white p-5"
            />

            <div className="p-6">

                <h3 className="text-xl font-bold text-gray-800">
                    {tutorial.title}
                </h3>

                <p className="mt-3 text-gray-600">
                    {tutorial.description}
                </p>

                <div className="flex justify-between items-center mt-6 gap-3">

                    <span className="text-yellow-500">
                        ★★★★★ {tutorial.rating}
                    </span>

                    <span className="text-sm text-gray-500">
                        {tutorial.author}
                    </span>

                </div>

            </div>

        </article>
    )
}

export default TutorialCard