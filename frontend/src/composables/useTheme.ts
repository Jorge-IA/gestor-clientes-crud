import { ref, watchEffect } from 'vue'

type Theme = 'light' | 'dark'

const getInitial = (): Theme => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<Theme>(getInitial())

watchEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
})

export function useTheme() {
    const toggle = () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
    }
    return { theme, toggle }
}
