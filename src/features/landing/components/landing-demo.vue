<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black bg-opacity-75" @click="closeModal"></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
            <!-- Close Button -->
            <button @click="closeModal"
                class="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <!-- Video Container -->
            <div class="relative w-full p-4">
                <div class="w-full max-w-4xl mx-auto">
                    <div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%;
                        padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden;
                        border-radius: 8px; will-change: transform;">
                        <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;"
                            src="https://www.canva.com/design/DAGugf4pBG0/g8P1l6VZ-kEuvTANQuDNeA/watch?embed" 
                            allowfullscreen="allowfullscreen" 
                            allow="fullscreen"
                            title="Qwesi AI Demo Video">
                        </iframe>
                    </div>
                    <div class="text-center mt-4">
                        <a href="https://www.canva.com/design/DAGugf4pBG0/g8P1l6VZ-kEuvTANQuDNeA/watch?utm_content=DAGugf4pBG0&utm_campaign=designshare&utm_medium=embeds&utm_source=link" 
                            target="_blank" 
                            rel="noopener" 
                            class="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                            Qwesi AI by Rexton Itsiah
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close'])

const videoUrl = ref('')

const closeModal = () => {
    emit('close')
}
</script>