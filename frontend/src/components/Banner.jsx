function Banner() {

    return (

        <section
            className="group relative w-full overflow-hidden"
            aria-label="Introduction banner"
        >

            <img
                src="/images/banner.jpg"
                alt="Banner image for Jiya Arora's personal website"
                className="w-full h-[500px] object-cover"
            />

            <div
                className="absolute bottom-0 left-0 w-full
                           bg-black/70 text-white text-center py-4
                           text-xl font-medium opacity-0
                           group-hover:opacity-100
                           transition-opacity duration-300"
            >

                Hey, I'm Jiya Arora

            </div>

        </section>

    )

}

export default Banner