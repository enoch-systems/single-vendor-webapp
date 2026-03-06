'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, Star, Minus, Plus, Truck, Shield, RotateCcw, Package, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroHeader } from '@/components/header'
import Footer from '@/components/footer'
import { useCart } from '@/components/cart-context'
import { getProductById, Product, getAllProducts } from '@/lib/products'

const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`size-4 ${
                        star <= Math.floor(rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                    }`}
                />
            ))}
            <span className="text-sm text-gray-600 ml-2">({rating})</span>
        </div>
    )
}

const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
        'Natural Black': '#1a1a1a',
        'Dark Brown': '#3e2723',
        'Chestnut Brown': '#6d4c41',
        'Jet Black': '#000000',
        'Off Black': '#2d2d2d',
        'Charcoal': '#36454f',
        'Platinum Blonde': '#f8f8ff',
        'Icy Blonde': '#e6f3ff',
        'Diamond Blonde': '#fafafa',
        'Honey Blonde': '#e6b800',
        'Auburn Red': '#a52a2a',
        'Burgundy Red': '#800020',
        'Copper Red': '#b87333',
        'Strawberry Red': '#ff6347',
        'Honey Brown': '#8b4513',
        'Caramel Brown': '#cd853f',
        'Chocolate Brown': '#3b2f2f',
        'Medium Brown': '#5c4033',
        'Light Brown': '#bc9a6a',
        'Rich Brown': '#654321',
        'Espresso Brown': '#2f1b14',
        'Ash Blonde': '#e0e0e0',
        'Strawberry Blonde': '#ffc0cb',
        'Pearl Blonde': '#f8f6f0',
        'Classic Auburn': '#8b4513',
        'Copper Auburn': '#b87333',
        'Burgundy Auburn': '#800020',
        'Strawberry Auburn': '#ff6347',
        'Velvet Red': '#8b0000',
        'Wine Red': '#722f37',
        'Cherry Red': '#de3163'
    }
    return colorMap[colorName] || '#cccccc'
}

