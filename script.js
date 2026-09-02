/* =========================================================
   PETROLOG — JavaScript principal
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     MENU MOBILE
  ========================= */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =========================
     BOTÃO VOLTAR AO TOPO
  ========================= */
  const toTop = document.getElementById('toTop');

  if (toTop) {
    const updateToTop = () => {
      toTop.classList.toggle('show', window.scrollY > 600);
    };

    window.addEventListener('scroll', updateToTop, { passive:true });
    updateToTop();

    toTop.addEventListener('click', () => {
      window.scrollTo({
        top:0,
        behavior:'smooth'
      });
    });
  }

  /* =========================
     ANIMAÇÃO DE ENTRADA
  ========================= */
  const animatedItems = document.querySelectorAll(
    '.stage-card, .panel, .image-card'
  );

  if ('IntersectionObserver' in window && animatedItems.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold:.08 });

    animatedItems.forEach(item => observer.observe(item));
  }

});
