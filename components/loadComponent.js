/**
 * @param {string} cssSelector
 * @param {string} componentName 
 * @example
 * loadComponent("header", "header")
 */
export default async function loadComponent(cssSelector, componentName) {
    const el = document.querySelector(cssSelector)

    // get html
    const res = await fetch(`/components/${componentName}.html`)
    const html = await res.text()
    el.outerHTML = html
}