<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Jobs Stat -->
        <div class="stats-card group" data-color="blue">
            <div class="stats-card-bg bg-gradient-to-br from-blue-50/80 to-blue-100/40"></div>
            <div class="stats-card-border border-blue-200/60 group-hover:border-blue-300/80"></div>
            <div class="stats-card-glow bg-blue-500/10 group-hover:bg-blue-500/20"></div>
            
            <div class="stats-content">
                <div class="flex items-start justify-between mb-4">
                    <div class="stats-icon-wrapper bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25">
                        <svg class="stats-icon text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
                        </svg>
                    </div>
                    <div class="stats-trend trend-positive">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                
                <div class="stats-number-container mb-2">
                    <span class="stats-number text-slate-900 group-hover:text-blue-900">{{ stats.jobs }}</span>
                    <div class="stats-sparkle opacity-0 group-hover:opacity-100">✦</div>
                </div>
                
                <h3 class="stats-title text-slate-700 group-hover:text-blue-700">Available Jobs</h3>
                
                <div class="stats-change">
                    <span class="change-positive">+{{ stats.changes?.jobs?.value || 12 }}%</span>
                    <span class="change-period">{{ stats.changes?.jobs?.period || 'vs last month' }}</span>
                </div>
            </div>
        </div>

        <!-- Active Tasks Stat -->
        <div class="stats-card group" data-color="emerald">
            <div class="stats-card-bg bg-gradient-to-br from-emerald-50/80 to-emerald-100/40"></div>
            <div class="stats-card-border border-emerald-200/60 group-hover:border-emerald-300/80"></div>
            <div class="stats-card-glow bg-emerald-500/10 group-hover:bg-emerald-500/20"></div>
            
            <div class="stats-content">
                <div class="flex items-start justify-between mb-4">
                    <div class="stats-icon-wrapper bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/25">
                        <svg class="stats-icon text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <div class="stats-trend trend-positive">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                
                <div class="stats-number-container mb-2">
                    <span class="stats-number text-slate-900 group-hover:text-emerald-900">{{ stats.activeTasks }}</span>
                    <div class="stats-sparkle opacity-0 group-hover:opacity-100">✦</div>
                </div>
                
                <h3 class="stats-title text-slate-700 group-hover:text-emerald-700">Active Tasks</h3>
                
                <div class="stats-change">
                    <span class="change-positive">+{{ stats.changes?.activeTasks?.value || 8 }}%</span>
                    <span class="change-period">{{ stats.changes?.activeTasks?.period || 'vs last week' }}</span>
                </div>
            </div>
        </div>

        <!-- Team Members Stat -->
        <div class="stats-card group" data-color="violet">
            <div class="stats-card-bg bg-gradient-to-br from-violet-50/80 to-violet-100/40"></div>
            <div class="stats-card-border border-violet-200/60 group-hover:border-violet-300/80"></div>
            <div class="stats-card-glow bg-violet-500/10 group-hover:bg-violet-500/20"></div>
            
            <div class="stats-content">
                <div class="flex items-start justify-between mb-4">
                    <div class="stats-icon-wrapper bg-gradient-to-br from-violet-500 to-violet-600 shadow-violet-500/25">
                        <svg class="stats-icon text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58A2.01 2.01 0 0 0 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0 0 20 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/>
                        </svg>
                    </div>
                    <div class="stats-trend trend-positive">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                
                <div class="stats-number-container mb-2">
                    <span class="stats-number text-slate-900 group-hover:text-violet-900">{{ stats.people }}</span>
                    <div class="stats-sparkle opacity-0 group-hover:opacity-100">✦</div>
                </div>
                
                <h3 class="stats-title text-slate-700 group-hover:text-violet-700">Team Members</h3>
                
                <div class="stats-change">
                    <span class="change-positive">+{{ stats.changes?.people?.value || 5 }}%</span>
                    <span class="change-period">{{ stats.changes?.people?.period || 'vs last month' }}</span>
                </div>
            </div>
        </div>

        <!-- Productivity Stat -->
        <div class="stats-card group" data-color="amber">
            <div class="stats-card-bg bg-gradient-to-br from-amber-50/80 to-amber-100/40"></div>
            <div class="stats-card-border border-amber-200/60 group-hover:border-amber-300/80"></div>
            <div class="stats-card-glow bg-amber-500/10 group-hover:bg-amber-500/20"></div>
            
            <div class="stats-content">
                <div class="flex items-start justify-between mb-4">
                    <div class="stats-icon-wrapper bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/25">
                        <svg class="stats-icon text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                        </svg>
                    </div>
                    <div class="stats-trend trend-positive">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                
                <div class="stats-number-container mb-2">
                    <span class="stats-number text-slate-900 group-hover:text-amber-900">{{ stats.productivity }}%</span>
                    <div class="stats-sparkle opacity-0 group-hover:opacity-100">✦</div>
                </div>
                
                <h3 class="stats-title text-slate-700 group-hover:text-amber-700">Productivity</h3>
                
                <div class="stats-change">
                    <span class="change-positive">+{{ stats.changes?.productivity?.value || 15 }}%</span>
                    <span class="change-period">{{ stats.changes?.productivity?.period || 'vs last week' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    stats: {
        type: Object,
        default: () => ({
            jobs: 0,
            activeTasks: 0,
            people: 0,
            productivity: 0,
            changes: {
                jobs: { value: 0, period: "last month" },
                activeTasks: { value: 0, period: "last week" },
                people: { value: 0, period: "last month" },
                productivity: { value: 0, period: "last week" }
            }
        })
    }
})
</script>

