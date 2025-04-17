const ROOT = "https://webshop-2025-be-g1-blush.vercel.app/"

// DOM
const productBody = document.querySelector("#productBody")

main() // STARTUP
async function main() {
    const users = await getUsers()

    if (!users) {
        productBody.innerHTML = `
            <p>Något gick fel</p>
        `
        return
    }

    renderusers(users)
}

////////////// functions //////////////

async function getUsers() {
    try {
        const res = await fetch(ROOT + `api/test/users`, {
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

function formatDate(dateString) {
    const date = new Date(dateString);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${mins}`;
  }

function renderusers(users) {
    console.log("users:", users)
    productBody.innerHTML = ""
    users.forEach((user) => {

        // Render table row
        productBody.insertAdjacentHTML('beforeend', `
            <tr>
                <td>
                    ${user.firstName} ${user.lastName}
                </td>
                <td>
                    ${user.email}
                </td>
                <td>
                    ${formatDate(user.createdAt)}
                </td>
            </tr>
        `)
    })
}