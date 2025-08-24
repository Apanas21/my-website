import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

// Serve frontend build if provided
app.use(express.static('public'))

app.post('/api/send', async (req, res) => {
  const { name, contact, message } = req.body || {}
  if (!name || !contact) return res.status(400).json({ error: 'name and contact are required' })

  try {
    // 1) Email via SMTP
    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_HOST) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: (process.env.SMTP_SECURE || 'true') === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      })

      await transporter.sendMail({
        from: `"SmartLife" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        to: process.env.TO_EMAIL || process.env.SMTP_USER,
        subject: 'Новая заявка SmartLife',
        text: `Имя: ${name}\nКонтакт: ${contact}\nСообщение: ${message || ''}`
      })
    }

    // 2) Telegram notification
    if (process.env.TELEGRAM_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: `Новая заявка с сайта SmartLife:\nИмя: ${name}\nКонтакт: ${contact}\nСообщение: ${message || ''}`
        })
      })
    }

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to process request' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`SmartLife backend running on port ${PORT}`))
