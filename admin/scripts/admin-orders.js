const ROOT = "https://webshop-2025-be-g1-blush.vercel.app/"

// DOM
const productBody = document.querySelector("#productBody")

main() // STARTUP
async function main() {
    const orders = await getOrders()

    if (!orders) {
        productBody.innerHTML = `
            <p>Något gick fel</p>
        `
        return
    }

    renderOrders(orders)
}

////////////// functions //////////////

async function getOrders() {
    try {
        const res = await fetch(ROOT + `api/orders`, {
            headers: {
                'hakim-livs-token': localStorage.getItem('hakim-livs-token')
            }
        })

        const data = await res.json()

        if (!res.ok) {
            return
        }

        return data

    } catch (_) {
        
    }
}

function renderOrders(orders) {
    console.log("orders:", orders)
    productBody.innerHTML = ""
    orders.forEach((order, i) => {

        // Render table row
        productBody.insertAdjacentHTML('beforeend', `
            <tr>
                <td id="del-order-${i}"}>
                    <button style="font-size:2rem;font-weight:bold;padding:0rem 1rem;">
                        -
                    </button>
                </td>
                <td>${order.orderID}</td>
                <td>
                    ${order.firstName} <br />
                    ${order.lastName}
                </td>
                <td>
                    ${order.email}
                </td>
                <td>
                    ${order.phoneNumber}
                </td>
                <td>
                    ${order.address}
                </td>
                <td>
                    <button id="kontrollera-${i}">
                        Kontrollera
                    </button>
                </td>
            </tr>
        `)

        // delete button
        const delBtn = document.querySelector(`#del-order-${i}`)
        delBtn.addEventListener('click', () => {
            openDeleteOrderModal(order)
        })

        // kontrollera button
        const konBtn = document.querySelector(`#kontrollera-${i}`)
        konBtn.addEventListener('click', () => {
            openManageOrderModal(order)
        })
    })
}

async function openDeleteOrderModal(order) {
    openModal(`
        <p>Är du säker? Denna åtgärd kan inte ångras.</p>
        <button class="confirm">Bekräfta</button>
    `)
    const delBtn = document.querySelector('.confirm')
    delBtn.addEventListener('click',() => {
        delBtn.disabled = true
        deleteOrder(order, delBtn)
    })
}

async function deleteOrder(order, delBtn) {
    alert("inte implementerad än")
    // const res = await fetch(ROOT + `api/orders/delete/${order._id}`, {
    //     headers: {
    //         'hakim-livs-token': localStorage.getItem('hakim-livs-token')
    //     }
    // })
}

async function openManageOrderModal(order) {
    openModal(`
        <table id="manage-order-modal-table">
            <thead>
                <tr>
                    <th>Bild</th>
                    <th>Namn</th>
                    <th>Antal</th>
                </tr>
            </thead>
            <tbody>
                ${order.products.map(product => {
                    const p = product.productId
                    return `
                        <tr>
                            <td>
                                <img src="${p.image}" alt="${p.name}"/ width="40">
                            </td>
                            <td>
                                ${p.name}
                            </td>
                            <td>
                                ${product.quantity}
                            </td>
                        </tr>
                    `
                }).join('')}
            </tbody>
        </table>
    `)
}

function closeModal() {
    document.querySelector('.modal-backdrop')?.remove()
}

function openModal(innerHTML) {
    document.body.insertAdjacentHTML(`beforeend`, `
        <div class="modal-backdrop">
            <div class="modal-window">
                <button class="modal-x" onclick="this.parentElement.parentElement.remove()">
                    X
                </button>
                ${innerHTML}
            </div>
        </div>
    `)
    const backdrop = document.querySelector(".modal-backdrop")
    
    backdrop?.addEventListener('click', e => {
        if (e.currentTarget !== e.target) return;
        e.currentTarget.remove()
    })
}