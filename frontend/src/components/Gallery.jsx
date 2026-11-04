function Gallery() {

    const images = [
        "/images/gallery1.jpg",
        "/images/gallery2.jpg",
        "/images/gallery3.jpg",
        "/images/gallery4.jpg",
        "/images/gallery5.jpg",
        "/images/gallery6.jpg"
    ]

    return (

        <section className="bg-white py-12">

            <div className="max-w-5xl mx-auto px-8">

                <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
                    My Gallery
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                    {images.map((image, index) => (

                        <img
                            key={index}
                            src={image}
                            alt={`Gallery photo ${index + 1}`}
                            className="w-full h-64 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                        />

                    ))}

                </div>

            </div>

        </section>

    )

}

export default Gallery