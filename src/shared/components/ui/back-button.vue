<template>
    <button @click="goBack" type="button" :class="buttonClass">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <slot>Back</slot>
    </button>
</template>

<script setup>
const router = useRouter()
const goBack = () => router.back()

defineProps({
    buttonClass: {
        type: String,
        default: 'inline-flex items-center text-blue-600 hover:text-blue-700 mb-4'
    }
})
</script>