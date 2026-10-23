import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import * as Accordion from '@radix-ui/react-accordion'
import { ArrowRight, Plus } from 'lucide-react'
import SectionHeading from '../../components/ui/SectionHeading'
import Modal from '../../components/ui/Modal'
import { helpTabs } from '../../data/ayuda'

function TopicDrawer({ topic, onClose }) {
  return (
    <Modal open={!!topic} onClose={onClose} variant="drawer" labelledBy="topic-title">
      {topic && (
        <>
          <span className="grid size-14 place-items-center rounded-2xl bg-navy-50 text-navy-600">
            <topic.icon className="size-7" strokeWidth={1.7} />
          </span>
          <h3 id="topic-title" className="mt-5 pr-12 text-3xl font-bold tracking-tight">
            {topic.title}
          </h3>
          <p className="mt-2 text-muted">{topic.description}</p>
          <Accordion.Root type="single" collapsible defaultValue="0" className="mt-8 divide-y divide-navy-100/70 border-y border-navy-100/70">
            {topic.faqs.map((f, i) => (
              <Accordion.Item key={f.q} value={String(i)} className="group">
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-ink transition-colors hover:text-navy-600 data-[state=open]:text-navy-600">
                    {f.q}
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-600 transition-all duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-navy-600 group-data-[state=open]:text-white">
                      <Plus className="size-4" />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <p className="pb-5 leading-relaxed text-muted">{f.a}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
          <p className="mt-8 text-sm text-muted">
            ¿No resolviste tu duda?{' '}
            <a href="#contacto" onClick={onClose} className="font-semibold text-navy-600 hover:underline">
              Contáctanos
            </a>
          </p>
        </>
      )}
    </Modal>
  )
}

export default function ServiceTopics() {
  const [tabId, setTabId] = useState(helpTabs[0].id)
  const [topic, setTopic] = useState(null)
  const tab = helpTabs.find((t) => t.id === tabId)

  return (
    <section id="servicios" className="scroll-mt-24 py-24 lg:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="Temas" title="Búsqueda por servicio" align="center" />

        <div role="tablist" aria-label="Segmentos" className="mx-auto mt-10 flex max-w-full justify-start gap-1 overflow-x-auto no-scrollbar sm:justify-center">
          {helpTabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={t.id === tabId}
              onClick={() => setTabId(t.id)}
              className={`relative shrink-0 px-5 py-3 text-[15px] transition-colors ${t.id === tabId ? 'font-semibold text-navy-600' : 'text-muted hover:text-ink'}`}
            >
              {t.label}
              {t.id === tabId && <motion.span layoutId="help-tab" className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-navy-600" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tabId}
            role="tabpanel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {tab.topics.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTopic(t)}
                className="group flex items-start gap-5 rounded-3xl bg-white p-6 text-left ring-1 ring-navy-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:ring-navy-200"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-navy-50 to-navy-100 text-navy-600 transition-colors duration-300 group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white">
                  <t.icon className="size-7" strokeWidth={1.7} />
                </span>
                <span className="flex-1">
                  <span className="block text-lg font-semibold text-ink">{t.title}</span>
                  <span className="mt-1 block leading-relaxed text-muted">{t.description}</span>
                  <span className="mt-3 inline-flex items-center gap-1.5 font-semibold text-navy-600">
                    Más información <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <TopicDrawer topic={topic} onClose={() => setTopic(null)} />
    </section>
  )
}
