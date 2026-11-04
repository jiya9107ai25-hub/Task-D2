function Footer() {
    return (
        <footer id="contact" className="bg-teal-700 text-white">

            <div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

                <div>
                    <h3 className="text-xl font-bold mb-5">
                        Explore
                    </h3>

                    <div className="flex flex-col gap-3">
                        <a href="#" className="hover:underline">Home</a>
                        <a href="#about" className="hover:underline">About</a>
                        <a href="#work" className="hover:underline">Work</a>
                        <a href="#articles" className="hover:underline">Articles</a>
                        <a href="#tutorials" className="hover:underline">Tutorials</a>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-5">
                        Support
                    </h3>

                    <div className="flex flex-col gap-3">
                        <span>FAQs</span>
                        <span>Help</span>
                        <a
                            href="mailto:jiya9107.ai25@gmail.com"
                            className="hover:underline"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-5">
                        Stay Connected
                    </h3>

                    <div className="flex flex-col gap-3">
                        <a
                            href="https://github.com/arorajiya2612"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            GitHub ↗
                        </a>

                        <a
                            href="mailto:jiya9107.ai25@gmail.com"
                            className="hover:underline"
                        >
                            ✉ Email
                        </a>
                    </div>
                </div>

            </div>

            <div className="border-t border-teal-500">

                <div className="max-w-6xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between gap-4 text-sm">

                    <p>DEV@Deakin © 2026</p>

                    <div className="flex flex-wrap gap-6">
                        <span>Privacy Policy</span>
                        <span>Terms</span>
                        <span>Code of Conduct</span>
                    </div>

                </div>

            </div>

        </footer>
    )
}

export default Footer