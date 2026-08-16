require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Resend } = require('resend')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const app = express()
const PORT = process.env.PORT || 3000

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))
app.use(express.json())

const resend = new Resend(process.env.RESEND_API_KEY)
// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany()
    res.json(projects)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// GET all skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany()
    res.json(skills)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' })
  }
})

// GET all publications
app.get('/api/publications', async (req, res) => {
  try {
    const publications = await prisma.publication.findMany({ orderBy: { year: 'desc' } })
    res.json(publications)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch publications' })
  }
})

// POST contact form
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
    return res.status(400).json({ error: 'Name, email, and message are required.' })
  }

  try {
    const newMessage = await prisma.message.create({
      data: { name: name.trim(), email: email.trim(), message: message.trim() }
    })

    // Send HTTP response immediately to UI
    res.status(201).json({ success: true, message: 'Message sent successfully!', id: newMessage.id })

    // Send email asynchronously in background
    if (process.env.RESEND_API_KEY) {
      resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'antsanotiavinaantsa@gmail.com',
        replyTo: email.trim(),
        subject: `New Portfolio Message from ${name.trim()}`,
        text: `You have a new message.\n\nName: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
        html: `<h3>New Message from ${name.trim()}</h3><p><strong>Email:</strong> ${email.trim()}</p><p><strong>Message:</strong></p><p>${message.trim().replace(/\n/g, '<br>')}</p>`
      }).catch(emailError => {
        console.error('Failed to send email in background:', emailError)
      })
    }
  } catch (error) {
    console.error('Failed to save message:', error)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to save message' })
    }
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})