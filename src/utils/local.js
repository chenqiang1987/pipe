export const setLocal = (key, value) => {
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
}

export const getLocal = (key) => {
    const value = localStorage.getItem(key) || ''
    if (value.includes('[') || value.includes('{')) {
        return JSON.parse(value)
    } else {
        return localStorage.getItem(key) || ''
    }
}

export const setSession = (key, value) => {
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    sessionStorage.setItem(key, value)
}

export const getSession = (key) => {
    const value = sessionStorage.getItem(key) || ''
    if (value.includes('[') || value.includes('{')) {
        return JSON.parse(value)
    } else {
        return sessionStorage.getItem(key) || ''
    }
}

export const removeLocal = (key) => {
    localStorage.removeItem(key)
}

export const removeSession = (key) => {
    sessionStorage.removeItem(key)
}

window.setLocal = setLocal
window.getLocal = getLocal
window.setSession = setLocal
window.getSession = getLocal
window.setSession = removeLocal
window.getSession = removeSession
