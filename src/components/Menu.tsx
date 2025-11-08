import { useState } from 'react'

interface MenuItem {
  name: string
  image: string
  description?: string
  price?: string
}

interface MenuProps {
  matchaItems: MenuItem[]
  coffeeItems: MenuItem[]
  seasonalItems: MenuItem[]
  pastriesItems: MenuItem[]
}

type Category = 'Matcha' | 'Coffee' | 'Seasonal' | 'Pastries'

export default function Menu({ matchaItems, coffeeItems, seasonalItems, pastriesItems }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('Matcha')

  const categoryMap = {
    Matcha: matchaItems,
    Coffee: coffeeItems,
    Seasonal: seasonalItems,
    Pastries: pastriesItems,
  }

  const currentItems = categoryMap[activeCategory]

  return (
    <section className="py-12 md:py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Horizontal Menu Options */}
        <div className="flex justify-start gap-2 md:gap-8 mb-8 md:mb-12 overflow-x-auto scrollbar-hide">
          {(['Matcha', 'Coffee', 'Seasonal', 'Pastries'] as Category[]).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-lg font-medium transition-colors rounded-lg whitespace-nowrap flex-shrink-0 ${
                activeCategory === category
                  ? 'bg-favorites text-background-dark'
                  : 'text-text-light hover:text-favorites hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-6">
          {currentItems.map((item, index) => (
            <div
              key={index}
              className="group cursor-pointer"
            >
              {/* Container: Image, Title, and Description */}
              <div className="flex flex-row gap-4 md:gap-6 items-start">
                {/* Image */}
                <div className="w-16 md:w-32 lg:w-40 aspect-square rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Title and Description */}
                <div className="flex-1 text-left">
                  <h3 className="text-base md:text-xl font-medium text-text-light mb-2">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-sm md:text-base text-text-light/60">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Price and Plus Icon - Same line */}
              <div className="flex items-center justify-between mt-2 ml-[calc(4rem+1rem)] md:ml-[calc(8rem+1.5rem)] lg:ml-[calc(10rem+1.5rem)]">
                {item.price && (
                  <p className="text-base md:text-lg font-semibold text-favorites">
                    {item.price}
                  </p>
                )}
                <button
                  className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-text-light/30 hover:border-favorites text-text-light hover:text-favorites transition-colors flex items-center justify-center"
                  aria-label={`Add ${item.name} to cart`}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

