'use client'

/**
 * Typing effect: cycles through phrases with type/delete; variant 'hero' | 'download' for different copy.
 * Uses .typing-cursor in globals.css for blink.
 */
import { useState, useEffect } from 'react'

const defaultPhrases = [
  'Your dreams, within reach.',
  'Financial freedom starts here.',
  'Empowering every Filipino.',
  'Smart loans, brighter future.',
]

const downloadPhrases = [
  'Download the Alwan App.',
  'Your finances in your pocket.',
  'Manage loans anytime.',
  'Get started in minutes.',
]

const registerPhrases = [
  'Join thousands of Filipinos.',
  'Your financial journey starts here.',
  'Register in minutes.',
  'One app. Endless possibilities.',
]

export default function TypingAnimation({ variant = 'hero' }: { variant?: 'hero' | 'download' | 'register' }) {
  const phrases =
    variant === 'download' ? downloadPhrases : variant === 'register' ? registerPhrases : defaultPhrases
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]
    const typingSpeed = isDeleting ? 50 : 100
    const pauseTime = isDeleting ? 500 : 2000

    if (!isDeleting && displayText === currentPhrase) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime)
      return () => clearTimeout(timeout)
    } else if (isDeleting && displayText === '') {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
      setIsDeleting(false)
      return
    }

    const timeout = setTimeout(
      () => {
        setDisplayText((prev) =>
          isDeleting ? currentPhrase.substring(0, prev.length - 1) : currentPhrase.substring(0, prev.length + 1)
        )
      },
      typingSpeed
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentPhraseIndex])

  /** Cursor color: dark for light backgrounds (e.g. register page), white for dark (hero) */
  const cursorClass = variant === 'register' ? 'typing-cursor-register' : 'typing-cursor'

  return (
    <span>
      {displayText}
      <span className={`${cursorClass} inline-block w-0.5 h-[1em] ml-0.5 align-middle`} />
    </span>
  )
}