<style scoped>
/* Base stats card styling */
.stats-card {
    @apply relative p-8 rounded-3xl cursor-pointer overflow-hidden;
    @apply transform transition-all duration-500 ease-out;
    @apply hover:-translate-y-2 hover:scale-[1.02];
    backdrop-filter: blur(20px);
}

/* Layered background system */
.stats-card-bg {
    @apply absolute inset-0 transition-all duration-500;
}

.stats-card-border {
    @apply absolute inset-0 rounded-3xl border-2 transition-all duration-500;
}

.stats-card-glow {
    @apply absolute -inset-1 rounded-3xl transition-all duration-700 blur-xl;
    @apply opacity-0 group-hover:opacity-100;
}

/* Content container */
.stats-content {
    @apply relative z-10;
}

/* Icon styling */
.stats-icon-wrapper {
    @apply w-14 h-14 rounded-2xl flex items-center justify-center;
    @apply transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3;
    @apply shadow-lg;
}

.stats-icon {
    @apply w-7 h-7 transition-all duration-300;
}

/* Trend indicator */
.stats-trend {
    @apply w-8 h-8 rounded-xl flex items-center justify-center;
    @apply transform transition-all duration-300 group-hover:scale-110;
}

.trend-positive {
    @apply bg-emerald-100 text-emerald-600;
    @apply group-hover:bg-emerald-200;
}

/* Number display */
.stats-number-container {
    @apply relative flex items-center;
}

.stats-number {
    @apply text-4xl font-black transition-all duration-300;
    @apply bg-gradient-to-r bg-clip-text text-transparent;
    @apply from-slate-900 to-slate-700;
    font-variant-numeric: tabular-nums;
}

.stats-sparkle {
    @apply text-2xl text-yellow-400 ml-2;
    @apply transform transition-all duration-500;
    @apply group-hover:rotate-12 group-hover:scale-125;
    animation: sparkle 2s ease-in-out infinite;
}

/* Title styling */
.stats-title {
    @apply text-sm font-bold uppercase tracking-wider;
    @apply transition-all duration-300;
}

/* Change indicators */
.stats-change {
    @apply flex items-center space-x-2 mt-4;
}

.change-positive {
    @apply text-sm font-bold text-emerald-600;
    @apply px-2 py-1 bg-emerald-100 rounded-lg;
    @apply transition-all duration-300;
}

.change-period {
    @apply text-xs text-slate-500 font-medium;
}

/* Animation keyframes */
@keyframes sparkle {
    0%, 100% { 
        opacity: 0.7; 
        transform: scale(1);
    }
    50% { 
        opacity: 1; 
        transform: scale(1.2);
    }
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
}

@keyframes glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
}

/* Advanced hover effects */
.stats-card:hover .stats-card-glow {
    animation: glow 2s ease-in-out infinite;
}

.stats-card:hover .stats-icon-wrapper {
    animation: float 3s ease-in-out infinite;
}

/* Glassmorphism support */
@supports (backdrop-filter: blur(20px)) {
    .stats-card {
        backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.7);
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .stats-card {
        background: rgba(15, 23, 42, 0.8);
    }
    
    .stats-number {
        @apply from-slate-100 to-slate-300;
    }
    
    .stats-title {
        @apply text-slate-300;
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    .stats-card,
    .stats-icon-wrapper,
    .stats-sparkle,
    .stats-card-glow {
        transition: none;
        animation: none;
    }
}

/* High contrast mode */
@media (prefers-contrast: high) {
    .stats-card-border {
        @apply border-4 border-slate-900;
    }
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .stats-card {
        @apply p-6 hover:scale-100;
    }
    
    .stats-number {
        @apply text-3xl;
    }
    
    .stats-icon-wrapper {
        @apply w-12 h-12;
    }
    
    .stats-icon {
        @apply w-6 h-6;
    }
}
</style>