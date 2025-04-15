// @ts-check

/**
 * @typedef DropdownItem
 * @property {string} text
 * @property {string} [href]
 * @property {string} [id]
 * @property {string} [classList]
 * @property {EventListenerOrEventListenerObject} [callback]
*/

/**
 * @typedef DropdownOptions
 * @property {string} innerHTML
 * @property {string} [id]
 * @property {string} [classList]
 * @property {DropdownItem[]} items
 */

/**
 * createDropdown
 * @param {DropdownOptions} options 
 * @returns {HTMLDivElement}
 */
export default function createDropdown(options) {
    // container
    const container = document.createElement('div')
    if (options.classList) container.classList = options.classList
    if (options.id) container.id = options.id
    container.classList.add('dropdown-container')

    // trigger
    const trigger = document.createElement('div')
    trigger.classList.add('dropdown-trigger')
    trigger.innerHTML = options.innerHTML

    container.append(trigger)

    // menu
    const menu = document.createElement('div')
    menu.classList.add('dropdown-menu')

    container.append(menu)

    // items
    options.items.forEach((item, i) => {
        const el = document.createElement(item.href ? 'a' : 'button')
        el.innerText = item.text
        if (item.classList) el.classList = item.classList
        if (item.id) el.id = item.id
        el.classList.add('dropdown-item')

        if (item.href) {
            el.setAttribute('href', item.href)
        }

        if (item.callback) {
            el.addEventListener('click', item.callback)
        }

        menu.append(el)
    })


    return container
}