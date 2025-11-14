import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import RadioSelector from '../components/DrinkCustomize/RadioSelector'

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

interface SizeOption {
  value: string
  label: string
  priceCents: number
}

interface MilkOption {
  value: string
  label: string
  priceCents: number
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export default function DrinkCustomizePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [drink, setDrink] = useState<MenuItem | null>(null)
  const [sizes, setSizes] = useState<SizeOption[]>([])
  const [milkOptions, setMilkOptions] = useState<MilkOption[]>([])
  
  // Customization options
  const [size, setSize] = useState<string>('')
  const [milk, setMilk] = useState<string>('')
  const [sugarLevel, setSugarLevel] = useState<number>(100)
  const [icedLevel, setIcedLevel] = useState<string>('regular')
  const [quantity, setQuantity] = useState<number>(1)

  const sugarLevelOptions = [
    { value: 100, label: '100% Sugar Level' },
    { value: 75, label: '75% Less Sugar' },
    { value: 50, label: '50% Half Sugar' },
    { value: 0, label: '0% No Sugar' },
  ]

  const iceLevelOptions = [
    { value: 'regular', label: 'Regular Ice' },
    { value: 'less', label: 'Less Ice' },
    { value: 'no', label: 'No Ice' },
  ]

  const useFallbackOptions = () => {
    setSizes([
      { value: 'regular', label: 'Regular', priceCents: 0 },
      { value: 'large', label: 'Large', priceCents: 100 },
    ])
    setMilkOptions([
      { value: 'whole', label: 'Whole Milk', priceCents: 0 },
      { value: 'skim', label: 'Skim Milk', priceCents: 0 },
      { value: 'almond', label: 'Almond Milk', priceCents: 50 },
      { value: 'oat', label: 'Oat Milk', priceCents: 50 },
      { value: 'soy', label: 'Soy Milk', priceCents: 50 },
      { value: 'none', label: 'No Milk', priceCents: 0 },
    ])
  }

  useEffect(() => {
    if (id) {
      fetchDrinkData()
      fetchOptions()
    }
  }, [id])

  async function fetchOptions() {
    try {
      // Fetch menu data to find the drink and extract its options
      const url = API_BASE_URL ? `${API_BASE_URL}/menu` : '/menu'
      const response = await fetch(url)
      
      if (!response.ok) {
        console.warn('Failed to fetch menu, using defaults')
        useFallbackOptions()
        return
      }
      
      const data = await response.json()

      if (!Array.isArray(data) || data.length === 0) {
        console.warn('Menu is empty, using defaults')
        useFallbackOptions()
        return
      }
      
      // Flatten all items from all categories
      const allItems = data.flatMap((category: any) => category.items || [])

      // Find the drink by ID
      const targetItem = allItems.find((item: any) => item.id === id)

      if (!targetItem || !Array.isArray(targetItem.options)) {
        console.warn('Target item or options are missing, using defaults')
        useFallbackOptions()
        return
      }

      // Find Size option group (name is "Size")
      const sizeGroup = targetItem.options.find((group: any) => 
        group.name?.toLowerCase() === 'size'
      )

      // Find Milk Type option group (name contains "milk")
      const milkGroup = targetItem.options.find((group: any) => 
        group.name?.toLowerCase().includes('milk')
      )

      // Parse sizes from the Size option group
      if (sizeGroup && Array.isArray(sizeGroup.options)) {
        const parsedSizes = sizeGroup.options.map((option: any) => ({
          value: option.name?.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').replace(/\s+/g, '-') || option.id,
          label: option.name || 'Unknown',
          priceCents: Number(option.price_delta_cents) || 0,
        }))
        setSizes(parsedSizes)
        // Set default size to first option
        if (parsedSizes.length > 0 && !size) {
          setSize(parsedSizes[0].value)
        }
      }

      // Parse milk options from the Milk Type option group
      if (milkGroup && Array.isArray(milkGroup.options)) {
        const parsedMilk = milkGroup.options.map((option: any) => ({
          value: option.name?.toLowerCase().replace(/\s+/g, '-') || option.id,
          label: option.name || 'Unknown',
          priceCents: Number(option.price_delta_cents) || 0,
        }))
        setMilkOptions(parsedMilk)
        // Set default milk to first option
        if (parsedMilk.length > 0 && !milk) {
          setMilk(parsedMilk[0].value)
        }
      }

      // If either group is missing, use fallback
      if (!sizeGroup || !milkGroup) {
        console.warn('Size or Milk group missing, using defaults for missing options')
        if (!sizeGroup) {
          useFallbackOptions()
        } else if (!milkGroup) {
          // Only set milk fallback if size was found
          setMilkOptions([
            { value: 'whole', label: 'Whole Milk', priceCents: 0 },
            { value: 'skim', label: 'Skim Milk', priceCents: 0 },
            { value: 'almond', label: 'Almond Milk', priceCents: 50 },
            { value: 'oat', label: 'Oat Milk', priceCents: 50 },
            { value: 'soy', label: 'Soy Milk', priceCents: 50 },
            { value: 'none', label: 'No Milk', priceCents: 0 },
          ])
        }
      }
    } catch (err) {
      console.error('Error fetching options:', err)
      useFallbackOptions()
    }
  }

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
      
