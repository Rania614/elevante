"use client"

const MoneyAnimation = () => {
  const moneySymbols = ["$", "€", "£", "¥", "₹", "₽", "₿"]
  const coinSymbols = ["💰", "💵", "💴", "💶", "💷", "🪙"]

  // Generate random positions and animations for symbols
  const generateSymbols = (count: number, symbols: string[]) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      left: Math.random() * 100,
      animationDelay: Math.random() * 10,
      animationDuration: 15 + Math.random() * 10,
      fontSize: 20 + Math.random() * 30,
      opacity: 0.1 + Math.random() * 0.3,
    }))
  }

  const floatingSymbols = generateSymbols(15, moneySymbols)
  const floatingCoins = generateSymbols(8, coinSymbols)

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Dollar Signs and Currency Symbols */}
      {floatingSymbols.map((item) => (
        <div
          key={`symbol-${item.id}`}
          className="absolute animate-float-up text-elevante-primary"
          style={{
            left: `${item.left}%`,
            fontSize: `${item.fontSize}px`,
            opacity: item.opacity,
            animationDelay: `${item.animationDelay}s`,
            animationDuration: `${item.animationDuration}s`,
            fontWeight: "bold",
          }}
        >
          {item.symbol}
        </div>
      ))}

      {/* Floating Coin Emojis */}
      {floatingCoins.map((item) => (
        <div
          key={`coin-${item.id}`}
          className="absolute animate-float-diagonal"
          style={{
            left: `${item.left}%`,
            fontSize: `${item.fontSize}px`,
            opacity: item.opacity,
            animationDelay: `${item.animationDelay}s`,
            animationDuration: `${item.animationDuration}s`,
          }}
        >
          {item.symbol}
        </div>
      ))}

      {/* Floating Money Bills */}
      <div className="absolute top-10 left-10 animate-float-slow opacity-20">
        <div className="text-4xl">💵</div>
      </div>
      <div className="absolute top-32 right-20 animate-float-slow opacity-15" style={{ animationDelay: "3s" }}>
        <div className="text-3xl">💴</div>
      </div>
      <div className="absolute bottom-40 left-1/4 animate-float-slow opacity-25" style={{ animationDelay: "6s" }}>
        <div className="text-5xl">💰</div>
      </div>
      <div className="absolute bottom-20 right-1/3 animate-float-slow opacity-20" style={{ animationDelay: "9s" }}>
        <div className="text-3xl">💶</div>
      </div>

      {/* Sparkle Effects */}
      <div className="absolute top-1/4 left-1/2 animate-pulse opacity-30" style={{ animationDelay: "2s" }}>
        <div className="text-2xl">✨</div>
      </div>
      <div className="absolute bottom-1/3 right-1/4 animate-pulse opacity-25" style={{ animationDelay: "5s" }}>
        <div className="text-xl">⭐</div>
      </div>
      <div className="absolute top-1/2 left-1/4 animate-pulse opacity-20" style={{ animationDelay: "8s" }}>
        <div className="text-2xl">💎</div>
      </div>
    </div>
  )
}

export default MoneyAnimation