export default function DynamicProductPage({ params }: { params: Promise<{ productId: string }> }) {
    const { addToCart } = useCart()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedColor, setSelectedColor] = useState('')
    const [selectedSize, setSelectedSize] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set())
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
    const [expandedSection, setExpandedSection] = useState<string | null>('features')

    const resolvedParams = React.use(params)

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true)
                setError(null)
                const productId = parseInt(resolvedParams.productId)
                if (isNaN(productId)) {
                    throw new Error('Invalid product ID')
                }
                const productData = await getProductById(productId)
                if (!productData) {
                    throw new Error('Product not found')
                }
                setProduct(productData)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load product')
            } finally {
                setLoading(false)
            }
        }

        loadProduct()
    }, [resolvedParams.productId])

    useEffect(() => {
        const loadRelatedProducts = async () => {
            try {
                const allProducts = await getAllProducts()
                // Get 4 random products excluding the current one
                const filtered = allProducts.filter(p => p.id !== product?.id)
                const shuffled = [...filtered].sort(() => 0.5 - Math.random())
                const random = shuffled.slice(0, 4)
                setRelatedProducts(random)
            } catch (err) {
                console.error('Failed to load related products:', err)
            }
        }

        if (product) {
            loadRelatedProducts()
        }
    }, [product])

    const handleAddToCart = () => {
        if (!product) return
        if (!selectedColor || !selectedSize) {
            alert('Please select color and size')
            return
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images[0],
            badge: product.badge
        })
        
        // Show success feedback
        setAddedToCart(prev => new Set([...prev, product.id]))
        
        // Remove feedback after 1 second
        setTimeout(() => {
            setAddedToCart(prev => {
                const newSet = new Set(prev)
                newSet.delete(product.id)
                return newSet
            })
        }, 1000)
    }

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted)
    }

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section)
    }

    if (loading) {
        return (
            <>
                <HeroHeader />
                <main className="overflow-hidden">
                    <section className="py-8 mt-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                        <div className="max-w-7xl mx-auto">
                            <Link href="/shop" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                                <ArrowLeft className="w-5 h-5" />
                                Back to Shopping
                            </Link>
                            <div className="flex items-center justify-center min-h-[400px]">
                                <div className="text-center">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-900" />
                                    <p className="text-gray-600">Loading product...</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </>
        )
    }

    if (error || !product) {
        return (
            <>
                <HeroHeader />
                <main className="overflow-hidden">
                    <section className="py-8 mt-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                        <div className="max-w-7xl mx-auto">
                            <Link href="/shop" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                                <ArrowLeft className="w-5 h-5" />
                                Back to Shopping
                            </Link>
                            <div className="flex items-center justify-center min-h-[400px]">
                                <div className="text-center">
                                    <div className="text-red-500 mb-4">Error loading product</div>
                                    <p className="text-gray-600 mb-4">{error}</p>
                                    <Link href="/shop">
                                        <Button className="bg-amber-900 text-white hover:bg-amber-800">
                                            Back to Shop
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </>
        )
    }

    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <section className="py-8 mt-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        {/* Back Button */}
                        <div className="mb-6">
                            <Link href="/shop" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                                <ArrowLeft className="w-5 h-5" />
                                Back to Shopping
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Product Images */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <img
                                        src={product.images[selectedImage]}
                                        alt={product.name}
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                    {product.badge && (
                                        <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                                            {product.badge}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Thumbnail Gallery */}
                                <div className="flex gap-4">
                                    {product.images.map((image: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === index
                                                    ? 'border-amber-500 scale-105'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} - View ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="space-y-6">
                                {/* Title and Price */}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-3xl font-semibold text-gray-900">{product.price}</span>
                                        <span className="text-xl text-gray-500 line-through">{product.originalPrice}</span>
                                    </div>
                                    <StarRating rating={product.rating} />
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                </div>

                                {/* Color Selection */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Color</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map((color: string) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-10 h-10 rounded-full border-2 transition-all ${
                                                    selectedColor === color
                                                        ? 'border-black'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                                title={color}
                                                style={{
                                                    backgroundColor: getColorHex(color)
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Size Selection */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Size</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map((size: string) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                                    selectedSize === size
                                                        ? 'bg-amber-700 text-white border-amber-700'
                                                        : size === '3XL' 
                                                            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                                            : 'bg-white text-black border-gray-300 hover:border-gray-400'
                                                }`}
                                                disabled={size === '3XL'}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity and Actions */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                        <select
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent text-sm"
                                        >
                                            {Array.from({ length: 49 }, (_, i) => i + 1).map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <Button
                                        onClick={handleAddToCart}
                                        className={`flex-1 py-4 transition-colors ${
                                            addedToCart.has(product.id)
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                                        }`}
                                    >
                                        {addedToCart.has(product.id) ? 'Added!' : 'Add to Cart'}
                                    </Button>
                                </div>

                                {/* You May Also Like */}
                                {relatedProducts.length > 0 && (
                                    <div className="mt-12 border-t pt-8">
                                        <h3 className="text-lg mt-4 font-semibold text-gray-900 mb-6">You May Also Like</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {relatedProducts.map((relatedProduct) => (
                                                <Link key={relatedProduct.id} href={`/shop/${relatedProduct.id}`} className="block">
                                                    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
                                                        {/* Product Image */}
                                                        <div className="relative overflow-hidden rounded-t-lg">
                                                            <img
                                                                src={relatedProduct.image}
                                                                alt={relatedProduct.name}
                                                                className="w-full h-48 object-cover transition-transform duration-300"
                                                            />
                                                        </div>
                                                        
                                                        {/* Product Info */}
                                                        <div className="p-3">
                                                            <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                                                                {relatedProduct.name}
                                                            </h4>
                                                            
                                                            {/* Price */}
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-base font-bold text-gray-900">
                                                                    {relatedProduct.price}
                                                                </span>
                                                                <span className="text-xs text-gray-500 line-through">
                                                                    {relatedProduct.originalPrice}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Page footer */}
                <Footer />
            </main>
        </>
    )
}
