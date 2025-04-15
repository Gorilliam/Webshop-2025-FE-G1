import { getBaseUrl } from "./api.js"

export default async function loadUserContext() {
    try {        
        const res = await fetch(getBaseUrl() + "api/auth/me", {
            headers: {
                'hakim-livs-token': localStorage.getItem('hakim-livs-token')
            }
        })
        const data = await res.json()
        globalThis.user = data;
        console.log("globalThis.user:", globalThis.user)
        globalThis.loggedIn = globalThis.user._id !== undefined;
        globalThis.isAdmin = globalThis.user.isAdmin
    } catch (error) {
        console.error(error)
    }
}