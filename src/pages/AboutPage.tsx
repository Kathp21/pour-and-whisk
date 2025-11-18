export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 md:py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-text-light mb-4">
            About Pour & Whisk
          </h1>
          <p className="text-xl md:text-2xl text-text-light/80 italic">
            "Sip, Stillness. Discover our craft in every cup."
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 md:space-y-12">
          {/* Our Story Section */}
          <section className="bg-background-dark/50 rounded-lg p-6 md:p-8 border border-text-light/10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-favorites mb-4 md:mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-text-light/80 text-base md:text-lg leading-relaxed">
              <p>
                Pour & Whisk was born from a simple passion: to create moments of tranquility in every cup. 
                Founded in the heart of the city, we set out to blend the ancient art of matcha preparation 
                with the rich tradition of coffee craftsmanship.
              </p>
              <p>
                What started as a small dream has grown into a community gathering place where people come 
                to slow down, connect, and savor the simple pleasures of life. Every drink we serve is 
                crafted with care, using only the finest ingredients sourced from trusted partners around the world.
              </p>
              <p>
                We believe that great coffee and matcha aren't just beverages—they're experiences that bring 
                people together and create lasting memories. Whether you're starting your morning with an 
                espresso or winding down with a ceremonial matcha, we're here to make every sip count.
              </p>
            </div>
          </section>

          {/* Our Values Section */}
          <section className="bg-background-dark/50 rounded-lg p-6 md:p-8 border border-text-light/10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-favorites mb-4 md:mb-6">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h3 className="text-xl font-bold text-text-light mb-2">Quality First</h3>
                <p className="text-text-light/80">
                  We source only the finest beans and matcha leaves, ensuring every cup meets our 
                  high standards of excellence.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-light mb-2">Community</h3>
                <p className="text-text-light/80">
                  We're more than a coffee shop—we're a gathering place where neighbors become friends 
                  and strangers become family.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-light mb-2">Sustainability</h3>
                <p className="text-text-light/80">
                  We're committed to sustainable practices, from ethically sourced ingredients to 
                  eco-friendly packaging.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-light mb-2">Craftsmanship</h3>
                <p className="text-text-light/80">
                  Every drink is prepared with precision and care, honoring both traditional methods 
                  and innovative techniques.
                </p>
              </div>
            </div>
          </section>

          {/* Meet the Team Section */}
          <section className="bg-background-dark/50 rounded-lg p-6 md:p-8 border border-text-light/10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-favorites mb-4 md:mb-6">
              Meet the Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-favorites/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-favorites" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-light mb-1">Founder</h3>
                <p className="text-text-light/60 text-sm">Passionate about bringing people together through great coffee</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-favorites/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-favorites" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-light mb-1">Head Barista</h3>
                <p className="text-text-light/60 text-sm">Master of the art of espresso and matcha preparation</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-favorites/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-favorites" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-light mb-1">Pastry Chef</h3>
                <p className="text-text-light/60 text-sm">Creating delicious treats to complement your favorite drinks</p>
              </div>
            </div>
          </section>

          {/* Visit Us Section */}
          <section className="bg-background-dark/50 rounded-lg p-6 md:p-8 border border-text-light/10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-favorites mb-4 md:mb-6">
              Visit Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-text-light mb-2">Location</h3>
                <p className="text-text-light/80">
                  123 Coffee Street<br />
                  San Francisco, CA 94102
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-light mb-2">Hours</h3>
                <p className="text-text-light/80">
                  Mon - Fri: 7:00 AM - 7:00 PM<br />
                  Sat - Sun: 8:00 AM - 8:00 PM
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

