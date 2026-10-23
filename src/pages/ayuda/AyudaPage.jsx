import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import HelpHero from './HelpHero'
import ServiceTopics from './ServiceTopics'
import HelpContact from './HelpContact'

export default function AyudaPage() {
  const [question, setQuestion] = useState(null)

  return (
    <>
      <title>Aerogas | Centro de ayuda</title>
      <HelpHero onOpen={setQuestion} />
      <ServiceTopics />
      <HelpContact />
      <Modal open={!!question} onClose={() => setQuestion(null)} labelledBy="question-title">
        {question && (
          <>
            <span className="rounded-lg bg-navy-50 px-2.5 py-1 text-sm font-medium text-navy-600">
              {question.tab} · {question.topic}
            </span>
            <h3 id="question-title" className="mt-5 pr-10 text-balance text-2xl font-bold leading-snug sm:text-3xl">
              {question.q}
            </h3>
            <p className="mt-5 text-lg leading-relaxed text-muted">{question.a}</p>
            <p className="mt-8 text-sm text-muted">
              ¿No resolviste tu duda?{' '}
              <a href="#contacto" onClick={() => setQuestion(null)} className="font-semibold text-navy-600 hover:underline">
                Contáctanos
              </a>
            </p>
          </>
        )}
      </Modal>
    </>
  )
}
