import { getBaseUrl } from "../../src/utils/api.js"

const adminLoadingDiv = document.querySelector('.admin-loading')
const adminErrorDiv = document.querySelector('.admin-error')
const adminContainer = document.querySelector('.admin-container')

main()

async function main() {
    await checkToken()
}

async function checkToken() {
    const res = await fetch(getBaseUrl() + "api/auth/me", {
        headers: {
            'hakim-livs-token': localStorage.getItem('hakim-livs-token')
        }
    })
    const data = await res.json()
    globalThis.user = data

    if (!data.isAdmin) {
        adminLoadingDiv.classList.add('hidden')
        adminErrorDiv.classList.remove('hidden')
        return
    }

    adminLoadingDiv.classList.add('hidden')
    adminContainer.classList.remove('hidden')
} 