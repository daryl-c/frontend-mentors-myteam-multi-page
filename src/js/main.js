const openBtn = document.getElementById('nav-open');
const closeBtn = document.getElementById('nav-close');
const nav = document.querySelector('.nav');
const navOverlay = document.querySelector('.nav__overlay');
const navList = nav.querySelector('.nav__inner');
const siteHeader = document.querySelector('.site-head');

const BREAKPOINT_TAB_PORT = 48 * 16;
const BREAKPOINT_DESKTOP_SMALL = 90 * 16;
const KEY_CODE_MAP = {
    ESCAPE: 'Escape',
    TAB: 'Tab'
};

const getAllFocusableElements = parent => {
    if (!parent) {
        console.warn('You need to pass a parent HTMLElement');
        return []; // Return array so length queries will work
    }

    return parent.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)'
    );
};

function trapFocus(event) {
    if (event.key === KEY_CODE_MAP.ESCAPE) {
        closeMenu();
    }
    const focusables = getAllFocusableElements(nav.querySelector('.nav__inner'));
    const firstFocusable = focusables[0];
    const lastFocusable = focusables[focusables.length - 1];

    const isCurrentlyOnFirstElement = document.activeElement === firstFocusable;
    const isCurrentlyOnLastElement = document.activeElement === lastFocusable

    if (isCurrentlyOnFirstElement && event.key === KEY_CODE_MAP.TAB && event.shiftKey) {
        event.preventDefault();
    lastFocusable.focus();
    }

    if (isCurrentlyOnLastElement && event.key === KEY_CODE_MAP.TAB && !event.shiftKey) {
        event.preventDefault();
        firstFocusable.focus();
    }
}

function closeMenu () {
    nav.classList.remove('nav--open');
    openBtn.setAttribute('aria-expanded', false);
    window.removeEventListener('keydown', trapFocus);
}

const resizeObserver = new ResizeObserver(() => {
    if (siteHeader.getBoundingClientRect().width > BREAKPOINT_TAB_PORT) {
        closeMenu();
    }
});

resizeObserver.observe(siteHeader);
openBtn.addEventListener('click', () => {
    openBtn.setAttribute('aria-expanded', true);
    nav.classList.add('nav--open');
    window.addEventListener('keydown', trapFocus);

    const firstElement = getAllFocusableElements(nav.querySelector('.nav__inner'))[0];
    firstElement.focus();
});
closeBtn.addEventListener('click', closeMenu);
navOverlay.addEventListener('click', closeMenu);