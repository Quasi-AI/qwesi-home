<template>
  <div class="faq-container">
    <!-- Dynamic Background -->
    <div class="background-elements">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
      <div class="mesh-gradient"></div>
    </div>

    <!-- Header Section -->
    <header class="header-section">
      <div class="header-content">
        <BackButton class="back-button" />
        <div class="header-text">
          <div class="title-container">
            <h1 class="main-title">
              <span class="title-text">Frequently Asked</span>
              <span class="title-highlight">Questions</span>
            </h1>
            <div class="title-underline"></div>
          </div>
          <p class="subtitle">Find answers to common questions about Qwesi AI</p>
        </div>
        <div class="header-icon">
          <div class="question-mark">
            <i class="fas fa-question"></i>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Search Section -->
        <section class="search-section">
          <div class="search-container">
            <div class="search-icon">
              <i class="fas fa-search"></i>
            </div>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search for answers..." 
              class="search-input"
              @focus="isSearchFocused = true"
              @blur="isSearchFocused = false"
            />
            <div class="search-suggestions" v-if="isSearchFocused && searchSuggestions.length > 0">
              <div 
                v-for="suggestion in searchSuggestions" 
                :key="suggestion"
                @click="searchQuery = suggestion"
                class="suggestion-item"
              >
                {{ suggestion }}
              </div>
            </div>
          </div>
          <div class="search-stats" v-if="searchQuery">
            <span class="results-count">{{ filteredFAQs.length }} results found</span>
          </div>
        </section>

        <!-- FAQ Categories -->
        <section class="categories-section" v-if="!searchQuery">
          <h2 class="section-title">Browse by Category</h2>
          <div class="categories-grid">
            <button 
              v-for="category in categories" 
              :key="category.name"
              @click="selectedCategory = selectedCategory === category.name ? null : category.name"
              class="category-card"
              :class="{ 'active': selectedCategory === category.name }"
            >
              <div class="category-icon">
                <i :class="category.icon"></i>
              </div>
              <div class="category-info">
                <h3>{{ category.name }}</h3>
                <span class="category-count">{{ category.count }} questions</span>
              </div>
            </button>
          </div>
        </section>

        <!-- FAQ Items -->
        <section class="faq-section">
          <div class="faq-header" v-if="selectedCategory || searchQuery">
            <h2 class="section-title">
              {{ selectedCategory ? `${selectedCategory} Questions` : `Search Results` }}
            </h2>
            <button 
              v-if="selectedCategory || searchQuery"
              @click="clearFilters"
              class="clear-filters"
            >
              <i class="fas fa-times"></i>
              Clear filters
            </button>
          </div>

          <div class="faq-list">
            <div 
              v-for="(faq, idx) in displayedFAQs" 
              :key="idx" 
              class="faq-item"
              :class="{ 'expanded': openFAQs[idx] }"
            >
              <div class="faq-question-container">
                <button 
                  @click="toggleFAQ(idx)"
                  class="faq-question"
                >
                  <div class="question-content">
                    <div class="question-icon">
                      <i class="fas fa-lightbulb"></i>
                    </div>
                    <h3>{{ faq.question }}</h3>
                  </div>
                  <div class="expand-icon" :class="{ 'rotated': openFAQs[idx] }">
                    <i class="fas fa-chevron-down"></i>
                  </div>
                </button>
                <div class="category-badge" v-if="faq.category">
                  {{ faq.category }}
                </div>
              </div>
              
              <transition name="accordion">
                <div v-if="openFAQs[idx]" class="faq-answer">
                  <div class="answer-content">
                    <div class="answer-icon">
                      <i class="fas fa-check-circle"></i>
                    </div>
                    <p v-html="highlightSearch(faq.answer)"></p>
                  </div>
                  <div class="answer-actions">
                    <button class="helpful-button" @click="markHelpful(idx)">
                      <i class="fas fa-thumbs-up"></i>
                      Helpful
                    </button>
                    <button class="share-button" @click="shareFAQ(faq)">
                      <i class="fas fa-share"></i>
                      Share
                    </button>
                  </div>
                </div>
              </transition>
            </div>

            <!-- No Results -->
            <div v-if="displayedFAQs.length === 0" class="no-results">
              <div class="no-results-icon">
                <i class="fas fa-search"></i>
              </div>
              <h3>No questions found</h3>
              <p>Try searching with different keywords or browse our categories above.</p>
            </div>
          </div>

          <!-- Load More -->
          <div v-if="hasMoreFAQs" class="load-more-section">
            <button @click="loadMoreFAQs" class="load-more-button">
              <span>Load More Questions</span>
              <i class="fas fa-arrow-down"></i>
            </button>
          </div>
        </section>

        <!-- Quick Actions -->
        <section class="quick-actions">
          <h2 class="section-title">Quick Actions</h2>
          <div class="actions-grid">
            <a href="https://api.whatsapp.com/send/?phone=12019790148" target="_blank" class="action-card whatsapp">
              <div class="action-icon">
                <i class="fab fa-whatsapp"></i>
              </div>
              <div class="action-content">
                <h3>Chat on WhatsApp</h3>
                <p>Get instant answers via WhatsApp</p>
              </div>
            </a>
            <a href="tel:+12082796057" class="action-card call">
              <div class="action-icon">
                <i class="fas fa-phone"></i>
              </div>
              <div class="action-content">
                <h3>Call Support</h3>
                <p>Speak directly with our team</p>
              </div>
            </a>
            <a href="mailto:info@qwesi.org" class="action-card email">
              <div class="action-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="action-content">
                <h3>Email Us</h3>
                <p>Send us your questions</p>
              </div>
            </a>
          </div>
        </section>

        <!-- Help Section -->
        <section class="help-section">
          <div class="help-card">
            <div class="help-content">
              <div class="help-icon">
                <i class="fas fa-life-ring"></i>
              </div>
              <div class="help-text">
                <h3>Still need help?</h3>
                <p>Our support team is here to assist you with any questions not covered in this FAQ.</p>
              </div>
            </div>
            <div class="help-actions">
              <button class="contact-button primary">
                <i class="fas fa-comments"></i>
                Contact Support
              </button>
              <button class="contact-button secondary">
                <i class="fas fa-book"></i>
                View Documentation
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BackButton from '@/shared/components/ui/back-button.vue'

