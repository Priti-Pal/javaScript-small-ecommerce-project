let productsWrapper = document.getElementById("productsWrapper");
let cart = document.getElementById("cart");
let cartItems = [];
window.addEventListener("load", displayCartItems);

async function fetchProducts() {
  try {
    let response = await fetch("https://fakestoreapi.com/products");
    let data = await response.json();
    console.log(data);
    displayProducts(data);
  } catch (error) {
    console.log(error);
    productsWrapper.innerHTML = `<h2>Something went wrong 🤯</h2>`;
  }
}
fetchProducts();

function displayProducts(allproducts) {
  allproducts.map((product) => {
    let card = document.createElement("article");
    let productImage = document.createElement("img");
    let cardTitle = document.createElement("h3");
    let productPrice = document.createElement("p");
    let btn = document.createElement("button");

    cardTitle.textContent = product.title;
    productPrice.textContent = `Rs.${product.price}`;
    btn.textContent = "Add to Cart";

    card.setAttribute("class", "productCard");
    productImage.setAttribute("src", product.image);
    let cartCountSpan = document.getElementById("cartCount");

    // Function to update cart count
    function updateCartCount() {
      let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      let totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      cartCountSpan.textContent = totalItems; // Update the cart count span
    }

    // Call updateCartCount initially
    updateCartCount();

    btn.addEventListener("click", () => {
      let existingProduct = cartItems.find((ele) => ele.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cartItems.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cartItems));
      updateCartCount(); // Update the count after adding
      displayCartItems(); // Refresh the cart display
    });

    card.append(productImage, cardTitle, productPrice, btn);
    productsWrapper.append(card);
  });
}

function displayCartItems() {
  cart.innerHTML = "";
  cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  // If cart is empty, show a message
  if (cartItems.length === 0) {
    cart.innerHTML = "<p>Your cart is empty.</p>";
    updateCartCount(); // Update the count to 0
    return;
  }

  cartItems.map((item) => {
    let cartCard = document.createElement("article");
    let cartImg = document.createElement("img");
    let cartTitle = document.createElement("h3");
    let cartQuantity = document.createElement("p");
    let cartPrice = document.createElement("p");
    let removebtn = document.createElement("button");

    cartCard.setAttribute("class", "cartCard");
    cartImg.setAttribute("src", item.image);
    cartTitle.textContent = item.title;
    cartQuantity.textContent = `Quantity: ${item.quantity}`;
    cartPrice.textContent = `Rs. ${item.quantity * item.price}`;
    removebtn.textContent = "Remove";

    removebtn.addEventListener("click", () => {
      let index = cartItems.findIndex((ele) => ele.id === item.id);

      if (index !== -1) {
        if (cartItems[index].quantity > 1) {
          cartItems[index].quantity -= 1; // Reduce quantity
        } else {
          cartItems.splice(index, 1); // Remove item if quantity is 1
        }
        localStorage.setItem("cart", JSON.stringify(cartItems));
        updateCartCount(); // Update the count after removing
        displayCartItems(); // Refresh the cart display
      }
    });

    cartCard.append(cartImg, cartTitle, cartQuantity, cartPrice, removebtn);
    cart.append(cartCard);
  });
}

// Function to update cart count
function updateCartCount() {
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  let totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  let cartCountSpan = document.getElementById("cartCount");
  cartCountSpan.textContent = totalItems;
}
