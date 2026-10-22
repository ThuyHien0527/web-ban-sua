document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealTargets = document.querySelectorAll(
    [
      ".category-slider-container",
      ".main-section-title",
      "#featured-products-container",
      ".middle-banner-section",
      ".th-truemart-section",
      ".health-corner-section",
      ".media-section",
      ".site-footer",
    ].join(","),
  );

  const productContainers = document.querySelectorAll(
    "#featured-products-container, #product-shelves-container",
  );

  // Tôn trọng cài đặt giảm chuyển động của người dùng.
  if (reduceMotion) return;

  // Nếu trình duyệt không hỗ trợ observer, giữ nội dung hiển thị bình thường.
  if (!("IntersectionObserver" in window)) return;

  // Hiệu ứng xuất hiện khi cuộn.
  revealTargets.forEach((element) => {
    element.classList.add("reveal-on-scroll");
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px",
    },
  );

  revealTargets.forEach((element) => revealObserver.observe(element));

  // Chỉ bật chế độ ẩn ban đầu sau khi đã thiết lập observer.
  document.documentElement.classList.add("motion-ready");

  // Hiệu ứng xuất hiện lần lượt cho sản phẩm được render động.
  function animateProductCards(container) {
    const cards = container.querySelectorAll(".product-card:not([data-motion-initialized])");

    cards.forEach((card) => {
      card.dataset.motionInitialized = "true";
      card.classList.add("product-reveal");

      const allCards = container.querySelectorAll(".product-card");
      const index = Array.prototype.indexOf.call(allCards, card);

      card.style.setProperty("--reveal-delay", `${Math.min(index, 7) * 65}ms`);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.classList.add("product-reveal-visible");
        });
      });
    });
  }

  productContainers.forEach((container) => {
    // Xử lý sản phẩm đã có sẵn.
    animateProductCards(container);

    // Theo dõi sản phẩm được thêm hoặc render lại sau khi đổi danh mục.
    const productObserver = new MutationObserver(() => {
      animateProductCards(container);
    });

    productObserver.observe(container, {
      childList: true,
      subtree: true,
    });
  });
});
