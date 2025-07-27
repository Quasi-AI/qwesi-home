<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Jobs Stat -->
        <div
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer group">
            <div class="flex items-center">
                <div
                    class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                    <svg class="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300"
                        fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-4">
                    <p
                        class="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                        Jobs</p>
                    <p
                        class="text-2xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
                        {{ stats.jobs }}</p>
                </div>
            </div>
            <div class="mt-4">
                <span class="text-sm text-green-600 font-medium">+12%</span>
                <span class="text-sm text-gray-500 ml-1">from last month</span>
            </div>
        </div>

        <!-- Active Tasks Stat -->
        <div
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-green-200 hover:bg-green-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer group">
            <div class="flex items-center">
                <div
                    class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                    <svg class="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform duration-300"
                        fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-4">
                    <p
                        class="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors duration-300">
                        Active Tasks</p>
                    <p
                        class="text-2xl font-bold text-gray-900 group-hover:text-green-900 transition-colors duration-300">
                        {{ stats.activeTasks }}</p>
                </div>
            </div>
            <div class="mt-4">
                <span class="text-sm text-green-600 font-medium">+8%</span>
                <span class="text-sm text-gray-500 ml-1">from last week</span>
            </div>
        </div>

        <!-- People Stat -->
        <div
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer group">
            <div class="flex items-center">
                <div
                    class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                    <svg class="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300"
                        fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                </div>
                <div class="ml-4">
                    <p
                        class="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                        People</p>
                    <p
                        class="text-2xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
                        {{ stats.people }}</p>
                </div>
            </div>
            <div class="mt-4">
                <span class="text-sm text-green-600 font-medium">+5%</span>
                <span class="text-sm text-gray-500 ml-1">from last month</span>
            </div>
        </div>

        <!-- Productivity Stat -->
        <div
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-orange-200 hover:bg-orange-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer group">
            <div class="flex items-center">
                <div
                    class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-300">
                    <svg class="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform duration-300"
                        fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-4">
                    <p
                        class="text-sm font-medium text-gray-600 group-hover:text-orange-600 transition-colors duration-300">
                        Productivity</p>
                    <p
                        class="text-2xl font-bold text-gray-900 group-hover:text-orange-900 transition-colors duration-300">
                        {{ stats.productivity }}%</p>
                </div>
            </div>
            <div class="mt-4">
                <span class="text-sm text-green-600 font-medium">+15%</span>
                <span class="text-sm text-gray-500 ml-1">from last week</span>
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
            productivity: 0
        })
    }
})
</script>