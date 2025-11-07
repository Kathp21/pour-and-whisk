import { useState } from 'react'
import matchaCoffeeImage from '../assets/images/matcha-coffee.png'
import ceremorialMatchaImage from '../assets/images/ceremorial-matcha.png'
import coldBrewImage from '../assets/images/cold-brew.png'

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Sample drink data - you can replace with actual images later
  const favorites = [
    { name: 'Ceremorial Matcha', image: ceremorialMatchaImage },
    { name: 'Espresso', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop' },
    { name: 'Cappuccino', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop' },
    { name: 'Cold Brew', image: coldBrewImage },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${matchaCoffeeImage})`
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Text Overlay */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-text-light mb-4 md:mb-6">
            Sip, Stillness
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-text-light font-light max-w-2xl">
            Discover our craft in every cup
          </p>
        </div>
      </section>

      {/* Favorites Section */}
      <section className="py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-favorites text-center mb-8 md:mb-12">
            Our Favorites
          </h3>
          
          {/* Drink Carousel */}
          <div className="relative mb-10 md:mb-12">
            {/* Carousel Container */}
            <div className="relative overflow-hidden">
              {/* Slide Indicators - Overlay on Images */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex justify-center gap-2">
                {favorites.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide ? 'w-8 bg-favorites' : 'w-2 bg-text-light/30'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {favorites.map((drink, index) => (
                  <div 
                    key={index} 
                    className="min-w-full md:min-w-[50%] lg:min-w-[25%] px-2"
                  >
                    <div className="group cursor-pointer transform transition-transform hover:scale-105">
                      <div className="aspect-square rounded-lg overflow-hidden mb-3 shadow-lg">
                        <img 
                          src={drink.image} 
                          alt={drink.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <h4 className="text-center text-sm md:text-base font-medium text-text-light">
                        {drink.name}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Explore Menu Button */}
          <div className="text-center">
            <button className="w-full bg-button-primary hover:bg-button-primary/90 text-text-light font-semibold py-2 px-5 md:py-4 md:px-12 rounded-lg text-base md:text-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
              Explore our menu
            </button>
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="py-12 md:py-20 px-6 md:px-12 bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-favorites text-center mb-8 md:mb-12">
            Visit Us
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Location */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-8 h-8 text-favorites" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-text-light mb-2">Location</h4>
              <p className="text-text-light/40">
                123 Coffee Street<br />
                San Francisco, CA 94102
              </p>
            </div>

            {/* Hours */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-8 h-8 text-favorites" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-text-light mb-2">Hours</h4>
              <p className="text-text-light/40">
                Mon - Fri: 7:00 AM - 7:00 PM<br />
                Sat - Sun: 8:00 AM - 8:00 PM
              </p>
            </div>

            {/* Phone */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-8 h-8 text-favorites" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-text-light mb-2">Phone</h4>
              <p className="text-text-light/40">
                (555) 123-4567
              </p>
            </div>

            {/* Email */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-8 h-8 text-favorites" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-text-light mb-2">Email</h4>
                <p className="text-text-light/40">
                hello@pourandwhisk.com
              </p>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-8 md:mt-12">
            <div className="w-full h-[300px] md:h-[400px] bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-text-light/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-text-light/60 text-sm md:text-base">Map placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
