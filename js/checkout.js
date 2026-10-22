/* ==========================================================================
   FILE: js/search.js
   DÙNG CHO TRANG: search.html
   MÔ TẢ: Xử lý bật/tắt ô tìm kiếm, bóc tách từ khóa trên URL, lọc sản phẩm 
          trong kho (data.js) và hiển thị kết quả tìm kiếm ra màn hình.
   ========================================================================== */

// 1. Hàm bật/tắt ô tìm kiếm bo tròn trên Header
function toggleSearchBar() {
  const toggleBtn = document.getElementById("searchToggleBtn");
  const searchForm = document.getElementById("searchExpandForm");
  const searchInput = document.getElementById("searchExpandInput");

  if (searchForm) {
    // Thêm hoặc gỡ class "active" để trượt/hiện khung tìm kiếm bằng CSS
    searchForm.classList.toggle("active");
    if (searchForm.classList.contains("active")) {
      if (toggleBtn) toggleBtn.style.display = "none"; // Ẩn nút kính lúp
      if (searchInput) searchInput.focus(); // Đặt dấu nháy chuột vào ô nhập ngay lập tức
    }
  }
}

// 2. Logic hiển thị trang kết quả tìm kiếm search.html
function executeSearch() {
  // Đọc các tham số trên đường dẫn URL (Ví dụ: search.html?q=sua)
  const urlParams = new URLSearchParams(window.location.search);
  const rawQuery = urlParams.get("q") || "";
  const query = rawQuery.trim().toLowerCase(); // Chuyển về chữ thường để so sánh chính xác

  // Lấy các phần tử hiển thị trên trang search.html (Đã đồng bộ ID chuẩn với HTML)
  const keywordElem = document.getElementById("search-keyword-display");
  const countElem = document.getElementById("search-count-number");
  const container = document.getElementById("search-results-grid");

  if (!container) return; // Nếu không phải trang tìm kiếm thì dừng lại

  // TRƯỜNG HỢP 1: CHƯA NHẬP TỪ KHÓA (Người dùng vào trang mà không gõ gì)
  if (!query) {
    if (keywordElem) keywordElem.innerText = '""';
    if (countElem) countElem.innerText = "0";
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fff; border-radius: 8px;">
        <i class="fa fa-search" style="font-size: 40px; color: #ccc; margin-bottom: 15px;"></i>
        <h3 style="color: #555;">Bạn chưa nhập từ khóa tìm kiếm.</h3>
        <p style="color: #888;">Hãy nhập tên sản phẩm bạn muốn tìm vào thanh tìm kiếm ở trên.</p>
      </div>
    `;
    return;
  }

  // TRƯỜNG HỢP 2: ĐÃ NHẬP TỪ KHÓA -> TIẾN HÀNH LỌC SẢN PHẨM KHỚP
  if (keywordElem) keywordElem.innerText = rawQuery;

  // Lấy dữ liệu nguồn từ mảng allProducts (khai báo trong data.js)
  let dataset = typeof allProducts !== "undefined" ? allProducts : [];

  // Dùng filter() và includes() để lọc ra các sản phẩm có tên chứa từ khóa tìm kiếm
  const matchedProducts = dataset.filter((p) => p.name.toLowerCase().includes(query));

  // Hiển thị số lượng sản phẩm tìm thấy ra màn hình
  if (countElem) {
    countElem.innerText = matchedProducts.length;
  }

  // Nếu không tìm thấy sản phẩm nào khớp
  if (matchedProducts.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fff; border-radius: 8px;">
        <h3 style="color: #555;">Không tìm thấy sản phẩm nào phù hợp với từ khóa "${rawQuery}".</h3>
        <a href="products.html" style="color: #0088cc; text-decoration: underline;">Xem tất cả sản phẩm</a>
      </div>
    `;
    return;
  }

  // Nếu tìm thấy sản phẩm, dùng map() để vẽ các thẻ HTML sản phẩm
  let html = matchedProducts
    .map((p) => {
      const priceFormatted = p.price ? `${p.price.toLocaleString("vi-VN")} đ` : "Liên hệ";
      return `
        <div class="search-product-card">
          <img src="${p.image}" alt="${p.name}" class="search-product-img" onclick="goToDetail(${p.id})" onerror="this.src='images/banners/logo.png'">
          <div class="search-product-name" onclick="goToDetail(${p.id})">${p.name}</div>
          <div class="search-product-price">${priceFormatted}</div>
          <button class="btn-add-search" onclick="addToCartFromSearch(${p.id})">Thêm vào giỏ</button>
        </div>
      `;
    })
    .join("");

  // Chèn chuỗi HTML sản phẩm vừa tạo vào khung lưới kết quả
  container.innerHTML = html;
}

// 3. Hàm chuyển hướng sang trang chi tiết sản phẩm khi bấm vào ảnh hoặc tên
function goToDetail(id) {
  window.location.href = `detail.html?id=${id}`;
}

// 4. Hàm thêm sản phẩm trực tiếp từ trang kết quả tìm kiếm vào giỏ hàng
function addToCartFromSearch(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let dataset = typeof allProducts !== "undefined" ? allProducts : [];
  let product = dataset.find((p) => p.id === productId);

  if (!product) return;

  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1; // Nếu có rồi thì tăng số lượng lên 1
  } else {
    // Nếu chưa có thì thêm mới vào mảng giỏ hàng
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price || 43700,
      image: product.image || "images/banners/logo.png",
      quantity: 1,
    });
  }

  // Lưu ngược lại vào localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`Đã thêm "${product.name}" vào giỏ hàng!`);

  // Cập nhật lại số lượng badge hiển thị trên Header ngay lập tức
  const badge = document.getElementById("cart-count-badge");
  if (badge) {
    let totalCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    badge.innerText = totalCount;
  }
}

// 5. Tự động kích hoạt hàm tìm kiếm ngay khi trang search.html tải xong
document.addEventListener("DOMContentLoaded", executeSearch);
