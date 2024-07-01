let navigation = {

    $navTrigger: document.querySelector('.nav__trigger'),
    $nav: document.querySelector('.nav'),
    $navItems: document.querySelectorAll('.nav__item a'),
    $main: document.querySelector('.main'),
    transitionEnd: 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
    isOpeningNav: false,

    init() {
        let self = this;
        self.$main.style.overflow = 'auto';
        self.$main.style.height = 'auto';
        window.addEventListener('scroll', e => {
            if (window.scrollY == 0 && self.isOpeningNav) {
                self.isOpeningNav = false;
                setTimeout(function() {
                    self.openNavigation();
                }, 150);
            }
        });
        self.$navTrigger.addEventListener('click', e => {
            e.preventDefault();

            if (!self.$navTrigger.classList.contains('is-active')) {
               
                self.openNavigation();
                $('.nav').css('display', 'block');

                // }
            } else {
                self.closeNavigation();
                self.$nav.classList.add('CloseAni');
                $('.nav').css('display', 'none');

            }
        });

        // Handle .nav__item click events
        self.$navItems.forEach(navLink => {
            navLink.addEventListener('click', function(e) {
                e.preventDefault();
                self.$navItems.forEach(el => {
                    el.classList.remove('is-active');
                });

                this.classList.add('is-active');
                self.transitionPage();
            });
        });
    },

    openNavigation() {
        let self = this;
        self.$nav.classList.remove('CloseAni');
        self.$navTrigger.classList.add('is-active');
        document.body.classList.add('is-froze');
        if (self.$main.style.removeProperty) {
            self.$main.style.removeProperty('overflow');
            self.$main.style.removeProperty('height');
        } else {
            self.$main.style.removeAttribute('overflow');
            self.$main.style.removeAttribute('height');
        }

        self.$main.classList.add('is-active');
    },

    closeNavigation() {
        let self = this;

        self.$navTrigger.classList.remove('is-active');

        self.$main.classList.remove('is-active');
        self.$main.addEventListener('transitionend', e => {
            if (e.propertyName == 'transform' && !self.$navTrigger.classList.contains('is-active')) {
                self.$main.style.overflow = 'auto';
                self.$main.style.height = 'auto';

                document.body.classList.remove('is-froze');
            }
        });

     
        self.$main.classList.remove('is-active');

        // body unfroze
        document.body.classList.remove('is-froze');
        //}
    },

    transitionPage() {
        let self = this;

        // .main transitioning
        self.$main.classList.add('is-transition-out');
        self.$main.addEventListener('transitionend', e => {
            if (e.propertyName == 'clip-path') {
                if (self.$main.classList.contains('is-transition-in')) {
                    self.$main.classList.remove('is-transition-in');
                    self.$main.classList.remove('is-transition-out');
                    self.closeNavigation();
                }

                if (self.$main.classList.contains('is-transition-out')) {
                    self.$main.classList.remove('is-transition-out');

                    setTimeout(function() {
                        self.$main.classList.add('is-transition-in');
                    }, 500);
                }
            }
        });
    }
};


navigation.init();


$('.toggle').click(function(e) {
    e.preventDefault();

    var $this = $(this);

    if ($this.next().hasClass('show')) {
        $this.next().removeClass('show');
        $this.next().slideUp(350);
    } else {
        $this.parent().parent().find('li .inner').removeClass('show');
        $this.parent().parent().find('li .inner').slideUp(350);
        $this.next().toggleClass('show');
        $this.next().slideToggle(350);
    }
});


// Counter JS
(function($) {
    $.fn.countTo = function(options) {
        options = options || {};

        return $(this).each(function() {
            var settings = $.extend({}, $.fn.countTo.defaults, {
                from: $(this).data('from'),
                to: $(this).data('to'),
                speed: $(this).data('speed'),
                refreshInterval: $(this).data('refresh-interval'),
                decimals: $(this).data('decimals')
            }, options);
            var loops = Math.ceil(settings.speed / settings.refreshInterval),
                increment = (settings.to - settings.from) / loops;

            var self = this,
                $self = $(this),
                loopCount = 0,
                value = settings.from,
                data = $self.data('countTo') || {};

            $self.data('countTo', data);

            if (data.interval) {
                clearInterval(data.interval);
            }
            data.interval = setInterval(updateTimer, settings.refreshInterval);

            render(value);

            function updateTimer() {
                value += increment;
                loopCount++;

                render(value);

                if (typeof(settings.onUpdate) == 'function') {
                    settings.onUpdate.call(self, value);
                }

                if (loopCount >= loops) {
                    $self.removeData('countTo');
                    clearInterval(data.interval);
                    value = settings.to;

                    if (typeof(settings.onComplete) == 'function') {
                        settings.onComplete.call(self, value);
                    }
                }
            }

            function render(value) {
                var formattedValue = settings.formatter.call(self, value, settings);
                $self.html(formattedValue);
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0, 
        to: 0, 
        speed: 1000, 
        refreshInterval: 100, 
        decimals: 0, 
        formatter: formatter,
        onUpdate: null, 
        onComplete: null 
    };

    function formatter(value, settings) {
        return value.toFixed(settings.decimals);
    }
}(jQuery));

jQuery(function($) {
    $('.count-number').data('countToOptions', {
        formatter: function(value, options) {
            return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
        }
    });
    $('.timer').each(count);

    function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }
});