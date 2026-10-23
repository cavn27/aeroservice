// Íconos de redes sociales (lucide ya no incluye logos de marcas).
const paths = {
  Facebook: <path d="M14 8h3V4h-3a5 5 0 0 0-5 5v2H6v4h3v9h4v-9h3l1-4h-4V9a1 1 0 0 1 1-1Z" fill="currentColor" />,
  Instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </g>
  ),
  LinkedIn: (
    <path
      fill="currentColor"
      d="M4 9h4v12H4V9Zm2-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm4 6h3.8v1.7c.6-1 1.9-2 3.9-2 4 0 4.3 2.6 4.3 6V21h-4v-5.5c0-1.5 0-3.3-2-3.3s-2.1 1.6-2.1 3.2V21H10V9Z"
    />
  ),
  YouTube: (
    <g>
      <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
      <path d="m10 9 5 3-5 3V9Z" fill="var(--icon-bg, #070b24)" />
    </g>
  ),
  TikTok: (
    <path
      fill="currentColor"
      d="M16.5 3c.3 2.2 1.6 3.6 3.8 3.8v3.1a7 7 0 0 1-3.8-1.2v6.1A5.8 5.8 0 1 1 11 9v3.2a2.7 2.7 0 1 0 2.4 2.7V3h3.1Z"
    />
  ),
  WhatsApp: (
    <g>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z"
      />
      <path
        fill="currentColor"
        d="M16.6 14.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z"
      />
    </g>
  ),
}

export default function SocialIcon({ name, className = 'size-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

export function WhatsAppIcon({ className }) {
  return <SocialIcon name="WhatsApp" className={className} />
}
