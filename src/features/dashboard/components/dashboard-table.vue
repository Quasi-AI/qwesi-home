<template>
    <div class="modern-table-container">
        <!-- Glassmorphism background layers -->
        <div class="table-backdrop"></div>
        <div class="table-glow"></div>
        
        <!-- Table Header -->
        <div class="table-header">
            <div class="header-content">
                <div class="header-text">
                    <h3 class="header-title">{{ title }}</h3>
                    <p class="header-description">{{ description }}</p>
                </div>
                <div class="header-actions">
                    <div class="data-count">
                        <span class="count-number">{{ data.length }}</span>
                        <span class="count-label">{{ data.length === 1 ? 'item' : 'items' }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table Content -->
        <div class="table-wrapper">
            <div class="table-scroll-container">
                <table class="modern-table">
                    <thead class="table-head">
                        <tr class="header-row">
                            <th v-for="column in columns" :key="column.key" class="header-cell">
                                <div class="header-cell-content">
                                    <span class="column-label">{{ column.label }}</span>
                                    <div class="column-decorator"></div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="table-body">
                        <tr v-for="(item, index) in data" :key="index" 
                            class="data-row group"
                            :style="{ '--row-index': index }">
                            <td v-for="column in columns" :key="column.key" class="data-cell">
                                <!-- Status Badge -->

                                <div v-if="column.type === 'title'" class="cell-content">
                                    <span class="cell-text">{{ item[column.key] }}</span>
                                </div>

                                <div v-if="column.type === 'role'" class="cell-content">
                                    <span class="cell-text">{{ item[column.key] }}</span>
                                </div>

                                <!-- Avatar -->
                                <div v-else-if="column.type === 'avatar'" class="avatar-container">
                                    <div class="avatar-wrapper">
                                        <div class="avatar-circle">
                                            <span class="avatar-initials">{{ getAvatarInitials(item[column.key]) }}</span>
                                            <div class="avatar-ring"></div>
                                        </div>
                                        <div class="avatar-info">
                                            <p class="avatar-name">{{ getDisplayName(item[column.key]) }}</p>
                                            <div class="avatar-indicator"></div>
                                        </div>
                                    </div>
                                </div>

                                <div v-else-if="column.type === 'status'" class="status-container">
                                    <div class="status-badge" :class="getStatusClasses(item[column.key])">
                                        <div class="status-dot"></div>
                                        <span class="status-text">{{ item[column.key] }}</span>
                                    </div>
                                </div>

                                <!-- Default Content -->
                                <div v-else class="cell-content">
                                    <span class="cell-text">{{ item[column.key] }}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Enhanced Empty State -->
        <div v-if="data.length === 0" class="empty-state">
            <div class="empty-animation">
                <div class="empty-icon-wrapper">
                    <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div class="empty-sparkles">
                        <div class="sparkle" style="--delay: 0s"></div>
                        <div class="sparkle" style="--delay: 0.5s"></div>
                        <div class="sparkle" style="--delay: 1s"></div>
                    </div>
                </div>
                <div class="empty-content">
                    <h3 class="empty-title">No {{ title.toLowerCase() }} found</h3>
                    <p class="empty-description">Get started by creating your first {{ title.toLowerCase().slice(0, -1) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    columns: {
        type: Array,
        required: true
    },
    data: {
        type: Array,
        default: () => []
    }
})

const getStatusClasses = (status) => {
    const classes = {
        'Active': 'status-active',
        'Pending': 'status-pending',
        'Completed': 'status-completed',
        'Cancelled': 'status-cancelled',
        'In Progress': 'status-progress',
        'sent': 'status-sent'
    }
    return classes[status] || 'status-default'
}

const getDisplayName = (value) => {
    if (typeof value === 'string') {
        return value
    }
    if (value && typeof value === 'object' && value.name) {
        return value.name
    }
    return 'Unknown'
}

const getAvatarInitials = (value) => {
    if (typeof value === 'string') {
        return getInitials(value)
    }
    if (value && typeof value === 'object' && value.initials) {
        return value.initials
    }
    if (value && typeof value === 'object' && value.name) {
        return getInitials(value.name)
    }
    return 'U'
}

const getInitials = (name) => {
    if (!name || typeof name !== 'string') {
        return 'U'
    }
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<style scoped>
/* Container and backdrop */
.modern-table-container {
    @apply relative overflow-hidden rounded-3xl;
    backdrop-filter: blur(20px);
}

.table-backdrop {
    @apply absolute inset-0 bg-gradient-to-br from-white/90 to-slate-50/80;
    @apply border border-slate-200/60;
    border-radius: inherit;
}

.table-glow {
    @apply absolute -inset-px bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-emerald-500/10;
    @apply opacity-0 transition-opacity duration-700;
    border-radius: inherit;
    filter: blur(8px);
}

.modern-table-container:hover .table-glow {
    @apply opacity-100;
}

/* Header styling */
.table-header {
    @apply relative z-10 border-b border-slate-200/60;
    @apply bg-gradient-to-r from-slate-50/80 to-white/60;
    backdrop-filter: blur(12px);
}

.header-content {
    @apply flex items-center justify-between p-8;
}

.header-title {
    @apply text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent;
    @apply mb-2;
}

.header-description {
    @apply text-sm text-slate-600 font-medium;
}

.data-count {
    @apply flex items-center space-x-2 px-4 py-2 rounded-2xl;
    @apply bg-gradient-to-r from-blue-500/10 to-purple-500/10;
    @apply border border-blue-200/50;
}

.count-number {
    @apply text-lg font-bold text-blue-600;
}

.count-label {
    @apply text-sm text-slate-600 font-medium;
}

/* Table wrapper */
.table-wrapper {
    @apply relative overflow-hidden;
}

.table-scroll-container {
    @apply overflow-x-auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.table-scroll-container::-webkit-scrollbar {
    @apply h-2;
}

.table-scroll-container::-webkit-scrollbar-track {
    @apply bg-transparent;
}

.table-scroll-container::-webkit-scrollbar-thumb {
    @apply bg-slate-300/50 rounded-full;
}

/* Modern table */
.modern-table {
    @apply w-full;
}

.table-head {
    @apply relative;
}

.header-row {
    @apply border-b border-slate-200/40;
}

.header-cell {
    @apply px-8 py-6 text-left;
}

.header-cell-content {
    @apply flex items-center space-x-3;
}

.column-label {
    @apply text-xs font-bold text-slate-500 uppercase tracking-wider;
    @apply transition-colors duration-300;
}

.column-decorator {
    @apply w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400;
    @apply opacity-0 transition-all duration-300;
}

.header-cell:hover .column-decorator {
    @apply opacity-100 scale-125;
}

/* Table body */
.table-body {
    @apply divide-y divide-slate-200/40;
}

.data-row {
    @apply relative transition-all duration-300;
    @apply hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-blue-50/30;
    animation: slideIn 0.5s ease-out both;
    animation-delay: calc(var(--row-index) * 0.1s);
}

.data-row::before {
    @apply absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500;
    @apply opacity-0 transition-opacity duration-300;
    content: '';
}

.data-row:hover::before {
    @apply opacity-100;
}

.data-cell {
    @apply px-8 py-6;
}

/* Status badges */
.status-container {
    @apply flex items-center;
}

.status-badge {
    @apply inline-flex items-center space-x-2 px-4 py-2 rounded-2xl;
    @apply text-xs font-bold transition-all duration-300;
    @apply hover:scale-105 hover:shadow-lg;
}

.status-dot {
    @apply w-2 h-2 rounded-full;
    @apply animate-pulse;
}

.status-active {
    @apply bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border border-emerald-200;
}

.status-active .status-dot {
    @apply bg-emerald-500;
}

.status-pending {
    @apply bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200;
}

.status-pending .status-dot {
    @apply bg-amber-500;
}

.status-completed {
    @apply bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200;
}

.status-completed .status-dot {
    @apply bg-blue-500;
}

.status-cancelled {
    @apply bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200;
}

.status-cancelled .status-dot {
    @apply bg-red-500;
}

.status-progress {
    @apply bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-200;
}

.status-progress .status-dot {
    @apply bg-purple-500;
}

.status-default {
    @apply bg-gradient-to-r from-slate-100 to-slate-50 text-slate-800 border border-slate-200;
}

.status-default .status-dot {
    @apply bg-slate-500;
}

/* Avatar styling */
.avatar-container {
    @apply flex items-center;
}

.avatar-wrapper {
    @apply flex items-center space-x-4;
}

.avatar-circle {
    @apply relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600;
    @apply rounded-2xl flex items-center justify-center;
    @apply shadow-lg transform transition-all duration-300;
    @apply hover:scale-110 hover:rotate-3;
}

.avatar-initials {
    @apply text-white font-bold text-sm drop-shadow-sm;
}

.avatar-ring {
    @apply absolute -inset-1 rounded-2xl border-2 border-blue-400/30;
    @apply opacity-0 transition-opacity duration-300;
}

.avatar-circle:hover .avatar-ring {
    @apply opacity-100;
}

.avatar-name {
    @apply text-sm font-bold text-slate-900;
    @apply transition-colors duration-300;
}

.avatar-indicator {
    @apply w-2 h-2 bg-emerald-400 rounded-full;
    @apply animate-pulse;
}

/* Cell content */
.cell-content {
    @apply flex items-center;
}

.cell-text {
    @apply text-sm font-medium text-slate-700;
    @apply transition-colors duration-300;
}

.data-row:hover .cell-text {
    @apply text-slate-900;
}

/* Empty state */
.empty-state {
    @apply flex items-center justify-center py-20;
}

.empty-animation {
    @apply text-center max-w-md;
}

.empty-icon-wrapper {
    @apply relative mx-auto mb-8;
    @apply w-24 h-24 flex items-center justify-center;
}

.empty-icon {
    @apply w-16 h-16 text-slate-400;
    @apply transition-all duration-500;
    animation: float 3s ease-in-out infinite;
}

.empty-sparkles {
    @apply absolute inset-0;
}

.sparkle {
    @apply absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full;
    @apply opacity-0;
    animation: sparkle 2s ease-in-out infinite;
    animation-delay: var(--delay);
}

.sparkle:nth-child(1) {
    @apply top-2 right-4;
}

.sparkle:nth-child(2) {
    @apply bottom-4 left-2;
}

.sparkle:nth-child(3) {
    @apply top-6 left-6;
}

.empty-title {
    @apply text-xl font-bold text-slate-900 mb-2;
}

.empty-description {
    @apply text-sm text-slate-600;
}

/* Animations */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
}

@keyframes sparkle {
    0%, 100% { 
        opacity: 0; 
        transform: scale(0.5);
    }
    50% { 
        opacity: 1; 
        transform: scale(1.2);
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .data-row,
    .avatar-circle,
    .status-badge,
    .empty-icon,
    .sparkle {
        animation: none;
    }
}
</style>