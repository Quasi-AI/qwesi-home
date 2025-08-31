<template>
  <div class="privacy-container">
    <!-- Animated Background -->
    <div class="background-elements">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
      <div class="grid-pattern"></div>
    </div>

    <!-- Header with Glass Effect -->
    <header class="header-section">
      <div class="header-content">
        <BackButton class="back-button" />
        <div class="header-text">
          <h1 class="main-title">
            <span class="title-gradient">Privacy Policy</span>
            <div class="title-decoration"></div>
          </h1>
          <p class="subtitle">Last updated: July 13, 2025</p>
        </div>
        <div class="header-visual">
          <div class="security-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Sidebar -->
    <nav class="sidebar-nav" :class="{ 'nav-visible': sidebarVisible }">
      <div class="nav-header">
        <h3>Quick Navigation</h3>
        <button @click="toggleSidebar" class="nav-toggle">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <ul class="nav-list">
        <li v-for="(section, index) in sections" :key="index">
          <a 
            :href="`#section-${index + 1}`" 
            @click="scrollToSection(index + 1)"
            class="nav-item"
            :class="{ 'active': activeSection === index + 1 }"
          >
            <span class="nav-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="nav-text">{{ section.title }}</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Mobile Navigation Toggle -->
    <button @click="toggleSidebar" class="mobile-nav-toggle">
      <i class="fas fa-bars"></i>
      <span>Contents</span>
    </button>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Introduction Section -->
        <section :id="`section-1`" class="content-section intro-section">
          <div class="section-header">
            <div class="section-number">01</div>
            <h2>Introduction</h2>
          </div>
          <div class="glass-card">
            <div class="card-content">
              <p>
                At <strong class="brand-highlight">Qwesi</strong> ("we", "our", or "us"), accessible at 
                <a href="https://www.qwesi.org" class="link-style">www.qwesi.org</a>, we prioritize your privacy. 
                This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal data when you 
                interact with our services— including our website, WhatsApp assistant, and call-based platforms.
              </p>
            </div>
          </div>
        </section>

        <!-- Information We Collect -->
        <section :id="`section-2`" class="content-section">
          <div class="section-header">
            <div class="section-number">02</div>
            <h2>Information We Collect</h2>
          </div>
          <div class="info-grid">
            <div class="info-card" v-for="(item, index) in informationTypes" :key="index">
              <div class="info-icon">
                <i :class="item.icon"></i>
              </div>
              <div class="info-content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- How We Use Your Data -->
        <section :id="`section-3`" class="content-section">
          <div class="section-header">
            <div class="section-number">03</div>
            <h2>How We Use Your Data</h2>
          </div>
          <div class="glass-card">
            <div class="usage-list">
              <div v-for="(use, index) in dataUsages" :key="index" class="usage-item">
                <div class="usage-icon">
                  <i :class="use.icon"></i>
                </div>
                <p>{{ use.text }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- WhatsApp and Call Data Usage -->
        <section :id="`section-4`" class="content-section">
          <div class="section-header">
            <div class="section-number">04</div>
            <h2>WhatsApp and Call Data Usage</h2>
          </div>
          <div class="glass-card special-card">
            <div class="card-header">
              <div class="whatsapp-icon">
                <i class="fab fa-whatsapp"></i>
              </div>
              <div class="phone-icon">
                <i class="fas fa-phone-alt"></i>
              </div>
            </div>
            <div class="card-content">
              <p>
                When you interact with Qwesi via WhatsApp, your messages, audio files, and contact information 
                are securely processed through Meta's WhatsApp Business API and used only to support your job or 
                recruitment journey.
              </p>
              <p>
                Phone calls to Qwesi may be logged for support or verification. We do not record conversations 
                unless explicitly stated and agreed to by the user for quality improvement or documentation purposes.
              </p>
            </div>
          </div>
        </section>

        <!-- Sharing of Information -->
        <section :id="`section-5`" class="content-section">
          <div class="section-header">
            <div class="section-number">05</div>
            <h2>Sharing of Information</h2>
          </div>
          <div class="glass-card">
            <div class="card-content">
              <div class="highlight-box">
                <i class="fas fa-lock"></i>
                <strong>Qwesi does not sell your data.</strong>
              </div>
              <p>We may share information with:</p>
              <div class="sharing-grid">
                <div v-for="(share, index) in sharingTypes" :key="index" class="share-item">
                  <div class="share-icon">
                    <i :class="share.icon"></i>
                  </div>
                  <p>{{ share.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Third-Party Services -->
        <section :id="`section-6`" class="content-section">
          <div class="section-header">
            <div class="section-number">06</div>
            <h2>Third-Party Services</h2>
          </div>
          <div class="glass-card">
            <div class="card-content">
              <p>
                We integrate with external APIs including but not limited to OpenAI, WhatsApp Business API, and 
                Stripe. Each of these platforms has its own privacy policies. By using Qwesi, you also agree to 
                their terms where applicable.
              </p>
              <div class="partners-showcase">
                <div class="partner-badge">OpenAI</div>
                <div class="partner-badge">WhatsApp</div>
                <div class="partner-badge">Stripe</div>
                <div class="partner-badge">Google Cloud</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Data Retention -->
        <section :id="`section-7`" class="content-section">
          <div class="section-header">
            <div class="section-number">07</div>
            <h2>Data Retention</h2>
          </div>
          <div class="glass-card">
            <div class="card-content">
              <p>
                We retain your personal data for as long as needed to provide our services, fulfill legal 
                obligations, resolve disputes, or enforce our agreements. You can request deletion of your data 
                at any time by contacting <a href="mailto:info@qwesi.org" class="link-style">info@qwesi.org</a>.
              </p>
            </div>
          </div>
        </section>

        <!-- Children's Privacy -->
        <section :id="`section-8`" class="content-section">
          <div class="section-header">
            <div class="section-number">08</div>
            <h2>Children's Privacy</h2>
          </div>
          <div class="glass-card children-card">
            <div class="card-header">
              <div class="children-icon">
                <i class="fas fa-child"></i>
              </div>
            </div>
            <div class="card-content">
              <p>
                Qwesi is designed to be accessible and beneficial to users of all ages, including children. We 
                are committed to protecting the privacy of minors and comply with applicable laws such as the 
                Children's Online Privacy Protection Act (COPPA).
              </p>
              <div class="protection-features">
                <div class="feature-item">
                  <i class="fas fa-user-shield"></i>
                  <span>Parental consent required for users under 13</span>
                </div>
                <div class="feature-item">
                  <i class="fas fa-eye"></i>
                  <span>Parents can review, update, or delete child's information</span>
                </div>
                <div class="feature-item">
                  <i class="fas fa-ban"></i>
                  <span>No ads or marketing to minors</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Your Rights -->
        <section :id="`section-9`" class="content-section">
          <div class="section-header">
            <div class="section-number">09</div>
            <h2>Your Rights</h2>
          </div>
          <div class="rights-grid">
            <div v-for="(right, index) in userRights" :key="index" class="rights-card">
              <div class="rights-icon">
                <i :class="right.icon"></i>
              </div>
              <h3>{{ right.title }}</h3>
              <p>{{ right.description }}</p>
            </div>
          </div>
        </section>

        <!-- Security -->
        <section :id="`section-10`" class="content-section">
          <div class="section-header">
            <div class="section-number">10</div>
            <h2>Security</h2>
          </div>
          <div class="glass-card security-card">
            <div class="security-visual">
              <div class="security-layers">
                <div class="layer layer-1"></div>
                <div class="layer layer-2"></div>
                <div class="layer layer-3"></div>
                <div class="security-core">
                  <i class="fas fa-shield-alt"></i>
                </div>
              </div>
            </div>
            <div class="card-content">
              <p>
                We implement strong technical and organizational safeguards to protect your information from 
                loss, misuse, or unauthorized access. These include secure data encryption, access control, and 
                regular audits.
              </p>
            </div>
          </div>
        </section>

        <!-- Changes to This Policy -->
        <section :id="`section-11`" class="content-section">
          <div class="section-header">
            <div class="section-number">11</div>
            <h2>Changes to This Policy</h2>
          </div>
          <div class="glass-card">
            <div class="card-content">
              <p>
                We may update this Privacy Policy occasionally. The latest version will always be available on 
                our website. Significant changes will be communicated via email or WhatsApp.
              </p>
            </div>
          </div>
        </section>

        <!-- Contact Us -->
        <section :id="`section-12`" class="content-section contact-section">
          <div class="section-header">
            <div class="section-number">12</div>
            <h2>Contact Us</h2>
          </div>
          <div class="contact-card">
            <div class="contact-header">
              <h3>Get in Touch</h3>
              <p>Questions about this Privacy Policy or your personal data?</p>
            </div>
            <div class="contact-methods">
              <a href="mailto:info@qwesi.org" class="contact-method">
                <div class="method-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="method-info">
                  <span class="method-label">Email</span>
                  <span class="method-value">info@qwesi.org</span>
                </div>
              </a>
              <a href="tel:+12082796057" class="contact-method">
                <div class="method-icon">
                  <i class="fas fa-phone"></i>
                </div>
                <div class="method-info">
                  <span class="method-label">Phone</span>
                  <span class="method-value">+1 208 279 6057</span>
                </div>
              </a>
              <div class="contact-method">
                <div class="method-icon">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="method-info">
                  <span class="method-label">Address</span>
                  <span class="method-value">DeReimer Street, New York, NY 10745, USA</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Scroll Progress -->
    <div class="scroll-progress">
      <div class="progress-bar" :style="{ width: scrollProgress + '%' }"></div>
    </div>

    <!-- Back to Top -->
    <button 
      v-if="showBackToTop" 
      @click="scrollToTop" 
      class="back-to-top"
    >
      <i class="fas fa-arrow-up"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import BackButton from '@/shared/components/ui/back-button.vue'

// Reactive data
const sidebarVisible = ref(false)
const activeSection = ref(1)
const scrollProgress = ref(0)
const showBackToTop = ref(false)

// Section data
const sections = [
  { title: 'Introduction' },
  { title: 'Information We Collect' },
  { title: 'How We Use Your Data' },
  { title: 'WhatsApp and Call Data' },
  { title: 'Sharing of Information' },
  { title: 'Third-Party Services' },
  { title: 'Data Retention' },
  { title: 'Children\'s Privacy' },
  { title: 'Your Rights' },
  { title: 'Security' },
  { title: 'Changes to Policy' },
  { title: 'Contact Us' }
]

const informationTypes = [
  {
    icon: 'fas fa-user',
    title: 'Personal Information',
    description: 'Full name, phone number, email address, location, and CV details.'
  },
  {
    icon: 'fab fa-whatsapp',
    title: 'WhatsApp Data',
    description: 'Messages, voice notes, media, and other inputs sent to our WhatsApp bot.'
  },
  {
    icon: 'fas fa-phone',
    title: 'Call Data',
    description: 'Phone number, call duration, and conversation summaries for support.'
  },
  {
    icon: 'fas fa-laptop',
    title: 'Technical Information',
    description: 'Device type, IP address, browser type, and usage activity.'
  },
  {
    icon: 'fas fa-credit-card',
    title: 'Subscription Data',
    description: 'Payment status and transaction history (handled securely).'
  }
]

const dataUsages = [
  { icon: 'fas fa-search', text: 'To match you with job opportunities based on your skills and preferences.' },
  { icon: 'fas fa-bell', text: 'To send automated job alerts, investor leads, or career advice via WhatsApp or email.' },
  { icon: 'fas fa-comments', text: 'To enable voice/chat interactions with our AI Coach or Recruiter over WhatsApp and calls.' },
  { icon: 'fas fa-chart-line', text: 'To improve platform performance and enhance user experience using aggregated analytics.' },
  { icon: 'fas fa-id-card', text: 'To verify identity for subscription and access to premium services.' }
]

const sharingTypes = [
  { icon: 'fas fa-briefcase', text: 'Verified employers or recruiters (only after your consent).' },
  { icon: 'fas fa-credit-card', text: 'Payment processors (Stripe, Paystack) for billing and verification.' },
  { icon: 'fas fa-cogs', text: 'Service providers (e.g., OpenAI, Google Cloud, Signalwire) to power features.' },
  { icon: 'fas fa-gavel', text: 'Law enforcement or regulators when required to comply with legal obligations.' }
]

const userRights = [
  {
    icon: 'fas fa-eye',
    title: 'Access',
    description: 'Right to access the personal data we hold about you.'
  },
  {
    icon: 'fas fa-edit',
    title: 'Correction',
    description: 'Right to request correction or deletion of your data.'
  },
  {
    icon: 'fas fa-times-circle',
    title: 'Withdraw Consent',
    description: 'Right to withdraw consent at any time (e.g., unsubscribe).'
  },
  {
    icon: 'fas fa-download',
    title: 'Portability',
    description: 'Right to receive your data in a usable format upon request.'
  }
]

// Methods
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

const scrollToSection = (sectionNumber) => {
  const element = document.getElementById(`section-${sectionNumber}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    sidebarVisible.value = false
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  const scrollTop = window.pageYOffset
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = (scrollTop / docHeight) * 100
  
  showBackToTop.value = scrollTop > 500
  
  // Update active section
  const sections = document.querySelectorAll('.content-section')
  let currentSection = 1
  
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect()
    if (rect.top <= 200 && rect.bottom > 200) {
      currentSection = index + 1
    }
  })
  
  activeSection.value = currentSection
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Meta
useHead({
  title: 'Privacy Policy - Qwesi AI',
  meta: [
    { name: 'description', content: 'Privacy Policy for Qwesi AI - Learn how we collect, use, and protect your personal data.' }
  ]
})
</script>

<style scoped>
/* CSS Variables */
:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --secondary: #8b5cf6;
  --accent: #06b6d4;
  --gradient: linear-gradient(135deg, #6366f1, #8b5cf6);
  --glass: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --surface: rgba(255, 255, 255, 0.8);
}

/* Base Styles */
.privacy-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
}

/* Animated Background */
.background-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  right: 15%;
  animation-delay: -7s;
}

.orb-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 60%;
  animation-delay: -14s;
}

.grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 30s linear infinite;
}

/* Header */
.header-section {
  position: relative;
  z-index: 10;
  padding: 2rem 0 4rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
}

.back-button {
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.main-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  position: relative;
  margin-bottom: 1rem;
}

.title-gradient {
  background: linear-gradient(135deg, #ffffff, #f1f5f9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-decoration {
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100px;
  height: 4px;
  background: var(--gradient);
  border-radius: 2px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.125rem;
}

.header-visual {
  display: flex;
  justify-content: center;
}

.security-icon {
  width: 80px;
  height: 80px;
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  animation: pulse 2s ease-in-out infinite;
}

/* Sidebar Navigation */
.sidebar-nav {
  position: fixed;
  top: 0;
  left: -300px;
  width: 300px;
  height: 100vh;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid var(--glass-border);
  z-index: 1000;
  transition: left 0.3s ease;
  overflow-y: auto;
}

.sidebar-nav.nav-visible {
  left: 0;
}

.nav-header {
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-header h3 {
  color: white;
  font-weight: 600;
}

.nav-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.nav-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-list {
  list-style: none;
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover,
.nav-item.active {
  color: white;
  background: rgba(99, 102, 241, 0.2);
  border-left-color: var(--primary);
}

.nav-number {
  font-weight: 700;
  margin-right: 1rem;
  opacity: 0.5;
}

.nav-text {
  font-weight: 500;
}

.mobile-nav-toggle {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 999;
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mobile-nav-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Main Content */
.main-content {
  position: relative;
  z-index: 5;
  padding: 2rem 0;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.content-section {
  scroll-margin-top: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-number {
  width: 60px;
  height: 60px;
  background: var(--gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.25rem;
  color: white;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin: 0;
}

/* Glass Cards */
.glass-card {
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.card-content {
  color: white;
  line-height: 1.7;
}

.card-content p {
  margin-bottom: 1.5rem;
}

.card-content p:last-child {
  margin-bottom: 0;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.info-icon {
  width: 48px;
  height: 48px;
  background: var(--gradient);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: white;
}

.info-content h3 {
  color: white;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.info-content p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* Usage List */
.usage-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.usage-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.usage-icon {
  width: 40px;
  height: 40px;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
}

/* Special Cards */
.special-card .card-header {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.whatsapp-icon, .phone-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.whatsapp-icon {
  background: #25d366;
}

.phone-icon {
  background: var(--primary);
}

/* Highlight Box */
.highlight-box {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #10b981;
}

.highlight-box i {
  font-size: 1.25rem;
}

/* Sharing Grid */
.sharing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.share-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.share-icon {
  width: 36px;
  height: 36px;
  background: var(--gradient);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

/* Partners Showcase */
.partners-showcase {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.partner-badge {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
}

/* Children Card */
.children-card .card-header {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.children-icon {
  width: 60px;
  height: 60px;
  background: rgba(251, 113, 133, 0.2);
  border: 1px solid rgba(251, 113, 133, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #fb7185;
}

.protection-features {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(251, 113, 133, 0.1);
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.feature-item i {
  color: #fb7185;
}

/* Rights Grid */
.rights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.rights-card {
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.rights-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.rights-icon {
  width: 60px;
  height: 60px;
  background: var(--gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: white;
}

.rights-card h3 {
  color: white;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.rights-card p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* Security Card */
.security-card {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.security-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 200px;
}

.security-layers {
  position: relative;
  width: 150px;
  height: 150px;
}

.layer {
  position: absolute;
  border-radius: 50%;
  border: 2px solid;
  animation: rotate 10s linear infinite;
}

.layer-1 {
  width: 100%;
  height: 100%;
  border-color: rgba(99, 102, 241, 0.3);
  animation-duration: 10s;
}

.layer-2 {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  border-color: rgba(139, 92, 246, 0.5);
  animation-duration: 8s;
  animation-direction: reverse;
}

.layer-3 {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  border-color: rgba(6, 182, 212, 0.7);
  animation-duration: 6s;
}

.security-core {
  position: absolute;
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
  background: var(--gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

/* Contact Section */
.contact-section {
  margin-bottom: 4rem;
}

.contact-card {
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 2rem;
  padding: 3rem;
  text-align: center;
}

.contact-header {
  margin-bottom: 2rem;
}

.contact-header h3 {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.contact-header p {
  color: rgba(255, 255, 255, 0.8);
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-method:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.method-icon {
  width: 48px;
  height: 48px;
  background: var(--gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;
}

.method-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.method-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.method-value {
  color: white;
  font-weight: 600;
}

/* Utilities */
.link-style {
  color: #60a5fa;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

.link-style:hover {
  border-bottom-color: #60a5fa;
}

.brand-highlight {
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Scroll Progress */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  z-index: 1001;
  background: rgba(255, 255, 255, 0.1);
}

.progress-bar {
  height: 100%;
  background: var(--gradient);
  transition: width 0.1s ease;
}

/* Back to Top */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  background: var(--gradient);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
}

.back-to-top:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(20px, -20px) rotate(1deg); }
  50% { transform: translate(-10px, -30px) rotate(-1deg); }
  75% { transform: translate(-20px, 10px) rotate(0.5deg); }
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    grid-template-columns: auto 1fr;
    gap: 1rem;
  }
  
  .header-visual {
    display: none;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .content-wrapper {
    padding: 0 1rem;
    gap: 2rem;
  }
  
  .glass-card {
    padding: 1.5rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .section-number {
    width: 48px;
    height: 48px;
    font-size: 1rem;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .sharing-grid {
    grid-template-columns: 1fr;
  }
  
  .rights-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .security-card {
    flex-direction: column;
    text-align: center;
  }
  
  .contact-methods {
    grid-template-columns: 1fr;
  }
  
  .mobile-nav-toggle {
    top: 1rem;
    right: 1rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .rights-grid {
    grid-template-columns: 1fr;
  }
  
  .partners-showcase {
    justify-content: center;
  }
  
  .protection-features {
    gap: 0.75rem;
  }
  
  .feature-item {
    font-size: 0.875rem;
  }
}
</style>