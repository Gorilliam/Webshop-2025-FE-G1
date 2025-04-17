import loadComponent from '../../components/loadComponent.js'
import loadUserContext from "../../src/utils/userContext.js"

const adminLoadingDiv = document.querySelector('.admin-loading')
const adminErrorDiv = document.querySelector('.admin-error')
const adminContainer = document.querySelector('.admin-container')

main()

async function main() {
    await loadUserContext()
    await checkToken()
    await loadComponent('aside', 'adminSidebar')
}


async function checkToken() {
    if (!user || !user.isAdmin) {
        adminLoadingDiv.classList.add('hidden')
        adminErrorDiv.classList.remove('hidden')
        return
    }

    adminLoadingDiv.classList.add('hidden')
    adminContainer.classList.remove('hidden')
} 