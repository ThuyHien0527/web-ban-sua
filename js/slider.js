/* ==========================================================================
   FILE: js/slider.js
   DÙNG CHO TRANG: index.html
   MÔ TẢ: Xử lý Banner Slider chạy tự động, chuyển ảnh qua nút bấm (Previous / Next),
          và tạm dừng khi người dùng đưa chuột vào vùng banner.
   ========================================================================== */

// Biến lưu trữ vị trí index của ảnh hiện tại (bắt đầu từ 0)
let currentSlideIndex = 0;
// Biến lưu trữ hàm đếm thời gian tự động trượt ảnh (setInterval)
let slideInterval = null;

// Mảng chứa danh sách đường dẫn các bức ảnh banner quảng cáo
const bannerSlides = [
  "images/banners/banner_1.jpg",
  "images/banners/banner_2.jpg",
  "images/banners/banner_3.jpg",
  "images/banners/banner_4.png",
  "images/banners/banner_5.png",
  "images/banners/banner_6.png",
];

// 1. Hàm hiển thị ảnh banner theo chỉ số index truyền vào
function showSlide(index) {
  const bannerImg = document.getElementById("bannerImage");
  if (!bannerImg) return; // Nếu không tìm thấy thẻ ảnh trên trang thì thoát hàm

  // Kiểm soát giới hạn vòng lặp mảng:
  if (index >= bannerSlides.length) {
    currentSlideIndex = 0; // Nếu vượt quá ảnh cuối -> quay về ảnh đầu tiên
  } else if (index < 0) {
    currentSlideIndex = bannerSlides.length - 1; // Nếu lùi quá ảnh đầu -> nhảy về ảnh cuối cùng
  } else {
    currentSlideIndex = index; // Gán chỉ số index bình thường
  }
  const nextSrc = bannerSlides[currentSlideIndex];

  if (bannerImg.src.endsWith(nextSrc)) return;

  bannerImg.classList.add("is-changing");

  const preloadImage = new Image();

  preloadImage.onload = () => {
    bannerImg.src = nextSrc;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bannerImg.classList.remove("is-changing");
      });
    });
  };

  preloadImage.onerror = () => {
    bannerImg.classList.remove("is-changing");
  };

  preloadImage.src = nextSrc;
}

// 2. Hàm chuyển sang ảnh tiếp theo (dùng cho nút mũi tên ❯)
function nextSlide() {
  showSlide(currentSlideIndex + 1);
}

// 3. Hàm quay lại ảnh trước đó (dùng cho nút mũi tên ❮)
function prevSlide() {
  showSlide(currentSlideIndex - 1);
}

// 4. Hàm khởi động chế độ tự động chạy slide
function startAutoSlide() {
  if (slideInterval) clearInterval(slideInterval); // Xóa bộ đếm cũ nếu có để tránh bị lồng lịch chạy nhanh hơn
  slideInterval = setInterval(nextSlide, 2000);
}

// 5. Hàm dừng chế độ tự động chạy slide
function stopAutoSlide() {
  if (slideInterval) clearInterval(slideInterval);
}

// 6. Tự động kích hoạt slider ngay khi trang index.html tải xong
document.addEventListener("DOMContentLoaded", () => {
  const bannerSection = document.querySelector(".banner-section");
  if (bannerSection) {
    showSlide(0); // Hiển thị bức ảnh đầu tiên (index = 0)
    startAutoSlide(); // Bắt đầu chạy tự động

    // Hiệu ứng tương tác: Rê chuột vào vùng banner thì dừng chạy tự động (để người dùng đọc nội dung)
    bannerSection.addEventListener("mouseenter", stopAutoSlide);
    // Rời chuột ra khỏi vùng banner thì tiếp tục chạy tự động bình thường
    bannerSection.addEventListener("mouseleave", startAutoSlide);
  }
});
