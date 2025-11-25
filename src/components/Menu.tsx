import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

interface MenuItem {
  id: string
  name: string
  image_url: string
  description?: string
  base_price_cents?: number
  price?: string // For backward compatibility
  is_available?: number
  category_id?: string
  options?: any[]
}

interface CategoryResponse {
  id: string
  name: string
  sort: number
  items: MenuItem[]
}

type MenuData = CategoryResponse[] | {
  matcha?: MenuItem[]
  coffee?: MenuItem[]
  tea?: MenuItem[]
  seasonal?: MenuItem[] // Keep for backward compatibility
  pastries?: MenuItem[]
  matchaItems?: MenuItem[]
  coffeeItems?: MenuItem[]
  teaItems?: MenuItem[]
  seasonalItems?: MenuItem[] // Keep for backward compatibility
  pastriesItems?: MenuItem[]
}

type Category = 'Matcha' | 'Coffee' | 'Tea' | 'Pastries'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Helper function to format price from cents
function formatPrice(item: MenuItem): string {
  if (item.price) {
    return item.price
  }
  if (item.base_price_cents !== undefined) {
    return `$${(item.base_price_cents / 100).toFixed(2)}`
  }
  return ''
}

export default function Menu() {
  const navigate = useNavigate()
  const { cartItems } = useCart()
  const [activeCategory, setActiveCategory] = useState<Category>('Matcha')
  const [matchaItems, setMatchaItems] = useState<MenuItem[]>([])
  const [coffeeItems, setCoffeeItems] = useState<MenuItem[]>([])
  const [teaItems, setTeaItems] = useState<MenuItem[]>([])
  const [pastriesItems, setPastriesItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Get total quantity for a specific menu item in the cart
  function getItemQuantity(itemId: string): number {
    return cartItems
      .filter(item => item.drinkId === itemId)
      .reduce((total, item) => total + item.quantity, 0)
  }

  useEffect(() => {
    async function fetchMenuData() {
      try {
        setLoading(true)
        setError(null)
        
        const url = API_BASE_URL ? `${API_BASE_URL}/menu` : '/menu'

        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch menu: ${response.statusText}`)
        }
        
        const data: MenuData = await response.json()
        
        // Check if response is an array (new format) or object (old format)
        if (Array.isArray(data)) {
          // New format: array of category objects
          const categories = data as CategoryResponse[]
          
          // Map categories by name
          const matchaCategory = categories.find(cat => cat.name.toLowerCase() === 'matcha')
          const coffeeCategory = categories.find(cat => cat.name.toLowerCase() === 'coffee')
          const teaCategory = categories.find(cat => cat.name.toLowerCase() === 'tea')
          const pastriesCategory = categories.find(cat => cat.name.toLowerCase() === 'pastries')
          
          setMatchaItems(matchaCategory?.items || [])
          setCoffeeItems(coffeeCategory?.items || [])
          setTeaItems(teaCategory?.items || [])
          setPastriesItems(pastriesCategory?.items || [])

        } else {
          // Old format: object with category keys
          const objData = data as {
            matcha?: MenuItem[]
            coffee?: MenuItem[]
            tea?: MenuItem[]
            seasonal?: MenuItem[] // Keep for backward compatibility
            pastries?: MenuItem[]
            matchaItems?: MenuItem[]
            coffeeItems?: MenuItem[]
            teaItems?: MenuItem[]
            seasonalItems?: MenuItem[] // Keep for backward compatibility
            pastriesItems?: MenuItem[]
          }
          
          setMatchaItems(objData.matcha || objData.matchaItems || [])
          setCoffeeItems(objData.coffee || objData.coffeeItems || [])
          setTeaItems(objData.tea || objData.teaItems || objData.seasonal || objData.seasonalItems || [])
          setPastriesItems(objData.pastries || objData.pastriesItems || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu items')
        console.error('Error fetching menu:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuData()
  }, [])

  const categoryMap = {
    Matcha: matchaItems,
    Coffee: coffeeItems,
    Tea: teaItems,
    Pastries: pastriesItems,
  }

  const currentItems = categoryMap[activeCategory]

  if (loading) {
    return (
      <section className="py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-favorites mx-auto mb-4"></div>
            <p className="text-text-light">Loading menu...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <p className="text-text-light/60">Please try refreshing the page.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Horizontal Menu Options */}
        <div className="flex justify-start gap-4 md:gap-8 mb-8 md:mb-12 overflow-x-auto scrollbar-hide">
          {(['Matcha', 'Coffee', 'Tea', 'Pastries'] as Category[]).map((category) => (
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
        {currentItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-light/60 text-lg">No items available in this category.</p>
          </div>
        ) : (
          <div key={activeCategory} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 animate-fadeIn">
            {currentItems.map((item, index) => (
            <div
              key={`${activeCategory}-${index}`}
              className="group cursor-pointer animate-slideIn"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate(`/menu/customize/${item.id}`)}
            >
              {/* Mobile: Horizontal Layout */}
              <div className="flex flex-row gap-4 md:gap-6 items-start md:hidden">
                {/* Image */}
                <div className="relative w-16 md:w-32 aspect-square rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Quantity Badge Overlay */}
                  {getItemQuantity(item.id) > 0 && (
                    <span className="absolute top-1 right-1 bg-favorites text-background-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {getItemQuantity(item.id) > 99 ? '99+' : getItemQuantity(item.id)}
                    </span>
                  )}
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
                {formatPrice(item) && (
                  <p className="text-base md:text-lg font-semibold text-favorites">
                    {formatPrice(item)}
                  </p>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // TODO: Add to cart functionality
                  }}
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
                <div className="relative w-full max-w-[200px] md:max-w-[180px] lg:max-w-[200px] aspect-square rounded-lg overflow-hidden shadow-lg mb-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Quantity Badge Overlay */}
                  {getItemQuantity(item.id) > 0 && (
                    <span className="absolute top-2 right-2 bg-favorites text-background-dark text-base font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                      {getItemQuantity(item.id) > 99 ? '99+' : getItemQuantity(item.id)}
                    </span>
                  )}
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
                  {formatPrice(item) && (
                    <p className="text-base md:text-lg font-semibold text-favorites">
                      {formatPrice(item)}
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
        )}
      </div>
    </section>
  )
}

