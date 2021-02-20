const BREAKPOINT_TAB_PORT = 48 * 16;
const BREAKPOINT_DESKTOP_SMALL = 90 * 16;
const KEY_CODE_MAP = {
    ESCAPE: 'Escape',
    TAB: 'Tab'
};

// 
// Nav 
// 
(function () {
    const openBtn = document.getElementById('nav-open');
    const closeBtn = document.getElementById('nav-close');
    const nav = document.querySelector('.nav');
    const navOverlay = document.querySelector('.nav__overlay');
    const siteHeader = document.querySelector('.site-head');

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
})();


// 
// People show quote functionality 
// 

(function() {
    const peopleList = document.getElementById('people-list');
    if (peopleList) {
        const peopleListItems = peopleList.querySelectorAll('.person');
        peopleList.addEventListener('click', (event) => {
            if (event.target.classList.contains('person__btn')) {
                const targetIndex = event.target.getAttribute('data-index') - 1;
                peopleListItems[targetIndex].classList.toggle('person--active')
            }
        });
    }
})();


// 
// Contact Form
//
(function () {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const emailInput = contactForm.querySelector('#email');
        const emailFormField = contactForm.querySelector('[data-field="email"]');
        
        const validationRegex = new RegExp(
            emailInput.getAttribute('pattern') || '[^@]+@[^.]+..+',
            'i'
            ); 
            
        emailInput.required = false;
        contactForm.setAttribute('novalidate', '');
        
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!validationRegex.test(emailInput.value.trim())) {
                emailFormField.classList.add('form__field--invalid');
                const emailInputAlert = emailFormField.querySelector('.form__input-alert');
                const validationMessage = emailInput.value.trim() === '' ? 'This field is required' : 'Not a valid email address'
                
                emailInputAlert.innerText = validationMessage;

                function resetValidation() {
                    emailInputAlert.innerText = '';
                    emailFormField.classList.remove('form__field--invalid');
                    emailInput.removeEventListener('keyup', resetValidation);
                }

                emailInput.addEventListener('keyup', resetValidation);
            } else {
                contactForm.innerHTML = `<p>Thanks so much for reaching out. We'll be in contact soon! In the meantime, you can <a href="#">check us out on twitter</a></p>`
                console.log('Submitting!');
            }
        })
    }
})();

