/* ===================================================================
 * Monica 1.0.0 - Main JS (Fixed & Complete)
 * ------------------------------------------------------------------- */

(function(html) {

    'use strict';

    const cfg = {
        mailChimpURL : 'https://YOURPREFIX.usX.list-manage.com/subscribe/post?u=XXXX&id=XXXX' 
    };


   /* preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {
        const siteBody = document.querySelector('body');
        const preloader = document.querySelector('#preloader');
        if (!preloader) return;

        html.classList.add('ss-preload');
        
        window.addEventListener('load', function() {
            html.classList.remove('ss-preload');
            html.classList.add('ss-loaded');
            
            preloader.addEventListener('transitionend', function afterTransition(e) {
                if (e.target.matches('#preloader'))  {
                    siteBody.classList.add('ss-show');
                    e.target.style.display = 'none';
                    preloader.removeEventListener(e.type, afterTransition);
                }
            });
        });
    };


   /* mobile menu
    * ---------------------------------------------------- */ 
    const ssMobileMenu = function() {
        const toggleButton = document.querySelector('.s-header__menu-toggle');
        const mainNavWrap = document.querySelector('.s-header__nav');
        const siteBody = document.querySelector('body');

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.s-header__nav a').forEach(function(link) {
            link.addEventListener("click", function() {
                if (window.matchMedia('(max-width: 900px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {
            if (window.matchMedia('(min-width: 901px)').matches) {
                siteBody.classList.remove('menu-is-open');
                toggleButton.classList.remove('is-clicked');
            }
        });
    };


   /* swiper sliders
    * ------------------------------------------------------ */ 
    const ssSwiper = function() {
        new Swiper('.home-slider', {
            slidesPerView: 1,
            pagination: { el: '.swiper-pagination', clickable: true },
            breakpoints: {
                401: { slidesPerView: 1, spaceBetween: 20 },
                801: { slidesPerView: 2, spaceBetween: 40 },
                1331: { slidesPerView: 3, spaceBetween: 48 },
                1774: { slidesPerView: 4, spaceBetween: 48 }
            }
        });

        new Swiper('.page-slider', {
            slidesPerView: 1,
            pagination: { el: '.swiper-pagination', clickable: true },
            breakpoints: {
                401: { slidesPerView: 1, spaceBetween: 20 },
                801: { slidesPerView: 2, spaceBetween: 40 },
                1241: { slidesPerView: 3, spaceBetween: 48 }
            }
        });
    };


    // Header carousel
    $(".header-carousel").owlCarousel({
        animateOut: 'rotateOutUpRight',
        animateIn: 'rotateInDownLeft',
        items: 1,
        autoplay: true,
        smartSpeed: 1000,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });



   /* mailchimp form
    * ---------------------------------------------------- */ 
    const ssMailChimpForm = function() {
        const mcForm = document.querySelector('#mc-form');
        if (!mcForm) return;

        mcForm.setAttribute('novalidate', true);

        function hasError(field) {
            if (field.disabled || ['file', 'reset', 'submit', 'button'].includes(field.type)) return;
            let validity = field.validity;
            if (validity.valid) return;
            if (validity.valueMissing) return 'Please enter an email address.';
            if (validity.typeMismatch && field.type === 'email') return 'Please enter a valid email address.';
            if (validity.patternMismatch) return field.title || 'Please match the requested format.';
            return 'Invalid value.';
        }

        function showError(field, error) {
            let errorMessage = field.form.querySelector('.mc-status');
            if (!errorMessage) return;
            errorMessage.classList.remove('success-message');
            errorMessage.classList.add('error-message');
            errorMessage.innerHTML = error;
        }

        window.displayMailChimpStatus = function (data) {
            if (!data || !data.result || !data.msg || typeof mcStatus === 'undefined') return;
            mcStatus.innerHTML = data.msg;

            if (data.result === 'error') {
                mcStatus.classList.remove('success-message');
                mcStatus.classList.add('error-message');
            } else {
                mcStatus.classList.remove('error-message');
                mcStatus.classList.add('success-message');
            }
        };

        function submitMailChimpForm(form) {
            let url = cfg.mailChimpURL;
            let emailField = form.querySelector('#mce-EMAIL');
            let serialize = '&' + encodeURIComponent(emailField.name) + '=' + encodeURIComponent(emailField.value);
            if (url == '') return;

            url = url.replace('/post?u=', '/post-json?u=');
            url += serialize + '&c=displayMailChimpStatus';

            var ref = window.document.getElementsByTagName('script')[0];
            var script = window.document.createElement('script');
            script.src = url;

            window.mcStatus = form.querySelector('.mc-status');
            window.mcStatus.classList.remove('error-message', 'success-message');
            window.mcStatus.innerText = 'Submitting...';

            ref.parentNode.insertBefore(script, ref);
            script.onload = function() { this.remove(); };
        }

        mcForm.addEventListener('submit', function (event) {
            event.preventDefault();
            let emailField = event.target.querySelector('#mce-EMAIL');
            let error = hasError(emailField);
            if (error) {
                showError(emailField, error);
                emailField.focus();
                return;
            }
            submitMailChimpForm(this);
        }, false);
    };


   /* alert boxes
    * ------------------------------------------------------ */
    const ssAlertBoxes = function() {
        const boxes = document.querySelectorAll('.alert-box');
        boxes.forEach(function(box){
            box.addEventListener('click', function(e) {
                if (e.target.matches('.alert-box__close')) {
                    e.stopPropagation();
                    e.target.parentElement.classList.add('hideit');
                    setTimeout(function() {
                        box.style.display = 'none';
                    }, 500);
                }
            });
        });
    };


   /* Back to Top
    * ------------------------------------------------------ */
    const ssBackToTop = function() {
        const pxShow = 900;
        const goTopButton = document.querySelector(".ss-go-top");
        if (!goTopButton) return;

        if (window.scrollY >= pxShow) goTopButton.classList.add("link-is-visible");

        window.addEventListener('scroll', function() {
            if (window.scrollY >= pxShow) {
                goTopButton.classList.add("link-is-visible");
            } else {
                goTopButton.classList.remove("link-is-visible");
            }
        });
    };


   /* smoothscroll
    * ------------------------------------------------------ */
    const ssMoveTo = function() {
        const easeFunctions = {
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        };

        const triggers = document.querySelectorAll('.smoothscroll');
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(trigger => moveTo.registerTrigger(trigger));
    };


   /* Initialize all
    * ------------------------------------------------------ */
    (function ssInit() {
        ssPreloader();
        ssMobileMenu();
        ssSwiper();
        ssHeaderCarousel();   // ✅ Properly initialized
        ssMailChimpForm();
        ssAlertBoxes();
        ssMoveTo();
        ssBackToTop();
    })();

})(document.documentElement);
