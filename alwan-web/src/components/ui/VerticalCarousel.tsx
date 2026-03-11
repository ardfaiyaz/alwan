'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface CarouselItem {
  title: string
  position: 'far-prev' | 'prev' | 'current' | 'next' | 'far-next'
  opacity: number
  blur: string
  scale: number
  y: number
}

interface VerticalCarouselProps {
  items: string[]
  currentIndex: number
  className?: string
  itemClassName?: string
  currentItemClassName?: string
  staggerDelay?: number
  animationDuration?: number
}

export default function VerticalCarousel({
  items,
  currentIndex,
  className = '',
  itemClassName = '',
  currentItemClassName = '',
  staggerDelay = 0.08,
  animationDuration = 0.4,
}: VerticalCarouselProps) {
  const [previousIndex, setPreviousIndex] = useState(currentIndex)

  useEffect(() => {
    setPreviousIndex(currentIndex)
  }, [currentIndex])

  const getCarouselItems = (): CarouselItem[] => {
    const carouselItems: CarouselItem[] = []
    
    // Show 2 previous items (more blurred as they go up)
    if (currentIndex > 1) {
      carouselItems.push({
        title: items[currentIndex - 2],
        position: 'far-prev',
        opacity: 0.15,
        blur: 'blur-md',
        scale: 0.85,
        y: -120,
      })
    }
    
    if (currentIndex > 0) {
      carouselItems.push({
        title: items[currentIndex - 1],
        position: 'prev',
        opacity: 0.3,
        blur: 'blur-sm',
        scale: 0.9,
        y: -60,
      })
    }
    
    // Current item (main focus)
    carouselItems.push({
      title: items[currentIndex],
      position: 'current',
      opacity: 1,
      blur: '',
      scale: 1,
      y: 0,
    })
    
    // Show 2 next items (more blurred as they go down)
    if (currentIndex < items.length - 1) {
      carouselItems.push({
        title: items[currentIndex + 1],
        position: 'next',
        opacity: 0.3,
        blur: 'blur-sm',
        scale: 0.9,
        y: 60,
      })
    }
    
    if (currentIndex < items.length - 2) {
      carouselItems.push({
        title: items[currentIndex + 2],
        position: 'far-next',
        opacity: 0.15,
        blur: 'blur-md',
        scale: 0.85,
        y: 120,
      })
    }
    
    return carouselItems
  }

  const isMovingForward = currentIndex > previousIndex

  return (
    <div className={`relative w-full h-[600px] flex items-center justify-center overflow-hidden ${className}`}>
      {getCarouselItems().map((item, index) => {
        const isCurrent = item.position === 'current'
        
        return (
          <motion.div
            key={`${item.position}-${currentIndex}-${index}`}
            initial={{ 
              opacity: 0, 
              y: isMovingForward ? item.y + 60 : item.y - 60,
              scale: 0.8 
            }}
            animate={{ 
              opacity: item.opacity, 
              y: item.y, 
              scale: item.scale 
            }}
            exit={{ 
              opacity: 0, 
              y: isMovingForward ? item.y - 60 : item.y + 60,
              scale: 0.8 
            }}
            transition={{ 
              duration: animationDuration, 
              ease: [0.4, 0, 0.2, 1],
              delay: index * staggerDelay
            }}
            className={`absolute text-center px-8 ${item.blur} ${
              isCurrent ? 'z-10' : 'z-0'
            } ${itemClassName}`}
          >
            <h2 
              className={`font-bold bg-gradient-to-r from-[#009245] via-[#4dd88f] to-[#056633] bg-clip-text text-transparent leading-tight ${
                isCurrent ? `text-5xl ${currentItemClassName}` : 'text-3xl'
              }`}
            >
              {item.title}
            </h2>
          </motion.div>
        )
      })}
    </div>
  )
}
