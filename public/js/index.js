(() => {
  const refs = {
    burgerMenuBtn: document.querySelector('.burger__menu'),
    burgerCloseBtn: document.querySelector('.burger__close'),
    burgerMenu: document.querySelector('.burger__modal'),
    mainContent: document.querySelector('main'),
    burgerMenuLinks: document.querySelectorAll('.burger__modal-link'),
    scrollUpBtn: document.querySelector('.scroll-up'),
  };

  const toggleBurgerMenu = () => {
    refs.burgerMenu.classList.toggle('is-open');
  };

  const handleCloseBurgerMenu = (event) => {
    refs.burgerMenu.classList.remove('is-open');
  };

  refs.burgerMenuBtn.addEventListener('click', toggleBurgerMenu);
  refs.burgerCloseBtn.addEventListener('click', toggleBurgerMenu);
  refs.mainContent.addEventListener('click', handleCloseBurgerMenu);
  refs.burgerMenuLinks.forEach((link) => {
    link.addEventListener('click', handleCloseBurgerMenu);
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      refs.scrollUpBtn.classList.add('is-show');
    } else {
      refs.scrollUpBtn.classList.remove('is-show');
    }
  });

  refs.scrollUpBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