      // Extract options from the found drink
      if (foundDrink.options && Array.isArray(foundDrink.options)) {
        // Find Size option group
        const sizeGroup = foundDrink.options.find((group: any) => 
          group.name?.toLowerCase() === 'size'
        )
        
        // Find Milk Type option group
        const milkGroup = foundDrink.options.find((group: any) => 
          group.name?.toLowerCase().includes('milk')
        )
        
        // Parse sizes
        if (sizeGroup && Array.isArray(sizeGroup.options)) {
          const parsedSizes = sizeGroup.options.map((option: any) => ({
            value: option.name?.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').replace(/\s+/g, '-') || option.id,
            label: option.name || 'Unknown',
            priceCents: Number(option.price_delta_cents) || 0,
          }))
          setSizes(parsedSizes)
          if (parsedSizes.length > 0 && !size) {
            setSize(parsedSizes[0].value)
          }
        }
        
        // Parse milk options
        if (milkGroup && Array.isArray(milkGroup.options)) {
          const parsedMilk = milkGroup.options.map((option: any) => ({
            value: option.name?.toLowerCase().replace(/\s+/g, '-') || option.id,
            label: option.name || 'Unknown',
            priceCents: Number(option.price_delta_cents) || 0,
          }))
          setMilkOptions(parsedMilk)
          if (parsedMilk.length > 0 && !milk) {
            setMilk(parsedMilk[0].value)
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load drink')
      console.error('Error fetching drink:', err)
    } finally {
      setLoading(false)
    }
  }

  function calculateTotalPrice(): number {
    if (!drink) return 0
    
    // Ensure base_price_cents is a number (convert string to number if needed)
    let basePrice = Number(drink.base_price_cents) || 0
    
    // base_price_cents should already be in cents, so use it directly
    let total = basePrice
    
    // Add size price (already in cents) - only if size is selected
    if (size) {
      const selectedSize = sizes.find(s => s.value === size)
      if (selectedSize) {
        total = Number(total) + Number(selectedSize.priceCents)
      }
    }
    
    // Add milk price (already in cents) - only if milk is selected
    if (milk) {
      const selectedMilk = milkOptions.find(m => m.value === milk)
      if (selectedMilk) {
        total = Number(total) + Number(selectedMilk.priceCents)
      }
    }
    
    // Multiply by quantity
    const finalTotal = Number(total) * Number(quantity)
    return finalTotal
  }

  function handleAddToCart() {
    if (!drink) return
    
    // Validate required selections
    if (!size || !milk) {
      alert('Please select size and milk type before adding to cart')
      return
    }

    // Calculate total price for all quantities
    const totalPriceCents = calculateTotalPrice()

    // Add item to cart with all customization details
    addToCart({
      drinkId: drink.id,
      drinkName: drink.name,
      imageUrl: drink.image_url,
      size,
      milk,
      sugarLevel,
      icedLevel,
      quantity,
      totalPriceCents,
    })
    
    // Navigate to cart page after adding
    navigate('/cart')
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
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
          <div className="space-y-4 md:space-y-6">
            {/* Quantity */}
            <div className="bg-background-dark/50 rounded-lg p-4 md:p-6">
              <label className="block text-text-light font-medium mb-3 md:mb-4">
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
            {sizes.length > 0 && (
              <div className="bg-background-dark/50 rounded-lg p-4 md:p-6">
                <label className="block text-text-light font-medium mb-3 md:mb-4">
                  Size *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {sizes.map((sizeOption) => {
                    const isSelected = size === sizeOption.value
                    return (
                      <button
                        key={sizeOption.value}
                        onClick={() => setSize(sizeOption.value)}
                        className={`p-3 md:p-4 rounded-lg border-2 transition-colors ${
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
            )}

            {/* Milk Type */}
            {milkOptions.length > 0 && (
              <div className="bg-background-dark/50 rounded-lg p-4 md:p-6">
                <label className="block text-text-light font-medium mb-3 md:mb-4">
                  Milk Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {milkOptions.map((milkOption) => {
                    const isSelected = milk === milkOption.value
                    return (
                      <button
                        key={milkOption.value}
                        onClick={() => setMilk(milkOption.value)}
                        className={`p-3 md:p-4 rounded-lg border-2 transition-colors text-left ${
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
            )}

            {/* Sugar Level */}
            <RadioSelector
              title="Sugar Level *"
              name="sugarLevel"
              options={sugarLevelOptions}
              selectedValue={sugarLevel}
              onValueChange={(value) => setSugarLevel(value as number)}
              columns={2}
            />

            {/* Iced Level */}
            <RadioSelector
              title="Ice Level *"
              name="icedLevel"
              options={iceLevelOptions}
              selectedValue={icedLevel}
              onValueChange={(value) => setIcedLevel(value as string)}
              columns={3}
            />

            {/* Total Price */}
            <div className="bg-background-dark/50 rounded-lg p-4 lg:p-6 border-2 border-favorites">
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

