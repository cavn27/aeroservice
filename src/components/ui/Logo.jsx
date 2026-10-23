import { Link } from 'react-router'
import emblem from '../../assets/emblem.png'
import wordmark from '../../assets/wordmark.png'
import wordmarkWhite from '../../assets/wordmark-white.png'

export default function Logo({ variant = 'color', to = '/personas', className = '' }) {
  return (
    <Link to={to} aria-label="Aerogas, ir al inicio" className={`flex shrink-0 items-center gap-2.5 ${className}`}>
      <img src={emblem} alt="" className="h-9 w-auto sm:h-10" />
      <img
        src={variant === 'white' ? wordmarkWhite : wordmark}
        alt="Aerogas"
        className="h-6 w-auto sm:h-7"
      />
    </Link>
  )
}
