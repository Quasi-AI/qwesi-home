<template>
    <!-- Right Side - Cover Image -->
    <div class="hidden lg:block lg:w-1/2 bg-gray-50 border-l">
        <div class="h-full flex items-center justify-center p-8">
            <div class="relative">
                <!-- Thinking UI Elements -->
                <div
                    class="absolute -top-4 -right-4 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center animate-bounce">
                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div class="absolute -top-2 -right-12 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center animate-bounce"
                    style="animation-delay: 0.2s;">
                    <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                </div>
                <div class="absolute top-8 -right-8 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center animate-bounce"
                    style="animation-delay: 0.4s;">
                    <div class="w-1 h-1 bg-blue-500 rounded-full"></div>
                </div>

                <!-- Floating dots around the image -->
                <div class="absolute -top-6 left-8 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-80">
                </div>
                <div class="absolute top-4 -left-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-70"
                    style="animation-delay: 0.5s;"></div>
                <div class="absolute top-16 -left-6 w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse opacity-60"
                    style="animation-delay: 1s;"></div>

                <!-- Main Image -->
                <img src="@/assets/images/qwesi-image.png" alt="QWESI AI Assistant"
                    class="w-64 h-auto object-contain rounded-2xl animate-breathing relative z-10" />

                <!-- Bottom thinking elements -->
                <div class="absolute -bottom-4 left-12 w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center animate-bounce"
                    style="animation-delay: 0.6s;">
                    <div class="w-1 h-1 bg-orange-500 rounded-full"></div>
                </div>
                <div class="absolute -bottom-2 right-8 w-3 h-3 bg-teal-100 rounded-full flex items-center justify-center animate-bounce"
                    style="animation-delay: 0.8s;">
                    <div class="w-0.5 h-0.5 bg-teal-500 rounded-full"></div>
                </div>

                <!-- Connection lines (subtle) -->
                <div
                    class="absolute top-1/2 -right-2 w-8 h-px bg-gradient-to-r from-blue-200 to-transparent opacity-30">
                </div>
                <div
                    class="absolute top-1/3 -left-2 w-6 h-px bg-gradient-to-l from-green-200 to-transparent opacity-30">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// No props or logic needed for this component
</script>

<style scoped>
/* Breathing animation for the main image */
@keyframes breathing {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
}

.animate-breathing {
    animation: breathing 4s ease-in-out infinite;
}
</style>