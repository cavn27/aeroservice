import { helpTabs, popular } from '../../data/ayuda'

// Índice plano de todas las preguntas, para el buscador y las preguntas destacadas.
export const allQuestions = helpTabs.flatMap((tab) =>
  tab.topics.flatMap((topic) =>
    topic.faqs.map((faq) => ({
      ...faq,
      tab: tab.label,
      topic: topic.title,
      context: `${topic.title} ${topic.description}`,
      key: `${tab.id}/${topic.id}/${faq.q}`,
    })),
  ),
)

export const popularQuestions = popular.map(([tabId, topicId, i]) => {
  const tab = helpTabs.find((t) => t.id === tabId)
  const topic = tab.topics.find((t) => t.id === topicId)
  return allQuestions.find((q) => q.key === `${tabId}/${topicId}/${topic.faqs[i].q}`)
})

// Quita tildes y pasa a minúsculas para comparar ("camion" encuentra "camión").
const normalize = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

export function searchQuestions(query, limit = 6) {
  const words = normalize(query).split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  return allQuestions
    .map((item) => {
      const q = normalize(item.q)
      const rest = normalize(`${item.a} ${item.context}`)
      // Coincidencias en la pregunta pesan más que en la respuesta o el tema.
      const score = words.reduce((acc, w) => acc + (q.includes(w) ? 3 : 0) + (rest.includes(w) ? 1 : 0), 0)
      const all = words.every((w) => q.includes(w) || rest.includes(w))
      return { item, score: all ? score : 0 }
    })
    .filter((r) => r.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((r) => r.item)
}
