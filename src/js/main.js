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
    function resetValidation(formField) {
        if (formField.classList.contains('form__field--invalid')) {
            formField.querySelector('.form__input-alert').innerText = '';
            formField.classList.remove('form__field--invalid');
        }
    }
    
    function validateEmail(emailInput) {
        const validationRegex = new RegExp(emailInput.getAttribute('pattern') || '[^@]+@[^.]+..+', 'i'); 
        return validationRegex.test(emailInput.value.trim());
    }
    
    function renderError(formField, message) {
        formField.classList.add('form__field--invalid');
        formField.querySelector('.form__input-alert').innerText = message;
    }
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.setAttribute('novalidate', '');

        const emailInput = contactForm.querySelector('#email');
        const emailFormField = contactForm.querySelector('[data-field="email"]');
        const nameInput = contactForm.querySelector('#name');
        const nameFormField = contactForm.querySelector('[data-field="name"]');
        const messageInput = contactForm.querySelector('#message');
        const messageFormField = contactForm.querySelector('[data-field="message"]');
        
        emailInput.required = false;
        nameInput.required = false;
        messageInput.required = false;

        [emailFormField, nameFormField, messageFormField].forEach(formField => {
            formField.addEventListener('keyup', () => resetValidation(formField));
        })
        
        contactForm.addEventListener('submit', (event) => {
            let hasError = false;
            event.preventDefault();

            // Check email is valid
            if (!validateEmail(emailInput)) {
                hasError = true;
                renderError(emailFormField, 'Please use a valid email address');
            }
            
            // Check required fields
            [
                [emailFormField, emailInput],
                [nameFormField, nameInput],
                [messageFormField, messageInput]
            ].forEach(([formField, formInput]) => {
                if (formInput.value.trim() === '') {
                    hasError = true;
                    renderError(formField, 'This field is required');
                }
            })
            
            if (!hasError) {
                contactForm.innerHTML = `<p>Thanks so much for reaching out. We'll be in contact soon! In the meantime, you can <a href="#">check us out on twitter</a></p>`
                console.log('Submitting!');
            }
        })
    }
})();

