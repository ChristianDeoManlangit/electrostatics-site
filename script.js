// Minimal JS for subtle animations and interactivity
// Add hover/focus effects, and future enhancements

document.addEventListener('DOMContentLoaded', () => {
  // Animate cards on load
  document.querySelectorAll('.card').forEach((card, i) => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(24px) scale(0.98)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.6s cubic-bezier(.44,0,.56,1), transform 0.6s cubic-bezier(.44,0,.56,1)';
      card.style.opacity = 1;
      card.style.transform = 'translateY(0) scale(1)';
    }, 200 + i * 120);
  });
});
