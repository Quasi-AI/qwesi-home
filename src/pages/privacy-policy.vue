<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="bg-white shadow-sm border-b">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <BackButton class="mb-4" />
                <h1 class="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                <p class="text-gray-600 mt-2">Last updated: July 13, 2025</p>
            </div>
        </div>

        <!-- Content -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="bg-white rounded-lg shadow-sm border p-8 space-y-8">
                <!-- Introduction -->
                <section>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                    <p class="text-gray-700 leading-relaxed">
                        At Qwesi ("we", "our", or "us"), accessible at www.qwesi.org, we prioritize your privacy. This
                        Privacy Policy outlines how we collect, use, disclose, and safeguard your personal data when you
                        interact with our services— including our website, WhatsApp assistant, and call-based platforms.
                    </p>
                </section>

                <!-- Information We Collect -->
                <section>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                    <ul class="space-y-3 text-gray-700">
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span><strong>Personal Information:</strong> Full name, phone number, email address,
                                location, and CV details.</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span><strong>WhatsApp Data:</strong> Messages, voice notes, media, and other inputs sent to
                                our WhatsApp bot for job assistance.</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span><strong>Call Data:</strong> Phone number, call duration, and conversation summaries
                                for career or recruitment support.</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span><strong>Technical Information:</strong> Device type, IP address, browser type,
                                referral sources, and usage activity on qwesi.org.</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span><strong>Subscription Data:</strong> Payment status, transaction history (handled
                                securely by Stripe or Paystack).</span>
                        </li>
                    </ul>
                </section>

                <!-- How We Use Your Data -->
                <section>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Data</h2>
                    <ul class="space-y-3 text-gray-700">
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span>To match you with job opportunities based on your skills and preferences.</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span>To send automated job alerts, investor leads, or career advice via WhatsApp or
                                email.</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span>To enable voice/chat interactions with our AI Coach or Recruiter over WhatsApp and
                                calls.</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span>To improve platform performance and enhance user experience using aggregated
                                analytics.</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span>To verify identity for subscription and access to premium services.</span>
                        </li>
                    </ul>
                </section>

                <!-- WhatsApp and Call Data Usage -->
                <section>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">4. WhatsApp and Call Data Usage</h2>
                    <p class="text-gray-700 leading-relaxed mb-4">
                        When you interact with Qwesi via WhatsApp, your messages, audio files, and contact information
                        are securely processed through Meta's WhatsApp Business API and used only to support your job or
                        recruitment journey.
                    </p>
                    <p class="text-gray-700 leading-relaxed">
                        Phone calls to Qwesi may be logged for support or verification. We do not record conversations
                        unless explicitly stated and agreed to by the user for quality improvement or documentation
                        purposes.
                    </p>
                </section>

                <!-- Sharing of Information -->
                <section>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">5. Sharing of Information</h2>
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Qwesi does not sell your data. We may share information with:
                    </p>
                    <ul class="space-y-3 text-gray-700">
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span>Verified employers or recruiters (only after your consent).</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span>Payment processors (Stripe, Paystack) for billing and verification.</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span>Service providers (e.g., OpenAI, Google Cloud, Signalwire) to power features like
                                transcription, chat response, and messaging.</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span>Law enforcement or regulators when required to comply with legal obligations.</span>
                        </li>
                    </ul>
                </section>

                <!-- Third-Party Services -->
                <section>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
                    <p class="text-gray-700 leading-relaxed">
                        We integrate with external APIs including but not limited to OpenAI, WhatsApp Business API, and
                        Stripe. Each of these platforms has its own privacy policies. By using Qwesi, you also agree to
                        their terms where applicable.
                    </p>
                </section>

                <!-- Data Retention -->
                <section>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
                    <p class="text-gray-700 leading-relaxed">
                        We retain your personal data for as long as needed to provide our services, fulfill legal
                        obligations, resolve disputes, or enforce our agreements. You can request deletion of your data
                        at any time by contacting info@qwesi.org.
                    </p>
                </section>

                <!-- Children's Privacy -->
                <section>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Qwesi is designed to be accessible and beneficial to users of all ages, including children. We
                        are committed to protecting the privacy of minors and comply with applicable laws such as the
                        Children's Online Privacy Protection Act (COPPA).
                    </p>
                    <p class="text-gray-700 leading-relaxed mb-4">
                        For users under the age of 13, we require verifiable parental or guardian consent before
                        collecting personal information. Parents or legal guardians have the right to review, update, or
                        delete their child's information at any time by contacting us at info@qwesi.org.
                    </p>
                    <p class="text-gray-700 leading-relaxed mb-4">
                        We limit the collection of data from minors to only what is necessary to provide our services,
                        such as name, phone number, and the type of career assistance needed. We do not display ads or
                        use their data for marketing purposes.
                    </p>
                    <p class="text-gray-700 leading-relaxed">
                        If we discover that we have collected personal information from a child without parental
                        consent, we will take immediate steps to delete the information from our servers.
                    </p>
                </section>

                <!-- Your Rights -->
                <section>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">9. Your Rights</h2>
                    <ul class="space-y-3 text-gray-700">
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span>Right to access the personal data we hold about you.</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span>Right to request correction or deletion of your data.</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span>Right to withdraw consent at any time (e.g., unsubscribe from WhatsApp or email
                                alerts).</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 font-semibold mr-2">•</span>
                            <span>Right to data portability (receive your data in a usable format upon request).</span>
                        </li>
                    </ul>
                </section>

                <!-- Security -->
                <section>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">10. Security</h2>
                    <p class="text-gray-700 leading-relaxed">
                        We implement strong technical and organizational safeguards to protect your information from
                        loss, misuse, or unauthorized access. These include secure data encryption, access control, and
                        regular audits.
                    </p>
                </section>

                <!-- Changes to This Policy -->
                <section>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
                    <p class="text-gray-700 leading-relaxed">
                        We may update this Privacy Policy occasionally. The latest version will always be available on
                        our website. Significant changes will be communicated via email or WhatsApp.
                    </p>
                </section>

                <!-- Contact Us -->
                <section>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
                    <p class="text-gray-700 leading-relaxed mb-4">
                        If you have questions or concerns about this Privacy Policy or your personal data, please
                        contact:
                    </p>
                    <div class="bg-gray-50 rounded-lg p-6 space-y-2">
                        <p class="text-gray-700"><strong>Email:</strong> info@qwesi.org</p>
                        <p class="text-gray-700"><strong>Phone:</strong> +1 208 279 6057</p>
                        <p class="text-gray-700"><strong>Address:</strong> DeReimer Street, New York, NY 10745, USA</p>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import BackButton from '@/components/BackButton.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const goBack = () => router.back()
// Set page title
useHead({
    title: 'Privacy Policy - Qwesi AI',
    meta: [
        { name: 'description', content: 'Privacy Policy for Qwesi AI - Learn how we collect, use, and protect your personal data.' }
    ]
})
</script>