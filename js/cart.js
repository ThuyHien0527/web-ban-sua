/* ==========================================================================
   FILE: js/cart.js
   CHỨC NĂNG: Thêm, hiển thị, cập nhật, xóa sản phẩm và tính tiền giỏ hàng
   LƯU TRỮ: localStorage với key "cart"
   ========================================================================== */

const CART_STORAGE_KEY = "cart";

// Đọc giỏ hàng an toàn từ localStorage
function getCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .filter((item) => item && item.id !== undefined && item.id !== null)
      .map((item) => ({
        ...item,
        quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
        price: Math.max(0, Number(item.price) || 0),
      }));
  } catch (error) {
    console.error("Không thể đọc giỏ hàng:", error);
    return [];
  }
}

// Lưu giỏ hàng
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Định dạng tiền Việt Nam
function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString("vi-VN") + " đ";
}

// Chuyển dữ liệu thành chuỗi an toàn trước khi đưa vào HTML
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

// Cập nhật huy hiệu số lượng sản phẩm trên header
function updateCartBadge() {
  const badge = document.getElementById("cart-count-badge");
  if (!badge) return;

  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  badge.textContent = totalCount;
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
  const dataset =
    typeof allProducts !== "undefined" && Array.isArray(allProducts)
      ? allProducts
      : typeof products !== "undefined" && Array.isArray(products)
        ? products
        : [];

  const product = dataset.find((item) => String(item.id) === String(productId));

  if (!product) {
    alert("Không tìm thấy sản phẩm. Vui lòng thử lại!");
    return;
  }

  const cart = getCart();
  const existingItem = cart.find((item) => String(item.id) === String(product.id));

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name || "Sản phẩm TH true MILK",
      price: Math.max(0, Number(product.price) || 0),
      image: product.image || "images/banners/logo.png",
      quantity: 1,
    });
  }

  saveCart(cart);
  renderCart();
  updateCartBadge();

  alert("Đã thêm sản phẩm vào giỏ hàng TH true MILK thành công!");
}

// Hiển thị danh sách sản phẩm trong cart.html
function renderCart() {
  const container = document.getElementById("cart-items-container");
  if (!container) return;

  const cart = getCart();
  container.replaceChildren();

  if (cart.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:30px; color:#666;">
          Giỏ hàng của bạn đang trống.
          <a href="products.html" style="color:#004b87; font-weight:bold;">
            Mua sắm ngay
          </a>
        </td>
      </tr>
    `;

    updateCartTotals(0);
    updateCartBadge();
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const itemPrice = item.price;
    const itemTotal = itemPrice * item.quantity;
    total += itemTotal;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <div class="cart-product-item">
          <img
            src="${escapeHTML(item.image || "images/banners/logo.png")}"
            alt="${escapeHTML(item.name)}"
            onerror="this.onerror=null;this.src='images/banners/logo.png';"
          >
          <span class="cart-product-name">
            ${escapeHTML(item.name)}
          </span>
        </div>
      </td>

      <td style="text-align:center;">
        ${formatCurrency(itemPrice)}
      </td>

      <td style="text-align:center;">
        <button
          type="button"
          class="qty-btn"
          data-action="decrease"
          data-id="${escapeHTML(item.id)}"
          aria-label="Giảm số lượng"
          ${item.quantity <= 1 ? "disabled" : ""}
        >-</button>

        <span class="qty-val">${item.quantity}</span>

        <button
          type="button"
          class="qty-btn"
          data-action="increase"
          data-id="${escapeHTML(item.id)}"
          aria-label="Tăng số lượng"
        >+</button>
      </td>

      <td style="text-align:center; font-weight:bold; color:#004b87;">
        ${formatCurrency(itemTotal)}
      </td>

      <td style="text-align:center;">
        <button
          type="button"
          class="btn-delete"
          data-action="delete"
          data-id="${escapeHTML(item.id)}"
        >Xóa</button>
      </td>
    `;

    container.appendChild(row);
  });

  updateCartTotals(total);
  updateCartBadge();
}

// Tăng hoặc giảm số lượng sản phẩm
function changeQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find((product) => String(product.id) === String(id));

  if (!item) return;

  // Số lượng không được thấp hơn 1
  item.quantity = Math.max(1, item.quantity + Number(delta || 0));

  saveCart(cart);
  renderCart();
  updateCartBadge();
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(id) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => String(item.id) !== String(id));

  saveCart(updatedCart);
  renderCart();
  updateCartBadge();
}

// Giữ tên hàm cũ để tương thích nếu trang khác đang gọi
function removeProductFromCart(productId) {
  removeFromCart(productId);
}

// Cập nhật tổng tiền
function updateCartTotals(total) {
  const totalPriceElem = document.getElementById("cart-total-price");
  const finalPriceElem = document.getElementById("cart-final-price");
  const formattedTotal = formatCurrency(total);

  if (totalPriceElem) {
    totalPriceElem.textContent = formattedTotal;
  }

  if (finalPriceElem) {
    finalPriceElem.textContent = formattedTotal;
  }
}

// Xử lý các nút tăng, giảm và xóa bằng một bộ sự kiện duy nhất
document.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "increase") {
    changeQuantity(id, 1);
  } else if (action === "decrease") {
    changeQuantity(id, -1);
  } else if (action === "delete") {
    removeFromCart(id);
  }
});

// Xử lý thanh toán
function processCheckout() {
  const cart = getCart();

  if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước.");
    return;
  }

  window.location.href = "checkout.html";
}

// Khởi tạo khi trang tải xong
document.addEventListener("DOMContentLoaded", function () {
  renderCart();
  updateCartBadge();
});
