import { useState } from 'react'
import DiagonalBanner from '../../components/sections/DiagonalBanner'
import VideoModal from '../../components/ui/VideoModal'
import { video } from '../../data/empresas'

export default function VideoBanner() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <DiagonalBanner
        title={video.title}
        image={video.image}
        action={{ label: 'Ver video', onClick: () => setOpen(true) }}
        onPlay={() => setOpen(true)}
      />
      <VideoModal open={open} onClose={() => setOpen(false)} title={video.title} embedUrl={video.embedUrl} />
    </>
  )
}
