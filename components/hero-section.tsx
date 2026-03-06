'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { Carousel } from '@/components/ui/carousel'
import { HeroHeader } from './header'
import { Featured } from './featured'
import Footer from '@/components/footer'
import { useUI } from '@/contexts/ui-context'

const carouselImages = [
    {
        src: '/wig1.jpeg',
        alt: 'Premium Wig Collection',
        title: 'Premium Quality Wigs',
        description: 'Discover our exclusive collection of high-quality wigs designed for style and comfort.'
    },
    {
        src: '/wig2.jpeg',
        alt: 'Fashion Wigs',
        title: 'Trendy Fashion Styles',
        description: 'Stay ahead of the trends with our latest fashion-forward wig designs.'
    },
    {
        src: '/wig3.jpeg',
        alt: 'Natural Look Wigs',
        title: 'Natural Looking Wigs',
        description: 'Achieve the perfect natural look with our realistic hairline and texture options.'
    },
    {
        src: '/wig4.jpeg',
        alt: 'Colorful Wigs',
        title: 'Vibrant Color Collection',
        description: 'Express yourself with our wide range of vibrant and natural color options.'
    },
    {
        src: '/wig5.jpeg',
        alt: 'Luxury Wigs',
        title: 'Luxury Hair Solutions',
        description: 'Experience premium luxury with our handcrafted designer wig collection.'
    }
]

// Sample products for search (same as in shop)
const sampleProducts = [
    { id: 1, name: 'Classic Bob Cut', price: '₦45,000', image: '/wig1.jpeg' },
    { id: 2, name: 'Long Wavy Style', price: '₦55,000', image: '/wig2.jpeg' },
    { id: 3, name: 'Curly Afro Wig', price: '₦38,000', image: '/wig3.jpeg' },
    { id: 4, name: 'Straight Blonde', price: '₦62,000', image: '/wig4.jpeg' },
    { id: 5, name: 'Brown Layered Cut', price: '₦48,000', image: '/wig5.jpeg' },
    { id: 6, name: 'Short Pixie Style', price: '₦35,000', image: '/wig6.jpeg' },
    { id: 7, name: 'Black Long Straight', price: '₦58,000', image: '/wig7.jpeg' },
    { id: 8, name: 'Auburn Curls', price: '₦42,000', image: '/wig8.jpeg' },
    { id: 9, name: 'Platinum Blonde', price: '₦68,000', image: '/wig9.jpeg' },
    { id: 10, name: 'Dark Brown Waves', price: '₦52,000', image: '/wig10.jpeg' },
]

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

const carouselTransitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
                delay: 0.3,
            },
        },
    },
}

const featuredTransitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
                delay: 0.6,
            },
        },
    },
}

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState('')
    const searchWrapperRef = useRef<HTMLDivElement>(null)
    const [resultsStyle, setResultsStyle] = useState<{top: number; left: number; width: number} | null>(null)
    const { profileDropdownOpen, mobileMenuOpen } = useUI()

    // compute dropdown position whenever query changes
    useEffect(() => {
        if (!searchWrapperRef.current) return
        const rect = searchWrapperRef.current.getBoundingClientRect()
        setResultsStyle({
            top: rect.bottom + window.scrollY,
            left: rect.left + rect.width / 2 + window.scrollX,
            width: rect.width,
        })
    }, [searchQuery])

    // reposition on window resize
    useEffect(() => {
        const handler = () => {
            if (!searchWrapperRef.current) return
            const rect = searchWrapperRef.current.getBoundingClientRect()
            setResultsStyle({
                top: rect.bottom + window.scrollY,
                left: rect.left + rect.width / 2 + window.scrollX,
                width: rect.width,
            })
        }
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    const filteredProducts = sampleProducts.filter(product => 
        product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    )

    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring',
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="mask-b-from-35% mask-b-to-90% absolute inset-0 top-56 -z-20 lg:top-32">
                            <Image
                                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                                alt="background"
                                className="hidden size-full"
                                width="3276"
                                height="4095"
                            />
                        </AnimatedGroup>

                        <div
                            aria-hidden
                            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
                        />

                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants} className="relative z-2">
                                    {!profileDropdownOpen && !mobileMenuOpen && (
                                        <div ref={searchWrapperRef} className="hover:bg-background bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-2 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300">
                                            <input
                                                type="text"
                                                placeholder="Search products...."
                                                className="text-foreground text-sm bg-transparent outline-none w-64 placeholder:text-muted-foreground"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <span className="block h-4 w-0.5 border-l bg-white"></span>
                                            <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500 flex items-center justify-center">
                                                <Search className="m-auto size-3" />
                                            </div>
                                        </div>
                                    )}
                                </AnimatedGroup>
                            </div>
                        </div>

                        {/* backdrop blur layer */}
                        {searchQuery && filteredProducts.length > 0 && (
                            <div
                                className="fixed inset-0 bg-white/25 backdrop-blur-sm z-[9998]"
                                onClick={() => setSearchQuery('')}
                            />
                        )}

                        {/* search results dropdown */}
                        {searchQuery && filteredProducts.length > 0 && resultsStyle && (
                            <div
                                className="fixed bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto z-[9999]"
                                style={{
                                    top: resultsStyle.top + 8,
                                    left: resultsStyle.left,
                                    transform: 'translateX(-50%)',
                                    width: resultsStyle.width
                                }}
                            >
                                {filteredProducts.slice(0, 10).map(product => (
                                    <div key={product.id} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                                        <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded mr-3" />
                                        <div>
                                            <p className="text-sm font-semibold">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Carousel Section */}
                        <AnimatedGroup variants={carouselTransitionVariants}>
                            <div className="relative h-[600px] w-full">
                                <Carousel images={carouselImages} className="h-full" />
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                
                {/* Featured Products Section */}
                <Featured />

                {/* Page footer */}
                <Footer />
            </main>
        </>
    )
}
