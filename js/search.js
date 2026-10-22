/* ==========================================================================
   FILE: js/search.js
   MÔ TẢ:
   - Đọc từ khóa q trên URL
   - Tìm sản phẩm trong allProducts
   - Hiển thị kết quả tìm kiếm
   - Chuyển đến trang chi tiết sản phẩm
   - Sử dụng chung chức năng giỏ hàng từ cart.js
   ========================================================================== */

/* =========================================================
   1. THỰC HIỆN TÌM KIẾM
   ========================================================= */

function executeSearch() {
  // Lấy từ khóa q từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const rawQuery = (urlParams.get("q") || "").trim();
  const queryLower = rawQuery.toLocaleLowerCase("vi-VN");

  // Lấy các phần tử HTML
  const keywordElem = document.getElementById("search-keyword-display");
  const countElem = document.getElementById("search-count-number");
  const container = document.getElementById("search-results-grid");

  // Không có khu vực hiển thị kết quả thì dừng
  if (!container) {
    return;
  }

  // Không nhập từ khóa
  if (!rawQuery) {
    if (keywordElem) {
      keywordElem.textContent = '""';
    }

    if (countElem) {
      countElem.textContent = "0";
    }

    container.innerHTML = `
            <div class="search-empty-result">
                <i class="fa fa-search"></i>
                <h3>Bạn chưa nhập từ khóa tìm kiếm.</h3>
                <p>
                    Hãy nhập tên sản phẩm, ví dụ:
                    Sữa tươi, Sữa chua, Kem...
                </p>
            </div>
        `;

    return;
  }

  // Hiển thị từ khóa bằng textContent để tránh chèn HTML
  if (keywordElem) {
    keywordElem.textContent = `"${rawQuery}"`;
  }

  // Lấy danh sách sản phẩm
  const dataset =
    typeof allProducts !== "undefined" && Array.isArray(allProducts) ? allProducts : [];

  // Lọc sản phẩm theo tên
  // Chuẩn hóa tiếng Việt: bỏ dấu, không phân biệt hoa/thường
  function normalizeSearchText(text) {
    return String(text || "")
      .toLocaleLowerCase("vi-VN")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  const normalizedQuery = normalizeSearchText(rawQuery);

  // Từ khóa tìm kiếm có thể tương ứng với danh mục sản phẩm
  const categoryKeywords = [
    {
      keywords: ["sua tiet trung", "tiet trung"],
      categories: ["suatiettrung", "tiet-trung", "tiettrung"],
    },
    {
      keywords: ["sua thanh trung", "thanh trung"],
      categories: ["suathanhtrung", "thanh-trung", "thanhtrung"],
    },
    {
      keywords: ["sua hat"],
      categories: ["suahat", "sua-hat"],
    },
    {
      keywords: ["sua chua"],
      categories: ["suachua", "sua-chua"],
    },
    {
      keywords: ["nuoc tinh khiet"],
      categories: ["nuoctinhkhiet", "nuoc-tinh-khiet"],
    },
    {
      keywords: ["do uong", "do uong giai khat"],
      categories: ["douonggiaikhat", "do-uong"],
    },
    {
      keywords: ["bo pho mat", "pho mat"],
      categories: ["bo-phomat", "bophomat"],
    },
    {
      keywords: ["sua lua mach"],
      categories: ["thucuongsualuamach", "sua-lua-mach"],
    },
  ];

  const matchedCategory = categoryKeywords.find((item) =>
    item.keywords.some((keyword) => normalizedQuery.includes(keyword)),
  );

  // Lọc theo tên hoặc danh mục
  const matchedProducts = dataset.filter(function (product) {
    if (!product || !product.name) {
      return false;
    }

    const normalizedName = normalizeSearchText(product.name);

    // Tìm theo tên sản phẩm, kể cả khi người dùng không gõ dấu
    const nameMatches = normalizedName.includes(normalizedQuery);

    // Tìm theo danh mục nếu tên sản phẩm không khớp
    const normalizedCategory = normalizeSearchText(product.category).replace(/\s/g, "");

    const categoryMatches =
      matchedCategory &&
      matchedCategory.categories.some((category) => {
        return normalizedCategory === normalizeSearchText(category).replace(/\s/g, "");
      });

    return nameMatches || categoryMatches;
  });

  // Hiển thị số lượng kết quả
  if (countElem) {
    countElem.textContent = matchedProducts.length;
  }

  // Không tìm thấy sản phẩm
  if (matchedProducts.length === 0) {
    container.innerHTML = `
            <div class="search-empty-result">
                <i class="fa fa-search"></i>
                <h3 id="search-empty-title">
                    Không tìm thấy sản phẩm phù hợp.
                </h3>
                <p>
                    Thử tìm kiếm với các từ khóa ngắn hơn như:
                    <b>sữa tươi</b>,
                    <b>tiệt trùng</b>,
                    <b>sữa chua</b>,
                    <b>kem</b>.
                </p>
                <a href="products.html">
                    Xem tất cả sản phẩm
                </a>
            </div>
        `;

    // Đưa từ khóa vào nội dung dưới dạng văn bản
    const emptyTitle = document.getElementById("search-empty-title");

    if (emptyTitle) {
      emptyTitle.textContent = `Không tìm thấy sản phẩm nào khớp với từ khóa "${rawQuery}".`;
    }

    return;
  }

  // Có kết quả tìm kiếm
  const html = matchedProducts
    .map(function (product) {
      // Chuẩn hóa giá sản phẩm
      const price = Number(product.price);
      const validPrice = Number.isFinite(price) && price >= 0 ? price : 43700;

      const priceFormatted = validPrice.toLocaleString("vi-VN") + " đ";

      // Chuẩn hóa đường dẫn hình ảnh
      const image = product.image || "images/banners/logo.png";

      // Chuyển tên và đường dẫn ảnh thành nội dung HTML an toàn
      const safeName = escapeSearchHTML(product.name);
      const safeImage = escapeSearchHTML(image);

      return `
            <div class="search-product-card">

                <!-- ẢNH SẢN PHẨM -->
                <img
                    src="${safeImage}"
                    alt="${safeName}"
                    class="search-product-img"
                    onclick="goToDetail(${Number(product.id)})"
                    onerror="this.onerror=null;this.src='images/banners/logo.png';"
                >

                <!-- TÊN SẢN PHẨM -->
                <div
                    class="search-product-name"
                    onclick="goToDetail(${Number(product.id)})"
                >
                    ${safeName}
                </div>

                <!-- GIÁ SẢN PHẨM -->
                <div class="search-product-price">
                    ${priceFormatted}
                </div>

                <!-- THÊM VÀO GIỎ -->
                <button
                    type="button"
                    class="btn-add-search"
                    onclick="addToCart(${Number(product.id)})"
                >
                    Thêm vào giỏ
                </button>

            </div>
        `;
    })
    .join("");

  // Hiển thị danh sách sản phẩm
  container.innerHTML = html;
}

/* =========================================================
   2. HỖ TRỢ HIỂN THỊ NỘI DUNG AN TOÀN
   ========================================================= */

function escapeSearchHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, function (char) {
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

/* =========================================================
   3. ĐI ĐẾN TRANG CHI TIẾT SẢN PHẨM
   ========================================================= */

function goToDetail(id) {
  const productId = Number(id);

  if (!Number.isFinite(productId)) {
    return;
  }

  window.location.href = `detail.html?id=${encodeURIComponent(productId)}`;
}

/* =========================================================
   4. KHỞI CHẠY KHI TRANG ĐƯỢC TẢI
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  executeSearch();

  // Sử dụng hàm cập nhật badge từ cart.js nếu có
  if (typeof updateCartBadge === "function") {
    updateCartBadge();
  }
});
