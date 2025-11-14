interface RadioOption {
  value: string | number
  label: string
}

interface RadioSelectorProps {
  title: string
  name: string
  options: RadioOption[]
  selectedValue: string | number
  onValueChange: (value: string | number) => void
  columns?: 2 | 3 | 4 // Number of columns on desktop
}

export default function RadioSelector({
  title,
  name,
  options,
  selectedValue,
  onValueChange,
  columns = 2,
}: RadioSelectorProps) {
  const gridColsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns]

  return (
    <div className="bg-background-dark/50 rounded-lg">
      <label className="block text-text-light font-medium mb-3 md:mb-4">
        {title}
      </label>
      <div className={`space-y-2 md:space-y-0 gap-4 md:grid ${gridColsClass}`}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value
          return (
            <label
              key={String(option.value)}
              className={`flex items-center justify-between gap-2 p-3 md:px-2 md:py-4 rounded-lg border-2 cursor-pointer transition-colors ${
                isSelected
                  ? 'border-favorites bg-favorites/10'
                  : 'border-text-light/20 hover:border-text-light/40'
              }`}
            >
              <span className="text-text-light font-medium">{option.label}</span>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={(e) => {
                  // Handle both string and number values
                  const value = typeof option.value === 'number' 
                    ? parseInt(e.target.value) 
                    : e.target.value
                  onValueChange(value)
                }}
                className="w-5 h-5 accent-black cursor-pointer"
              />
            </label>
          )
        })}
      </div>
    </div>
  )
}

