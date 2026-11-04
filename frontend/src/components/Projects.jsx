import ProjectCard from './ProjectCard.jsx'

function Projects() {
    return (
        <section id="work" className="bg-gray-50 py-12">

            <div className="max-w-5xl mx-auto px-8">

                <h2 className="text-3xl font-bold mb-4">
                    My Work
                </h2>

                <p className="text-gray-500 mb-10">
                    A selection of projects I have completed through
                    university and personal learning.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <ProjectCard
                        title="Automatic Water Surface Cleaner Robot"
                        image="/images/project1.jpg"
                        description="A hardware-based project designed to automatically collect waste floating on the surface of water."
                        github="https://github.com/arorajiya2612/floating-waste-segregation-ai"
                    />

                    <ProjectCard
                        title="Automatic Waste Management using AI and Machine Learning"
                        image="/images/project2.jpg"
                        description="A software project that uses Artificial Intelligence and Machine Learning to support waste management processes."
                    />

                    <ProjectCard
                        title="Cybersecurity Project"
                        image="/images/project3.jpg"
                        description="A cybersecurity project focused on identifying common web vulnerabilities based on OWASP security guidelines."
                        github="https://github.com/arorajiya2612/Bit-Bots"
                    />

                </div>

            </div>

        </section>
    )
}

export default Projects