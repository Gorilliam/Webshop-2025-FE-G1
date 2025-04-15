import loadComponent from '../../components/loadComponent.js'

export default async function loadFooter() {
    await loadComponent('footer', 'footer')
    document.querySelector('.footer-year').innerText = new Date().getFullYear()
}