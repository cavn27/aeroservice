import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, description, align = 'left', light = false, className = '' }) {
  const centered = align === 'center'
  return (
    <Reveal className={`${centered ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow && (
        <div className={`mb-4 flex flex-col gap-3 ${centered ? 'items-center' : 'items-start'}`}>
          <span className="h-1 w-6 rounded-full bg-brand-600" />
          <span className={`text-sm font-semibold tracking-wide ${light ? 'text-white/80' : 'text-muted'}`}>{eyebrow}</span>
        </div>
      )}
      <h2 className={`text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl ${light ? 'text-white' : 'text-ink'}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-pretty text-lg leading-relaxed ${light ? 'text-white/80' : 'text-muted'}`}>{description}</p>
      )}
    </Reveal>
  )
}
