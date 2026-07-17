import { useEffect, useRef, useState } from 'react'

type WalkthroughVideoProps = {
  webmSrc: string
  mp4Src: string
  posterSrc: string
  label: string
  className?: string
  autoPlay?: boolean
  loop?: boolean
}

export function WalkthroughVideo({
  webmSrc,
  mp4Src,
  posterSrc,
  label,
  className = '',
  autoPlay = true,
  loop = true,
}: WalkthroughVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(media.matches)
    updatePreference()
    media.addEventListener('change', updatePreference)
    return () => media.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (reducedMotion) {
      video.pause()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && autoPlay) {
          void video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [autoPlay, reducedMotion])

  return (
    <video
      ref={videoRef}
      className={className}
      aria-label={label}
      poster={posterSrc}
      muted
      autoPlay={autoPlay && !reducedMotion}
      playsInline
      loop={loop}
      controls
      preload="metadata"
    >
      <source src={webmSrc} type="video/webm" />
      <source src={mp4Src} type="video/mp4" />
      Your browser does not support embedded video. The product story remains available in the surrounding text and images.
    </video>
  )
}
