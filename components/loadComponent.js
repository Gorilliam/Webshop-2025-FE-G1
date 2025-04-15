/**
 * @param {string} cssSelector
 * @param {string} componentName 
 * @example
 * loadComponent("header", "header")
 */
export default async function loadComponent(cssSelector, componentName) {
    const el = document.querySelector(cssSelector)

    // get html
    const res = await fetch(`./${componentName}/${componentName}.html`)
    const html = await res.text()
    el.outerHTML = html

    // run js
    await import(`./${componentName}/${componentName}.js`)
}