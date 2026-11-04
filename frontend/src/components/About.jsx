function About() {

    return (

        <section id="about" className="bg-white py-10">

            <div className="max-w-5xl mx-auto px-8">

                <div className="mb-12">

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        About Me
                    </h2>

                    <p className="mt-3 text-lg text-gray-500">
                        Get to know me and my interests.
                    </p>

                </div>

                <div className="text-center">

                    <div className="flex justify-center mb-5">

                        <img
                            src="/images/profile.jpg"
                            alt="Profile photo of Jiya Arora"
                            className="w-[160px] h-[160px] rounded-full object-cover border-4 border-white shadow-lg"
                        />

                    </div>

                    <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 leading-snug">

                        I am an Artificial Intelligence and Machine Learning
                        student with an interest in programming, web development
                        and building technology-based solutions.

                    </p>

                    <div className="w-20 h-1 bg-blue-500 mx-auto my-6"></div>

                    <h3 className="text-3xl md:text-4xl font-bold text-gray-800">

                        Here's what I've done so far

                    </h3>

                </div>

            </div>

        </section>

    )

}

export default About