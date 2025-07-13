function smoothScrollTo(targetY, duration = 800) {
  const startY = window.scrollY;
  const change = targetY - startY;
  const startTime = performance.now();

  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease =
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

    window.scrollTo(0, startY + change * ease);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

document.querySelectorAll('header a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 70; // trừ header
      smoothScrollTo(offsetTop, 1000); // 1000ms = 1 giây
    }
  });
});
