import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { GitBranch, ExternalLink, Mail, User, Send, Code2, Terminal, Database, Wrench, BookOpen, Phone, CheckCircle, AlertCircle, Loader2, X, Menu } from 'lucide-react'

const LinkedinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const FULL_NAME = 'Antsa Notiavina Rasolofonimaro'

export default function App() {
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [publications, setPublications] = useState([])
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState(null)
  const [typedName, setTypedName] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Typewriter effect for the name
  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < FULL_NAME.length) {
        setTypedName(FULL_NAME.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
        // Keep cursor blinking for 2s then hide it
        setTimeout(() => setShowCursor(false), 2500)
      }
    }, 70)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    axios.get(`${API}/api/projects`).then(r => setProjects(r.data))
    axios.get(`${API}/api/skills`).then(r => setSkills(r.data))
    axios.get(`${API}/api/publications`).then(r => setPublications(r.data))
  }, [])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nameVal = form.name.trim()
    const emailVal = form.email.trim()
    const messageVal = form.message.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!nameVal) {
      setNotification({ type: 'error', message: 'Name is required. Please enter your name.' })
      return
    }
    if (!emailVal || !emailRegex.test(emailVal)) {
      setNotification({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }
    if (!messageVal) {
      setNotification({ type: 'error', message: 'Message is required. Please write your message.' })
      return
    }

    setLoading(true)
    setNotification(null)

    try {
      const res = await axios.post(`${API}/api/contact`, { name: nameVal, email: emailVal, message: messageVal })
      setSent(true)
      setNotification({
        type: 'success',
        message: res.data?.message || 'Message sent successfully! I will get back to you soon.'
      })
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error(err)
      setNotification({
        type: 'error',
        message: err.response?.data?.error || 'Failed to send message. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || []
    acc[skill.category].push(skill.name)
    return acc
  }, {})

  const categoryIcons = {
    'Language': <Terminal size={18} />,
    'Frontend': <Code2 size={18} />,
    'Backend': <Terminal size={18} />,
    'Database': <Database size={18} />,
    'Tool': <Wrench size={18} />
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* FLOATING TOAST NOTIFICATION */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '18px 24px',
              borderRadius: '16px',
              background: '#0d131f',
              border: notification.type === 'success' ? '1px solid #10b981' : '1px solid #f43f5e',
              boxShadow: notification.type === 'success' ? '0 15px 35px rgba(16, 185, 129, 0.35)' : '0 15px 35px rgba(244, 63, 94, 0.35)',
              color: '#ffffff',
              maxWidth: '460px',
              width: 'calc(100% - 48px)'
            }}
          >
            {notification.type === 'success' ? (
              <CheckCircle size={26} style={{ color: '#10b981', flexShrink: 0 }} />
            ) : (
              <AlertCircle size={26} style={{ color: '#f43f5e', flexShrink: 0 }} />
            )}
            <span style={{ fontSize: '1rem', fontWeight: 500, lineHeight: 1.4 }}>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: 'auto', padding: '4px', display: 'flex', alignItems: 'center' }}
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav className="glass-nav" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: '0 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px', boxSizing: 'border-box' }}>
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="brand-font gradient-text"
          style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '1px' }}>
          Antsa.dev
        </motion.span>
        
        {/* Desktop Nav Links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="nav-desktop">
          {['About', 'Skills', 'Publications', 'Projects', 'Contact'].map(item => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              whileHover={{ color: 'var(--accent-hover)', y: -2 }}
              style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }}>
              {item}
            </motion.a>
          ))}
        </motion.div>

        {/* Mobile / iPad Hamburger Toggle */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="nav-mobile-toggle"
          aria-label="Toggle navigation menu">
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </motion.button>
      </nav>

      {/* MOBILE & IPAD NAVIGATION OVERLAY MENU DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mobile-menu-overlay">
            <div className="mobile-nav-links">
              {['About', 'Skills', 'Publications', 'Projects', 'Contact'].map((item, idx) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 + 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-nav-link">
                  <span>{item}</span>
                  <span style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>&rarr;</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT wrapper to ensure footer is pushed down */}
      <main style={{ flex: 1 }}>

        {/* HERO */}
        <section className="hero-section">
          <div className="float-1" style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)' }}></div>
          <div className="float-2" style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)' }}></div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="hero-container">

            <div className="hero-content">
              <motion.p variants={fadeInUp} style={{ color: 'var(--accent-hover)', fontWeight: 700, marginBottom: '16px', fontSize: '1.1rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Hello, I am</motion.p>
              <motion.h1 variants={fadeInUp} className="brand-font hero-title">
                {typedName.length <= 16
                  ? <>{typedName}<span className={showCursor ? 'typewriter-cursor' : ''} /></>
                  : <>Antsa Notiavina <br /><span className="gradient-text">{typedName.slice(16)}</span><span className={showCursor ? 'typewriter-cursor' : ''} /></>
                }
              </motion.h1>
              <motion.h2 variants={fadeInUp} className="hero-subtitle">Software Engineer</motion.h2>
              <motion.p variants={fadeInUp} className="hero-description">
                I build full-stack web applications using React, Node.js, Express, and PostgreSQL.
                Currently looking for internship or junior developer opportunities to create impactful solutions.
              </motion.p>
              <motion.div variants={fadeInUp} className="hero-buttons">
                <a href="#projects" className="btn-primary">
                  View Projects
                </a>
                <a href="#contact" className="btn-outline">
                  Contact Me
                </a>
              </motion.div>
            </div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.03, rotate: 1 }}
              transition={{ duration: 0.3 }}
              className="hero-image-wrapper">
              <div style={{
                position: 'absolute',
                inset: '-12px',
                borderRadius: '32px',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover), #3b82f6)',
                opacity: 0.35,
                filter: 'blur(24px)',
                zIndex: 0
              }}></div>
              <div className="glass-card" style={{
                position: 'relative',
                zIndex: 1,
                padding: '12px',
                borderRadius: '28px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
              }}>
                <img
                  src="/profile.png"
                  alt="Antsa Notiavina Rasolofonimaro"
                  style={{
                    width: '100%',
                    height: '380px',
                    objectFit: 'cover',
                    borderRadius: '20px',
                    display: 'block'
                  }}
                />
              </div>
            </motion.div>

          </motion.div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section-padding">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="section-container">
            <motion.p variants={fadeInUp} className="section-label">WHO I AM</motion.p>
            <motion.h2 variants={fadeInUp} className="brand-font section-heading">About Me</motion.h2>
            <div className="about-grid">
              <motion.p variants={fadeInUp} style={{ lineHeight: 1.9, color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                I'm a passionate developer from Madagascar currently mastering full-stack JavaScript.
                I have experience building web applications with PHP and MySQL, and I'm now expanding
                into the modern JavaScript ecosystem with React, Express, and PostgreSQL.<br /><br />
                I love turning ideas into real, working products that solve real problems, constantly learning new technologies along the way.
              </motion.p>
              <motion.div variants={fadeInUp} className="glass-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <User color="var(--accent-primary)" />
                  <p className="brand-font" style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Quick Facts</p>
                </div>
                {[
                  ['Location', 'Indonesia'],
                  ['Focus', 'Software Engineer'],
                  ['Available', 'Internship / Junior Role'],
                  ['GitHub', '@Antsa19'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{k}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem' }}>{v}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="section-container">
            <motion.p variants={fadeInUp} className="section-label">WHAT I KNOW</motion.p>
            <motion.h2 variants={fadeInUp} className="brand-font section-heading">Skills</motion.h2>
            <div className="skills-grid">
              {Object.entries(groupedSkills).map(([category, items]) => (
                <motion.div key={category} variants={fadeInUp} className="glass-card skills-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ color: 'var(--accent-secondary)' }}>{categoryIcons[category] || <Code2 size={18} />}</div>
                    <p className="brand-font" style={{ fontWeight: 600, margin: 0, fontSize: '1.15rem', letterSpacing: '0.5px' }}>{category}</p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {items.map(skill => (
                      <span key={skill} className="tech-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* PUBLICATIONS */}
        {publications.length > 0 && (
          <section id="publications" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="section-container">
              <motion.p variants={fadeInUp} className="section-label">MY RESEARCH</motion.p>
              <motion.h2 variants={fadeInUp} className="brand-font section-heading">Publications</motion.h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {publications.map(pub => (
                  <motion.div
                    key={pub.id}
                    variants={fadeInUp}
                    className="glass-card"
                    style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '52px', height: '52px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', boxShadow: 'inset 0 0 12px rgba(139, 92, 246, 0.2)' }}>
                          <BookOpen size={26} />
                        </div>
                        <div>
                          <div style={{ color: 'var(--accent-hover)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                            {pub.conference}
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                            Published &bull; {pub.year}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        display: 'inline-flex',
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 0 15px rgba(16, 185, 129, 0.1)',
                        alignSelf: 'center'
                      }}>
                        {pub.status}
                      </span>
                    </div>

                    <h3 className="brand-font" style={{ margin: '4px 0 0 0', fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 800, lineHeight: '1.4', background: 'linear-gradient(90deg, #f8fafc, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {pub.title}
                    </h3>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', margin: 0, background: 'rgba(255, 255, 255, 0.01)', padding: '16px 20px', borderRadius: '12px', borderLeft: '3px solid var(--accent-primary)' }}>
                      <strong>Abstract:</strong> {pub.abstract}
                    </p>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap' }}>
                      {pub.pdfUrl && (
                        <a href={pub.pdfUrl} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                          <ExternalLink size={16} /> PDF
                        </a>
                      )}
                      {pub.doiUrl && (
                        <a href={pub.doiUrl} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                          <ExternalLink size={16} /> {pub.doiUrl.includes('ieee') ? 'IEEE Publication' : 'DOI'}
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* PROJECTS */}
        <section id="projects" className="section-padding">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="section-container">
            <motion.p variants={fadeInUp} className="section-label">WHAT I'VE BUILT</motion.p>
            <motion.h2 variants={fadeInUp} className="brand-font section-heading">Featured Projects</motion.h2>
            <div className="projects-grid">
              {projects.map(project => (
                <motion.div
                  key={project.id}
                  variants={fadeInUp}
                  className="glass-card"
                  style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '56px', height: '56px', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', boxShadow: 'inset 0 0 10px rgba(139, 92, 246, 0.15)' }}>
                    <Code2 size={28} />
                  </div>
                  <h3 className="brand-font" style={{ margin: '0 0 16px', fontSize: '1.45rem', color: 'var(--text-primary)', fontWeight: 800 }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '24px', flex: 1 }}>{project.description}</p>
                  <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {project.techStack.split(',').map(tech => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                        <ExternalLink size={16} /> Live
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                        <GitBranch size={16} /> GitHub
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section-padding" style={{ background: 'var(--bg-secondary)', paddingBottom: '120px' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="section-container">
            <motion.p variants={fadeInUp} className="section-label">GET IN TOUCH</motion.p>
            <motion.h2 variants={fadeInUp} className="brand-font section-heading">Contact Me</motion.h2>
            <div className="contact-grid">
              <motion.div variants={fadeInUp}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem', lineHeight: 1.8 }}>
                  I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', flexShrink: 0 }}>
                      <Mail size={20} />
                    </div>
                    <div>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email</p>
                      <a href="mailto:antsanotiavinaantsa@gmail.com" style={{ color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}>antsanotiavinaantsa@gmail.com</a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', flexShrink: 0 }}>
                      <Phone size={20} />
                    </div>
                    <div>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Phone</p>
                      <a href="tel:+6282230708963" style={{ color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}>+62 822 3070 8963</a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', flexShrink: 0 }}>
                      <LinkedinIcon size={20} />
                    </div>
                    <div>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>LinkedIn</p>
                      <a href="https://www.linkedin.com/in/antsa-notiavina-b4a167308/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}>Antsa Notiavina</a>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                {sent ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '24px', padding: '40px 32px', textAlign: 'center' }}>
                    <div style={{ color: '#10b981', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                      <CheckCircle size={56} />
                    </div>
                    <h3 style={{ color: 'var(--text-primary)', margin: '0 0 8px', fontSize: '1.4rem' }}>Message Sent Successfully!</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px', fontSize: '1rem' }}>Thank you for reaching out. I have received your email and will respond to you soon.</p>
                    <button
                      onClick={() => setSent(false)}
                      className="btn-outline"
                      style={{ padding: '10px 24px', fontSize: '0.9rem' }}
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form noValidate onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {notification && (
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                        border: notification.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
                        color: notification.type === 'success' ? '#10b981' : '#f43f5e'
                      }}>
                        {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span>{notification.message}</span>
                      </div>
                    )}
                    <div>
                      <label className="form-label">Name <span className="required-star">*</span></label>
                      <input
                        required
                        type="text"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="form-input"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="form-label">Email <span className="required-star">*</span></label>
                      <input
                        required
                        type="email"
                        placeholder="Enter your email address"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="form-input"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="form-label">Message <span className="required-star">*</span></label>
                      <textarea
                        required
                        placeholder="Write your message here..."
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        rows={5}
                        className="form-input"
                        disabled={loading}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                      style={{ justifyContent: 'center', width: '100%', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                      {loading ? (
                        <>
                          Sending... <Loader2 size={18} className="spinner" />
                        </>
                      ) : (
                        <>
                          Send Message <Send size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </motion.div>
        </section>

      </main>

      {/* FOOTER - Right at the bottom */}
      <footer style={{ background: '#070a12', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'center', padding: '32px', fontSize: '0.95rem', marginTop: 'auto' }}>
        <p style={{ margin: '0 0 16px 0', fontStyle: 'italic', color: 'var(--text-secondary)' }}>Philippians 4:13 " I can do all things through Christ who strengthens me"</p>
        <p style={{ margin: 0 }}>Built with ❤️ by <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>Antsa Notiavina Rasolofonimaro</span></p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px' }}>
          <motion.a href="https://github.com/Antsa19" target="_blank" rel="noreferrer" whileHover={{ color: 'var(--accent-primary)', y: -2 }} style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}><GitBranch size={20} /></motion.a>
          <motion.a href="https://www.linkedin.com/in/antsa-notiavina-b4a167308/" target="_blank" rel="noreferrer" whileHover={{ color: 'var(--accent-primary)', y: -2 }} style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}><LinkedinIcon size={20} /></motion.a>
        </div>
      </footer>

    </div>
  )
}