function openMenu() {
  document.querySelector(".header__nav").classList.add("active");
  document.querySelector(".header__menu-toggle").classList.add("hide");
}

function closeMenu() {
  document.querySelector(".header__nav").classList.remove("active");
  document.querySelector(".header__menu-toggle").classList.remove("hide");
}

// Reset nếu resize lại
window.addEventListener("resize", () => {
  const menuToggle = document.querySelector(".header__menu-toggle");
  const nav = document.querySelector(".header__nav");

  if (window.innerWidth > 1080) {
    nav.classList.remove("active");
    menuToggle.classList.remove("hide");
  }
});

// Sticky header khi cuộn trang
window.addEventListener("scroll", () => {
  const header = document.getElementById("main-header");
  if (window.scrollY > 50) {
    header.classList.add("fixed");
  } else {
    header.classList.remove("fixed");
  }
});
