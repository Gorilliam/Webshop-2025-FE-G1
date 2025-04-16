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
    const RADIUS = 50;
    const POINTS = 16;
    const coords = [];

    for (let i = 0; i < POINTS; i++) {
        const angle = (i / POINTS) * Math.PI * 2;
        const x = Math.round(Math.cos(angle) * RADIUS);
        const y = Math.round(Math.sin(angle) * RADIUS);
        coords.push([x, y]);
    }

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