// Reactive data
const searchQuery = ref('')
const isSearchFocused = ref(false)
const selectedCategory = ref(null)
const openFAQs = ref({})
const visibleFAQCount = ref(6)

// FAQ data with categories
const faqs = [
  {
    question: 'What is Qwesi AI?',
    answer: 'Qwesi AI is a smart assistant that helps you find jobs, connect with employers or investors, solve homework, and more—via voice or WhatsApp.',
    category: 'Getting Started'
  },
  {
    question: 'How do I use Qwesi AI?',
    answer: 'You can use Qwesi AI by calling, chatting on WhatsApp, or subscribing on the website. Ask questions, make requests, or even search for opportunities.',
    category: 'Getting Started'
  },
  {
    question: 'Can Qwesi help with my school work?',
    answer: 'Yes! Qwesi AI assists with homework, assignments, explanations, writing help, and educational support for students at any level.',
    category: 'Features'
  },
  {
    question: 'How much does it cost to use?',
    answer: 'You get free access to some features, but full unlimited access is <strong>$10/month</strong> via Stripe or Paystack.',
    category: 'Pricing'
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Yes, Stripe users can cancel from their customer portal. For Paystack, contact support via email to cancel anytime.',
    category: 'Pricing'
  },
  {
    question: 'Can Qwesi connect me to real people?',
    answer: 'Yes. Qwesi can connect you with employers, investors, or collaborators depending on what you\'re seeking.',
    category: 'Features'
  },
  {
    question: 'Is my data safe with Qwesi?',
    answer: 'Absolutely. We use industry-standard encryption and follow strict privacy policies to protect your personal information.',
    category: 'Privacy & Security'
  },
  {
    question: 'What languages does Qwesi support?',
    answer: 'Qwesi currently supports English, with plans to add more languages in the future.',
    category: 'Features'
  },
  {
    question: 'How accurate are the job recommendations?',
    answer: 'Our AI uses advanced matching algorithms to provide highly relevant job recommendations based on your skills and preferences.',
    category: 'Features'
  }
]

// Categories
const categories = computed(() => {
  const categoryMap = {}
  faqs.forEach(faq => {
    if (!categoryMap[faq.category]) {
      categoryMap[faq.category] = { name: faq.category, count: 0, icon: getCategoryIcon(faq.category) }
    }
    categoryMap[faq.category].count++
  })
  return Object.values(categoryMap)
})

// Search suggestions
const searchSuggestions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return []
  
  const suggestions = []
  faqs.forEach(faq => {
    const words = faq.question.toLowerCase().split(' ')
    words.forEach(word => {
      if (word.includes(searchQuery.value.toLowerCase()) && word.length > 2) {
        suggestions.push(word)
      }
    })
  })
  
  return [...new Set(suggestions)].slice(0, 3)
})

