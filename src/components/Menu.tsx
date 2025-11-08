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
        <div className="flex justify-start gap-4 md:gap-8 mb-8 md:mb-12 overflow-x-auto scrollbar-hide">
          {(['Matcha', 'Coffee', 'Seasonal', 'Pastries'] as Category[]).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-sm md:text-lg font-medium transition-all duration-300 ease-in-out whitespace-nowrap flex-shrink-0 pb-2 ${
                activeCategory === category
                  ? 'text-text-light border-b-2 border-button-primary'
                  : 'text-text-light hover:text-favorites border-b-2 border-transparent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div key={activeCategory} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 animate-fadeIn">
          {currentItems.map((item, index) => (
            <div
              key={`${activeCategory}-${index}`}
              className="group cursor-pointer animate-slideIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Mobile: Horizontal Layout */}
              <div className="flex flex-row gap-4 md:gap-6 items-start md:hidden">
                {/* Image */}
                <div className="w-16 md:w-32 aspect-square rounded-lg overflow-hidden shadow-lg flex-shrink-0">
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

              {/* Mobile: Price and Plus Icon */}
              <div className="flex items-center justify-between mt-2 ml-[calc(4rem+1rem)] md:ml-[calc(8rem+1.5rem)] md:hidden">
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

              {/* Tablet & Desktop: Vertical Layout */}
              <div className="hidden md:flex flex-col items-center text-center">
                {/* Image */}
                <div className="w-full max-w-[200px] md:max-w-[180px] lg:max-w-[200px] aspect-square rounded-lg overflow-hidden shadow-lg mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl lg:text-xl font-medium text-text-light mb-2">
                  {item.name}
                </h3>

                {/* Description */}
                {item.description && (
                  <p className="text-sm md:text-base text-text-light/60 mb-3 px-2 w-full max-w-[200px] md:max-w-[180px] lg:max-w-[200px]">
                    {item.description}
                  </p>
                )}

                {/* Price and Plus Icon */}
                <div className="flex items-center justify-center gap-4 mt-2">
                  {item.price && (
                    <p className="text-base md:text-lg font-semibold text-favorites">
                      {item.price}
                    </p>
                  )}
                  <button
                    className="flex-shrink-0 w-10 h-10 md:w-10 md:h-10 rounded-full border-2 border-text-light/30 hover:border-favorites text-text-light hover:text-favorites transition-colors flex items-center justify-center"
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

