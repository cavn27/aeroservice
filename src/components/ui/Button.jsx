const variants = {
  primary: 'bg-navy-600 text-white hover:bg-navy-700 shadow-[0_8px_20px_-8px_rgb(31_45_132/0.6)]',
  brand: 'bg-brand-600 text-white hover:bg-brand-700 shadow-[0_8px_20px_-8px_rgb(227_6_19/0.6)]',
  outline: 'border border-navy-600 text-navy-600 hover:bg-navy-50',
  white: 'bg-white text-navy-700 hover:bg-navy-50',
  ghostWhite: 'border border-white/40 text-white hover:bg-white/10',
}

const sizes = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-8 text-base',
}

export default function Button({ as: Tag = 'a', variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.97] ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