// Filtered FAQs
const filteredFAQs = computed(() => {
  let filtered = faqs

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(faq => faq.category === selectedCategory.value)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Displayed FAQs with pagination
const displayedFAQs = computed(() => {
  return filteredFAQs.value.slice(0, visibleFAQCount.value)
})

const hasMoreFAQs = computed(() => {
  return filteredFAQs.value.length > visibleFAQCount.value
})

// Methods
const getCategoryIcon = (category) => {
  const icons = {
    'Getting Started': 'fas fa-play-circle',
    'Features': 'fas fa-star',
    'Pricing': 'fas fa-dollar-sign',
    'Privacy & Security': 'fas fa-shield-alt'
  }
  return icons[category] || 'fas fa-question-circle'
}

const toggleFAQ = (index) => {
  openFAQs.value[index] = !openFAQs.value[index]
}

const clearFilters = () => {
  selectedCategory.value = null
  searchQuery.value = ''
  visibleFAQCount.value = 6
}

const loadMoreFAQs = () => {
  visibleFAQCount.value += 6
}

const highlightSearch = (text) => {
  if (!searchQuery.value) return text
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<mark class="search-highlight">$1</mark>')
}

const markHelpful = (index) => {
  // Add helpful feedback logic
  console.log('Marked as helpful:', index)
}

const shareFAQ = (faq) => {
  // Add share logic
  if (navigator.share) {
    navigator.share({
      title: faq.question,
      text: faq.answer,
      url: window.location.href
    })
  }
}

// Meta
useHead({
  title: 'FAQ - Qwesi AI',
  meta: [
    { name: 'description', content: 'Frequently Asked Questions about Qwesi AI - Find answers to common questions about our services.' }
  ]
})
</script>

<style scoped>
/* CSS Variables */
:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --secondary: #8b5cf6;
  --accent: #10b981;
  --warning: #f59e0b;
  --gradient-primary: linear-gradient(135deg, #6366f1, #8b5cf6);
  --gradient-accent: linear-gradient(135deg, #10b981, #059669);
  --glass: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --surface: rgba(255, 255, 255, 0.95);
  --text-primary: #0f172a;
  --text-secondary: #64748b;
}

/* Base Styles */
.faq-container {
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

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
  animation: float 15s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 20%;
  animation-delay: -5s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 60%;
  animation-delay: -10s;
}

.shape-4 {
  width: 120px;
  height: 120px;
  top: 30%;
  right: 10%;
  animation-delay: -7s;
}

.mesh-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
  animation: mesh-move 20s ease-in-out infinite;
}

/* Header */
.header-section {
  position: relative;
  z-index: 10;
  padding: 2rem 0 3rem;
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

.title-container {
  position: relative;
}

.main-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.title-text {
  color: white;
  display: block;
}

.title-highlight {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
}

.title-underline {
  width: 120px;
  height: 4px;
  background: var(--gradient-primary);
  border-radius: 2px;
  margin-top: 0.5rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.125rem;
  font-weight: 500;
}

.header-icon {
  display: flex;
  justify-content: center;
}

.question-mark {
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
  animation: bounce 2s ease-in-out infinite;
}

/* Main Content */
.main-content {
  position: relative;
  z-index: 5;
  padding: 0 0 4rem;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Search Section */
.search-section {
  position: relative;
}

.search-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 1.25rem 1.25rem 1.25rem 3.5rem;
  background: var(--surface);
  backdrop-filter: blur(20px);
  border: 2px solid transparent;
  border-radius: 2rem;
  font-size: 1.125rem;
  color: var(--text-primary);
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.2);
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1.25rem;
}

.search-suggestions {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.suggestion-item {
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f1f5f9;
}

.suggestion-item:hover {
  background: #f8fafc;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.search-stats {
  text-align: center;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.results-count {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Categories Section */
.categories-section {
  text-align: center;
}

.section-title {
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.category-card {
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 1.5rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.category-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.category-card.active {
  background: var(--gradient-primary);
  border-color: transparent;
}

.category-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.category-card.active .category-icon {
  background: rgba(255, 255, 255, 0.3);
}

.category-info h3 {
  color: white;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.category-count {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

/* FAQ Section */
.faq-section {
  background: var(--surface);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 2rem;
  padding: 2rem;
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.faq-header .section-title {
  color: var(--text-primary);
  margin-bottom: 0;
}

.clear-filters {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.clear-filters:hover {
  background: #fecaca;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.faq-item {
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  transition: all 0.3s ease;
  overflow: hidden;
}

.faq-item:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.1);
}

.faq-item.expanded {
  border-color: var(--primary);
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.15);
}

.faq-question-container {
  position: relative;
}

.faq-question {
  width: 100%;
  padding: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.faq-question:hover {
  background: #f8fafc;
}

.question-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.question-icon {
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.question-content h3 {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.125rem;
  margin: 0;
}

.expand-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
  color: var(--primary);
}

.category-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: var(--gradient-accent);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.faq-answer {
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.answer-content {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
}

.answer-icon {
  width: 32px;
  height: 32px;
  background: var(--gradient-accent);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.answer-content p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
}

.answer-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  gap: 1rem;
}

.helpful-button,
.share-button {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.helpful-button:hover {
  background: #ecfdf5;
  border-color: var(--accent);
  color: var(--accent);
}

.share-button:hover {
  background: #eff6ff;
  border-color: var(--primary);
  color: var(--primary);
}

/* No Results */
.no-results {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.no-results-icon {
  width: 64px;
  height: 64px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: var(--text-secondary);
}

.no-results h3 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.no-results p {
  margin: 0;
}

/* Load More */
.load-more-section {
  text-align: center;
  margin-top: 2rem;
}

.load-more-button {
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.load-more-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

/* Quick Actions */
.quick-actions {
  text-align: center;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.action-card {
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 1.5rem;
  padding: 2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.action-card.whatsapp {
  border-left: 4px solid #25d366;
}

.action-card.whatsapp:hover {
  background: rgba(37, 211, 102, 0.1);
}

.action-card.call {
  border-left: 4px solid var(--primary);
}

.action-card.call:hover {
  background: rgba(99, 102, 241, 0.1);
}

.action-card.email {
  border-left: 4px solid var(--accent);
}

.action-card.email:hover {
  background: rgba(16, 185, 129, 0.1);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.whatsapp .action-icon {
  background: #25d366;
}

.call .action-icon {
  background: var(--primary);
}

.email .action-icon {
  background: var(--accent);
}

.action-content {
  text-align: left;
}

.action-content h3 {
  color: white;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.action-content p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin: 0;
}

/* Help Section */
.help-section {
  background: var(--surface);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 2rem;
  overflow: hidden;
}

.help-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  gap: 2rem;
}

.help-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.help-icon {
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.help-text h3 {
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.help-text p {
  color: var(--text-secondary);
  margin: 0;
}

.help-actions {
  display: flex;
  gap: 1rem;
}

.contact-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.contact-button.primary {
  background: var(--gradient-primary);
  color: white;
  border: none;
}

.contact-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

.contact-button.secondary {
  background: white;
  color: var(--text-primary);
  border: 1px solid #e2e8f0;
}

.contact-button.secondary:hover {
  background: #f8fafc;
  border-color: var(--primary);
}

/* Search Highlight */
.search-highlight {
  background: #fef08a;
  color: #92400e;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-weight: 600;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -10px) rotate(1deg); }
  50% { transform: translate(-5px, -15px) rotate(-0.5deg); }
  75% { transform: translate(-10px, 5px) rotate(0.5deg); }
}

@keyframes mesh-move {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Transitions */
.accordion-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-20px);
}

.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    grid-template-columns: auto 1fr;
    gap: 1rem;
  }
  
  .header-icon {
    display: none;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .content-wrapper {
    padding: 0 1rem;
    gap: 2rem;
  }
  
  .search-input {
    padding: 1rem 1rem 1rem 3rem;
    font-size: 1rem;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .help-card {
    flex-direction: column;
    text-align: center;
  }
  
  .help-actions {
    flex-direction: column;
  }
  
  .faq-question {
    padding: 1rem;
  }
  
  .question-content h3 {
    font-size: 1rem;
  }
  
  .answer-content {
    padding: 1rem;
  }
  
  .answer-actions {
    padding: 0 1rem 1rem;
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }
  
  .search-input {
    padding: 0.875rem 0.875rem 0.875rem 2.5rem;
  }
  
  .search-icon {
    left: 0.875rem;
    font-size: 1rem;
  }
  
  .category-card {
    padding: 1rem;
  }
  
  .category-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .faq-section {
    padding: 1rem;
  }
  
  .question-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
  
  .answer-icon {
    width: 24px;
    height: 24px;
    font-size: 0.875rem;
  }
  
  .category-badge {
    font-size: 0.625rem;
    padding: 0.125rem 0.5rem;
  }
}
</style>