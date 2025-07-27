<template>
    <div class="relative">
        <div class="relative">
            <button type="button" @click="toggleDropdown" :disabled="disabled"
                class="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white text-left h-[2.58rem]"
                :class="{ 'ring-2 ring-blue-500 border-transparent': isOpen }">
                <div class="flex items-center space-x-2">
                    <img v-if="selectedCountry" :src="selectedCountry.flag" :alt="selectedCountry.name"
                        class="w-6 h-4 mr-2 rounded-sm object-cover" />
                    <span v-if="selectedCountry" class="text-sm font-medium text-gray-900">
                        +{{ selectedCountry.callingCodes[0] }}
                    </span>
                    <span v-else class="text-gray-500">Country</span>
                </div>
                <svg class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': isOpen }" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <!-- Dropdown -->
            <div v-if="isOpen"
                class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <!-- Search input -->
                <div class="sticky top-0 bg-white border-b border-gray-200 p-2">
                    <input v-model="searchQuery" type="text" placeholder="Search countries..."
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <!-- Country list -->
                <div class="py-1 overflow-x-hidden">
                    <button v-for="country in filteredCountries" :key="country.alpha2Code"
                        @click="selectCountry(country)"
                        class="w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
                        <img :src="country.flag" :alt="country.name"
                            class="w-6 h-4 mr-3 flex-shrink-0 rounded-sm object-cover" />
                        <div class="flex-1 min-w-0">
                            <div class="text-sm font-medium text-gray-900">{{ country.name }}</div>
                            <div class="text-xs text-gray-500">+{{ country.callingCodes[0] }} ({{ country.alpha2Code }})
                            </div>
                        </div>
                    </button>
                </div>

                <!-- Loading state -->
                <div v-if="loading" class="p-4 text-center text-gray-500">
                    Loading countries...
                </div>

                <!-- No results -->
                <div v-if="!loading && filteredCountries.length === 0" class="p-4 text-center text-gray-500">
                    No countries found
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const loading = ref(false)
const countries = ref([])
const searchQuery = ref('')
const selectedCountry = ref(null)

// Filter countries based on search query
const filteredCountries = computed(() => {
    if (!searchQuery.value) return countries.value

    const query = searchQuery.value.toLowerCase()
    return countries.value.filter(country =>
        country.name.toLowerCase().includes(query) ||
        country.alpha2Code.toLowerCase().includes(query) ||
        country.callingCodes.some(code => code.includes(query))
    )
})

// Fetch countries from REST Countries API
const fetchCountries = async () => {
    loading.value = true
    try {
        // Use v2 API which provides SVG flag URLs
        const response = await fetch('https://restcountries.com/v2/all?fields=name,flag,alpha2Code,callingCodes')

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Transform data to match our needs for v2 API with SVG flags
        countries.value = data
            .filter(country => country.callingCodes && country.callingCodes.length > 0)
            .map(country => ({
                name: country.name,
                flag: country.flag || 'https://flagcdn.com/xx.svg', // Use SVG flag URL
                alpha2Code: country.alpha2Code, // This is the shortcode (e.g., "GH", "US", "GB")
                callingCodes: country.callingCodes
            }))
            .sort((a, b) => a.name.localeCompare(b.name))

        // Set default country based on user's location or Ghana
        if (!selectedCountry.value && !props.modelValue) {
            const defaultCountry = countries.value.find(c => c.alpha2Code === 'GH') || countries.value[0]
            if (defaultCountry) {
                selectCountry(defaultCountry)
            }
        } else if (props.modelValue && countries.value.length > 0) {
            // If modelValue is provided, find and set the corresponding country
            const cleanValue = props.modelValue.replace('+', '')
            const country = countries.value.find(c => c.callingCodes.includes(cleanValue))
            if (country) {
                selectedCountry.value = country
            }
        }
    } catch (error) {
        console.error('Error fetching countries:', error)
        // Fallback to a few common countries if API fails
        countries.value = [
            {
                name: 'Ghana',
                flag: '🇬🇭',
                alpha2Code: 'GH',
                callingCodes: ['233']
            },
            {
                name: 'United States',
                flag: '🇺🇸',
                alpha2Code: 'US',
                callingCodes: ['1']
            },
            {
                name: 'United Kingdom',
                flag: '🇬🇧',
                alpha2Code: 'GB',
                callingCodes: ['44']
            },
            {
                name: 'Nigeria',
                flag: '🇳🇬',
                alpha2Code: 'NG',
                callingCodes: ['234']
            },
            {
                name: 'Kenya',
                flag: '🇰🇪',
                alpha2Code: 'KE',
                callingCodes: ['254']
            }
        ]

        // Set Ghana as default
        if (!selectedCountry.value && !props.modelValue) {
            const defaultCountry = countries.value.find(c => c.alpha2Code === 'GH')
            if (defaultCountry) {
                selectCountry(defaultCountry)
            }
        }
    } finally {
        loading.value = false
    }
}

// Select a country
const selectCountry = (country) => {
    selectedCountry.value = country
    // Emit the calling code with a plus sign to avoid double plus signs in forms
    const newValue = `+${country.callingCodes[0]}`

    // Only emit if the value is different from current modelValue
    if (newValue !== props.modelValue) {
        emit('update:modelValue', newValue)
    }

    isOpen.value = false
    searchQuery.value = ''
}

// Toggle dropdown
const toggleDropdown = () => {
    if (!props.disabled) {
        isOpen.value = !isOpen.value
    }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
    if (!event.target.closest('.relative')) {
        isOpen.value = false
    }
}

// Watch for modelValue changes to update selected country
watch(() => props.modelValue, (newValue) => {
    if (newValue && countries.value.length > 0) {
        // Remove plus sign for comparison since callingCodes don't have it
        const cleanValue = newValue.replace('+', '')
        const country = countries.value.find(c => c.callingCodes.includes(cleanValue))
        if (country) {
            selectedCountry.value = country
        }
    }
})

// Initialize
onMounted(() => {
    fetchCountries()
    document.addEventListener('click', handleClickOutside)
})

// Cleanup
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>