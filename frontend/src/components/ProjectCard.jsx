function ProjectCard({ title, description, image, github }) {

    return (
        <article className="bg-white rounded-xl shadow-md overflow-hidden">

            <img
                src={image}
                alt={title}
                className="w-full h-64 object-contain"
            />

            <div className="p-6">

                <h3 className="text-2xl font-bold text-gray-800">
                    {title}
                </h3>

                <p className="mt-3 text-gray-600">
                    {description}
                </p>

                {github && (
                    <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-5 text-blue-600"
                    >
                        View on GitHub
                    </a>
                )}

            </div>

        </article>
    )

}

export default ProjectCard