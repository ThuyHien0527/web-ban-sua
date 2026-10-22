/* ==========================================================================
   FILE: js/detail.js
   DÙNG CHO TRANG: detail.html
   MÔ TẢ: Đọc ID sản phẩm từ URL, tìm kiếm thông tin chi tiết trong kho (data.js 
          hoặc danh sách mặc định), render bố cục 2 cột (Ảnh, bảng dinh dưỡng, 
          7 thẻ đặc điểm thương hiệu) và xử lý thêm sản phẩm vào giỏ hàng.
   ========================================================================== */

// 1. Tự động chạy khi trang detail.html tải xong nội dung DOM
document.addEventListener("DOMContentLoaded", () => {
  // Vẽ thanh trượt danh mục sản phẩm ở đầu trang
  renderCategorySlider();

  // Đọc tham số 'id' trên đường dẫn URL (Ví dụ: detail.html?id=101)
  const urlParams = new URLSearchParams(window.location.search);
  const rawId = urlParams.get("id");
  const productId = rawId ? Number(rawId) : 101;

  // Danh sách dữ liệu mẫu dự phòng (phòng khi data.js chưa kịp load)
  const defaultList = [
    {
      id: 101,
      name: "Sữa Tươi Tiệt Trùng Nguyên Chất 1 Lít",
      price: 43700,
      image: "images/products/suatiettrungnguyenchat1L.png",
      description: "Sản phẩm chính hãng từ TH true MILK",
      packing: "Hộp giấy",
      volume: "1 lít",
      hsd: "240 ngày",
      energy: "63,2 kcal",
      protein: "3,1 g",
      carbs: "4,6 g",
      fat: "3,6 g",
      sodium: "36 mg",
      calcium: "104 mg",
    },
    {
      id: 102,
      name: "Sữa Tươi Tiệt Trùng Ít Đường 1 Lít",
      price: 43700,
      image: "images/products/suatiettrungitduong1L.png",
      description: "Sản phẩm chính hãng từ TH true MILK",
      packing: "Hộp giấy",
      volume: "1 lít",
      hsd: "240 ngày",
      energy: "60,0 kcal",
      protein: "3,0 g",
      carbs: "4,2 g",
      fat: "3,2 g",
      sodium: "35 mg",
      calcium: "100 mg",
    },
    {
      id: 103,
      name: "Sữa Tươi Tiệt Trùng Có Đường 1 Lít",
      price: 43700,
      image: "images/products/suatiettrungcoduong1L.png",
      description: "Sản phẩm chính hãng từ TH true MILK",
      packing: "Hộp giấy",
      volume: "1 lít",
      hsd: "240 ngày",
      energy: "70,0 kcal",
      protein: "3,1 g",
      carbs: "7,5 g",
      fat: "3,3 g",
      sodium: "36 mg",
      calcium: "104 mg",
    },
    {
      id: 1,
      name: "Cà Rì Bò TH TRUE FOOD 300g",
      price: 65000,
      image: "images/products/caribo.png",
      description: "Sản phẩm chính hãng từ TH true MILK",
      packing: "Khay nhựa",
      volume: "300g",
      hsd: "30 ngày",
      energy: "180 kcal",
      protein: "12 g",
      carbs: "8 g",
      fat: "10 g",
      sodium: "450 mg",
      calcium: "20 mg",
    },
    {
      id: 2,
      name: "Bò Kho Rau Củ TH TRUE FOOD 200g",
      price: 58000,
      image: "images/products/bokhoraucu.png",
      description: "Sản phẩm chính hãng từ TH true MILK",
      packing: "Khay nhựa",
      volume: "200g",
      hsd: "30 ngày",
      energy: "150 kcal",
      protein: "10 g",
      carbs: "6 g",
      fat: "8 g",
      sodium: "400 mg",
      calcium: "18 mg",
    },
    {
      id: 3,
      name: "Cháo Tươi Nhung Hươu Nấm Hương TH true FOOD 240 g",
      price: 32000,
      image: "images/products/chaonhunghuou.png",
      description: "Sản phẩm chính hãng từ TH true MILK",
      packing: "Túi chịu nhiệt",
      volume: "240 g",
      hsd: "12 tháng",
      energy: "110 kcal",
      protein: "4.5 g",
      carbs: "18 g",
      fat: "2.5 g",
      sodium: "320 mg",
      calcium: "15 mg",
    },
    {
      id: 4,
      name: "Cháo Tươi Sườn Tổ Yến TH true FOOD 240 g",
      price: 35000,
      image: "images/products/chaosuontoyen.png",
      description: "Sản phẩm chính hãng từ TH true MILK",
      packing: "Túi chịu nhiệt",
      volume: "240 g",
      hsd: "12 tháng",
      energy: "125 kcal",
      protein: "5.0 g",
      carbs: "19 g",
      fat: "3.0 g",
      sodium: "310 mg",
      calcium: "18 mg",
    },
    {
      id: 5,
      name: "Cháo Tươi Gà Chân Chi Hạt Sen TH true FOOD 240 g",
      price: 32000,
      image: "images/products/chaogahatsen.png",
      description: "Sản phẩm chính hãng từ TH true MILK",
      packing: "Túi chịu nhiệt",
      volume: "240 g",
      hsd: "12 tháng",
      energy: "115 kcal",
      protein: "4.8 g",
      carbs: "18.5 g",
      fat: "2.6 g",
      sodium: "300 mg",
      calcium: "16 mg",
    },
  ];

  // Lấy dữ liệu từ allProducts (trong data.js), nếu không có thì dùng defaultList
  let dataset =
    typeof allProducts !== "undefined" && allProducts.length > 0 ? allProducts : defaultList;

  // Tìm sản phẩm khớp với ID trên URL, nếu không thấy lấy mặc định phần tử đầu tiên
  let product =
    dataset.find((p) => p.id === productId) ||
    defaultList.find((p) => p.id === productId) ||
    defaultList[0];

  // Tìm khung chứa chi tiết sản phẩm trên file detail.html
  const container = document.getElementById("product-detail-container");
  if (!container) return;

  // Định dạng giá tiền theo chuẩn Việt Nam (Ví dụ: 43.700 đ)
  const priceFormatted = product.price ? product.price.toLocaleString("vi-VN") + " đ" : "43,700 đ";

  // Đổ nội dung HTML chi tiết sản phẩm ra giao diện (Bố cục 2 cột)
  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1.1fr; gap: 35px; max-width: 1200px; margin: 20px auto 50px auto; padding: 0 10px; align-items: start;">
      
      <!-- CỘT TRÁI: THÔNG TIN SẢN PHẨM, ẢNH, GIÁ & BẢNG DINH DƯỠNG -->
      <div style="display: flex; flex-direction: column; gap: 25px;">
        
        <!-- Ô 1: Ảnh + Tên sản phẩm + Giá + Nút Đặt Hàng -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; display: flex; flex-direction: column;">
          <div style="width: 100%; height: 350px; display: flex; align-items: center; justify-content: center; margin-bottom: 25px;">
            <img src="${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.src='images/banners/logo.png'">
          </div>
          <h1 style="font-size: 22px; color: #111111; font-weight: 700; margin: 0 0 8px 0;">${product.name}</h1>
          <p style="font-size: 13px; color: #666666; margin: 0 0 15px 0;">${product.description || "Sản phẩm chính hãng từ TH true MILK"}</p>
          <div style="font-size: 22px; color: #d32f2f; font-weight: 700; margin-bottom: 20px;">${priceFormatted}</div>
          <!-- Nút bấm gọi hàm thêm vào giỏ hàng -->
          <button onclick="addToCartDetail(${product.id})" style="width: 100%; height: 46px; background-color: #004b87; color: #ffffff; border: none; font-size: 15px; font-weight: 700; border-radius: 6px; cursor: pointer;">Thêm vào giỏ</button>
        </div>

        <!-- Ô 2: Quy cách đóng gói, Hướng dẫn bảo quản & Bảng Thành phần dinh dưỡng -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; font-size: 13px; color: #444444; line-height: 1.6;">
          
          <div style="display: flex; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px dashed #e2e8f0; margin-bottom: 12px;">
            <span style="color: #666; display: flex; align-items: center; gap: 8px;"><i class="fa fa-box" style="color:#004b87;"></i> Quy cách đóng gói</span>
            <span style="font-weight: 600; color: #111;">${product.packing || "Hộp giấy"}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px;">
            <span style="color: #666; display: flex; align-items: center; gap: 8px;"><i class="fa fa-tint" style="color:#004b87;"></i> Dung tích</span>
            <span style="font-weight: 600; color: #111;">${product.volume || "1 lít"}</span>
          </div>

          <ul style="padding-left: 18px; margin: 0 0 20px 0; color: #555555; line-height: 1.7;">
            <li>Hoàn toàn từ sữa tươi sạch, nguyên chất, theo chuẩn của Trang trại TH.</li>
            <li>Được sản xuất theo một quy trình sạch, khép kín từ đồng cỏ đến bàn ăn.</li>
            <li>Không sử dụng chất bảo quản.</li>
          </ul>

          <h4 style="font-size: 13.5px; color: #111; font-weight: 700; margin: 0 0 8px 0;">Hướng dẫn bảo quản và sử dụng:</h4>
          <p style="margin: 0 0 6px 0;">- Bảo quản nơi khô ráo và thoáng mát.</p>
          <p style="margin: 0 0 6px 0;">- Sau khi mở hộp, bảo quản lạnh ở 4°C - 10°C và sử dụng hết trong vòng 3 ngày.</p>
          <p style="margin: 0 0 6px 0;">- Ngon hơn khi uống lạnh.</p>
          <p style="margin: 0 0 6px 0;">- Sản phẩm có chứa sữa.</p>
          <p style="margin: 0 0 20px 0; font-weight: 600;">HSD: ${product.hsd || "240 ngày"}</p>

          <h4 style="font-size: 13.5px; color: #111; font-weight: 700; margin: 0 0 12px 0; border-top: 1px solid #e2e8f0; padding-top: 15px;">Thành phần dinh dưỡng trung bình trong 100 ml:</h4>
          
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f5f5f5; padding-bottom: 4px;">
              <span>Năng lượng</span>
              <span style="font-weight: 600;">${product.energy || "63,2 kcal"}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f5f5f5; padding-bottom: 4px;">
              <span>Chất đạm</span>
              <span style="font-weight: 600;">${product.protein || "3,1 g"}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f5f5f5; padding-bottom: 4px;">
              <span>Carbohydrat</span>
              <span style="font-weight: 600;">${product.carbs || "4,6 g"}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f5f5f5; padding-bottom: 4px;">
              <span>Chất béo</span>
              <span style="font-weight: 600;">${product.fat || "3,6 g"}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f5f5f5; padding-bottom: 4px;">
              <span>Natri</span>
              <span style="font-weight: 600;">${product.sodium || "36 mg"}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Calci</span>
              <span style="font-weight: 600;">${product.calcium || "104 mg"}</span>
            </div>
          </div>

        </div>

      </div>

      <!-- CỘT PHẢI: 7 THẺ ĐẶC ĐIỂM THƯƠNG HIỆU & BẢNG TỔNG QUAN SẢN PHẨM TH -->
      <div style="display: flex; flex-direction: column; gap: 15px;">
        
        <!-- Thẻ 1 -->
        <div style="position: relative; background: #ffffff; border-left: 5px solid #004b87; border-top: 1px solid #f0f0f0; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; padding: 20px 22px; border-radius: 0 10px 10px 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <span style="position: absolute; right: 15px; top: 10px; font-size: 65px; font-weight: 800; color: #f1f5f9; line-height: 1; user-select: none;">1</span>
          <h3 style="font-size: 15px; color: #004b87; font-weight: 700; margin: 0 0 8px 0;">Giống bò sữa cao sản</h3>
          <p style="font-size: 12.5px; color: #555555; line-height: 1.5; margin: 0; padding-right: 35px;">Đàn bò được nhập khẩu trực tiếp từ New Zealand, Mỹ, Úc... có phả hệ rõ ràng, chọn lọc kỹ lưỡng cho ra nguồn sữa tươi chất lượng hàng đầu.</p>
        </div>

        <!-- Thẻ 2 -->
        <div style="position: relative; background: #ffffff; border-left: 5px solid #004b87; border-top: 1px solid #f0f0f0; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; padding: 20px 22px; border-radius: 0 10px 10px 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <span style="position: absolute; right: 15px; top: 10px; font-size: 65px; font-weight: 800; color: #f1f5f9; line-height: 1; user-select: none;">2</span>
          <h3 style="font-size: 15px; color: #004b87; font-weight: 700; margin: 0 0 8px 0;">Dinh dưỡng hoàn toàn tự nhiên</h3>
          <p style="font-size: 12.5px; color: #555555; line-height: 1.5; margin: 0; padding-right: 35px;">Hoàn toàn tự chủ về nguồn thức ăn sạch đạt chuẩn quốc tế. Trang trại ứng dụng công nghệ vi sinh và tự động hóa tiên tiến hàng đầu thế giới.</p>
        </div>

        <!-- Thẻ 3 -->
        <div style="position: relative; background: #ffffff; border-left: 5px solid #004b87; border-top: 1px solid #f0f0f0; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; padding: 20px 22px; border-radius: 0 10px 10px 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <span style="position: absolute; right: 15px; top: 10px; font-size: 65px; font-weight: 800; color: #f1f5f9; line-height: 1; user-select: none;">3</span>
          <h3 style="font-size: 15px; color: #004b87; font-weight: 700; margin: 0 0 8px 0;">Nhà máy chế biến hiện đại</h3>
          <p style="font-size: 12.5px; color: #555555; line-height: 1.5; margin: 0; padding-right: 35px;">Nhà máy Sữa tươi sạch TH có quy mô và công nghệ tự động hóa hàng đầu châu Á, trang thiết bị nhập khẩu trực tiếp từ các tập đoàn lớn ở G7 và Châu Âu.</p>
        </div>

        <!-- Thẻ 4 -->
        <div style="position: relative; background: #ffffff; border-left: 5px solid #10b981; border-top: 1px solid #f0f0f0; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; padding: 20px 22px; border-radius: 0 10px 10px 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <span style="position: absolute; right: 15px; top: 10px; font-size: 65px; font-weight: 800; color: #f1f5f9; line-height: 1; user-select: none;">4</span>
          <h3 style="font-size: 15px; color: #10b981; font-weight: 700; margin: 0 0 8px 0;">💡 Giá trị dinh dưỡng vượt trội</h3>
          <p style="font-size: 12.5px; color: #555555; line-height: 1.5; margin: 0; padding-right: 35px;">Sữa tươi TH true MILK cung cấp nguồn canxi tự nhiên, protein chất lượng cao cùng các vitamin nhóm B giúp phát triển chiều cao, tăng cường thể lực và hệ miễn dịch toàn diện mỗi ngày.</p>
        </div>

        <!-- Thẻ 5 -->
        <div style="position: relative; background: #ffffff; border-left: 5px solid #004b87; border-top: 1px solid #f0f0f0; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; padding: 20px 22px; border-radius: 0 10px 10px 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <span style="position: absolute; right: 15px; top: 10px; font-size: 65px; font-weight: 800; color: #f1f5f9; line-height: 1; user-select: none;">5</span>
          <h3 style="font-size: 15px; color: #004b87; font-weight: 700; margin: 0 0 8px 0;">Quy trình quản lý chuẩn quốc tế</h3>
          <p style="font-size: 12.5px; color: #555555; line-height: 1.5; margin: 0; padding-right: 35px;">Áp dụng tiêu chuẩn quản lý chất lượng ISO 9001, BRC, và FSSC 22000 trong toàn bộ chuỗi sản xuất, từ khâu quản trị trang trại tới khâu thành phẩm đến tay người tiêu dùng.</p>
        </div>

        <!-- Thẻ 6 -->
        <div style="position: relative; background: #ffffff; border-left: 5px solid #004b87; border-top: 1px solid #f0f0f0; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; padding: 20px 22px; border-radius: 0 10px 10px 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <span style="position: absolute; right: 15px; top: 10px; font-size: 65px; font-weight: 800; color: #f1f5f9; line-height: 1; user-select: none;">6</span>
          <h3 style="font-size: 15px; color: #004b87; font-weight: 700; margin: 0 0 8px 0;">Thân thiện và phát triển bền vững</h3>
          <p style="font-size: 12.5px; color: #555555; line-height: 1.5; margin: 0; padding-right: 35px;">Tiên phong áp dụng mô hình kinh tế tuần hoàn, ưu tiên sử dụng bao bì nhựa sinh học thân thiện môi trường và hệ thống xử lý chất thải hiện đại bảo vệ hệ sinh thái tự nhiên.</p>
        </div>

        <!-- Thẻ 7 -->
        <div style="position: relative; background: #ffffff; border-left: 5px solid #10b981; border-top: 1px solid #f0f0f0; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; padding: 20px 22px; border-radius: 0 10px 10px 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <span style="position: absolute; right: 15px; top: 10px; font-size: 65px; font-weight: 800; color: #f1f5f9; line-height: 1; user-select: none;">7</span>
          <h3 style="font-size: 15px; color: #10b981; font-weight: 700; margin: 0 0 8px 0;">🌱 Phân phối rộng khắp & Dịch vụ tận tâm</h3>
          <p style="font-size: 12.5px; color: #555555; line-height: 1.5; margin: 0; padding-right: 35px;">Hệ thống chuỗi cửa hàng TH true mart trên toàn quốc cùng dịch vụ giao hàng tận nhà nhanh chóng, đảm bảo sản phẩm luôn giữ tròn vị tươi ngon khi đến tay khách hàng.</p>
        </div>

        <!-- Ô hình ảnh các dòng sản phẩm thương hiệu TH -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; margin-top: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <h4 style="font-size: 14px; color: #004b87; font-weight: 700; margin: 0 0 15px 0;">CÁC DÒNG SẢN PHẨM THƯƠNG HIỆU TH</h4>
          <img src="images/banners/th_brands.png" alt="Các dòng sản phẩm TH" style="width: 100%; height: auto; object-fit: contain; border-radius: 6px;" onerror="this.src='images/banners/th_brands.png'">
        </div>

      </div>

    </div>
  `;

  // Cập nhật lại số lượng badge giỏ hàng trên Header
  updateCartBadge();
});

// 2. Hàm vẽ thanh trượt icon danh mục sản phẩm ngang ở đầu trang
function renderCategorySlider() {
  const container = document.getElementById("categoryIconsScroll");
  if (!container) return;

  const cats = [
    { name: "Sữa tươi tiệt trùng", image: "images/products/suatiettrungnguyenchat1L.png" },
    { name: "Sữa tươi thanh trùng", image: "images/products/suathanhtrungnguyenchat.png" },
    { name: "Sữa hạt", image: "images/products/suahatoccho.png" },
    { name: "Sữa chua", image: "images/products/suachuaanitbeo.png" },
    { name: "Kem", image: "images/products/kemocquevani.png" },
    { name: "Đồ uống giải khát", image: "images/nuoctaotunhien.png" },
    { name: "Nước tinh khiết", image: "images/products/nuoctinhkiet500.png" },
    { name: "Bơ - Phomat", image: "images/products/bonhattunhien.png" },
    { name: "TOPKID", image: "images/products/suatopkid.png" },
  ];

  container.innerHTML = cats
    .map(
      (c) => `
    <div class="category-icon-item" onclick="window.location.href='products.html'" style="flex: 0 0 105px; text-align: center; cursor: pointer; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff;">
      <img src="${c.image}" alt="${c.name}" style="width: 40px; height: 40px; object-fit: contain; margin-bottom: 5px;" onerror="this.src='images/banners/logo.png'">
      <p style="font-size: 11px; color: #333; margin: 0;">${c.name}</p>
    </div>
  `,
    )
    .join("");
}

// 3. Hàm trượt danh mục qua trái / phải qua nút mũi tên
function scrollCategories(direction) {
  const container = document.getElementById("categoryIconsScroll");
  if (container) {
    container.scrollBy({ left: direction * 200, behavior: "smooth" });
  }
}

// 4. Hàm thêm sản phẩm vào giỏ hàng ngay tại trang chi tiết
function addToCartDetail(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let dataset = typeof allProducts !== "undefined" ? allProducts : [];
  const product = dataset.find((p) => p.id === Number(id));

  if (!product) {
    alert("Không tìm thấy sản phẩm. Vui lòng quay lại danh sách sản phẩm.");
    return;
  }

  // Kiểm tra xem sản phẩm đã có trong giỏ hàng trước đó chưa
  let existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += 1; // Nếu có rồi tăng số lượng lên 1
  } else {
    // Nếu chưa có thì thêm mới vào mảng
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price || 43700,
      image: product.image || "images/banners/logo.png",
      quantity: 1,
    });
  }

  // Lưu ngược vào localStorage và thông báo
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
  updateCartBadge();
}

// 5. Cập nhật số lượng hiển thị trên icon giỏ hàng ở Header
function updateCartBadge() {
  const badge = document.getElementById("cart-count-badge");
  if (!badge) return;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  badge.innerText = total;
}
