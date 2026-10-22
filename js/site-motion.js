/* =========================================================
   TH true MILK — SITE MOTION
   Hiệu ứng bổ sung, không thay thế products.js
   ========================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function initReveal() {
    const targets = document.querySelectorAll(
      [
        ".category-slider-container",
        ".main-section-title",
        "#featured-products-container",
        ".middle-banner-section",
        ".th-truemart-section",
        ".health-corner-section",
        ".media-section",
        ".hero-content",
        ".banner-section",
        ".category-slider-section",
        ".product-section",
        ".shelf-row",
        ".site-footer",
        ".site-footer .footer-top-grid",
      ].join(","),
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((element) => {
        element.classList.remove("motion-pending");
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          entry.target.classList.remove("motion-pending");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      },
    );

    targets.forEach((element, index) => {
      document.documentElement.classList.add("motion-ready");
      // Tránh thêm hiệu ứng lặp cho cùng một phần tử.
      if (element.classList.contains("reveal-on-scroll")) return;

      element.classList.add("reveal-on-scroll");
      element.style.setProperty("--reveal-delay", `${(index % 4) * 75}ms`);

      observer.observe(element);
    });
  }

  function initProductCards() {
    // Theo dõi sản phẩm ở cả trang chủ và trang danh mục.
    const containers = [
      document.getElementById("featured-products-container"),
      document.getElementById("product-shelves-container"),
    ].filter(Boolean);

    if (reduceMotion) return;

    containers.forEach((container) => {
      const animateCards = () => {
        const cards = container.querySelectorAll(".product-card");

        cards.forEach((card, index) => {
          card.style.setProperty("--reveal-delay", `${Math.min(index, 6) * 70}ms`);

          if (reduceMotion) return;

          if (card.dataset.motionCardReady === "true") return;
          card.dataset.motionCardReady = "true";

          // Cho phép trình duyệt nhận trạng thái ban đầu trước khi chạy animation.
          requestAnimationFrame(() => {
            card.classList.add("product-reveal", "product-reveal-visible");
          });
        });
      };

      animateCards();

      const observer = new MutationObserver(() => {
        animateCards();
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
      });
    });
  }

  function initCardLight() {
    if (!finePointer || reduceMotion) return;

    document.addEventListener(
      "pointermove",
      (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const card = target.closest(".product-shelves-wrapper .product-card");

        if (!card) return;

        const rect = card.getBoundingClientRect();

        card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);

        card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
      },
      { passive: true },
    );
  }

  function initCategoryKeyboard() {
    document.querySelectorAll(".category-icon-item").forEach((item) => {
      if (!item.hasAttribute("tabindex")) {
        item.setAttribute("tabindex", "0");
      }

      if (!item.hasAttribute("role")) {
        item.setAttribute("role", "button");
      }

      if (item.dataset.motionKeyboardReady === "true") return;
      item.dataset.motionKeyboardReady = "true";

      item.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        item.click();
      });
    });
  }

  function boot() {
    initReveal();
    initProductCards();
    initCardLight();
    initCategoryKeyboard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
