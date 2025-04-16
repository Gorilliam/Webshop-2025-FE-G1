export function cartNotification(msg) {
	const existingNotification = document.querySelector('.notification')
	existingNotification?.remove()

	const notification = document.createElement('div')
	notification.classList.add('notification')
	notification.innerText = msg
	document.body.insertAdjacentElement('beforeend', notification)
	setTimeout(() => {
		notification.remove()
	}, 4000);
}

export function addProductToCart(product) {
	updateLocalStorageCart(function(cart) {
		const currentQuantity = cart.filter(p => p._id === product._id).length;
		if (currentQuantity >= product.stock) {
			cartNotification(`Ingen kvar på lagret!`)
			return cart
		}
		cart.push(product)
		return cart
	})
}

// Safely retreives cart from localStorage, guaranteed to return an array
export function getCartFromLocalStorage() {
	try {
		const cart = JSON.parse(localStorage.getItem('hakim-livs-cart'))
		if (!Array.isArray(cart)) return [];
		cart.sort((p1, p2) => p1.name.localeCompare(p2.name))
		return cart;
	} catch (error) {
		console.warn(`localStorage cart contained invalid JSON`)
		return []
	}
}

// Saves cart to local storage
export function saveCartToLocalStorage(cart) {
	localStorage.setItem('hakim-livs-cart', JSON.stringify(cart))
	updateDOMWithCartData()
}

/*
	Calls the provided callback, passing in the retreived cart, then saves
	New cart must be returned
	Example usage: 
	updateLocalStorageCart(function(cart) {
		cart.push(newProduct)
		return cart
	})
*/
export function updateLocalStorageCart(callbackFunction) {
	let cart = getCartFromLocalStorage()
	cart = callbackFunction(cart)
	saveCartToLocalStorage(cart)
}

export function countProduct(id)  {
	const cart = getCartFromLocalStorage()
	return cart.reduce((count, product) => {
		if (id === product._id) count++
		return count
	}, 0)
}
/*
	This function updates the DOM whenever the cart is saved
	For example, the cart count in the header
*/
export function updateDOMWithCartData() {
	// fix cart badge
	const cart = getCartFromLocalStorage()
	document.querySelector('.cart-count').innerText = cart.length;


	// console.log("cart at time of getting product counts:", cart)

	// fix product counts
	cart.forEach(product => {
		const productCountP = document.querySelector(`.product-count-${product._id}`)
		// console.log(productCountP)
		if (!productCountP) return;
		productCountP.innerText = countProduct(product._id)
	})

	renderCart()
}

/*
	Second argument is a boolean which removes all items from the cart
*/
export function removeProductFromCart(_id, removeAll) {
	updateLocalStorageCart(function(cart) {
		if (removeAll) {
			// Remove all
			return cart.filter(p => p._id !== _id)
		} else {
			// Remove one
			const i = cart.findIndex(p => p._id === _id)
			if (i !== -1) cart.splice(i, 1);
			return cart
		}
	})

	if (countProduct(_id) <= 0) {
		const productCountP = document.querySelector(`.product-count-${_id}`)
		if (!productCountP) return;
		productCountP.innerText = "0"
	}
}

/*
	"Aggregates" the cart so that repeating products are combined into a single object
	This is to assist in rendering the cart table
	It should return an object like this: 
	{
		products: [
			{
				...product,
				quantity: amount in cart
				total: price * quanity
			}
		]
		subtotal: total price of entire cart
		moms: VAT tax
		total: total with VAT
		cart: cart from local storage
	}
*/
export function getAggregatedCart() {
	const cart = getCartFromLocalStorage()
	const aggregatedCart = { products: [], moms: 0, total: 0, cart }
	for (const product of cart) {
		// Find existing product
		let existing = aggregatedCart.products.find(p => p._id === product._id);

		// If product hasn't been added yet
		if (!existing) {
			existing = {
				...product,
				quantity: 0,
				total: 0
			}
			aggregatedCart.products.push(existing)
		}

		// count
		existing.quantity++;
		existing.total += product.price;
		aggregatedCart.total += product.price;
	}

	aggregatedCart.moms = aggregatedCart.total * 0.12;
	console.log("aggregatedCart:", aggregatedCart)
	return aggregatedCart
}

export function renderCart(id = "") {
	document.querySelector('.fortsätt')?.remove()
	const cartTableContainer = document.querySelector('.cart-table-container')

	if (!cartTableContainer) {
		return
	}

	cartTableContainer.innerHTML = ""

	const {products, total, moms} = getAggregatedCart()

	// handle empty cart
	if (products.length < 1) {
		cartTableContainer.innerHTML = `
			<h3>Din varukorg är tom.</h3>
		`
		return
	}

	// create table
	const cartTable = document.createElement('table')
	if (id) cartTable.id = id;
	cartTable.classList.add('cart-table')
	cartTableContainer.append(cartTable)

	// create tbody
	const tbody = document.createElement('tbody')
	cartTable.append(tbody)

	console.log(products)

	// render products
	for (const product of products) {
		tbody.insertAdjacentHTML('beforeend', `
			<tr>
				<td class="image-td">
					<img src="${product.image}" alt="${product.name}">
				</td>
				<td>
					<h4>${product.name} <span class="quantity">x${product.quantity}</span></h4>
					<p>${product.total.toFixed(2)}:- <span class="styck">(${product.price.toFixed(2)}kr/st)</span></p>
					<div class="controls">
						<button class="ta-bort-alla-${product._id}">
							<img src="/public/trash.svg" alt="trash can" width="20">
							Ta bort alla
						</button>
						<button class="ta-bort-1-${product._id}">
							-1
						</button>
						<button class="lägg-till-${product._id}">
							+1
						</button>
					</div>
				</td>
			</tr>
		`)

		document.querySelector(`.ta-bort-1-${product._id}`).addEventListener('click', () => removeProductFromCart(product._id))
		document.querySelector(`.ta-bort-alla-${product._id}`).addEventListener('click', () => removeProductFromCart(product._id, true))
		document.querySelector(`.lägg-till-${product._id}`).addEventListener('click', () => addProductToCart(product))
	}

	// create tfoot
	const tfoot = document.createElement('tfoot')
	cartTable.append(tfoot)
	tfoot.innerHTML = `
		<tr>
			<th>Total</th>
			<td>${total.toFixed(2)} SEK</td>
		</tr>
		<tr style="font-size: 0.8em;">
			<th>Varav moms</th>
			<td>${moms.toFixed(2)} SEK</td>
		</tr>
	`

	// add Fortsätt button
	if (document.querySelector('.fortsätt')) return;
	const continueBtn = document.createElement('button')
	continueBtn.classList.add('fortsätt')
	continueBtn.addEventListener('click', handleCheckout)
	continueBtn.innerText = 'Fortsätt'
	cartTableContainer.insertAdjacentElement('afterend', continueBtn)
}


async function handleCheckout() {
    window.location.href = "/checkout.html"
}