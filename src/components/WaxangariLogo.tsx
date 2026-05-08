import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  /** Si false, le logo n'est pas cliquable (rare) */
  linkable?: boolean
}

const sizeMap = {
  sm: { w: 110, h: 44 },
  md: { w: 150, h: 60 },
  lg: { w: 200, h: 80 },
}

export function WaxangariLogo({ className, size = 'md', linkable = true }: LogoProps) {
  const { w, h } = sizeMap[size]

  const img = (
    <Image
      src="/logo.jpeg"
      alt="Waxangari Labs"
      width={w}
      height={h}
      priority
      className="object-contain select-none dark:mix-blend-multiply dark:[filter:invert(0)] rounded-sm"
      style={{ width: w, height: 'auto', maxHeight: h }}
    />
  )

  if (!linkable) return <div className={cn('inline-flex items-center', className)}>{img}</div>

  return (
    <Link
      href="/"
      className={cn('inline-flex items-center transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg', className)}
      aria-label="Waxangari Labs – Accueil"
    >
      {img}
    </Link>
  )
}
