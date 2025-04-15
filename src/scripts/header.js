import loadComponent from "../../components/loadComponent.js"
import { logOut } from "../utils/api.js"
import createDropdown from "../../components/createDropdown.js"

export default async function loadHeader() {
    await loadComponent('header', 'header')
    const navLinksUl = document.querySelector('.nav-links')

    // IF LOGGED IN
    if (globalThis.loggedIn) {
        // const logOutLi = document.createElement('li')
        // const logOutButton = document.createElement('button')
        // logOutButton.innerText = "Logga ut"
        // logOutButton.addEventListener('click', logOut)
        // logOutLi.append(logOutButton)
        // navLinksUl.append(logOutLi)
        navLinksUl.insertAdjacentHTML('beforeend', `
            <li>
                <p>Welcome: </p>
            </li>
        `)

        const dropdownItems = [
            {text: "Logga ut", callback: logOut}
        ]

        if (globalThis.isAdmin) dropdownItems.push({text: "Admin panel", href:"/admin/admin.html"});

        navLinksUl.insertAdjacentElement('beforeend', createDropdown({
            innerHTML: globalThis.user.firstName,
            items: dropdownItems
        }))
    }
    
    // IF LOGGED OUT
    if (!globalThis.loggedIn) {
        navLinksUl.insertAdjacentHTML('beforeend', `
            <li id="login-li">
                <a href="login.html">Logga in</a>
            </li>
        `)
    }

    // IF ADMIN
    if (globalThis.isAdmin) {
        // navLinksUl.insertAdjacentHTML('beforeend', `
        //     <li id="admin-li">
        //         <a href="admin/admin-Product.html" id="admin-link">Admin Panel</a>
        //     </li>
        // `)
    }
}
