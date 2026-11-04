import Banner from '../components/Banner.jsx'
import About from '../components/About.jsx'
import Projects from '../components/Projects.jsx'
import Gallery from '../components/Gallery.jsx'
import Articles from '../components/Articles.jsx'
import Tutorials from '../components/Tutorials.jsx'
import Newsletter from '../components/Newsletter.jsx'
import Footer from '../components/Footer.jsx'

function Home() {
    return (
        <>
            <main>
                <Banner />
                <About />
                <Projects />
                <Gallery />
                <Articles />
                <Tutorials />
                <Newsletter />
            </main>

            <Footer />
        </>
    )
}

export default Home