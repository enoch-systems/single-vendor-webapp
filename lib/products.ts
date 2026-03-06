export interface Product {
    id: number
    name: string
    price: string
    originalPrice: string
    rating: number
    reviews: number
    image: string
    images: string[]
    description: string
    features: string[]
    colors: string[]
    sizes: string[]
    inStock: boolean
    badge: string
    category?: string
}

export const products: Product[] = [
    // Generate 36 products programmatically
    ...Array.from({ length: 36 }, (_, index) => {
        const id = index + 1
        const wigNumber = id
        const styles = ['Classic Bob', 'Long Wavy', 'Pixie Cut', 'Layered Lob', 'Sleek Straight', 'Curly Afro', 'Side Swept', 'Messy Bun', 'Ponytail Extension', 'Braided Styles']
        const categories = ['Short Hair', 'Long Hair', 'Curly Hair', 'Straight Hair', 'Wavy Hair']
        const style = styles[Math.floor(Math.random() * styles.length)]
        const category = categories[Math.floor(Math.random() * categories.length)]
        const name = `${style} ${category}`

        const basePrice = Math.floor(Math.random() * 50000) + 15000
        const discount = Math.random() > 0.5 ? Math.floor(Math.random() * 0.3 * basePrice) : 0
        const price = `₦${(basePrice - discount).toLocaleString()}`
        const originalPrice = discount > 0 ? `₦${basePrice.toLocaleString()}` : price
        
        const rating = parseFloat((Math.random() * 2 + 3).toFixed(1))
        const reviews = Math.floor(Math.random() * 500) + 50

        const colorPalettes = [
            ['Natural Black', 'Dark Brown', 'Chestnut Brown'],
            ['Jet Black', 'Off Black', 'Charcoal'],
            ['Platinum Blonde', 'Icy Blonde', 'Diamond Blonde'],
            ['Auburn Red', 'Burgundy Red', 'Copper Red'],
            ['Honey Brown', 'Caramel Brown', 'Chocolate Brown']
        ]
        const colors = colorPalettes[Math.floor(Math.random() * colorPalettes.length)]

        // Set specific badges for first 4 products
        let badge = ''
        if (id === 1) badge = 'New Arrival'
        else if (id === 2) badge = 'Special Offer'
        else if (id === 3) badge = 'Top Selling'
        else if (id === 4) badge = 'Hot Deals'
        else {
            const badges: string[] = []
            badge = Math.random() > 0.3 ? badges[Math.floor(Math.random() * badges.length)] : ''
        }

        return {
            id,
            name,
            price,
            originalPrice,
            rating,
            reviews,
            image: `/wig${wigNumber}.jpeg`,
            images: [`/wig${wigNumber}.jpeg`, `/wig${wigNumber}-2.jpeg`, `/wig${wigNumber}-3.jpeg`, `/wig${wigNumber}-4.jpeg`],
            description: `Experience exceptional quality with our ${name}. This ${style.toLowerCase()} design features premium synthetic fibers that provide a natural look and feel. Perfect for those seeking ${category.toLowerCase()} styling with maximum comfort and versatility.`,
            features: [
                'Premium synthetic fibers',
                'Comfortable cap construction',
                'Adjustable fit',
                'Breathable design',
                'Easy maintenance',
                'Versatile styling'
            ],
            colors,
            sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
            inStock: Math.random() > 0.1, // 90% in stock
            badge,
            category
        } as Product
    })
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
    await delay(300) // Simulate API call
    return products
}

// Get product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
    await delay(200) // Simulate API call
    return products.find(product => product.id === id) || null
}

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
    await delay(250) // Simulate API call
    return products.filter(product =>
        product.category?.toLowerCase() === category.toLowerCase()
    )
}

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
    await delay(150) // Simulate API call
    const lowerQuery = query.toLowerCase()
    return products.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category?.toLowerCase().includes(lowerQuery)
    )
}
