import React, { useEffect, useRef } from 'react'

export default function App() {
  const fadeRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('opacity-100', 'translate-y-0')
      })
    }, { threshold: 0.15 })
    fadeRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const Feature = ({ emoji, title, text, i }) => (
    <div ref={(el) => (fadeRefs.current[i] = el)} className="opacity-0 translate-y-6 transition-all duration-700 bg-white rounded-2xl shadow p-6">
      <div className="text-5xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  )

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        alert('Заявка отправлена!')
        e.currentTarget.reset()
      } else {
        alert('Ошибка отправки. Попробуйте позже.')
      }
    } catch (e) {
      alert('Сеть недоступна. Проверьте подключение.')
    }
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white/90 backdrop-blur sticky top-0 z-20 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.svg" alt="SmartLife" className="h-10" />
            <span className="text-brand-dark font-bold text-xl">SmartLife</span>
          </div>
          <a href="#contact" className="px-4 py-2 rounded-xl bg-brand-accent text-white font-medium hover:opacity-90">Оставить заявку</a>
        </div>
      </header>

      <section className="text-center py-20 bg-gradient-to-b from-brand-dark to-blue-700 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Интеллектуальное видеонаблюдение</h1>
        <p className="text-lg opacity-90 mb-8">Удалённый доступ, облачное хранение, защита 24/7</p>
        <a href="#contact" className="inline-block bg-white text-brand-dark px-6 py-3 rounded-xl font-semibold hover:bg-gray-100">Получить консультацию</a>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-6">
        <Feature i={0} emoji="☁️" title="Облачное хранение" text="Архив и доступ в пару кликов, с любого устройства." />
        <Feature i={1} emoji="🔒" title="Надёжная защита" text="Шифрование TLS и строгие политики доступа." />
        <Feature i={2} emoji="🌙" title="Ночное видение" text="Чёткая картинка даже в полной темноте." />
      </section>

      <section id="how" className="bg-gray-100">
        <div className="max-w-6xl mx-auto py-16 px-6 text-center grid md:grid-cols-3 gap-8">
          {[
            { title: '1. Установка', text: 'Монтаж сертифицированными специалистами.' },
            { title: '2. Подключение', text: 'Интеграция с облаком и мобильным приложением.' },
            { title: '3. Контроль', text: 'Уведомления и просмотр 24/7, где бы вы ни были.' },
          ].map((s, i) => (
            <div key={i} ref={(el) => (fadeRefs.current[3 + i] = el)} className="opacity-0 translate-y-6 transition-all duration-700">
              <h3 className="font-bold text-xl mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="max-w-3xl mx-auto py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Оставьте заявку</h2>
        <form onSubmit={onSubmit} className="space-y-4 text-left bg-white rounded-2xl shadow p-6">
          <input name="name" type="text" placeholder="Имя" className="w-full border rounded-lg p-3" required />
          <input name="contact" type="text" placeholder="Телефон или Email" className="w-full border rounded-lg p-3" required />
          <textarea name="message" placeholder="Комментарий" className="w-full border rounded-lg p-3" rows="4"></textarea>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" required /> Согласен на обработку персональных данных
          </label>
          <button type="submit" className="bg-brand-accent text-white px-6 py-3 rounded-lg hover:opacity-90">Отправить</button>
        </form>
      </section>

      <footer className="bg-brand-dark text-white text-center py-6">
        © 2025 SmartLife. Все права защищены.
      </footer>
    </div>
  )
}
