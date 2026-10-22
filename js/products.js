/* ==========================================================================
   FILE: js/products.js
   DÙNG CHO TRANG: products.html
   MÔ TẢ: Xử lý hiển thị danh mục sản phẩm, lọc sản phẩm theo danh mục (Sữa tươi,
          Sữa chua, Kem, Thực phẩm,...), phân nhóm theo tầng kệ và thêm vào giỏ hàng.
   ========================================================================== */

// 1. Chuyển hướng sang trang chi tiết khi bấm vào ảnh hoặc tên sản phẩm
function goToDetail(id) {
  window.location.href = `detail.html?id=${id}`;
}

// 2. Thêm sản phẩm vào giỏ hàng từ trang danh mục

function addToCart(productId) {
  let cart = [];

  try {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart = Array.isArray(savedCart) ? savedCart : [];
  } catch (error) {
    alert("Dữ liệu giỏ hàng bị lỗi. Vui lòng kiểm tra lại!");
    return;
  }

  const dataset = typeof allProducts !== "undefined" ? allProducts : [];
  const product = dataset.find((p) => String(p.id) === String(productId));

  // Không thêm sản phẩm giả khi không tìm thấy ID.
  if (!product) {
    alert("Không tìm thấy sản phẩm này. Vui lòng tải lại trang!");
    return;
  }

  const existingItem = cart.find((item) => String(item.id) === String(product.id));

  if (existingItem) {
    existingItem.quantity = Math.max(1, Number(existingItem.quantity) || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image || "images/banners/logo.png",
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);

  if (typeof updateCartBadge === "function") {
    updateCartBadge();
  }
}

// 3. Cập nhật số lượng hiển thị trên icon giỏ hàng ở Header
function updateCartBadge() {
  const badge = document.getElementById("cart-count-badge");
  if (!badge) return;

  let cart = [];

  try {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart = Array.isArray(savedCart) ? savedCart : [];
  } catch (error) {
    cart = [];
  }

  const totalCount = cart.reduce((sum, item) => {
    return sum + Math.max(0, Number(item.quantity) || 0);
  }, 0);

  badge.textContent = totalCount;
}

// 4. Danh sách các danh mục sản phẩm hiển thị trên thanh trượt ngang
const defaultCategories = [
  {
    key: "tiet-trung",
    name: "Sữa tươi tiệt trùng",
    image: "images/products/suatiettrungnguyenchat1L.png",
  },
  {
    key: "thanh-trung",
    name: "Sữa tươi thanh trùng",
    image: "images/products/suathanhtrungnguyenchat.png",
  },
  { key: "sua-hat", name: "Sữa hạt", image: "images/products/suahatoccho.png" },
  { key: "sua-chua", name: "Sữa chua", image: "images/products/suachuaanitbeo.png" },
  { key: "kem", name: "Kem", image: "images/products/kemocquevani.png" },
  { key: "do-uong", name: "Đồ uống giải khát", image: "images/products/nuoctaotunhien.png" },
  { key: "nuoc-tinh-khiet", name: "Nước tinh khiết", image: "images/products/nuoctinhkiet500.png" },
  { key: "bo-phomat", name: "Bơ - Phomat", image: "images/products/bonhattunhien.png" },
  { key: "topkid", name: "TOPKID", image: "images/products/suatopkid.png" },
  {
    key: "sua-lua-mach",
    name: "Thức uống sữa lúa mạch",
    image: "images/products/thucuongsualuamach180.png",
  },
  { key: "thuc-pham", name: "Thực phẩm", image: "images/products/caribo.png" },
];

// 5. Hàm lọc sản phẩm khi người dùng bấm chọn một danh mục
function filterByCategory(categoryName) {
  const key = getCategoryKeyByName(categoryName);
  if (window.location.pathname.includes("products.html")) {
    window.history.pushState({}, "", `products.html?category=${key}`);
    loadProductsByCategory(key);
    renderCategories();
  } else {
    window.location.href = `products.html?category=${key}`;
  }
}

// 6. Hàm chuyển đổi tên danh mục tiếng Việt sang key định danh trên URL
function getCategoryKeyByName(categoryName) {
  if (!categoryName) return "tiet-trung";
  const nameLower = categoryName.toLowerCase();
  if (nameLower.includes("thanh trùng")) return "thanh-trung";
  if (nameLower.includes("tiệt trùng")) return "tiet-trung";
  if (nameLower.includes("hạt")) return "sua-hat";
  if (nameLower.includes("topkid")) return "topkid";
  if (nameLower.includes("lúa mạch")) return "sua-lua-mach";
  if (nameLower.includes("sữa chua")) return "sua-chua";
  if (nameLower.includes("tinh khiết")) return "nuoc-tinh-khiet";
  if (nameLower.includes("giải khát") || nameLower.includes("đồ uống")) return "do-uong";
  if (nameLower.includes("kem")) return "kem";
  if (nameLower.includes("bơ") || nameLower.includes("phô mai") || nameLower.includes("phomat"))
    return "bo-phomat";
  if (nameLower.includes("thực phẩm")) return "thuc-pham";
  return "tiet-trung";
}

// 7. Hàm render các icon danh mục ra giao diện thanh trượt
function renderCategories() {
  const container = document.getElementById("categoryIconsScroll");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const currentCategory = urlParams.get("category") || "tiet-trung";

  container.innerHTML = defaultCategories
    .map((cat) => {
      const isActive = cat.key === currentCategory ? "active" : "";
      return `
        <div class="category-icon-item ${isActive}" onclick="filterByCategory('${cat.name}')">
            <img src="${cat.image}" alt="${cat.name}" onerror="this.src='images/banners/logo.png'">
            <p>${cat.name}</p>
        </div>
      `;
    })
    .join("");
}

// 8. Hàm điều hướng trượt danh mục ngang qua lại bằng nút bấm
function scrollCategories(direction) {
  const container = document.getElementById("categoryIconsScroll");
  if (container) {
    container.scrollBy({ left: direction * 250, behavior: "smooth" });
  }
}

// 9. Hàm tải và hiển thị danh sách sản phẩm tương ứng với từng danh mục được chọn
function loadProductsByCategory(catKey) {
  const container = document.getElementById("product-shelves-container");
  const titleElement = document.getElementById("category-page-title");

  if (!container) return;

  let displayList = [];
  let pageTitle = "Sữa tươi tiệt trùng";

  // Sử dụng switch-case để quản lý toàn bộ dữ liệu sản phẩm đầy đủ của bạn
  switch (catKey) {
    case "thanh-trung":
      pageTitle = "Sữa tươi thanh trùng";
      displayList =
        typeof thanhTrungProducts !== "undefined" && thanhTrungProducts.length
          ? thanhTrungProducts
          : [
              {
                id: 201,
                name: "Sữa Tươi Thanh Trùng Nguyên Chất 940 ml",
                price: 48000,
                image: "images/products/suathanhtrungnguyenchat.png",
              },
              {
                id: 202,
                name: "Sữa Tươi Thanh Trùng Ít Đường 940 ml",
                price: 48000,
                image: "images/products/suathanhtrungitduong.png",
              },
              {
                id: 203,
                name: "Sữa Tươi Thanh Trùng Có Đường 450 ml",
                price: 25000,
                image: "images/products/suathanhtrungcoduong450.png",
              },
            ];
      break;

    case "sua-hat":
      pageTitle = "Sữa hạt tự nhiên";
      displayList =
        typeof suaHatProducts !== "undefined" && suaHatProducts.length
          ? suaHatProducts
          : [
              {
                id: 301,
                name: "Sữa Hạt Óc Chó TH true NUT 180 ml",
                price: 49100,
                image: "images/products/suahatoccho.png",
              },
              {
                id: 302,
                name: "Sữa Hạt Hạnh Nhân TH true NUT 180 ml",
                price: 49100,
                image: "images/products/suathathanhnhan.png",
              },
              {
                id: 303,
                name: "Sữa Hạt Macca TH true NUT 180 ml",
                price: 49100,
                image: "images/products/suahatmacca.png",
              },
            ];
      break;

    case "sua-chua":
      pageTitle = "Sữa chua các loại";
      displayList =
        typeof suaChuaProducts !== "undefined" && suaChuaProducts.length
          ? suaChuaProducts
          : [
              {
                id: 401,
                name: "Sữa Chua Ăn Ít Béo 100 g",
                price: 30000,
                image: "images/products/suachuaanitbeo.png",
              },
              {
                id: 402,
                name: "Sữa Chua Ăn Có Đường 100 g",
                price: 30000,
                image: "images/products/suachuaancoduong.png",
              },
              {
                id: 403,
                name: "Sữa Chua Ăn Ít Đường 100 g",
                price: 30000,
                image: "images/products/suachuaanitduong.png",
              },
              {
                id: 404,
                name: "Sữa Chua Ăn Vị Tự Nhiên 100 g",
                price: 30000,
                image: "images/products/suachuaantunhien.png",
              },
              {
                id: 405,
                name: "Sữa Chua Ăn Nha Đam Tự Nhiên 100 g",
                price: 35000,
                image: "images/products/suachuaannhadam.png",
              },
              {
                id: 406,
                name: "Sữa Chua Ăn Dừa Tự Nhiên 100 g",
                price: 35000,
                image: "images/products/suachuaandua.png",
              },
              {
                id: 407,
                name: "Sữa Chua Ăn Sầu Riêng Tự Nhiên 100 g",
                price: 35000,
                image: "images/products/suachuaansaurieng.png",
              },
              {
                id: 408,
                name: "Sữa Chua Ăn Táo – Sơ Ri Tự Nhiên 100 g",
                price: 35000,
                image: "images/products/suachuaantaosori.png",
              },
              {
                id: 409,
                name: "Sữa Chua Kem Ngậy Tự Nhiên TH true YOGURT Creamy 100 g",
                price: 38000,
                image: "images/products/suachuacreamy.png",
              },
              {
                id: 410,
                name: "Sữa Chua Ăn Men Sống Việt Quất Tự Nhiên 100 g",
                price: 35000,
                image: "images/products/suachuamensongvietquat.png",
              },
              {
                id: 411,
                name: "Sữa Chua Ăn Men Sống Trái Cây Tự Nhiên 100 g",
                price: 35000,
                image: "images/products/suachuamensongtraicay.png",
              },
              {
                id: 412,
                name: "Sữa Chua Nếp Cẩm Tự Nhiên 110 g",
                price: 30075,
                image: "images/products/suachuanepcam.png",
              },
              {
                id: 413,
                name: "Sữa Chua Ngũ Cốc Ca Cao Tự Nhiên 110 g",
                price: 48000,
                image: "images/products/suachuangucoccacao.png",
              },
              {
                id: 414,
                name: "Sữa Chua Cốm Nếp Giòn Tự Nhiên 110 g",
                price: 48000,
                image: "images/products/suachuacomnepgion.png",
              },
              {
                id: 415,
                name: "Sữa Uống Lên Men Ít Đường 85 ml",
                price: 26300,
                image: "images/products/suauonglenmenitduong.png",
              },
              {
                id: 416,
                name: "Sữa Uống Lên Men Hương Dâu Tự Nhiên 85 ml",
                price: 26300,
                image: "images/products/suauonglenmendau.png",
              },
              {
                id: 417,
                name: "Sữa Uống Lên Men Có Đường 85 ml",
                price: 26300,
                image: "images/products/suauonglenmencoduong.png",
              },
              {
                id: 418,
                name: "Sữa Uống Lên Men Hương Dứa Tự Nhiên 85 ml",
                price: 26300,
                image: "images/products/suauonglenmendua.png",
              },
              {
                id: 419,
                name: "Sữa Uống Lên Men Hương Đào Tự Nhiên 85 ml",
                price: 26300,
                image: "images/products/suauonglenmendao.png",
              },
              {
                id: 420,
                name: "Sữa Chua Uống Tiệt Trùng Hương Cam Tự Nhiên 180 ml",
                price: 26300,
                image: "images/products/suachuauonghuongcam.png",
              },
              {
                id: 421,
                name: "Sữa Chua Uống Tiệt Trùng Hương Dâu Tự Nhiên 180 ml",
                price: 26300,
                image: "images/products/suachuauonghuongdau.png",
              },
            ];
      break;

    case "kem":
      pageTitle = "Kem TH true ICE CREAM";
      displayList = [
        {
          id: 501,
          name: "Kem Que TOPKID Sô Cô La Nguyên Chất - Hương Vanilla Tự Nhiên",
          price: 11300,
          image: "images/products/kemquetopkidsocola.png",
        },
        {
          id: 502,
          name: "Kem Que TOPKID Sô Cô La Nguyên Chất - Phomat Tự Nhiên",
          price: 11300,
          image: "images/products/kemquetopkidphomat.png",
        },
        {
          id: 503,
          name: "Kem Que TOPKID Dâu - Hương Chuối Tự Nhiên",
          price: 11300,
          image: "images/products/kemquetopkiddauchuoi.png",
        },
        {
          id: 504,
          name: "Kem Que Hương Vanilla Xoài Tự Nhiên",
          price: 12000,
          image: "images/products/kemvanillaxoai.png",
        },
        {
          id: 505,
          name: "Kem Que Hương Vải Việt Quất Tự Nhiên",
          price: 12000,
          image: "images/products/kemvaivietquat.png",
        },
        {
          id: 506,
          name: "Kem Que Dâu Tự Nhiên",
          price: 16600,
          image: "images/products/kemquedau.png",
        },
        {
          id: 507,
          name: "Kem Que Đậu Xanh Tự Nhiên",
          price: 16600,
          image: "images/products/kemquedauxanh.png",
        },
        {
          id: 508,
          name: "Kem Que Caramel Cà Phê Muối Tự Nhiên",
          price: 16600,
          image: "images/products/kemquecaramel.png",
        },
        {
          id: 509,
          name: "Kem Que Phomat Tự Nhiên",
          price: 16600,
          image: "images/products/kemquephomat.png",
        },
        {
          id: 510,
          name: "Kem Que Sô Cô La Nguyên Chất",
          price: 16600,
          image: "images/products/kemquesocola.png",
        },
        {
          id: 511,
          name: "Kem Que Hương Vanilla Tự Nhiên",
          price: 16600,
          image: "images/products/kemquevanilla.png",
        },
        {
          id: 512,
          name: "Kem Que Sầu Riêng Tự Nhiên",
          price: 16600,
          image: "images/products/kemquesaurieng.png",
        },
        {
          id: 513,
          name: "Kem Que Dừa Tự Nhiên",
          price: 16600,
          image: "images/products/kemquedua.png",
        },
        {
          id: 514,
          name: "Kem Sandwich Sô Cô La Nguyên Chất - Hương Vanilla Tự Nhiên",
          price: 22700,
          image: "images/products/kemsandwich.png",
        },
        {
          id: 515,
          name: "Kem Ốc Quế Sô Cô La Nguyên Chất",
          price: 22400,
          image: "images/products/kemocquesocola.png",
        },
        {
          id: 516,
          name: "Kem Ốc Quế Hương Vanilla Tự Nhiên",
          price: 22400,
          image: "images/products/kemocquevanilla.png",
        },
        {
          id: 517,
          name: "Kem Ốc Quế Dâu - Hương Vanilla Tự Nhiên",
          price: 22400,
          image: "images/products/kemocquedau.png",
        },
        {
          id: 518,
          name: "Kem Hộp Hương Vanilla Tự Nhiên 50 g",
          price: 18600,
          image: "images/products/kemhopvanilla50.png",
        },
        {
          id: 519,
          name: "Kem Hộp Sô Cô La Nguyên Chất 50 g",
          price: 18600,
          image: "images/products/kemhopsocola50.png",
        },
        {
          id: 520,
          name: "Kem Hộp Trà Xanh Matcha Tự Nhiên 50 g",
          price: 18600,
          image: "images/products/kemhopmatcha50.png",
        },
        {
          id: 521,
          name: "Kem Hộp Dừa Tự Nhiên 50 g",
          price: 18600,
          image: "images/products/kemhopdua50.png",
        },
        {
          id: 522,
          name: "Kem Hộp Sầu Riêng Tự Nhiên 50 g",
          price: 18600,
          image: "images/products/kemhopsaurieng50.png",
        },
        {
          id: 523,
          name: "Kem Hộp Hương Vanilla Tự Nhiên 180 g",
          price: 62000,
          image: "images/products/kemhopvanilla180.png",
        },
        {
          id: 524,
          name: "Kem Hộp Sô Cô La Nguyên Chất 180 g",
          price: 62000,
          image: "images/products/kemhopsocola180.png",
        },
        {
          id: 525,
          name: "Kem Hộp Trà Xanh Matcha Tự Nhiên 180 g",
          price: 62000,
          image: "images/products/kemhopmatcha180.png",
        },
        {
          id: 526,
          name: "Kem Hộp Dừa Tự Nhiên 180 g",
          price: 62000,
          image: "images/products/kemhopdua180.png",
        },
        {
          id: 527,
          name: "Kem Hộp Sầu Riêng Tự Nhiên 180 g",
          price: 62000,
          image: "images/products/kemhopsaurieng180.png",
        },
        {
          id: 528,
          name: "Kem Hộp Caramel Cà Phê Muối Tự Nhiên 50 g",
          price: 18600,
          image: "images/products/kemhopcaramel50.png",
        },
        {
          id: 529,
          name: "Kem Hộp Caramel Cà Phê Muối Tự Nhiên 180 g",
          price: 62000,
          image: "images/products/kemhopcaramel180.png",
        },
      ];
      break;

    case "do-uong":
      pageTitle = "Đồ uống giải khát tự nhiên";
      displayList = [
        {
          id: 601,
          name: "Trà Đào Tự Nhiên TH true TEA 350 ml",
          price: 10000,
          image: "images/products/tradao.png",
        },
        {
          id: 602,
          name: "Trà Vải Tự Nhiên TH true TEA 350 ml",
          price: 10000,
          image: "images/products/travai.png",
        },
        {
          id: 603,
          name: "Trà Xanh Tự Nhiên TH true TEA 350 ml",
          price: 10000,
          image: "images/products/traxanh.png",
        },
        {
          id: 604,
          name: "Trà Ô Long Tự Nhiên TH true TEA 350 ml",
          price: 10000,
          image: "images/products/traolong.png",
        },
        {
          id: 605,
          name: "Trà Ổi Tự Nhiên TH true TEA 350 ml",
          price: 10000,
          image: "images/products/traoi.png",
        },
        {
          id: 606,
          name: "Trà Tắc Tự Nhiên TH true TEA 350 ml",
          price: 10000,
          image: "images/products/tratac.png",
        },
        {
          id: 607,
          name: "Trà Xanh Tự Nhiên Không Đường TH true TEA 350 ml",
          price: 10000,
          image: "images/products/traxanhkhongduong.png",
        },
        {
          id: 608,
          name: "Trà Hương Đào Tự Nhiên Không Đường TH true TEA 350 ml",
          price: 10000,
          image: "images/products/tradaokhongduong.png",
        },
        {
          id: 609,
          name: "Nước Gạo Rang TH true RICE 300 ml",
          price: 15000,
          image: "images/products/nuocgaorang.png",
        },
        {
          id: 610,
          name: "Nước Gạo Lức Đỏ TH true RICE 300 ml",
          price: 15000,
          image: "images/products/nuocgaolucdo.png",
        },
        {
          id: 611,
          name: "Nước Trái Cây TH true JUICE Cam Tự Nhiên 350 ml",
          price: 20900,
          image: "images/products/nuoccamtunhien.png",
        },
        {
          id: 612,
          name: "Nước Trái Cây TH true JUICE Táo Tự Nhiên 350 ml",
          price: 19200,
          image: "images/products/nuoctaotunhien.png",
        },
        {
          id: 613,
          name: "Nước Trái Cây TH true JUICE Táo Đào Tự Nhiên 350 ml",
          price: 19200,
          image: "images/products/nuoctaodao.png",
        },
        {
          id: 614,
          name: "Nước Uống Sữa Trái Cây Mãng Cầu TH true JUICE milk",
          price: 11300,
          image: "images/products/suatraicaymangcau.png",
        },
        {
          id: 615,
          name: "Nước Uống Sữa Trái Cây TH true JUICE milk Cam Tự Nhiên",
          price: 11300,
          image: "images/products/suatraicaycam.png",
        },
        {
          id: 616,
          name: "Nước Uống Sữa Trái Cây TH true JUICE milk Dâu Tự Nhiên",
          price: 11300,
          image: "images/products/suatraicaydau.png",
        },
        {
          id: 617,
          name: "Nước Uống Sữa Trái Cây TH true JUICE milk Việt Quất Tự Nhiên",
          price: 11300,
          image: "images/products/suatraicayvietquat.png",
        },
        {
          id: 618,
          name: "Nước Uống Sữa Trái Cây TH true JUICE milk Chuối Tự Nhiên",
          price: 11300,
          image: "images/products/suatraicaychuoi.png",
        },
      ];
      break;

    case "nuoc-tinh-khiet":
      pageTitle = "Nước tinh khiết TH true WATER";
      displayList = [
        {
          id: 701,
          name: "Nước Tinh Khiết 350 ml",
          price: 4900,
          image: "images/products/nuoctinhkiet350.png",
        },
        {
          id: 702,
          name: "Nước Tinh Khiết 500 ml",
          price: 5900,
          image: "images/products/nuoctinhkiet500.png",
        },
        {
          id: 703,
          name: "Nước Tinh Khiết 1.5 L",
          price: 11800,
          image: "images/products/nuoctinhkiet15L.png",
        },
      ];
      break;

    case "bo-phomat":
      pageTitle = "Bơ & Phô mai tự nhiên";
      displayList = [
        {
          id: 801,
          name: "Bơ Lạt Tự Nhiên 200 g",
          price: 66600,
          image: "images/products/bonhattunhien.png",
        },
        {
          id: 802,
          name: "Bơ Lạt Tự Nhiên 10 g",
          price: 39400,
          image: "images/products/bolat10g.png",
        },
        {
          id: 803,
          name: "Phomat Que Mozzarella",
          price: 41300,
          image: "images/products/phomaique.png",
        },
      ];
      break;

    case "topkid":
      pageTitle = "Sản phẩm công thức TOPKID";
      displayList = [
        {
          id: 901,
          name: "Sữa Tươi TOPKID Organic Vanilla Tự Nhiên 180 ml",
          price: 52100,
          image: "images/products/suatopkidvanilla.png",
        },
        {
          id: 902,
          name: "Sữa Chua Kem Ngậy Hương Vanilla Tự Nhiên YOGURT TOPKID",
          price: 46000,
          image: "images/products/suachuatopkidvanilla.png",
        },
        {
          id: 903,
          name: "Sữa Chua Kem Ngậy Phomat Tự Nhiên TH true YOGURT TOPKID",
          price: 46000,
          image: "images/products/suachuatopkidphomat.png",
        },
        {
          id: 904,
          name: "Sữa Chua Ăn TOPKID Hương Vanilla Tự Nhiên 60 g",
          price: 26200,
          image: "images/products/suachuaantopkidvanilla.png",
        },
        {
          id: 905,
          name: "Sữa Chua Ăn TOPKID Hương Chuối – Lúa Mạch Tự Nhiên 60 g",
          price: 26200,
          image: "images/products/suachuaantopkidchuoi.png",
        },
        {
          id: 906,
          name: "Sữa Chua Uống Phomat Tự Nhiên TOPKID 90 ml",
          price: 23500,
          image: "images/products/suachuauongtopkidphomat.jpg",
        },
        {
          id: 907,
          name: "Sữa Chua Uống Tiệt Trùng TOPKID Hương Cam Tự Nhiên 110 ml",
          price: 20700,
          image: "images/products/suachuauongtopkidcam.png",
        },
        {
          id: 908,
          name: "Sữa Chua Uống Tiệt Trùng TOPKID Hương Dâu Tự Nhiên 110 ml",
          price: 20700,
          image: "images/products/suachuauongtopkiddau.png",
        },
        {
          id: 909,
          name: "Sữa Chua Uống Tiệt Trùng TOPKID Hương Dâu-Chuối-Lúa Mạch 110 ml",
          price: 20700,
          image: "images/products/suachuauongtopkidluamach.png",
        },
      ];
      break;

    case "sua-lua-mach":
      pageTitle = "Thức uống sữa lúa mạch";
      displayList = [
        {
          id: 1001,
          name: "Thức Uống Sữa Lúa Mạch TH true CHOCOMALT MISTORI 180 ml",
          price: 32800,
          image: "images/products/sualuamach180.png",
        },
        {
          id: 1002,
          name: "Thức Uống Sữa Lúa Mạch TH true CHOCOMALT MISTORI 110 ml",
          price: 20900,
          image: "images/products/sualuamach110.png",
        },
        {
          id: 1003,
          name: "Thức Uống Sữa Lúa Mạch Có Thạch TH true CHOCOMALT MISTORI 180 ml",
          price: 36000,
          image: "images/products/sualuamachthach.png",
        },
      ];
      break;

    case "thuc-pham":
      pageTitle = "Thực phẩm chế biến TH true FOOD";
      displayList = [
        {
          id: 1301,
          name: "Sủi Cáo Nhân Thịt TH true FOOD 300 g",
          price: 58000,
          image: "images/products/suicaothit.png",
        },
        {
          id: 1302,
          name: "Sủi Cáo Nhân Tôm TH true FOOD 300 g",
          price: 67800,
          image: "images/products/suicaotom.png",
        },
        {
          id: 1303,
          name: "Sủi Cáo Nhân Thịt Phô Mai TH true FOOD 300 g",
          price: 63900,
          image: "images/products/suicaophomai.png",
        },
        {
          id: 1304,
          name: "Bánh Gạo Xốt Phô Mai TH true FOOD 300 g",
          price: 70700,
          image: "images/products/banhgaophomai.png",
        },
        {
          id: 1305,
          name: "Bánh Gạo Mozzarella Xốt Phô Mai TH true FOOD 300 g",
          price: 81500,
          image: "images/products/banhgaomozzarella.png",
        },
        {
          id: 1306,
          name: "Kim Chi Cải Thảo Cắt Lát TH true FOOD 500 g",
          price: 49600,
          image: "images/products/kimchi500.png",
        },
        {
          id: 1307,
          name: "Kim Chi Cải Thảo Cắt Lát TH true FOOD 100 g",
          price: 16500,
          image: "images/products/kimchi100.png",
        },
        {
          id: 1308,
          name: "Chân Giò Xông Khói TH true FOOD 450 g",
          price: 194000,
          image: "images/products/changioxongkhoi.png",
        },
        {
          id: 1309,
          name: "Ba chỉ xông khói TH true FOOD 400 g",
          price: 187900,
          image: "images/products/bachixongkhoi.png",
        },
        {
          id: 1310,
          name: "Giò Lụa TH true FOOD 250 g",
          price: 68000,
          image: "images/products/giolua.png",
        },
        {
          id: 1311,
          name: "Xúc xích thịt Heo bắp TH true FOOD 420 g",
          price: 166000,
          image: "images/products/xucxichheobap.png",
        },
        {
          id: 1312,
          name: "Xúc xích thịt Bò TH true FOOD 420 g",
          price: 166000,
          image: "images/products/xucxichbo.png",
        },
        {
          id: 1313,
          name: "Xúc Xích Thịt Heo TH true FOOD 420 g",
          price: 166000,
          image: "images/products/xucxichheo.png",
        },
        {
          id: 1314,
          name: "Xúc Xích Bơ Tỏi TH true FOOD 450 g",
          price: 129600,
          image: "images/products/xucxichbotoi.png",
        },
        {
          id: 1315,
          name: "Xúc Xích Xông Khói TH true FOOD 450 g",
          price: 93500,
          image: "images/products/xucxichxongkhoi450.png",
        },
        {
          id: 1316,
          name: "Xúc Xích Cocktail TH true FOOD 250 g",
          price: 65400,
          image: "images/products/xucxichcocktail.png",
        },
        {
          id: 1317,
          name: "Xúc Xích Xông Khói TH true FOOD 225 G",
          price: 62600,
          image: "images/products/xucxichxongkhoi225.png",
        },
        {
          id: 1318,
          name: "Cháo Tươi Nhung Hươu Nấm Hương TH true food 240 g",
          price: 38000,
          image: "images/products/chaonhunghuou.png",
        },
        {
          id: 1319,
          name: "Cháo Tươi Sườn Tổ Yến TH true FOOD 240 g",
          price: 45000,
          image: "images/products/chaosuontoyen.png",
        },
        {
          id: 1320,
          name: "Cháo Tươi Gà Chân Chi Hạt Sen 240 g",
          price: 38000,
          image: "images/products/chaogahatsen.png",
        },
        {
          id: 1321,
          name: "Cháo Tươi Thịt Gà Rau Củ TH true FOOD 150 g",
          price: 23000,
          image: "images/products/chaogaraucu.png",
        },
        {
          id: 1322,
          name: "Cháo Tươi Thịt Heo Bí Đỏ TH true FOOD 150 g",
          price: 23000,
          image: "images/products/chaoheobido.png",
        },
        {
          id: 1323,
          name: "Cháo Tươi Thịt Gà Ngô Nấm TH true FOOD 240 g",
          price: 29000,
          image: "images/products/chaogangonam.png",
        },
        {
          id: 1324,
          name: "Cháo Tươi Tôm Phô Mai TH true FOOD 240 g",
          price: 29000,
          image: "images/products/chaotomphomai.png",
        },
      ];
      break;

    case "tiet-trung":
    default:
      pageTitle = "Sữa tươi tiệt trùng";
      displayList =
        typeof tietTrungProducts !== "undefined" && tietTrungProducts.length
          ? tietTrungProducts
          : [
              {
                id: 101,
                name: "Sữa Tươi Tiệt Trùng Nguyên Chất 1L",
                price: 43700,
                image: "images/products/suatiettrungnguyenchat1L.png",
              },
              {
                id: 102,
                name: "Sữa Tươi Tiệt Trùng Ít Đường 1L",
                price: 43700,
                image: "images/products/suatiettrungitduong1L.png",
              },
              {
                id: 103,
                name: "Sữa Tươi Tiệt Trùng Có Đường 1L",
                price: 43700,
                image: "images/products/suatiettrungcoduong1L.png",
              },
              {
                id: 104,
                name: "Sữa Tươi Tiệt Trùng Nguyên Chất 180 ml",
                price: 39100,
                image: "images/products/suatiettrungnguyenchat180.png",
              },
              {
                id: 105,
                name: "Sữa Tươi Tiệt Trùng Ít Đường 180 ml",
                price: 39100,
                image: "images/products/suatiettrungitduong180.jpg",
              },
              {
                id: 106,
                name: "Sữa Tươi Tiệt Trùng Có Đường 180 ml",
                price: 39100,
                image: "images/products/suatiettrungcoduong180.png",
              },
              {
                id: 107,
                name: "Sữa Tươi Tiệt Trùng Hương Dâu Tự Nhiên 180 ml",
                price: 39100,
                image: "images/products/suatiettrungdau180.png",
              },
              {
                id: 108,
                name: "Sữa Tươi Tiệt Trùng Socola Nguyên Chất 180 ml",
                price: 39100,
                image: "images/products/suatiettrungsocola180.png",
              },
              {
                id: 109,
                name: "Sữa Tươi Tiệt Trùng Hương Chuối 180 ml",
                price: 39100,
                image: "images/products/suatiettrungchuoi180.jpg",
              },
              {
                id: 110,
                name: "Sữa Tươi Tiệt Trùng Nguyên Chất 110 ml",
                price: 24900,
                image: "images/products/suatiettrungnguyenchat110.png",
              },
              {
                id: 111,
                name: "Sữa Tươi Tiệt Trùng Ít Đường 110 ml",
                price: 24900,
                image: "images/products/suatiettrungitduong110.png",
              },
              {
                id: 112,
                name: "Sữa Tươi Tiệt Trùng Có Đường 110 ml",
                price: 24900,
                image: "images/products/suatiettrungcoduong110.png",
              },
              {
                id: 113,
                name: "Sữa Tươi Tiệt Trùng Nguyên Chất TH true MILK 220 ml",
                price: 9800,
                image: "images/products/suatiettrungnguyenchat220tui.png",
              },
              {
                id: 114,
                name: "Sữa Tươi Tiệt Trùng Ít Đường TH true MILK 220 ml",
                price: 9800,
                image: "images/products/suatiettrungitduong220tui.png",
              },
              {
                id: 115,
                name: "Sữa Tươi Tiệt Trùng Có Đường TH true MILK 220 ml",
                price: 9800,
                image: "images/products/suatiettrungcoduong220tui.jpg",
              },
              {
                id: 116,
                name: "Sữa Tươi Bổ sung Ngũ Cốc TH true MILK 180 ml",
                price: 49100,
                image: "images/products/suatiettrungngucoc.png",
              },
              {
                id: 117,
                name: "Sữa Tươi Tiệt Trùng TH true MILK HILO 180 ml",
                price: 43000,
                image: "images/products/suatiettrunghilo.png",
              },
              {
                id: 118,
                name: "Sữa Tươi Tiệt Trùng TH true MILK GOLD 180 ml",
                price: 72100,
                image: "images/products/suatiettrunggold.png",
              },
            ];
      break;
  }

  // Đồng bộ danh sách hiển thị với dữ liệu chuẩn trong data.js
  const categoryDataKeys = {
    "tiet-trung": "suatiettrung",
    "thanh-trung": "suathanhtrung",
    "sua-hat": "suahat",
    "sua-chua": "suachua",
    kem: "kem",
    "do-uong": "douonggiaikhat",
    "nuoc-tinh-khiet": "nuoctinhkhiet",
    "bo-phomat": "bo-phomat",
    topkid: "topkid",
    "sua-lua-mach": "thucuongsualuamach",
    "thuc-pham": "thucpham",
  };

  const dataCategory = categoryDataKeys[catKey] || "suatiettrung";

  const sharedProducts = allProducts.filter((product) => product.category === dataCategory);

  // Chỉ dùng dữ liệu chuẩn nếu danh mục có sản phẩm
  if (sharedProducts.length > 0) {
    displayList = [...sharedProducts];
  }

  // Cập nhật tiêu đề danh mục trên trang
  if (titleElement) titleElement.innerText = pageTitle;
  // Sắp xếp sản phẩm theo giá
  const sortSelect = document.getElementById("sort-price");
  const sortOrder = sortSelect ? sortSelect.value : "default";

  if (sortOrder === "asc") {
    displayList.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortOrder === "desc") {
    displayList.sort((a, b) => Number(b.price) - Number(a.price));
  }
  // Dựng bố cục các sản phẩm lên các tầng kệ (mỗi hàng hiển thị 3 sản phẩm)
  let html = "";
  for (let i = 0; i < displayList.length; i += 3) {
    const rowProducts = displayList.slice(i, i + 3);
    let gridHtml = rowProducts
      .map((p) => {
        const displayPrice = p.price ? `${p.price.toLocaleString("vi-VN")} đ` : "43.700 đ";
        return `
        <div class="product-card">
            <div class="product-img-box" onclick="goToDetail(${p.id})">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='images/banners/logo.png'">
            </div>
            <h3 onclick="goToDetail(${p.id})">${p.name}</h3>
            <div class="price">${displayPrice}</div>
            <button onclick="addToCart(${p.id})">Thêm vào giỏ</button>
        </div>
      `;
      })
      .join("");

    html += `
      <div class="shelf-row">
        <div class="product-grid">
          ${gridHtml}
        </div>
        <div class="shelf-board"></div>
      </div>
    `;
  }
  container.innerHTML = html;

  // Kích hoạt hiệu ứng cho sản phẩm vừa được render
  requestAnimationFrame(() => {
    const cards = container.querySelectorAll(".product-card");

    cards.forEach((card, index) => {
      card.style.animationDelay = `${Math.min(index % 3, 2) * 100}ms`;
      card.classList.add("product-card-visible");
    });
  });
}

// 10. Khởi chạy tự động khi trang products.html tải xong DOM
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  updateCartBadge();
  // Cập nhật danh sách khi thay đổi cách sắp xếp giá
  const sortSelect = document.getElementById("sort-price");

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const params = new URLSearchParams(window.location.search);
      const category = params.get("category") || "tiet-trung";
      loadProductsByCategory(category);
    });
  }

  if (document.getElementById("product-shelves-container")) {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category") || "tiet-trung";
    loadProductsByCategory(category);
  }
});

window.addEventListener("popstate", () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category") || "tiet-trung";

  renderCategories();
  loadProductsByCategory(category);
});
