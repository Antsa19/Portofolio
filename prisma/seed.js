const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.skill.deleteMany()
  await prisma.project.deleteMany()
  await prisma.publication.deleteMany()

  await prisma.project.createMany({
    data: [
      {
        title: 'Library Management System',
        description: 'Full-stack library management system with role-based access for Admin, Staff, and Users. Features book management, borrowing system, and user administration.',
        techStack: 'HTML,CSS,JavaScript,PHP,MySQL',
        liveUrl: null,
        githubUrl: 'https://github.com/urolaki1909/My-fullstack-project',
      },
      {
        title: 'Culinary Craft',
        description: 'A visually rich frontend website showcasing culinary arts and recipes. Built with a focus on clean UI and smooth user experience.',
        techStack: 'HTML,CSS,JavaScript',
        liveUrl: null,
        githubUrl: 'https://github.com/urolaki1909/My-First-HTML-project-',
      },
    ],
  })

  await prisma.skill.createMany({
    data: [
      { name: 'JavaScript', category: 'Language' },
      { name: 'PHP', category: 'Language' },
      { name: 'Python', category: 'Language' },
      { name: 'Java', category: 'Language' },
      { name: 'C++', category: 'Language' },
      { name: 'HTML', category: 'Frontend' },
      { name: 'CSS', category: 'Frontend' },
      { name: 'React', category: 'Frontend' },
      { name: 'Node.js', category: 'Backend' },
      { name: 'Express', category: 'Backend' },
      { name: 'MySQL', category: 'Database' },
      { name: 'PostgreSQL', category: 'Database' },
      { name: 'Prisma', category: 'Database' },
      { name: 'Git', category: 'Tool' },
    ],
  })

  await prisma.publication.createMany({
    data: [
      {
        title: 'Self-Distillation of XLM-RoBERTa for Multilingual Sentiment Analysis on Imbalanced Data: A Case Study on Malagasy Mobile Application Reviews',
        conference: 'The 23rd International Joint Conference on Computer Science and Software Engineering (JCSSE 2026)',
        year: 2026,
        abstract: 'This paper presents a self-distillation approach applied to XLM-RoBERTa for multilingual sentiment analysis on imbalanced datasets, with a focus on Malagasy mobile application reviews. By leveraging knowledge distillation techniques within the same model architecture, we address the challenges of class imbalance and multilingual sentiment classification in low-resource language settings.',
        status: 'Published',
        pdfUrl: null,
        doiUrl: 'https://ieeexplore.ieee.org/document/11596637',
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())