const openBtn = document.getElementById('nav-open');
const closeBtn = document.getElementById('nav-close');
const nav = document.querySelector('.nav');
const navOverlay = document.querySelector('.nav__overlay');
const siteHeader = document.querySelector('.site-head');

function closeMenu () {
    nav.classList.remove('nav--open');
    openBtn.setAttribute('aria-expanded', false);
}

openBtn.addEventListener('click', () => {
    openBtn.setAttribute('aria-expanded', true);
    nav.classList.add('nav--open');
    navOverlay.addEventListener('click', closeMenu);
});

closeBtn.addEventListener('click', () => {
    closeMenu();
    navOverlay.removeEventListener('click', closeMenu);
});

const resizeObserver = new ResizeObserver(() => {
    if (siteHeader.getBoundingClientRect().width) {
        closeMenu();
        navOverlay.removeEventListener('click', closeMenu);
    }
});

resizeObserver.observe(siteHeader);