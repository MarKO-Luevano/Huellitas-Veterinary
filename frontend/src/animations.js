// Variantes reutilizables para Framer Motion

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
}

export const slideDown = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const slideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const slideLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const zoomIn = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
}

export const bounceIn = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 18 },
    },
}

export const flipIn = {
    hidden: { opacity: 0, rotateX: -90 },
    visible: {
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
    },
}

// Para listas: cada hijo aparece con delay escalonado
export const containerStagger = {
    hidden: {},
    visible: {
    transition: { staggerChildren: 0.08 },
    },
}

export const itemFadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

// Modal backdrop
export const backdropAnim = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
}

// Modal panel
export const modalAnim = {
    hidden: { opacity: 0, scale: 0.88, y: 30 },
    visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
    },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
}