function openMenu() {
  document.querySelector("ul.nav").classList.add("active");
  document.querySelector(".menu-toggle").classList.add("hide");
}

function closeMenu() {
  document.querySelector("ul.nav").classList.remove("active");
  document.querySelector(".menu-toggle").classList.remove("hide");
}

// Reset nếu resize lại
window.addEventListener("resize", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("ul.nav");

  if (window.innerWidth > 1080) {
    nav.classList.remove("active");
    menuToggle.classList.remove("hide");
  }
});
// Xử lý khi resize lại cửa sổ
window.addEventListener("resize", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("ul.nav");

  if (window.innerWidth > 1080) {
    // Reset về trạng thái desktop
    nav.classList.remove("active");
    menuToggle.classList.remove("hide");
  }
});

window.addEventListener("scroll", function () {
  const header = document.getElementById("main-header");
  if (window.scrollY > 50) {
    header.classList.add("fixed");
  } else {
    header.classList.remove("fixed");
  }
});
