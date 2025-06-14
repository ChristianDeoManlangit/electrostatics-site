// Mobile menu toggle for sidebar
const menuBtn = document.querySelector('.mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');

if (menuBtn && sidebar) {
  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
  // Close sidebar when clicking outside (mobile only)
  document.addEventListener('click', (e) => {
    if (
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      sidebar.classList.remove('open');
    }
  });
}

// Optional: Animate cards on load
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach((card, i) => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.6s cubic-bezier(.4,1.4,.6,1), transform 0.6s cubic-bezier(.4,1.4,.6,1)';
      card.style.opacity = 1;
      card.style.transform = 'translateY(0)';
    }, 200 + i * 120);
  });
});