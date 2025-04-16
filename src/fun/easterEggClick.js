const eggAttr = `<a href="https://www.flaticon.com/free-icons/easter-egg" title="easter egg icons">Easter egg icons created by Freepik - Flaticon</a>`

const bloopRandomEgg = (x, y) => {
    const src = `/src/fun/egg${Math.floor(Math.random()*5)+1}.png`
    const img = document.createElement('img')
    img.classList.add('egg')
    img.width = '40'
    img.src = src
    img.style.position = 'absolute'
    img.style.userSelect = 'none'
    img.style.pointerEvents = 'none'
    img.style.left = x + 'px'
    img.style.top = y + 'px'
    img.style.translate = '-50% -50%'

    img.onload = () => {
        document.body.insertAdjacentElement('beforeend', img)

        setTimeout(() => {
            img.remove()
        }, 1000);
    }
}

const handleEggClick = (e) => {
    const FULL = 50
    const HALF = 25
    // Starting from 12:00 and going clockwise
    // Relative to position where clicked
    // Basically a circle of the 8 compass directions
    const coords = [
        [0, -FULL],
        [HALF, -HALF],
        [FULL, 0],
        [HALF, HALF],
        [0, FULL],
        [-HALF, HALF],
        [0, -FULL],
        [-HALF, -HALF],
        [-FULL, 0]
    ]

    for (let i = 0; i < coords.length; i++) {
        const [xOffset, yOffset] = coords[i]
        const timeout = 50*i;
        setTimeout(() => {
           bloopRandomEgg(e.clientX + xOffset, e.clientY + yOffset) 
        }, timeout);
    }
}

document.addEventListener('click', e => {
    if (Math.random() < 6.66/100) {
        handleEggClick(e)
    }
})