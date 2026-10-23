import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import Reveal from '../../components/ui/Reveal'
import { distributorPerks } from '../../data/personas'

export default function DistributorCta() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-navy-900">
      <motion.img
        src="/images/distribuidor.jpg"
        alt=""
        loading="lazy"
        style={{ y }}
        className="absolute inset-x-0 -top-[12%] -z-10 h-[124%] w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-navy-950/95 via-navy-900/75 to-navy-900/10" />
      <div className="container-page flex min-h-[460px] items-center justify-end py-20">
        <Reveal className="max-w-xl text-right">
          <h2 className="text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            ¿Te gustaría ser parte de nuestra red de distribuidores?
          </h2>
          <ul className="mt-8 flex flex-col items-end gap-3 text-white/85">
            {distributorPerks.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5">
                {perk} <CheckCircle2 className="size-5 shrink-0 text-brand-500" />
              </li>
            ))}
          </ul>
          <Button variant="white" size="lg" href="/distribuidores" className="mt-10">
            ¡Postula aquí! <ArrowRight className="size-5" />
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
