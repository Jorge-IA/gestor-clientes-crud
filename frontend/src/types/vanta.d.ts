interface VantaEffect {
    destroy(): void
}

interface Window {
    VANTA: {
        RINGS(options: {
            el: HTMLElement | string
            mouseControls?: boolean
            touchControls?: boolean
            gyroControls?: boolean
            minHeight?: number
            minWidth?: number
            scale?: number
            scaleMobile?: number
            color?: number
            backgroundColor?: number
            backgroundAlpha?: number
        }): VantaEffect
    }
}
