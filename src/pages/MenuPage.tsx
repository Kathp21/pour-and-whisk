import Menu from '../components/Menu'
import ceremorialMatchaImage from '../assets/images/ceremorial-matcha.png'
import coldBrewImage from '../assets/images/cold-brew.png'

const matchaItems = [
  { name: 'Ceremorial Matcha', image: ceremorialMatchaImage, description: 'A sweet and creamy matcha latte with a hint of sweetness.', price: '$5.99' },
  { name: 'Matcha Latte', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop', description: 'Traditional matcha with steamed milk.', price: '$5.50' },
  { name: 'Iced Matcha', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', description: 'Refreshing cold matcha drink.', price: '$5.00' },
]

const coffeeItems = [
  { name: 'Espresso', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop', description: 'Rich and bold, a classic coffee shot.', price: '$3.00' },
  { name: 'Cappuccino', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', description: 'Espresso with steamed milk foam.', price: '$4.50' },
  { name: 'Cold Brew', image: coldBrewImage, description: 'Smooth, low-acid coffee concentrate.', price: '$5.00' },
  { name: 'Americano', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop', description: 'Espresso with hot water.', price: '$3.50' },
]

const seasonalItems = [
  { name: 'Pumpkin Spice Latte', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', description: 'Fall favorite with pumpkin and spices.', price: '$6.00' },
  { name: 'Peppermint Mocha', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop', description: 'Holiday classic with peppermint and chocolate.', price: '$6.50' },
  { name: 'Iced Lavender Latte', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', description: 'Refreshing lavender-infused latte.', price: '$5.75' },
]

const pastriesItems = [
  { name: 'Croissant', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop', description: 'Flaky, buttery pastry.', price: '$4.50' },
  { name: 'Blueberry Muffin', image: 'https://images.unsplash.com/photo-1592659762303-411976379172?w=400&h=400&fit=crop', description: 'Sweet muffin with fresh blueberries.', price: '$3.75' },
  { name: 'Chocolate Chip Cookie', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop', description: 'Classic cookie with chocolate chips.', price: '$2.50' },
]

export default function MenuPage() {
  return (
    <div className="min-h-screen">
      <Menu 
        matchaItems={matchaItems}
        coffeeItems={coffeeItems}
        seasonalItems={seasonalItems}
        pastriesItems={pastriesItems}
      />
    </div>
  )
}

