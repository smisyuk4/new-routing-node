(() => {
  const refs = {
    burgerMenuBtn: document.querySelector('.burger__menu'),
    burgerCloseBtn: document.querySelector('.burger__close'),
    burgerMenu: document.querySelector('.burger__modal'),

    mainContent: document.querySelector('main'),
    burgerMenuLinks: document.querySelectorAll('.burger__modal-link'),
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
})();

//const btn = $('#up');

//$(window).scroll(function () {
//  if ($(window).scrollTop() > 300) {
//    btn.addClass('show');
//  } else {
//    btn.removeClass('show');
//  }
//});

//btn.on('click', function (e) {
//  e.preventDefault();
//  $('html, body').animate({ scrollTop: 0 }, '300');
//});

//{/*<a id="up"></a>*/}

//window.addEventListener('DOMContentLoaded', () => {
//  const refs = {
//    burgerMenuBtn: document.querySelector('.burger__menu'),
//    burgerCloseBtn: document.querySelector('.burger__close'),
//    burgerMenu: document.querySelector('.burger__modal'),
//    mainContent: document.querySelector('main'),
//    burgerMenuLink: document.querySelector('#link'),
//  };

//  const toggleBurgerMenu = () => {
//    refs.burgerMenu.classList.toggle('is-open');
//  };

//  const handleCloseBurgerMenu = () => {
//    refs.burgerMenu.classList.remove('is-open');
//    console.log('click main');
//  };

//  refs.burgerMenuBtn.addEventListener('click', toggleBurgerMenu);
//  refs.burgerCloseBtn.addEventListener('click', toggleBurgerMenu);
//  refs.mainContent.addEventListener('click', handleCloseBurgerMenu);
//  refs.burgerMenuLink.addEventListener('click', handleCloseBurgerMenu);
//});
