require('dotenv').config()
const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
})

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
  try {
    const newMessage = await prisma.message.create({
      data: { name, email, message }
    })

    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD && process.env.SMTP_PASSWORD !== 'your-app-password-here') {
      try {
        await transporter.sendMail({
          from: `"${name}" <${process.env.SMTP_EMAIL}>`,
          replyTo: email,
          to: process.env.SMTP_EMAIL,
          subject: `New Portfolio Message from ${name}`,
          text: `You have a new message.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `<h3>New Message from ${name}</h3><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`
        })
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
      }
    }

    res.status(201).json({ success: true, id: newMessage.id })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})