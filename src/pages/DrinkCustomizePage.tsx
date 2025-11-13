import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface MenuItem {
  id: string
  name: string
  image_url: string
  description?: string
  base_price_cents?: number
  is_available?: number
  category_id?: string
  options?: any[]
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export default function DrinkCustomizePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [drink, setDrink] = useState<MenuItem | null>(null)
  
  // Customization options
  const [size, setSize] = useState<string>('regular')
  const [milk, setMilk] = useState<string>('whole')
  const [sugarLevel, setSugarLevel] = useState<number>(100)
  const [icedLevel, setIcedLevel] = useState<string>('regular')
  const [quantity, setQuantity] = useState<number>(1)

  const sizes = [
    { value: 'regular', label: 'Regular', priceCents: 0 },
    { value: 'large', label: 'Large', priceCents: 100 },
  ]

  const milkOptions = [
    { value: 'whole', label: 'Whole Milk', priceCents: 0 },
    { value: 'skim', label: 'Skim Milk', priceCents: 0 },
    { value: 'almond', label: 'Almond Milk', priceCents: 50 },
    { value: 'oat', label: 'Oat Milk', priceCents: 50 },
    { value: 'soy', label: 'Soy Milk', priceCents: 50 },
    { value: 'none', label: 'No Milk', priceCents: 0 },
  ]

  useEffect(() => {
    if (id) {
      fetchDrinkData()
    }
  }, [id])

  async function fetchDrinkData() {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch menu data and find the drink by ID
      const url = API_BASE_URL ? `${API_BASE_URL}/menu` : '/menu'
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch menu: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Find the drink in all categories
      let foundDrink: MenuItem | null = null
      
      if (Array.isArray(data)) {
        // Array format: search through all categories
        for (const category of data) {
          if (category.items && Array.isArray(category.items)) {
            const item = category.items.find((item: MenuItem) => item.id === id)
            if (item) {
              foundDrink = item
              break
            }
          }
        }
      } else {
        // Object format: search through all category arrays
        const allItems = [
          ...(data.matcha || []),
          ...(data.coffee || []),
          ...(data.tea || []),
          ...(data.pastries || []),
          ...(data.matchaItems || []),
          ...(data.coffeeItems || []),
          ...(data.teaItems || []),
          ...(data.pastriesItems || [])
        ]
        foundDrink = allItems.find((item: MenuItem) => item.id === id) || null
      }
      
      if (!foundDrink) {
        throw new Error('Drink not found')
      }
      
      setDrink(foundDrink)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load drink')
      console.error('Error fetching drink:', err)
    } finally {
      setLoading(false)
    }
  }

  function calculateTotalPrice(): number {
    if (!drink) return 0
    
    let total = drink.base_price_cents || 0
    
    // Add size price
    const selectedSize = sizes.find(s => s.value === size)
    if (selectedSize) {
      total += selectedSize.priceCents
    }
    
    // Add milk price
    const selectedMilk = milkOptions.find(m => m.value === milk)
    if (selectedMilk) {
      total += selectedMilk.priceCents
    }
    
    return total * quantity
  }

  function handleAddToCart() {
    const customizedDrink = {
      drinkId: drink?.id,
      drinkName: drink?.name,
      size,
      milk,
      sugarLevel,
      icedLevel,
      quantity,
      totalPriceCents: calculateTotalPrice()
    }
    
    console.log('Adding to cart:', customizedDrink)
    // TODO: Add to cart functionality
    navigate('/menu')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-favorites mx-auto mb-4"></div>
          <p className="text-text-light">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !drink) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error || 'Drink not found'}</p>
          <button
            onClick={() => navigate('/menu')}
            className="text-favorites hover:text-white"
          >
            Back to Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 md:py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/menu')}
            className="text-favorites hover:text-white mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Menu
          </button>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-light mb-2">
            Customize Your Drink
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Drink Image */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-full max-w-md aspect-square rounded-lg overflow-hidden shadow-lg mb-6">
              <img
                src={drink.image_url}
                alt={drink.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-light mb-2">
              {drink.name}
            </h2>
            {drink.description && (
              <p className="text-text-light/60 text-lg mb-4">
                {drink.description}
              </p>
            )}
          </div>

          {/* Right: Customization Options */}
          <div className="space-y-6">
            {/* Quantity */}
            <div className="bg-background-dark/50 rounded-lg p-6">
              <label className="block text-text-light font-medium mb-4">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border-2 border-text-light/30 hover:border-favorites text-text-light hover:text-favorites transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-text-light text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border-2 border-text-light/30 hover:border-favorites text-text-light hover:text-favorites transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Size */}
            <div className="bg-background-dark/50 rounded-lg p-6">
              <label className="block text-text-light font-medium mb-4">
                Size *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {sizes.map((sizeOption) => {
                  const isSelected = size === sizeOption.value
                  return (
                    <button
                      key={sizeOption.value}
                      onClick={() => setSize(sizeOption.value)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        isSelected
                          ? 'border-favorites bg-favorites/10 text-text-light'
                          : 'border-text-light/20 hover:border-text-light/40 text-text-light/60'
                      }`}
                    >
                      <div className="font-medium">{sizeOption.label}</div>
                      {sizeOption.priceCents > 0 && (
                        <div className="text-sm text-favorites mt-1">
                          +${(sizeOption.priceCents / 100).toFixed(2)}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Milk Type */}
            <div className="bg-background-dark/50 rounded-lg p-6">
              <label className="block text-text-light font-medium mb-4">
                Milk Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {milkOptions.map((milkOption) => {
                  const isSelected = milk === milkOption.value
                  return (
                    <button
                      key={milkOption.value}
                      onClick={() => setMilk(milkOption.value)}
                      className={`p-4 rounded-lg border-2 transition-colors text-left ${
                        isSelected
                          ? 'border-favorites bg-favorites/10 text-text-light'
                          : 'border-text-light/20 hover:border-text-light/40 text-text-light/60'
                      }`}
                    >
                      <div className="font-medium">{milkOption.label}</div>
                      {milkOption.priceCents > 0 && (
                        <div className="text-sm text-favorites mt-1">
                          +${(milkOption.priceCents / 100).toFixed(2)}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sugar Level */}
            <div className="bg-background-dark/50 rounded-lg p-6">
              <label className="block text-text-light font-medium mb-4">
                Sugar Level *
              </label>
              <div className="space-y-3">
                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  sugarLevel === 100
                    ? 'border-favorites bg-favorites/10'
                    : 'border-text-light/20 hover:border-text-light/40'
                }`}>
                  <input
                    type="radio"
                    name="sugarLevel"
                    value="100"
                    checked={sugarLevel === 100}
                    onChange={(e) => setSugarLevel(parseInt(e.target.value))}
                    className="w-5 h-5 text-favorites focus:ring-favorites mr-3"
                  />
                  <span className="text-text-light font-medium">100% Normal Sugar Level</span>
                </label>
                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  sugarLevel === 75
                    ? 'border-favorites bg-favorites/10'
                    : 'border-text-light/20 hover:border-text-light/40'
                }`}>
                  <input
                    type="radio"
                    name="sugarLevel"
                    value="75"
                    checked={sugarLevel === 75}
                    onChange={(e) => setSugarLevel(parseInt(e.target.value))}
                    className="w-5 h-5 text-favorites focus:ring-favorites mr-3"
                  />
                  <span className="text-text-light font-medium">75% Less Sugar</span>
                </label>
                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  sugarLevel === 50
                    ? 'border-favorites bg-favorites/10'
                    : 'border-text-light/20 hover:border-text-light/40'
                }`}>
                  <input
                    type="radio"
                    name="sugarLevel"
                    value="50"
                    checked={sugarLevel === 50}
                    onChange={(e) => setSugarLevel(parseInt(e.target.value))}
                    className="w-5 h-5 text-favorites focus:ring-favorites mr-3"
                  />
                  <span className="text-text-light font-medium">50% Half Sugar</span>
                </label>
                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  sugarLevel === 0
                    ? 'border-favorites bg-favorites/10'
                    : 'border-text-light/20 hover:border-text-light/40'
                }`}>
                  <input
                    type="radio"
                    name="sugarLevel"
                    value="0"
                    checked={sugarLevel === 0}
                    onChange={(e) => setSugarLevel(parseInt(e.target.value))}
                    className="w-5 h-5 text-favorites focus:ring-favorites mr-3"
                  />
                  <span className="text-text-light font-medium">0% No Sugar</span>
                </label>
              </div>
            </div>

            {/* Iced Level */}
            <div className="bg-background-dark/50 rounded-lg p-6">
              <label className="block text-text-light font-medium mb-4">
                Ice Level *
              </label>
              <div className="space-y-3">
                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  icedLevel === 'regular'
                    ? 'border-favorites bg-favorites/10'
                    : 'border-text-light/20 hover:border-text-light/40'
                }`}>
                  <input
                    type="radio"
                    name="icedLevel"
                    value="regular"
                    checked={icedLevel === 'regular'}
                    onChange={(e) => setIcedLevel(e.target.value)}
                    className="w-5 h-5 text-favorites focus:ring-favorites mr-3"
                  />
                  <span className="text-text-light font-medium">Regular Ice</span>
                </label>
                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  icedLevel === 'less'
                    ? 'border-favorites bg-favorites/10'
                    : 'border-text-light/20 hover:border-text-light/40'
                }`}>
                  <input
                    type="radio"
                    name="icedLevel"
                    value="less"
                    checked={icedLevel === 'less'}
                    onChange={(e) => setIcedLevel(e.target.value)}
                    className="w-5 h-5 text-favorites focus:ring-favorites mr-3"
                  />
                  <span className="text-text-light font-medium">Less Ice</span>
                </label>
                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  icedLevel === 'no'
                    ? 'border-favorites bg-favorites/10'
                    : 'border-text-light/20 hover:border-text-light/40'
                }`}>
                  <input
                    type="radio"
                    name="icedLevel"
                    value="no"
                    checked={icedLevel === 'no'}
                    onChange={(e) => setIcedLevel(e.target.value)}
                    className="w-5 h-5 text-favorites focus:ring-favorites mr-3"
                  />
                  <span className="text-text-light font-medium">No Ice</span>
                </label>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-background-dark/50 rounded-lg p-6 border-2 border-favorites">
              <div className="flex items-center justify-between">
                <span className="text-text-light text-xl font-semibold">
                  Total
                </span>
                <span className="text-favorites text-2xl font-bold">
                  ${(calculateTotalPrice() / 100).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-button-primary hover:bg-button-primary/90 text-text-light font-semibold py-4 px-6 rounded-lg text-lg transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

