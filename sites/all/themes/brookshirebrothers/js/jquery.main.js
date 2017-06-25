// page init
jQuery(function () {
    "use strict";

    initSplitDropDown();
    initGoogleMaps();
    initFilterLocation();
    jcf.customForms.replaceAll();
    initCycleCarousel();
    initOpenClose();
    initAccordion();
    initSameHeight();
    jQuery('input, textarea').placeholder();
});

// split drop down
function initSplitDropDown() {
    "use strict";
    jQuery('.main-menu').each(function () {
        var list = jQuery(this);
        var items = list.find('>li');
        var sumHeight = 0;

        items.each(function () {
            var item = jQuery(this);
            var imgHolder = item.find('.img-holder');
            var drop = item.find('.dropdown');
            var dropHtml = drop.html();
            var dropHeight = drop.height();
            var breakFlag = false;

            ResponsiveHelper.addRange({
                '768..': {
                    on: function () {
                        breakFlag = false;
                        dropHeight = drop.height();
                        sumHeight = 0;

                        if (imgHolder.length === 0 && drop.length > 0) {
                            var dropList = drop.find('>ul');
                            var items = dropList.find('>li')
                            var firstList = jQuery('<ul class="first-column">');
                            var secondList = jQuery('<ul class="second-column">');

                            firstList.appendTo(drop);
                            secondList.appendTo(drop);

                            items.each(function (i) {
                                var item = jQuery(this);

                                sumHeight += item.actual('outerHeight');

                                !breakFlag ? item.appendTo(firstList) : item.appendTo(secondList);

                                if (sumHeight > dropHeight / 2) {
                                    breakFlag = true;
                                }
                            });
                            dropList.remove();
                        }
                    },
                    off: function () {
                        drop.html(dropHtml);
                    }
                }
            });
        });
    });
}

// google maps init
function initGoogleMaps() {
    "use strict";

    /*jQuery('#google-map-holder').each(function () {
        var set = jQuery(this);
        var attrAddress = set.find('.address').text();
        var iframe = set.find('.map-box');
        var linkToMap = set.find('.btn-map');

        linkToMap.attr('target', '_blank')

        var mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(-34.397, 150.644),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(iframe.get(0), mapOptions);

        getPosition(attrAddress).done(function (results) {
            map.setCenter(results[0].geometry.location);
            iframe.data('formatted_address', results[0].formatted_address);
            linkToMap.attr('href', 'https://maps.google.com/maps?q=' + results[0].formatted_address);
            makeMarker(results[0].geometry.location, results[0].formatted_address);
        });
        function makeMarker(location, address) {
            var infowindow = new google.maps.InfoWindow({
                content: attrAddress
            });

            var marker = new google.maps.Marker({
                map: map,
                position: location
            });
        }
    });*/

    function getPosition(address) {
        var d = jQuery.Deferred();
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function (results, status) {
            if (status === google.maps.GeocoderStatus) {
                d.resolve(results);
            }
        });
        return d;
    }
}

// filter location init
function initFilterLocation() {
    "use strict";
     var activeClass = 'filter-active';

    jQuery('.filter-location').each(function () {
        var holder = jQuery(this);
        var form = holder.find('.location-form');
        var filterHolder = holder.find('.filter-holder');
        var filterList = filterHolder.find('.store-block');
        var literLocation = form.find('.filter-location-area');
        var backBtn = filterHolder.find('.back-btn');
        var distanceSelect = form.find('.filter-distance');
        var checkboxes = form.find('input[type="checkbox"]');
        var selectedDistance;
        var convertCoeff = 1000 * 1.61;
        var resultCount = filterHolder.find('.result-count');
        var selectedMiles = filterHolder.find('.selected-miles');
        var yopurAddress = filterHolder.find('.your-location');
        var overClass = 'over';

        var mapOptions = {
            zoom: 11,
            mapTypeControl: false,
            center: new google.maps.LatLng(-34.397, 150.644),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        filterHolder.hide();
        function sendForm(e) {

            var weeklyad = holder.find('.weekly-ad');
            jQuery('#loader').show();
            var literLocation = form.find('.filter-location-area');
            /* [WM] 20140424 - get User's input text */
            if (e) {
                e.preventDefault();
            }
            jQuery.ajax({
                type: 'get',
                cache: false,
                url: form.attr('action'),
                data: 'ajax=1&weeklyad=' + weeklyad.val(),
                dataType: 'text',
                success: function (data) {
                    //var selectedOption = distanceSelect.children().eq(distanceSelect.get(0).selectedIndex);
                    //selectedDistance = parseInt(selectedOption.text(), 10);

                    //if (selectedOption.hasClass(overClass)) {
                        selectedDistance = 99999;
                    //}

                    jQuery(data).appendTo(jQuery('body'));
                    resultCount.text('0');
                    // selectedMiles.text(selectedOption.text());

                    getPosition(literLocation.val()).done(function (results) {
                        //var currCoord = [results[0].geometry.location.k, results[0].geometry.location.A]
                        //var currCoord = [results[0].geometry.location.lat(), results[0].geometry.location.lng()]
                        //var dataObject = getCoordinates(locationCoordinates, currCoord, selectedDistance);
                        var html = '';
                        //var lat = results[0].geometry.location.lat();
                        //var lng = results[0].geometry.location.lng();

                        for (var i in dataObject) {
                            dataObject[i].features[0].properties.i = i;
                            html += tmpl("result_tmpl", dataObject[i].features[0].properties);
                        }

                        //jQuery.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=false', function(){
                        // console.log(arguments[0].results[0].address_components[arguments[0].results[0].address_components.length-1].long_name)
                        // console.log(arguments[0].results[0].address_components[4].long_name)
                        //yopurAddress.text(arguments[0].results[0].address_components[4].long_name);
                        //});
                        filterList.html(html);
                    });
                    yopurAddress.text(literLocation.val());
                    /* [WM] 20140424 - Updated Value of Label with User's input text */
                    switchOnFilter();
                    jQuery('#loader').hide();
                }
            });
        }

        function switchOnFilter() {
            if (!holder.hasClass(activeClass)) {
                holder.addClass(activeClass);
                form.hide();
                filterHolder.show();
            } else {
                holder.removeClass(activeClass);
                form.show();
                filterHolder.hide();
            }
        }

        function getCoordinates(obj, yourCoord, limit) {
            var semiresultsArray = [];
            var currIndex = 0;

            function chechAddress() {
                if (obj[currIndex]) {
                    var currObj = obj[currIndex];
                    var coordArr = currObj.features[0].geometry.coordinates.split(',');
                    var currA = parseFloat(coordArr[0]);
                    var currB = parseFloat(coordArr[1]);
                    var latLngA = new google.maps.LatLng(parseFloat(yourCoord[0], 10), parseFloat(yourCoord[1], 10));
                    var latLngB = new google.maps.LatLng(parseFloat(currA, 10), parseFloat(currB, 10));
                    var distance = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB) / convertCoeff;

                    obj[currIndex].distanceMiles = distance;
                    if (!limit) {
                        semiresultsArray.push(obj[currIndex]);
                    }
                    else if (distance <= limit) {
                        semiresultsArray.push(obj[currIndex]);
                    }
                    currIndex++;
                    if (obj[currIndex]) {
                        chechAddress();
                    }
                }
            }

            chechAddress();
            semiresultsArray = semiresultsArray.sort(function (a, b) {
                return parseFloat(a.distanceMiles) > parseFloat(b.distanceMiles) ? 1 : -1;
            });
            var resultsArray = [];
            var checkboxArray = [];

            checkboxes.each(function () {
                var checkbox = jQuery(this);

                if (checkbox.is(':checked')) {
                    checkboxArray.push(checkbox.val());
                }
            });

            jQuery.each(semiresultsArray, function (ind, obj) {
                var intermediateArr = jQuery.trim(semiresultsArray[ind].features[0].keywords.split(',')).split(',');
                jQuery.each(intermediateArr, function (el, key) {
                    var key = jQuery.trim(key)

                    jQuery.each(checkboxArray, function (el2, key2) {
                        var key2 = jQuery.trim(key2);

                        if (key.toLowerCase() === key2.toLowerCase()) {
                            resultsArray.push(obj);
                            return true;
                        } else {
                            return false;
                        }
                    })
                });
            });

            if (checkboxes.filter(':checked').length > 0) {
                showResultCount(resultsArray);
                return resultsArray;
            } else {
                showResultCount(semiresultsArray);
                return semiresultsArray;
            }
        }

        function getPosition(address) {
            var d = jQuery.Deferred();

            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': address}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    d.resolve(results);
                }
            });
            return d;
        }

        function showResultCount(currArr) {
            resultCount.text(currArr.length);
            selectedMiles.text(distanceSelect.children().eq(distanceSelect.get(0).selectedIndex).text())
        }

        form.submit(sendForm);
        backBtn.bind('click', sendForm);
    });
}

// cycle scroll gallery init
function initCycleCarousel() {
    "use strict";
    jQuery('div.carousel').scrollAbsoluteGallery({
        mask: 'div.mask',
        slider: 'div.slideset',
        slides: 'div.slide',
        btnPrev: 'a.btn-prev',
        btnNext: 'a.btn-next',
        pagerLinks: '.pagination li',
        pauseOnHover: true,
        maskAutoSize: true,
        autoRotation: true,
        switchTime: 5000,
        animSpeed: 500
    });
}

// open-close init
function initOpenClose() {
    jQuery('div.open-close').openClose({
        activeClass: 'active',
        opener: '.opener',
        slider: '.slide',
        animSpeed: 400,
        effect: 'slide'
    });
    jQuery('div.open-close2').openClose({
        activeClass: 'active',
        opener: '.opener2',
        slider: '.slide2',
        animSpeed: 400,
        effect: 'slide'
    });
}

// accordion menu init
function initAccordion() {
    jQuery('ul.accordion').slideAccordion({
        opener: 'a.opener',
        slider: 'div.slide2',
        animSpeed: 300
    });
}

// align blocks height
function initSameHeight() {
    jQuery('.three-col').sameHeight({
        elements: '.article-box',
        flexible: true,
        multiLine: true
    });
}

/*
 * Responsive Layout helper
 */
ResponsiveHelper = (function ($) {
    // init variables
    var handlers = [];
    var win = $(window), prevWinWidth;
    var scrollBarWidth = 0;

    // prepare resize handler
    function resizeHandler() {
        var winWidth = win.width() + scrollBarWidth;
        if (winWidth !== prevWinWidth) {
            prevWinWidth = winWidth;

            // loop through range groups
            $.each(handlers, function (index, rangeObject) {
                // disable current active area if needed
                $.each(rangeObject.data, function (property, item) {
                    if ((winWidth < item.range[0] || winWidth > item.range[1]) && item.currentActive) {
                        item.currentActive = false;
                        if (typeof item.disableCallback === 'function') {
                            item.disableCallback();
                        }
                    }
                });

                // enable areas that match current width
                $.each(rangeObject.data, function (property, item) {
                    if (winWidth >= item.range[0] && winWidth <= item.range[1] && !item.currentActive) {
                        // make callback
                        item.currentActive = true;
                        if (typeof item.enableCallback === 'function') {
                            item.enableCallback();
                        }
                    }
                });
            });
        }
    }

    win.bind('load', function () {
        if (window.addEventListener) {
            scrollBarWidth = window.innerWidth - $('body').width();
            resizeHandler();
        }
        win.bind('resize orientationchange', resizeHandler);
    });

    // range parser
    function parseRange(rangeStr) {
        var rangeData = rangeStr.split('..');
        var x1 = parseInt(rangeData[0], 10) || -Infinity;
        var x2 = parseInt(rangeData[1], 10) || Infinity;
        return [x1, x2].sort(function (a, b) {
            return a - b;
        });
    }

    // export public functions
    return {
        addRange: function (ranges) {
            // parse data and add items to collection
            var result = {data: {}};
            $.each(ranges, function (property, data) {
                result.data[property] = {
                    range: parseRange(property),
                    enableCallback: data.on,
                    disableCallback: data.off
                };
            });
            handlers.push(result);

            // call resizeHandler to recalculate all events
            prevWinWidth = null;
            resizeHandler();
        }
    };
}(jQuery));

/*
 * jQuery Cycle Carousel plugin
 */
;(function ($) {
    function ScrollAbsoluteGallery(options) {
        this.options = $.extend({
            activeClass: 'active',
            mask: 'div.slides-mask',
            slider: '>ul',
            slides: '>li',
            btnPrev: '.btn-prev',
            btnNext: '.btn-next',
            pagerLinks: 'ul.pager > li',
            generatePagination: false,
            pagerList: '<ul>',
            pagerListItem: '<li><a href="#"></a></li>',
            pagerListItemText: 'a',
            galleryReadyClass: 'gallery-js-ready',
            currentNumber: 'span.current-num',
            totalNumber: 'span.total-num',
            maskAutoSize: false,
            autoRotation: false,
            pauseOnHover: false,
            stretchSlideToMask: false,
            switchTime: 3000,
            animSpeed: 500,
            handleTouch: true,
            swipeThreshold: 15,
            vertical: false
        }, options);
        this.init();
    }

    ScrollAbsoluteGallery.prototype = {
        init: function () {
            if (this.options.holder) {
                this.findElements();
                this.attachEvents();
                this.makeCallback('onInit', this);
            }
        },
        findElements: function () {
            // find structure elements
            this.holder = $(this.options.holder).addClass(this.options.galleryReadyClass);
            this.mask = this.holder.find(this.options.mask);
            this.slider = this.mask.find(this.options.slider);
            this.slides = this.slider.find(this.options.slides);
            this.btnPrev = this.holder.find(this.options.btnPrev);
            this.btnNext = this.holder.find(this.options.btnNext);

            // slide count display
            this.currentNumber = this.holder.find(this.options.currentNumber);
            this.totalNumber = this.holder.find(this.options.totalNumber);

            // create gallery pagination
            if (typeof this.options.generatePagination === 'string') {
                this.pagerLinks = this.buildPagination();
            } else {
                this.pagerLinks = this.holder.find(this.options.pagerLinks);
            }

            // define index variables
            this.sizeProperty = this.options.vertical ? 'height' : 'width';
            this.positionProperty = this.options.vertical ? 'top' : 'left';
            this.animProperty = this.options.vertical ? 'marginTop' : 'marginLeft';

            this.slideSize = this.slides[this.sizeProperty]();
            this.currentIndex = 0;
            this.prevIndex = 0;

            // reposition elements
            this.options.maskAutoSize = this.options.vertical ? false : this.options.maskAutoSize;
            if (this.options.vertical) {
                this.mask.css({
                    height: this.slides.innerHeight()
                });
            }
            if (this.options.maskAutoSize) {
                this.mask.css({
                    height: this.slider.height()
                });
            }
            this.slider.css({
                position: 'relative',
                height: this.options.vertical ? this.slideSize * this.slides.length : '100%'
            });
            this.slides.css({
                position: 'absolute'
            }).css(this.positionProperty, -9999).eq(this.currentIndex).css(this.positionProperty, 0);
            this.refreshState();
        },

        buildPagination: function () {
            var pagerLinks = $();
            if (!this.pagerHolder) {
                this.pagerHolder = this.holder.find(this.options.generatePagination);
            }
            if (this.pagerHolder.length) {
                this.pagerHolder.empty();
                this.pagerList = $(this.options.pagerList).appendTo(this.pagerHolder);
                for (var i = 0; i < this.slides.length; i++) {
                    $(this.options.pagerListItem).appendTo(this.pagerList).find(this.options.pagerListItemText).text(i + 1);
                }
                pagerLinks = this.pagerList.children();
            }
            return pagerLinks;
        },
        attachEvents: function () {
            // attach handlers
            var self = this;
            if (this.btnPrev.length) {
                this.btnPrevHandler = function (e) {
                    e.preventDefault();
                    self.prevSlide();
                };
                this.btnPrev.click(this.btnPrevHandler);
            }
            if (this.btnNext.length) {
                this.btnNextHandler = function (e) {
                    e.preventDefault();
                    self.nextSlide();
                };
                this.btnNext.click(this.btnNextHandler);
            }
            if (this.pagerLinks.length) {
                this.pagerLinksHandler = function (e) {
                    e.preventDefault();
                    self.numSlide(self.pagerLinks.index(e.currentTarget));
                };
                this.pagerLinks.click(this.pagerLinksHandler);
            }

            // handle autorotation pause on hover
            if (this.options.pauseOnHover) {
                this.hoverHandler = function () {
                    clearTimeout(self.timer);
                };
                this.leaveHandler = function () {
                    self.autoRotate();
                };
                this.holder.bind({mouseenter: this.hoverHandler, mouseleave: this.leaveHandler});
            }

            // handle holder and slides dimensions
            this.resizeHandler = function () {
                if (!self.animating) {
                    if (self.options.stretchSlideToMask) {
                        self.resizeSlides();
                    }
                    self.resizeHolder();
                    self.setSlidesPosition(self.currentIndex);
                }
            };
            $(window).bind('load resize orientationchange', this.resizeHandler);
            if (self.options.stretchSlideToMask) {
                self.resizeSlides();
            }

            // handle swipe on mobile devices
            if (this.options.handleTouch && jQuery.fn.hammer && this.slides.length > 1 && isTouchDevice) {
                this.mask.hammer({
                    drag_block_horizontal: self.options.vertical ? false : true,
                    drag_block_vertical: self.options.vertical ? true : false,
                    drag_min_distance: 1
                }).on('touch release ' + (this.options.vertical ? 'swipeup swipedown dragup dragdown' : 'swipeleft swiperight dragleft dragright'), function (ev) {
                    switch (ev.type) {
                        case (self.options.vertical ? 'dragup' : 'dragright'):
                        case (self.options.vertical ? 'dragdown' : 'dragleft'):
                            if (!self.animating) {
                                self.swipeOffset = -self.slideSize + ev.gesture[self.options.vertical ? 'deltaY' : 'deltaX'];
                                self.slider.css(self.animProperty, self.swipeOffset);
                                clearTimeout(self.timer);
                            }
                            ev.gesture.preventDefault();
                            break;
                        case (self.options.vertical ? 'swipeup' : 'swipeleft'):
                            if (!self.animating) {
                                self.nextSlide();
                                self.swipeOffset = 0;
                            }
                            ev.gesture.stopDetect();
                            break;
                        case (self.options.vertical ? 'swipedown' : 'swiperight'):
                            if (!self.animating) {
                                self.prevSlide();
                                self.swipeOffset = 0;
                            }
                            ev.gesture.stopDetect();
                            break;
                        case 'release':
                            if (Math.abs(ev.gesture[self.options.vertical ? 'deltaY' : 'deltaX']) > self.options.swipeThreshold) {
                                if (self.options.vertical) {
                                    if (ev.gesture.direction == 'down') {
                                        self.prevSlide();
                                    } else if (ev.gesture.direction == 'up') {
                                        self.nextSlide();
                                    }
                                }
                                else {
                                    if (ev.gesture.direction == 'right') {
                                        self.prevSlide();
                                    } else if (ev.gesture.direction == 'left') {
                                        self.nextSlide();
                                    }
                                }
                            }
                            else {
                                var tmpObj = {};
                                tmpObj[self.animProperty] = -self.slideSize;
                                self.slider.animate(tmpObj, {duration: self.options.animSpeed});
                            }
                            self.swipeOffset = 0;
                            break;
                    }
                });
            }

            // start autorotation
            this.autoRotate();
            this.resizeHolder();
            this.setSlidesPosition(this.currentIndex);
        },
        resizeSlides: function () {
            this.slideSize = this.mask[this.options.vertical ? 'height' : 'width']();
            this.slides.css(this.sizeProperty, this.slideSize);
        },
        resizeHolder: function () {
            if (this.options.maskAutoSize) {
                this.mask.css({
                    height: this.slides.eq(this.currentIndex).outerHeight(true)
                });
            }
        },
        prevSlide: function () {
            if (!this.animating && this.slides.length > 1) {
                this.direction = -1;
                this.prevIndex = this.currentIndex;
                if (this.currentIndex > 0) this.currentIndex--;
                else this.currentIndex = this.slides.length - 1;
                this.switchSlide();
            }
        },
        nextSlide: function (fromAutoRotation) {
            if (!this.animating && this.slides.length > 1) {
                this.direction = 1;
                this.prevIndex = this.currentIndex;
                if (this.currentIndex < this.slides.length - 1) this.currentIndex++;
                else this.currentIndex = 0;
                this.switchSlide();
            }
        },
        numSlide: function (c) {
            if (!this.animating && this.currentIndex !== c && this.slides.length > 1) {
                this.direction = c > this.currentIndex ? 1 : -1;
                this.prevIndex = this.currentIndex;
                this.currentIndex = c;
                this.switchSlide();
            }
        },
        preparePosition: function () {
            // prepare slides position before animation
            this.setSlidesPosition(this.prevIndex, this.direction < 0 ? this.currentIndex : null, this.direction > 0 ? this.currentIndex : null, this.direction);
        },
        setSlidesPosition: function (index, slideLeft, slideRight, direction) {
            // reposition holder and nearest slides
            if (this.slides.length > 1) {
                var prevIndex = (typeof slideLeft === 'number' ? slideLeft : index > 0 ? index - 1 : this.slides.length - 1);
                var nextIndex = (typeof slideRight === 'number' ? slideRight : index < this.slides.length - 1 ? index + 1 : 0);

                this.slider.css(this.animProperty, this.swipeOffset ? this.swipeOffset : -this.slideSize);
                this.slides.css(this.positionProperty, -9999).eq(index).css(this.positionProperty, this.slideSize);
                if (prevIndex === nextIndex && typeof direction === 'number') {
                    var calcOffset = direction > 0 ? this.slideSize * 2 : 0;
                    this.slides.eq(nextIndex).css(this.positionProperty, calcOffset);
                } else {
                    this.slides.eq(prevIndex).css(this.positionProperty, 0);
                    this.slides.eq(nextIndex).css(this.positionProperty, this.slideSize * 2);
                }
            }
        },
        switchSlide: function () {
            // prepare positions and calculate offset
            var self = this;
            var oldSlide = this.slides.eq(this.prevIndex);
            var newSlide = this.slides.eq(this.currentIndex);
            this.animating = true;

            // resize mask to fit slide
            if (this.options.maskAutoSize) {
                this.mask.animate({
                    height: newSlide.outerHeight(true)
                }, {
                    duration: this.options.animSpeed
                });
            }

            // start animation
            var animProps = {};
            animProps[this.animProperty] = this.direction > 0 ? -this.slideSize * 2 : 0;
            this.preparePosition();
            this.slider.animate(animProps, {
                duration: this.options.animSpeed, complete: function () {
                    self.setSlidesPosition(self.currentIndex);

                    // start autorotation
                    self.animating = false;
                    self.autoRotate();

                    // onchange callback
                    self.makeCallback('onChange', self);
                }
            });

            // refresh classes
            this.refreshState();

            // onchange callback
            this.makeCallback('onBeforeChange', this);
        },
        refreshState: function (initial) {
            // slide change function
            this.slides.removeClass(this.options.activeClass).eq(this.currentIndex).addClass(this.options.activeClass);
            this.pagerLinks.removeClass(this.options.activeClass).eq(this.currentIndex).addClass(this.options.activeClass);

            // display current slide number
            this.currentNumber.html(this.currentIndex + 1);
            this.totalNumber.html(this.slides.length);

            // add class if not enough slides
            this.holder.toggleClass('not-enough-slides', this.slides.length === 1);
        },
        autoRotate: function () {
            var self = this;
            clearTimeout(this.timer);
            if (this.options.autoRotation) {
                this.timer = setTimeout(function () {
                    self.nextSlide();
                }, this.options.switchTime);
            }
        },
        makeCallback: function (name) {
            if (typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        },
        destroy: function () {
            // destroy handler
            this.btnPrev.unbind('click', this.btnPrevHandler);
            this.btnNext.unbind('click', this.btnNextHandler);
            this.pagerLinks.unbind('click', this.pagerLinksHandler);
            this.holder.unbind({mouseenter: this.hoverHandler, mouseleave: this.leaveHandler});
            $(window).unbind('load resize orientationchange', this.resizeHandler);
            clearTimeout(this.timer);

            // destroy swipe handler
            if (this.options.handleTouch && $.fn.hammer) {
                this.mask.hammer().off('touch release swipeleft swiperight swipeup swipedown dragup dragdown dragleft dragright');
            }

            // remove inline styles, classes and pagination
            this.holder.removeClass(this.options.galleryReadyClass);
            this.slider.add(this.slides).removeAttr('style');
            if (typeof this.options.generatePagination === 'string') {
                this.pagerHolder.empty();
            }
        }
    };

    // detect device type
    var isTouchDevice = /MSIE 10.*Touch/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    // jquery plugin
    $.fn.scrollAbsoluteGallery = function (opt) {
        return this.each(function () {
            $(this).data('ScrollAbsoluteGallery', new ScrollAbsoluteGallery($.extend(opt, {holder: this})));
        });
    };
}(jQuery));

/*
 * jQuery Open/Close plugin
 */
;(function ($) {
    function OpenClose(options) {
        this.options = $.extend({
            addClassBeforeAnimation: true,
            hideOnClickOutside: false,
            activeClass: 'active',
            opener: '.opener',
            slider: '.slide',
            animSpeed: 400,
            effect: 'fade',
            event: 'click'
        }, options);
        this.init();
    }

    OpenClose.prototype = {
        init: function () {
            if (this.options.holder) {
                this.findElements();
                this.attachEvents();
                this.makeCallback('onInit');
            }
        },
        findElements: function () {
            this.holder = $(this.options.holder);
            this.opener = this.holder.find(this.options.opener);
            this.slider = this.holder.find(this.options.slider);
        },
        attachEvents: function () {
            // add handler
            var self = this;
            this.eventHandler = function (e) {
                e.preventDefault();
                if (self.slider.hasClass(slideHiddenClass)) {
                    self.showSlide();
                } else {
                    self.hideSlide();
                }
            };
            self.opener.bind(self.options.event, this.eventHandler);

            // hover mode handler
            if (self.options.event === 'over') {
                self.opener.bind('mouseenter', function () {
                    self.showSlide();
                });
                self.holder.bind('mouseleave', function () {
                    self.hideSlide();
                });
            }

            // outside click handler
            self.outsideClickHandler = function (e) {
                if (self.options.hideOnClickOutside) {
                    var target = $(e.target);
                    if (!target.is(self.holder) && !target.closest(self.holder).length) {
                        self.hideSlide();
                    }
                }
            };

            // set initial styles
            if (this.holder.hasClass(this.options.activeClass)) {
                $(document).bind('click touchstart', self.outsideClickHandler);
            } else {
                this.slider.addClass(slideHiddenClass);
            }
        },
        showSlide: function () {
            var self = this;
            if (self.options.addClassBeforeAnimation) {
                self.holder.addClass(self.options.activeClass);
            }
            self.slider.removeClass(slideHiddenClass);
            $(document).bind('click touchstart', self.outsideClickHandler);

            self.makeCallback('animStart', true);
            toggleEffects[self.options.effect].show({
                box: self.slider,
                speed: self.options.animSpeed,
                complete: function () {
                    if (!self.options.addClassBeforeAnimation) {
                        self.holder.addClass(self.options.activeClass);
                    }
                    self.makeCallback('animEnd', true);
                }
            });
        },
        hideSlide: function () {
            var self = this;
            if (self.options.addClassBeforeAnimation) {
                self.holder.removeClass(self.options.activeClass);
            }
            $(document).unbind('click touchstart', self.outsideClickHandler);

            self.makeCallback('animStart', false);
            toggleEffects[self.options.effect].hide({
                box: self.slider,
                speed: self.options.animSpeed,
                complete: function () {
                    if (!self.options.addClassBeforeAnimation) {
                        self.holder.removeClass(self.options.activeClass);
                    }
                    self.slider.addClass(slideHiddenClass);
                    self.makeCallback('animEnd', false);
                }
            });
        },
        destroy: function () {
            this.slider.removeClass(slideHiddenClass).css({display: ''});
            this.opener.unbind(this.options.event, this.eventHandler);
            this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
            $(document).unbind('click touchstart', this.outsideClickHandler);
        },
        makeCallback: function (name) {
            if (typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        }
    };

    // add stylesheet for slide on DOMReady
    var slideHiddenClass = 'js-slide-hidden';
    $(function () {
        var tabStyleSheet = $('<style type="text/css">')[0];
        var tabStyleRule = '.' + slideHiddenClass;
        tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
        if (tabStyleSheet.styleSheet) {
            tabStyleSheet.styleSheet.cssText = tabStyleRule;
        } else {
            tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
        }
        $('head').append(tabStyleSheet);
    });

    // animation effects
    var toggleEffects = {
        slide: {
            show: function (o) {
                o.box.stop(true).hide().slideDown(o.speed, o.complete);
            },
            hide: function (o) {
                o.box.stop(true).slideUp(o.speed, o.complete);
            }
        },
        fade: {
            show: function (o) {
                o.box.stop(true).hide().fadeIn(o.speed, o.complete);
            },
            hide: function (o) {
                o.box.stop(true).fadeOut(o.speed, o.complete);
            }
        },
        none: {
            show: function (o) {
                o.box.hide().show(0, o.complete);
            },
            hide: function (o) {
                o.box.hide(0, o.complete);
            }
        }
    };

    // jQuery plugin interface
    $.fn.openClose = function (opt) {
        return this.each(function () {
            jQuery(this).data('OpenClose', new OpenClose($.extend(opt, {holder: this})));
        });
    };
}(jQuery));

/*
 * jQuery Accordion plugin
 */
;(function ($) {
    "use strict";
    $.fn.slideAccordion = function (opt) {
        // default options
        var options = $.extend({
            addClassBeforeAnimation: false,
            activeClass: 'active',
            opener: '.opener',
            slider: '.slide',
            animSpeed: 300,
            collapsible: true,
            event: 'click'
        }, opt);

        return this.each(function () {
            // options
            var accordion = $(this);
            var items = accordion.find(':has(' + options.slider + ')');

            items.each(function () {
                var item = $(this);
                var opener = item.find(options.opener);
                var slider = item.find(options.slider);
                opener.bind(options.event, function (e) {
                    if (!slider.is(':animated')) {
                        if (item.hasClass(options.activeClass)) {
                            if (options.collapsible) {
                                slider.slideUp(options.animSpeed, function () {
                                    hideSlide(slider);
                                    item.removeClass(options.activeClass);
                                });
                            }
                        } else {
                            // show active
                            var levelItems = item.siblings('.' + options.activeClass);
                            var sliderElements = levelItems.find(options.slider);
                            item.addClass(options.activeClass);
                            showSlide(slider).hide().slideDown(options.animSpeed);

                            // collapse others
                            sliderElements.slideUp(options.animSpeed, function () {
                                levelItems.removeClass(options.activeClass);
                                hideSlide(sliderElements);
                            });
                        }
                    }
                    e.preventDefault();
                });
                if (item.hasClass(options.activeClass)) showSlide(slider); else hideSlide(slider);
            });

        });
    };

    // accordion slide visibility
    var showSlide = function (slide) {
        return slide.css({position: '', top: '', left: '', width: ''});
    };
    var hideSlide = function (slide) {
        return slide.show().css({position: 'absolute', top: -9999, left: -9999, width: slide.width()});
    };
}(jQuery));

/*
 * jQuery SameHeight plugin
 */
;(function ($) {
    $.fn.sameHeight = function (opt) {
        var options = $.extend({
            skipClass: 'same-height-ignore',
            leftEdgeClass: 'same-height-left',
            rightEdgeClass: 'same-height-right',
            elements: '>*',
            flexible: false,
            multiLine: false,
            useMinHeight: false,
            biggestHeight: false
        }, opt);
        return this.each(function () {
            var holder = $(this), postResizeTimer, ignoreResize;
            var elements = holder.find(options.elements).not('.' + options.skipClass);
            if (!elements.length) return;

            // resize handler
            function doResize() {
                elements.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', '');
                if (options.multiLine) {
                    // resize elements row by row
                    resizeElementsByRows(elements, options);
                } else {
                    // resize elements by holder
                    resizeElements(elements, holder, options);
                }
            }

            doResize();

            // handle flexible layout / font resize
            var delayedResizeHandler = function () {
                if (!ignoreResize) {
                    ignoreResize = true;
                    doResize();
                    clearTimeout(postResizeTimer);
                    postResizeTimer = setTimeout(function () {
                        doResize();
                        setTimeout(function () {
                            ignoreResize = false;
                        }, 10);
                    }, 100);
                }
            };

            // handle flexible/responsive layout
            if (options.flexible) {
                $(window).bind('resize orientationchange fontresize', delayedResizeHandler);
            }

            // handle complete page load including images and fonts
            $(window).bind('load', delayedResizeHandler);
        });
    };

    // detect css min-height support
    var supportMinHeight = typeof document.documentElement.style.maxHeight !== 'undefined';

    // get elements by rows
    function resizeElementsByRows(boxes, options) {
        var currentRow = $(), maxHeight, maxCalcHeight = 0, firstOffset = boxes.eq(0).offset().top;
        boxes.each(function (ind) {
            var curItem = $(this);
            if (curItem.offset().top === firstOffset) {
                currentRow = currentRow.add(this);
            } else {
                maxHeight = getMaxHeight(currentRow);
                maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
                currentRow = curItem;
                firstOffset = curItem.offset().top;
            }
        });
        if (currentRow.length) {
            maxHeight = getMaxHeight(currentRow);
            maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
        }
        if (options.biggestHeight) {
            boxes.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', maxCalcHeight);
        }
    }

    // calculate max element height
    function getMaxHeight(boxes) {
        var maxHeight = 0;
        boxes.each(function () {
            maxHeight = Math.max(maxHeight, $(this).outerHeight());
        });
        return maxHeight;
    }

    // resize helper function
    function resizeElements(boxes, parent, options) {
        var calcHeight;
        var parentHeight = typeof parent === 'number' ? parent : parent.height();
        boxes.removeClass(options.leftEdgeClass).removeClass(options.rightEdgeClass).each(function (i) {
            var element = $(this);
            var depthDiffHeight = 0;
            var isBorderBox = element.css('boxSizing') === 'border-box';

            if (typeof parent !== 'number') {
                element.parents().each(function () {
                    var tmpParent = $(this);
                    if (parent.is(this)) {
                        return false;
                    } else {
                        depthDiffHeight += tmpParent.outerHeight() - tmpParent.height();
                    }
                });
            }
            calcHeight = parentHeight - depthDiffHeight;
            calcHeight -= isBorderBox ? 0 : element.outerHeight() - element.height();

            if (calcHeight > 0) {
                element.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', calcHeight);
            }
        });
        boxes.filter(':first').addClass(options.leftEdgeClass);
        boxes.filter(':last').addClass(options.rightEdgeClass);
        return calcHeight;
    }
}(jQuery));

/*
 * jQuery FontResize Event
 */
jQuery.onFontResize = (function ($) {
    $(function () {
        var randomID = 'font-resize-frame-' + Math.floor(Math.random() * 1000);
        var resizeFrame = $('<iframe>').attr('id', randomID).addClass('font-resize-helper');

        // required styles
        resizeFrame.css({
            width: '100em',
            height: '10px',
            position: 'absolute',
            borderWidth: 0,
            top: '-9999px',
            left: '-9999px'
        }).appendTo('body');

        // use native IE resize event if possible
        if (window.attachEvent && !window.addEventListener) {
            resizeFrame.bind('resize', function () {
                $.onFontResize.trigger(resizeFrame[0].offsetWidth / 100);
            });
        }
        // use script inside the iframe to detect resize for other browsers
        else {
            var doc = resizeFrame[0].contentWindow.document;
            doc.open();
            doc.write('<scri' + 'pt>window.onload = function(){var em = parent.jQuery("#' + randomID + '")[0];window.onresize = function(){if(parent.jQuery.onFontResize){parent.jQuery.onFontResize.trigger(em.offsetWidth / 100);}}};</scri' + 'pt>');
            doc.close();
        }
        jQuery.onFontResize.initialSize = resizeFrame[0].offsetWidth / 100;
    });
    return {
        // public method, so it can be called from within the iframe
        trigger: function (em) {
            $(window).trigger("fontresize", [em]);
        }
    };
}(jQuery));

/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function (window, document, $) {

    // Opera Mini v7 doesn’t support placeholder although its DOM seems to indicate so
    var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]';
    var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
    var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;
    var prototype = $.fn;
    var valHooks = $.valHooks;
    var propHooks = $.propHooks;
    var hooks;
    var placeholder;

    if (isInputSupported && isTextareaSupported) {

        placeholder = prototype.placeholder = function () {
            return this;
        };

        placeholder.input = placeholder.textarea = true;

    } else {

        placeholder = prototype.placeholder = function () {
            var $this = this;
            $this
                .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
                .not('.placeholder')
                .bind({
                    'focus.placeholder': clearPlaceholder,
                    'blur.placeholder': setPlaceholder
                })
                .data('placeholder-enabled', true)
                .trigger('blur.placeholder');
            return $this;
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            'get': function (element) {
                var $element = $(element);

                var $passwordInput = $element.data('placeholder-password');
                if ($passwordInput) {
                    return $passwordInput[0].value;
                }

                return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
            },
            'set': function (element, value) {
                var $element = $(element);

                var $passwordInput = $element.data('placeholder-password');
                if ($passwordInput) {
                    return $passwordInput[0].value = value;
                }

                if (!$element.data('placeholder-enabled')) {
                    return element.value = value;
                }
                if (value == '') {
                    element.value = value;
                    // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
                    if (element != safeActiveElement()) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }
                } else if ($element.hasClass('placeholder')) {
                    clearPlaceholder.call(element, true, value) || (element.value = value);
                } else {
                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };

        if (!isInputSupported) {
            valHooks.input = hooks;
            propHooks.value = hooks;
        }
        if (!isTextareaSupported) {
            valHooks.textarea = hooks;
            propHooks.value = hooks;
        }

        $(function () {
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', function () {
                // Clear the placeholder values so they don't get submitted
                var $inputs = $('.placeholder', this).each(clearPlaceholder);
                setTimeout(function () {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function () {
            $('.placeholder').each(function () {
                this.value = '';
            });
        });

    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {};
        var rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function (i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });
        return newAttrs;
    }

    function clearPlaceholder(event, value) {
        var input = this;
        var $input = $(input);
        if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
            if ($input.data('placeholder-password')) {
                $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    return $input[0].value = value;
                }
                $input.focus();
            } else {
                input.value = '';
                $input.removeClass('placeholder');
                input == safeActiveElement() && input.select();
            }
        }
    }

    function setPlaceholder() {
        var $replacement;
        var input = this;
        var $input = $(input);
        var id = this.id;
        if (input.value == '') {
            if (input.type == 'password') {
                if (!$input.data('placeholder-textinput')) {
                    try {
                        $replacement = $input.clone().attr({'type': 'text'});
                    } catch (e) {
                        $replacement = $('<input>').attr($.extend(args(this), {'type': 'text'}));
                    }
                    $replacement
                        .removeAttr('name')
                        .data({
                            'placeholder-password': $input,
                            'placeholder-id': id
                        })
                        .bind('focus.placeholder', clearPlaceholder);
                    $input
                        .data({
                            'placeholder-textinput': $replacement,
                            'placeholder-id': id
                        })
                        .before($replacement);
                }
                $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
                // Note: `$input[0] != input` now!
            }
            $input.addClass('placeholder');
            $input[0].value = $input.attr('placeholder');
        } else {
            $input.removeClass('placeholder');
        }
    }

    function safeActiveElement() {
        // Avoid IE9 `document.activeElement` of death
        // https://github.com/mathiasbynens/jquery-placeholder/pull/99
        try {
            return document.activeElement;
        } catch (err) {
        }
    }

}(this, document, jQuery));

/*
 * JavaScript Custom Forms Module
 */
jcf = {
    // global options
    modules: {},
    plugins: {},
    baseOptions: {
        unselectableClass: 'jcf-unselectable',
        labelActiveClass: 'jcf-label-active',
        labelDisabledClass: 'jcf-label-disabled',
        classPrefix: 'jcf-class-',
        hiddenClass: 'jcf-hidden',
        focusClass: 'jcf-focus',
        wrapperTag: 'div'
    },
    // replacer function
    customForms: {
        setOptions: function (obj) {
            for (var p in obj) {
                if (obj.hasOwnProperty(p) && typeof obj[p] === 'object') {
                    jcf.lib.extend(jcf.modules[p].prototype.defaultOptions, obj[p]);
                }
            }
        },
        replaceAll: function (context) {
            for (var k in jcf.modules) {
                var els = jcf.lib.queryBySelector(jcf.modules[k].prototype.selector, context);
                for (var i = 0; i < els.length; i++) {
                    if (els[i].jcf) {
                        // refresh form element state
                        els[i].jcf.refreshState();
                    } else {
                        // replace form element
                        if (!jcf.lib.hasClass(els[i], 'default') && jcf.modules[k].prototype.checkElement(els[i])) {
                            new jcf.modules[k]({
                                replaces: els[i]
                            });
                        }
                    }
                }
            }
        },
        refreshAll: function (context) {
            for (var k in jcf.modules) {
                var els = jcf.lib.queryBySelector(jcf.modules[k].prototype.selector, context);
                for (var i = 0; i < els.length; i++) {
                    if (els[i].jcf) {
                        // refresh form element state
                        els[i].jcf.refreshState();
                    }
                }
            }
        },
        refreshElement: function (obj) {
            if (obj && obj.jcf) {
                obj.jcf.refreshState();
            }
        },
        destroyAll: function () {
            for (var k in jcf.modules) {
                var els = jcf.lib.queryBySelector(jcf.modules[k].prototype.selector);
                for (var i = 0; i < els.length; i++) {
                    if (els[i].jcf) {
                        els[i].jcf.destroy();
                    }
                }
            }
        }
    },
    // detect device type
    isTouchDevice: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    isWinPhoneDevice: navigator.msPointerEnabled && /MSIE 10.*Touch/.test(navigator.userAgent),
    // define base module
    setBaseModule: function (obj) {
        jcf.customControl = function (opt) {
            this.options = jcf.lib.extend({}, jcf.baseOptions, this.defaultOptions, opt);
            this.init();
        };
        for (var p in obj) {
            jcf.customControl.prototype[p] = obj[p];
        }
    },
    // add module to jcf.modules
    addModule: function (obj) {
        if (obj.name) {
            // create new module proto class
            jcf.modules[obj.name] = function () {
                jcf.modules[obj.name].superclass.constructor.apply(this, arguments);
            }
            jcf.lib.inherit(jcf.modules[obj.name], jcf.customControl);
            for (var p in obj) {
                jcf.modules[obj.name].prototype[p] = obj[p]
            }
            // on create module
            jcf.modules[obj.name].prototype.onCreateModule();
            // make callback for exciting modules
            for (var mod in jcf.modules) {
                if (jcf.modules[mod] != jcf.modules[obj.name]) {
                    jcf.modules[mod].prototype.onModuleAdded(jcf.modules[obj.name]);
                }
            }
        }
    },
    // add plugin to jcf.plugins
    addPlugin: function (obj) {
        if (obj && obj.name) {
            jcf.plugins[obj.name] = function () {
                this.init.apply(this, arguments);
            }
            for (var p in obj) {
                jcf.plugins[obj.name].prototype[p] = obj[p];
            }
        }
    },
    // miscellaneous init
    init: function () {
        if (navigator.pointerEnabled) {
            this.eventPress = 'pointerdown';
            this.eventMove = 'pointermove';
            this.eventRelease = 'pointerup';
        } else if (navigator.msPointerEnabled) {
            this.eventPress = 'MSPointerDown';
            this.eventMove = 'MSPointerMove';
            this.eventRelease = 'MSPointerUp';
        } else {
            this.eventPress = this.isTouchDevice ? 'touchstart' : 'mousedown';
            this.eventMove = this.isTouchDevice ? 'touchmove' : 'mousemove';
            this.eventRelease = this.isTouchDevice ? 'touchend' : 'mouseup';
        }

        setTimeout(function () {
            jcf.lib.domReady(function () {
                jcf.initStyles();
            });
        }, 1);
        return this;
    },
    initStyles: function () {
        // create <style> element and rules
        var head = document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            rules = document.createTextNode('.' + jcf.baseOptions.unselectableClass + '{' +
                '-moz-user-select:none;' +
                '-webkit-tap-highlight-color:rgba(255,255,255,0);' +
                '-webkit-user-select:none;' +
                'user-select:none;' +
                '}');

        // append style element
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = rules.nodeValue;
        } else {
            style.appendChild(rules);
        }
        head.appendChild(style);
    }
}.init();

/*
 * Custom Form Control prototype
 */
jcf.setBaseModule({
    init: function () {
        if (this.options.replaces) {
            this.realElement = this.options.replaces;
            this.realElement.jcf = this;
            this.replaceObject();
        }
    },
    defaultOptions: {
        // default module options (will be merged with base options)
    },
    checkElement: function (el) {
        return true; // additional check for correct form element
    },
    replaceObject: function () {
        this.createWrapper();
        this.attachEvents();
        this.fixStyles();
        this.setupWrapper();
    },
    createWrapper: function () {
        this.fakeElement = jcf.lib.createElement(this.options.wrapperTag);
        this.labelFor = jcf.lib.getLabelFor(this.realElement);
        jcf.lib.disableTextSelection(this.fakeElement);
        jcf.lib.addClass(this.fakeElement, jcf.lib.getAllClasses(this.realElement.className, this.options.classPrefix));
        jcf.lib.addClass(this.realElement, jcf.baseOptions.hiddenClass);
    },
    attachEvents: function () {
        jcf.lib.event.add(this.realElement, 'focus', this.onFocusHandler, this);
        jcf.lib.event.add(this.realElement, 'blur', this.onBlurHandler, this);
        jcf.lib.event.add(this.fakeElement, 'click', this.onFakeClick, this);
        jcf.lib.event.add(this.fakeElement, jcf.eventPress, this.onFakePressed, this);
        jcf.lib.event.add(this.fakeElement, jcf.eventRelease, this.onFakeReleased, this);

        if (this.labelFor) {
            this.labelFor.jcf = this;
            jcf.lib.event.add(this.labelFor, 'click', this.onFakeClick, this);
            jcf.lib.event.add(this.labelFor, jcf.eventPress, this.onFakePressed, this);
            jcf.lib.event.add(this.labelFor, jcf.eventRelease, this.onFakeReleased, this);
        }
    },
    fixStyles: function () {
        // hide mobile webkit tap effect
        if (jcf.isTouchDevice) {
            var tapStyle = 'rgba(255,255,255,0)';
            this.realElement.style.webkitTapHighlightColor = tapStyle;
            this.fakeElement.style.webkitTapHighlightColor = tapStyle;
            if (this.labelFor) {
                this.labelFor.style.webkitTapHighlightColor = tapStyle;
            }
        }
    },
    setupWrapper: function () {
        // implement in subclass
    },
    refreshState: function () {
        // implement in subclass
    },
    destroy: function () {
        if (this.fakeElement && this.fakeElement.parentNode) {
            this.fakeElement.parentNode.insertBefore(this.realElement, this.fakeElement);
            this.fakeElement.parentNode.removeChild(this.fakeElement);
        }
        jcf.lib.removeClass(this.realElement, jcf.baseOptions.hiddenClass);
        this.realElement.jcf = null;
    },
    onFocus: function () {
        // emulated focus event
        jcf.lib.addClass(this.fakeElement, this.options.focusClass);
    },
    onBlur: function (cb) {
        // emulated blur event
        jcf.lib.removeClass(this.fakeElement, this.options.focusClass);
    },
    onFocusHandler: function () {
        // handle focus loses
        if (this.focused) return;
        this.focused = true;

        // handle touch devices also
        if (jcf.isTouchDevice) {
            if (jcf.focusedInstance && jcf.focusedInstance.realElement != this.realElement) {
                jcf.focusedInstance.onBlur();
                jcf.focusedInstance.realElement.blur();
            }
            jcf.focusedInstance = this;
        }
        this.onFocus.apply(this, arguments);
    },
    onBlurHandler: function () {
        // handle focus loses
        if (!this.pressedFlag) {
            this.focused = false;
            this.onBlur.apply(this, arguments);
        }
    },
    onFakeClick: function () {
        if (jcf.isTouchDevice) {
            this.onFocus();
        } else if (!this.realElement.disabled) {
            this.realElement.focus();
        }
    },
    onFakePressed: function (e) {
        this.pressedFlag = true;
    },
    onFakeReleased: function () {
        this.pressedFlag = false;
    },
    onCreateModule: function () {
        // implement in subclass
    },
    onModuleAdded: function (module) {
        // implement in subclass
    },
    onControlReady: function () {
        // implement in subclass
    }
});

/*
 * JCF Utility Library
 */
jcf.lib = {
    bind: function (func, scope) {
        return function () {
            return func.apply(scope, arguments);
        };
    },
    browser: (function () {
        var ua = navigator.userAgent.toLowerCase(), res = {},
            match = /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || [];
        res[match[1]] = true;
        res.version = match[2] || "0";
        res.safariMac = ua.indexOf('mac') != -1 && ua.indexOf('safari') != -1;
        return res;
    })(),
    getOffset: function (obj) {
        if (obj.getBoundingClientRect && !jcf.isWinPhoneDevice) {
            var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            var clientLeft = document.documentElement.clientLeft || document.body.clientLeft || 0;
            var clientTop = document.documentElement.clientTop || document.body.clientTop || 0;
            return {
                top: Math.round(obj.getBoundingClientRect().top + scrollTop - clientTop),
                left: Math.round(obj.getBoundingClientRect().left + scrollLeft - clientLeft)
            };
        } else {
            var posLeft = 0, posTop = 0;
            while (obj.offsetParent) {
                posLeft += obj.offsetLeft;
                posTop += obj.offsetTop;
                obj = obj.offsetParent;
            }
            return {top: posTop, left: posLeft};
        }
    },
    getScrollTop: function () {
        return window.pageYOffset || document.documentElement.scrollTop;
    },
    getScrollLeft: function () {
        return window.pageXOffset || document.documentElement.scrollLeft;
    },
    getWindowWidth: function () {
        return document.compatMode == 'CSS1Compat' ? document.documentElement.clientWidth : document.body.clientWidth;
    },
    getWindowHeight: function () {
        return document.compatMode == 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight;
    },
    getStyle: function (el, prop) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(el, null)[prop];
        } else if (el.currentStyle) {
            return el.currentStyle[prop];
        } else {
            return el.style[prop];
        }
    },
    getParent: function (obj, selector) {
        while (obj.parentNode && obj.parentNode != document.body) {
            if (obj.parentNode.tagName.toLowerCase() == selector.toLowerCase()) {
                return obj.parentNode;
            }
            obj = obj.parentNode;
        }
        return false;
    },
    isParent: function (parent, child) {
        while (child.parentNode) {
            if (child.parentNode === parent) {
                return true;
            }
            child = child.parentNode;
        }
        return false;
    },
    getLabelFor: function (object) {
        var parentLabel = jcf.lib.getParent(object, 'label');
        if (parentLabel) {
            return parentLabel;
        } else if (object.id) {
            return jcf.lib.queryBySelector('label[for="' + object.id + '"]')[0];
        }
    },
    disableTextSelection: function (el) {
        if (typeof el.onselectstart !== 'undefined') {
            el.onselectstart = function () {
                return false;
            };
        } else if (window.opera) {
            el.setAttribute('unselectable', 'on');
        } else {
            jcf.lib.addClass(el, jcf.baseOptions.unselectableClass);
        }
    },
    enableTextSelection: function (el) {
        if (typeof el.onselectstart !== 'undefined') {
            el.onselectstart = null;
        } else if (window.opera) {
            el.removeAttribute('unselectable');
        } else {
            jcf.lib.removeClass(el, jcf.baseOptions.unselectableClass);
        }
    },
    queryBySelector: function (selector, scope) {
        if (typeof scope === 'string') {
            var result = [];
            var holders = this.getElementsBySelector(scope);
            for (var i = 0, contextNodes; i < holders.length; i++) {
                contextNodes = Array.prototype.slice.call(this.getElementsBySelector(selector, holders[i]));
                result = result.concat(contextNodes);
            }
            return result;
        } else {
            return this.getElementsBySelector(selector, scope);
        }
    },
    prevSibling: function (node) {
        while (node = node.previousSibling) if (node.nodeType == 1) break;
        return node;
    },
    nextSibling: function (node) {
        while (node = node.nextSibling) if (node.nodeType == 1) break;
        return node;
    },
    fireEvent: function (element, event) {
        if (element.dispatchEvent) {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent(event, true, true);
            return !element.dispatchEvent(evt);
        } else if (document.createEventObject) {
            var evt = document.createEventObject();
            return element.fireEvent('on' + event, evt);
        }
    },
    inherit: function (Child, Parent) {
        var F = function () {
        }
        F.prototype = Parent.prototype
        Child.prototype = new F()
        Child.prototype.constructor = Child
        Child.superclass = Parent.prototype
    },
    extend: function (obj) {
        for (var i = 1; i < arguments.length; i++) {
            for (var p in arguments[i]) {
                if (arguments[i].hasOwnProperty(p)) {
                    obj[p] = arguments[i][p];
                }
            }
        }
        return obj;
    },
    hasClass: function (obj, cname) {
        return (obj.className ? obj.className.match(new RegExp('(\\s|^)' + cname + '(\\s|$)')) : false);
    },
    addClass: function (obj, cname) {
        if (!this.hasClass(obj, cname)) obj.className += (!obj.className.length || obj.className.charAt(obj.className.length - 1) === ' ' ? '' : ' ') + cname;
    },
    removeClass: function (obj, cname) {
        if (this.hasClass(obj, cname)) obj.className = obj.className.replace(new RegExp('(\\s|^)' + cname + '(\\s|$)'), ' ').replace(/\s+$/, '');
    },
    toggleClass: function (obj, cname, condition) {
        if (condition) this.addClass(obj, cname); else this.removeClass(obj, cname);
    },
    createElement: function (tagName, options) {
        var el = document.createElement(tagName);
        for (var p in options) {
            if (options.hasOwnProperty(p)) {
                switch (p) {
                    case 'class':
                        el.className = options[p];
                        break;
                    case 'html':
                        el.innerHTML = options[p];
                        break;
                    case 'style':
                        this.setStyles(el, options[p]);
                        break;
                    default:
                        el.setAttribute(p, options[p]);
                }
            }
        }
        return el;
    },
    setStyles: function (el, styles) {
        for (var p in styles) {
            if (styles.hasOwnProperty(p)) {
                switch (p) {
                    case 'float':
                        el.style.cssFloat = styles[p];
                        break;
                    case 'opacity':
                        el.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + styles[p] * 100 + ')';
                        el.style.opacity = styles[p];
                        break;
                    default:
                        el.style[p] = (typeof styles[p] === 'undefined' ? 0 : styles[p]) + (typeof styles[p] === 'number' ? 'px' : '');
                }
            }
        }
        return el;
    },
    getInnerWidth: function (el) {
        return el.offsetWidth - (parseInt(this.getStyle(el, 'paddingLeft')) || 0) - (parseInt(this.getStyle(el, 'paddingRight')) || 0);
    },
    getInnerHeight: function (el) {
        return el.offsetHeight - (parseInt(this.getStyle(el, 'paddingTop')) || 0) - (parseInt(this.getStyle(el, 'paddingBottom')) || 0);
    },
    getAllClasses: function (cname, prefix, skip) {
        if (!skip) skip = '';
        if (!prefix) prefix = '';
        return cname ? cname.replace(new RegExp('(\\s|^)' + skip + '(\\s|$)'), ' ').replace(/[\s]*([\S]+)+[\s]*/gi, prefix + "$1 ") : '';
    },
    getElementsBySelector: function (selector, scope) {
        if (typeof document.querySelectorAll === 'function') {
            return (scope || document).querySelectorAll(selector);
        }
        var selectors = selector.split(',');
        var resultList = [];
        for (var s = 0; s < selectors.length; s++) {
            var currentContext = [scope || document];
            var tokens = selectors[s].replace(/^\s+/, '').replace(/\s+$/, '').split(' ');
            for (var i = 0; i < tokens.length; i++) {
                token = tokens[i].replace(/^\s+/, '').replace(/\s+$/, '');
                if (token.indexOf('#') > -1) {
                    var bits = token.split('#'), tagName = bits[0], id = bits[1];
                    var element = document.getElementById(id);
                    if (tagName && element.nodeName.toLowerCase() != tagName) {
                        return [];
                    }
                    currentContext = [element];
                    continue;
                }
                if (token.indexOf('.') > -1) {
                    var bits = token.split('.'), tagName = bits[0] || '*', className = bits[1], found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; j < elements.length; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (found[k].className && found[k].className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^"]*)"?\]$/)) {
                    var tagName = RegExp.$1 || '*', attrName = RegExp.$2, attrOperator = RegExp.$3, attrValue = RegExp.$4;
                    if (attrName.toLowerCase() == 'for' && this.browser.msie && this.browser.version < 8) {
                        attrName = 'htmlFor';
                    }
                    var found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; elements[j]; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0, checkFunction;
                    switch (attrOperator) {
                        case '=':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName) == attrValue)
                            };
                            break;
                        case '~':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).match(new RegExp('(\\s|^)' + attrValue + '(\\s|$)')))
                            };
                            break;
                        case '|':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).match(new RegExp('^' + attrValue + '-?')))
                            };
                            break;
                        case '^':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).indexOf(attrValue) == 0)
                            };
                            break;
                        case '$':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length)
                            };
                            break;
                        case '*':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).indexOf(attrValue) > -1)
                            };
                            break;
                        default :
                            checkFunction = function (e) {
                                return e.getAttribute(attrName)
                            };
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (checkFunction(found[k])) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                tagName = token;
                var found = [], foundCount = 0;
                for (var h = 0; h < currentContext.length; h++) {
                    var elements = currentContext[h].getElementsByTagName(tagName);
                    for (var j = 0; j < elements.length; j++) {
                        found[foundCount++] = elements[j];
                    }
                }
                currentContext = found;
            }
            resultList = [].concat(resultList, currentContext);
        }
        return resultList;
    },
    scrollSize: (function () {
        var content, hold, sizeBefore, sizeAfter;

        function buildSizer() {
            if (hold) removeSizer();
            content = document.createElement('div');
            hold = document.createElement('div');
            hold.style.cssText = 'position:absolute;overflow:hidden;width:100px;height:100px';
            hold.appendChild(content);
            document.body.appendChild(hold);
        }

        function removeSizer() {
            document.body.removeChild(hold);
            hold = null;
        }

        function calcSize(vertical) {
            buildSizer();
            content.style.cssText = 'height:' + (vertical ? '100%' : '200px');
            sizeBefore = (vertical ? content.offsetHeight : content.offsetWidth);
            hold.style.overflow = 'scroll';
            content.innerHTML = 1;
            sizeAfter = (vertical ? content.offsetHeight : content.offsetWidth);
            if (vertical && hold.clientHeight) sizeAfter = hold.clientHeight;
            removeSizer();
            return sizeBefore - sizeAfter;
        }

        return {
            getWidth: function () {
                return calcSize(false);
            },
            getHeight: function () {
                return calcSize(true)
            }
        }
    }()),
    domReady: function (handler) {
        var called = false

        function ready() {
            if (called) return;
            called = true;
            handler();
        }

        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", ready, false);
        } else if (document.attachEvent) {
            if (document.documentElement.doScroll && window == window.top) {
                function tryScroll() {
                    if (called) return
                    if (!document.body) return
                    try {
                        document.documentElement.doScroll("left")
                        ready()
                    } catch (e) {
                        setTimeout(tryScroll, 0)
                    }
                }

                tryScroll()
            }
            document.attachEvent("onreadystatechange", function () {
                if (document.readyState === "complete") {
                    ready()
                }
            })
        }
        if (window.addEventListener) window.addEventListener('load', ready, false)
        else if (window.attachEvent) window.attachEvent('onload', ready)
    },
    event: (function () {
        var guid = 0;

        function fixEvent(e) {
            e = e || window.event;
            if (e.isFixed) {
                return e;
            }
            e.isFixed = true;
            e.preventDefault = e.preventDefault || function () {
                    this.returnValue = false
                }
            e.stopPropagation = e.stopPropagation || function () {
                    this.cancelBubble = true
                }
            if (!e.target) {
                e.target = e.srcElement
            }
            if (!e.relatedTarget && e.fromElement) {
                e.relatedTarget = e.fromElement == e.target ? e.toElement : e.fromElement;
            }
            if (e.pageX == null && e.clientX != null) {
                var html = document.documentElement, body = document.body;
                e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
                e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
            }
            if (!e.which && e.button) {
                e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0));
            }
            if (e.type === "DOMMouseScroll" || e.type === 'mousewheel') {
                e.mWheelDelta = 0;
                if (e.wheelDelta) {
                    e.mWheelDelta = e.wheelDelta / 120;
                } else if (e.detail) {
                    e.mWheelDelta = -e.detail / 3;
                }
            }
            return e;
        }

        function commonHandle(event, customScope) {
            event = fixEvent(event);
            var handlers = this.events[event.type];
            for (var g in handlers) {
                var handler = handlers[g];
                var ret = handler.call(customScope || this, event);
                if (ret === false) {
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
        }

        var publicAPI = {
            add: function (elem, type, handler, forcedScope) {
                if (elem.setInterval && (elem != window && !elem.frameElement)) {
                    elem = window;
                }
                if (!handler.guid) {
                    handler.guid = ++guid;
                }
                if (!elem.events) {
                    elem.events = {};
                    elem.handle = function (event) {
                        return commonHandle.call(elem, event);
                    }
                }
                if (!elem.events[type]) {
                    elem.events[type] = {};
                    if (elem.addEventListener) elem.addEventListener(type, elem.handle, false);
                    else if (elem.attachEvent) elem.attachEvent("on" + type, elem.handle);
                    if (type === 'mousewheel') {
                        publicAPI.add(elem, 'DOMMouseScroll', handler, forcedScope);
                    }
                }
                var fakeHandler = jcf.lib.bind(handler, forcedScope);
                fakeHandler.guid = handler.guid;
                elem.events[type][handler.guid] = forcedScope ? fakeHandler : handler;
            },
            remove: function (elem, type, handler) {
                var handlers = elem.events && elem.events[type];
                if (!handlers) return;
                delete handlers[handler.guid];
                for (var any in handlers) return;
                if (elem.removeEventListener) elem.removeEventListener(type, elem.handle, false);
                else if (elem.detachEvent) elem.detachEvent("on" + type, elem.handle);
                delete elem.events[type];
                for (var any in elem.events) return;
                try {
                    delete elem.handle;
                    delete elem.events;
                } catch (e) {
                    if (elem.removeAttribute) {
                        elem.removeAttribute("handle");
                        elem.removeAttribute("events");
                    }
                }
                if (type === 'mousewheel') {
                    publicAPI.remove(elem, 'DOMMouseScroll', handler);
                }
            }
        }
        return publicAPI;
    }())
}

// custom select module
jcf.addModule({
    name: 'select',
    selector: 'select',
    defaultOptions: {
        useNativeDropOnMobileDevices: true,
        hideDropOnScroll: true,
        showNativeDrop: false,
        handleDropPosition: false,
        selectDropPosition: 'bottom', // or 'top'
        wrapperClass: 'select-area',
        focusClass: 'select-focus',
        dropActiveClass: 'select-active',
        selectedClass: 'item-selected',
        currentSelectedClass: 'current-selected',
        disabledClass: 'select-disabled',
        valueSelector: 'span.center',
        optGroupClass: 'optgroup',
        openerSelector: 'a.select-opener',
        selectStructure: '<span class="left"></span><span class="center"></span><a class="select-opener"></a>',
        wrapperTag: 'span',
        classPrefix: 'select-',
        dropMaxHeight: 200,
        dropFlippedClass: 'select-options-flipped',
        dropHiddenClass: 'options-hidden',
        dropScrollableClass: 'options-overflow',
        dropClass: 'select-options',
        dropClassPrefix: 'drop-',
        dropStructure: '<div class="drop-holder"><div class="drop-list"></div></div>',
        dropSelector: 'div.drop-list'
    },
    checkElement: function (el) {
        return (!el.size && !el.multiple);
    },
    setupWrapper: function () {
        jcf.lib.addClass(this.fakeElement, this.options.wrapperClass);
        this.realElement.parentNode.insertBefore(this.fakeElement, this.realElement.nextSibling);
        this.fakeElement.innerHTML = this.options.selectStructure;
        this.fakeElement.style.width = (this.realElement.offsetWidth > 0 ? this.realElement.offsetWidth + 'px' : 'auto');

        // show native drop if specified in options
        if (this.options.useNativeDropOnMobileDevices && (jcf.isTouchDevice || jcf.isWinPhoneDevice)) {
            this.options.showNativeDrop = true;
        }
        if (this.options.showNativeDrop) {
            this.fakeElement.appendChild(this.realElement);
            jcf.lib.removeClass(this.realElement, this.options.hiddenClass);
            jcf.lib.setStyles(this.realElement, {
                top: 0,
                left: 0,
                margin: 0,
                padding: 0,
                opacity: 0,
                border: 'none',
                position: 'absolute',
                width: jcf.lib.getInnerWidth(this.fakeElement) - 1,
                height: jcf.lib.getInnerHeight(this.fakeElement) - 1
            });
            jcf.lib.event.add(this.realElement, jcf.eventPress, function () {
                this.realElement.title = '';
            }, this)
        }

        // create select body
        this.opener = jcf.lib.queryBySelector(this.options.openerSelector, this.fakeElement)[0];
        this.valueText = jcf.lib.queryBySelector(this.options.valueSelector, this.fakeElement)[0];
        jcf.lib.disableTextSelection(this.valueText);
        this.opener.jcf = this;

        if (!this.options.showNativeDrop) {
            this.createDropdown();
            this.refreshState();
            this.onControlReady(this);
            this.hideDropdown(true);
        } else {
            this.refreshState();
        }
        this.addEvents();
    },
    addEvents: function () {
        if (this.options.showNativeDrop) {
            jcf.lib.event.add(this.realElement, 'click', this.onChange, this);
        } else {
            jcf.lib.event.add(this.fakeElement, 'click', this.toggleDropdown, this);
        }
        jcf.lib.event.add(this.realElement, 'change', this.onChange, this);
    },
    onFakeClick: function () {
        // do nothing (drop toggles by toggleDropdown method)
    },
    onFocus: function () {
        jcf.modules[this.name].superclass.onFocus.apply(this, arguments);
        if (!this.options.showNativeDrop) {
            // Mac Safari Fix
            if (jcf.lib.browser.safariMac) {
                this.realElement.setAttribute('size', '2');
            }
            jcf.lib.event.add(this.realElement, 'keydown', this.onKeyDown, this);
            if (jcf.activeControl && jcf.activeControl != this) {
                jcf.activeControl.hideDropdown();
                jcf.activeControl = this;
            }
        }
    },
    onBlur: function () {
        if (!this.options.showNativeDrop) {
            // Mac Safari Fix
            if (jcf.lib.browser.safariMac) {
                this.realElement.removeAttribute('size');
            }
            if (!this.isActiveDrop() || !this.isOverDrop()) {
                jcf.modules[this.name].superclass.onBlur.apply(this);
                if (jcf.activeControl === this) jcf.activeControl = null;
                if (!jcf.isTouchDevice) {
                    this.hideDropdown();
                }
            }
            jcf.lib.event.remove(this.realElement, 'keydown', this.onKeyDown);
        } else {
            jcf.modules[this.name].superclass.onBlur.apply(this);
        }
    },
    onChange: function () {
        this.refreshState();
    },
    onKeyDown: function (e) {
        this.dropOpened = true;
        jcf.tmpFlag = true;
        setTimeout(function () {
            jcf.tmpFlag = false
        }, 100);
        var context = this;
        context.keyboardFix = true;
        setTimeout(function () {
            context.refreshState();
        }, 10);
        if (e.keyCode == 13) {
            context.toggleDropdown.apply(context);
            return false;
        }
    },
    onResizeWindow: function (e) {
        if (this.isActiveDrop()) {
            this.hideDropdown();
        }
    },
    onScrollWindow: function (e) {
        if (this.options.hideDropOnScroll) {
            this.hideDropdown();
        } else if (this.isActiveDrop()) {
            this.positionDropdown();
        }
    },
    onOptionClick: function (e) {
        var opener = e.target && e.target.tagName && e.target.tagName.toLowerCase() == 'li' ? e.target : jcf.lib.getParent(e.target, 'li');
        if (opener) {
            this.dropOpened = true;
            this.realElement.selectedIndex = parseInt(opener.getAttribute('rel'));
            if (jcf.isTouchDevice) {
                this.onFocus();
            } else {
                this.realElement.focus();
            }
            this.refreshState();
            this.hideDropdown();
            jcf.lib.fireEvent(this.realElement, 'change');
        }
        return false;
    },
    onClickOutside: function (e) {
        if (jcf.tmpFlag) {
            jcf.tmpFlag = false;
            return;
        }
        if (!jcf.lib.isParent(this.fakeElement, e.target) && !jcf.lib.isParent(this.selectDrop, e.target)) {
            this.hideDropdown();
        }
    },
    onDropHover: function (e) {
        if (!this.keyboardFix) {
            this.hoverFlag = true;
            var opener = e.target && e.target.tagName && e.target.tagName.toLowerCase() == 'li' ? e.target : jcf.lib.getParent(e.target, 'li');
            if (opener) {
                this.realElement.selectedIndex = parseInt(opener.getAttribute('rel'));
                this.refreshSelectedClass(parseInt(opener.getAttribute('rel')));
            }
        } else {
            this.keyboardFix = false;
        }
    },
    onDropLeave: function () {
        this.hoverFlag = false;
    },
    isActiveDrop: function () {
        return !jcf.lib.hasClass(this.selectDrop, this.options.dropHiddenClass);
    },
    isOverDrop: function () {
        return this.hoverFlag;
    },
    createDropdown: function () {
        // remove old dropdown if exists
        if (this.selectDrop) {
            this.selectDrop.parentNode.removeChild(this.selectDrop);
        }

        // create dropdown holder
        this.selectDrop = document.createElement('div');
        this.selectDrop.className = this.options.dropClass;
        this.selectDrop.innerHTML = this.options.dropStructure;
        jcf.lib.setStyles(this.selectDrop, {position: 'absolute'});
        this.selectList = jcf.lib.queryBySelector(this.options.dropSelector, this.selectDrop)[0];
        jcf.lib.addClass(this.selectDrop, this.options.dropHiddenClass);
        document.body.appendChild(this.selectDrop);
        this.selectDrop.jcf = this;
        jcf.lib.event.add(this.selectDrop, 'click', this.onOptionClick, this);
        jcf.lib.event.add(this.selectDrop, 'mouseover', this.onDropHover, this);
        jcf.lib.event.add(this.selectDrop, 'mouseout', this.onDropLeave, this);
        this.buildDropdown();
    },
    buildDropdown: function () {
        // build select options / optgroups
        this.buildDropdownOptions();

        // position and resize dropdown
        this.positionDropdown();

        // cut dropdown if height exceedes
        this.buildDropdownScroll();
    },
    buildDropdownOptions: function () {
        this.resStructure = '';
        this.optNum = 0;
        for (var i = 0; i < this.realElement.children.length; i++) {
            this.resStructure += this.buildElement(this.realElement.children[i], i) + '\n';
        }
        this.selectList.innerHTML = this.resStructure;
    },
    buildDropdownScroll: function () {
        jcf.lib.addClass(this.selectDrop, jcf.lib.getAllClasses(this.realElement.className, this.options.dropClassPrefix, jcf.baseOptions.hiddenClass));
        if (this.options.dropMaxHeight) {
            if (this.selectDrop.offsetHeight > this.options.dropMaxHeight) {
                this.selectList.style.height = this.options.dropMaxHeight + 'px';
                this.selectList.style.overflow = 'auto';
                this.selectList.style.overflowX = 'hidden';
                jcf.lib.addClass(this.selectDrop, this.options.dropScrollableClass);
            }
        }
    },
    parseOptionTitle: function (optTitle) {
        return (typeof optTitle === 'string' && /\.(jpg|gif|png|bmp|jpeg)(.*)?$/i.test(optTitle)) ? optTitle : '';
    },
    buildElement: function (obj, index) {
        // build option
        var res = '', optImage;
        if (obj.tagName.toLowerCase() == 'option') {
            if (!jcf.lib.prevSibling(obj) || jcf.lib.prevSibling(obj).tagName.toLowerCase() != 'option') {
                res += '<ul>';
            }

            optImage = this.parseOptionTitle(obj.title);
            res += '<li rel="' + (this.optNum++) + '" class="' + (obj.className ? obj.className + ' ' : '') + (index % 2 ? 'option-even ' : '') + 'jcfcalc"><a href="#">' + (optImage ? '<img src="' + optImage + '" alt="" />' : '') + '<span>' + obj.innerHTML + '</span></a></li>';
            if (!jcf.lib.nextSibling(obj) || jcf.lib.nextSibling(obj).tagName.toLowerCase() != 'option') {
                res += '</ul>';
            }
            return res;
        }
        // build option group with options
        else if (obj.tagName.toLowerCase() == 'optgroup' && obj.label) {
            res += '<div class="' + this.options.optGroupClass + '">';
            res += '<strong class="jcfcalc"><em>' + (obj.label) + '</em></strong>';
            for (var i = 0; i < obj.children.length; i++) {
                res += this.buildElement(obj.children[i], i);
            }
            res += '</div>';
            return res;
        }
    },
    positionDropdown: function () {
        var ofs = jcf.lib.getOffset(this.fakeElement), selectAreaHeight = this.fakeElement.offsetHeight, selectDropHeight = this.selectDrop.offsetHeight;
        var fitInTop = ofs.top - selectDropHeight >= jcf.lib.getScrollTop() && jcf.lib.getScrollTop() + jcf.lib.getWindowHeight() < ofs.top + selectAreaHeight + selectDropHeight;


        if ((this.options.handleDropPosition && fitInTop) || this.options.selectDropPosition === 'top') {
            this.selectDrop.style.top = (ofs.top - selectDropHeight) + 'px';
            jcf.lib.addClass(this.selectDrop, this.options.dropFlippedClass);
            jcf.lib.addClass(this.fakeElement, this.options.dropFlippedClass);
        } else {
            this.selectDrop.style.top = (ofs.top + selectAreaHeight) + 'px';
            jcf.lib.removeClass(this.selectDrop, this.options.dropFlippedClass);
            jcf.lib.removeClass(this.fakeElement, this.options.dropFlippedClass);
        }
        this.selectDrop.style.left = ofs.left + 'px';
        this.selectDrop.style.width = this.fakeElement.offsetWidth + 'px';
    },
    showDropdown: function () {
        document.body.appendChild(this.selectDrop);
        jcf.lib.removeClass(this.selectDrop, this.options.dropHiddenClass);
        jcf.lib.addClass(this.fakeElement, this.options.dropActiveClass);
        this.positionDropdown();

        // highlight current active item
        var activeItem = this.getFakeActiveOption();
        this.removeClassFromItems(this.options.currentSelectedClass);
        jcf.lib.addClass(activeItem, this.options.currentSelectedClass);

        // show current dropdown
        jcf.lib.event.add(window, 'resize', this.onResizeWindow, this);
        jcf.lib.event.add(window, 'scroll', this.onScrollWindow, this);
        jcf.lib.event.add(document, jcf.eventPress, this.onClickOutside, this);
        this.positionDropdown();
    },
    hideDropdown: function (partial) {
        if (this.selectDrop.parentNode) {
            if (this.selectDrop.offsetWidth) {
                this.selectDrop.parentNode.removeChild(this.selectDrop);
            }
            if (partial) {
                return;
            }
        }
        if (typeof this.origSelectedIndex === 'number') {
            this.realElement.selectedIndex = this.origSelectedIndex;
        }
        jcf.lib.removeClass(this.fakeElement, this.options.dropActiveClass);
        jcf.lib.addClass(this.selectDrop, this.options.dropHiddenClass);
        jcf.lib.event.remove(window, 'resize', this.onResizeWindow);
        jcf.lib.event.remove(window, 'scroll', this.onScrollWindow);
        jcf.lib.event.remove(document.documentElement, jcf.eventPress, this.onClickOutside);
        if (jcf.isTouchDevice) {
            this.onBlur();
        }
    },
    toggleDropdown: function () {
        if (!this.realElement.disabled && this.realElement.options.length) {
            if (jcf.isTouchDevice) {
                this.onFocus();
            } else {
                this.realElement.focus();
            }
            if (this.isActiveDrop()) {
                this.hideDropdown();
            } else {
                this.showDropdown();
            }
            this.refreshState();
        }
    },
    scrollToItem: function () {
        if (this.isActiveDrop()) {
            var dropHeight = this.selectList.offsetHeight;
            var offsetTop = this.calcOptionOffset(this.getFakeActiveOption());
            var sTop = this.selectList.scrollTop;
            var oHeight = this.getFakeActiveOption().offsetHeight;
            //offsetTop+=sTop;

            if (offsetTop >= sTop + dropHeight) {
                this.selectList.scrollTop = offsetTop - dropHeight + oHeight;
            } else if (offsetTop < sTop) {
                this.selectList.scrollTop = offsetTop;
            }
        }
    },
    getFakeActiveOption: function (c) {
        return jcf.lib.queryBySelector('li[rel="' + (typeof c === 'number' ? c : this.realElement.selectedIndex) + '"]', this.selectList)[0];
    },
    calcOptionOffset: function (fake) {
        var h = 0;
        var els = jcf.lib.queryBySelector('.jcfcalc', this.selectList);
        for (var i = 0; i < els.length; i++) {
            if (els[i] == fake) break;
            h += els[i].offsetHeight;
        }
        return h;
    },
    childrenHasItem: function (hold, item) {
        var items = hold.getElementsByTagName('*');
        for (i = 0; i < items.length; i++) {
            if (items[i] == item) return true;
        }
        return false;
    },
    removeClassFromItems: function (className) {
        var children = jcf.lib.queryBySelector('li', this.selectList);
        for (var i = children.length - 1; i >= 0; i--) {
            jcf.lib.removeClass(children[i], className);
        }
    },
    setSelectedClass: function (c) {
        var activeOption = this.getFakeActiveOption(c);
        if (activeOption) {
            jcf.lib.addClass(activeOption, this.options.selectedClass);
        }
    },
    refreshSelectedClass: function (c) {
        if (!this.options.showNativeDrop) {
            this.removeClassFromItems(this.options.selectedClass);
            this.setSelectedClass(c);
        }
        if (this.realElement.disabled) {
            jcf.lib.addClass(this.fakeElement, this.options.disabledClass);
            if (this.labelFor) {
                jcf.lib.addClass(this.labelFor, this.options.labelDisabledClass);
            }
        } else {
            jcf.lib.removeClass(this.fakeElement, this.options.disabledClass);
            if (this.labelFor) {
                jcf.lib.removeClass(this.labelFor, this.options.labelDisabledClass);
            }
        }
    },
    refreshSelectedText: function () {
        if (!this.dropOpened && this.realElement.title) {
            this.valueText.innerHTML = this.realElement.title;
        } else {
            var activeOption = this.realElement.options[this.realElement.selectedIndex];
            if (activeOption) {
                if (activeOption.title) {
                    var optImage = this.parseOptionTitle(this.realElement.options[this.realElement.selectedIndex].title);
                    this.valueText.innerHTML = (optImage ? '<img src="' + optImage + '" alt="" />' : '') + this.realElement.options[this.realElement.selectedIndex].innerHTML;
                } else {
                    this.valueText.innerHTML = this.realElement.options[this.realElement.selectedIndex].innerHTML;
                }
            }
        }
    },
    refreshState: function () {
        this.origSelectedIndex = this.realElement.selectedIndex;
        this.refreshSelectedClass();
        this.refreshSelectedText();
        if (!this.options.showNativeDrop) {
            this.positionDropdown();
            if (this.selectDrop.offsetWidth) {
                this.scrollToItem();
            }
        }
    }
});

// custom radio module
jcf.addModule({
    name: 'radio',
    selector: 'input[type="radio"]',
    defaultOptions: {
        wrapperClass: 'rad-area',
        focusClass: 'rad-focus',
        checkedClass: 'rad-checked',
        uncheckedClass: 'rad-unchecked',
        disabledClass: 'rad-disabled',
        radStructure: '<span></span>'
    },
    getRadioGroup: function (item) {
        var name = item.getAttribute('name');
        if (name) {
            return jcf.lib.queryBySelector('input[name="' + name + '"]', jcf.lib.getParent('form'));
        } else {
            return [item];
        }
    },
    setupWrapper: function () {
        jcf.lib.addClass(this.fakeElement, this.options.wrapperClass);
        this.fakeElement.innerHTML = this.options.radStructure;
        this.realElement.parentNode.insertBefore(this.fakeElement, this.realElement);
        this.refreshState();
        this.addEvents();
    },
    addEvents: function () {
        jcf.lib.event.add(this.fakeElement, 'click', this.toggleRadio, this);
        if (this.labelFor) {
            jcf.lib.event.add(this.labelFor, 'click', this.toggleRadio, this);
        }
    },
    onFocus: function (e) {
        jcf.modules[this.name].superclass.onFocus.apply(this, arguments);
        setTimeout(jcf.lib.bind(function () {
            this.refreshState();
        }, this), 10);
    },
    toggleRadio: function () {
        if (!this.realElement.disabled && !this.realElement.checked) {
            this.realElement.checked = true;
            jcf.lib.fireEvent(this.realElement, 'change');
        }
        this.refreshState();
    },
    refreshState: function () {
        var els = this.getRadioGroup(this.realElement);
        for (var i = 0; i < els.length; i++) {
            var curEl = els[i].jcf;
            if (curEl) {
                if (curEl.realElement.checked) {
                    jcf.lib.addClass(curEl.fakeElement, curEl.options.checkedClass);
                    jcf.lib.removeClass(curEl.fakeElement, curEl.options.uncheckedClass);
                    if (curEl.labelFor) {
                        jcf.lib.addClass(curEl.labelFor, curEl.options.labelActiveClass);
                    }
                } else {
                    jcf.lib.removeClass(curEl.fakeElement, curEl.options.checkedClass);
                    jcf.lib.addClass(curEl.fakeElement, curEl.options.uncheckedClass);
                    if (curEl.labelFor) {
                        jcf.lib.removeClass(curEl.labelFor, curEl.options.labelActiveClass);
                    }
                }
                if (curEl.realElement.disabled) {
                    jcf.lib.addClass(curEl.fakeElement, curEl.options.disabledClass);
                    if (curEl.labelFor) {
                        jcf.lib.addClass(curEl.labelFor, curEl.options.labelDisabledClass);
                    }
                } else {
                    jcf.lib.removeClass(curEl.fakeElement, curEl.options.disabledClass);
                    if (curEl.labelFor) {
                        jcf.lib.removeClass(curEl.labelFor, curEl.options.labelDisabledClass);
                    }
                }
            }
        }
    }
});

// custom checkbox module
jcf.addModule({
    name: 'checkbox',
    selector: 'input[type="checkbox"]',
    defaultOptions: {
        wrapperClass: 'chk-area',
        focusClass: 'chk-focus',
        checkedClass: 'chk-checked',
        labelActiveClass: 'chk-label-active',
        uncheckedClass: 'chk-unchecked',
        disabledClass: 'chk-disabled',
        chkStructure: '<span></span>'
    },
    setupWrapper: function () {
        jcf.lib.addClass(this.fakeElement, this.options.wrapperClass);
        this.fakeElement.innerHTML = this.options.chkStructure;
        this.realElement.parentNode.insertBefore(this.fakeElement, this.realElement);
        jcf.lib.event.add(this.realElement, 'click', this.onRealClick, this);
        this.refreshState();
    },
    isLinkTarget: function (target, limitParent) {
        while (target.parentNode || target === limitParent) {
            if (target.tagName.toLowerCase() === 'a') {
                return true;
            }
            target = target.parentNode;
        }
    },
    onFakePressed: function () {
        jcf.modules[this.name].superclass.onFakePressed.apply(this, arguments);
        if (!this.realElement.disabled) {
            this.realElement.focus();
        }
    },
    onFakeClick: function (e) {
        jcf.modules[this.name].superclass.onFakeClick.apply(this, arguments);
        this.tmpTimer = setTimeout(jcf.lib.bind(function () {
            this.toggle();
        }, this), 10);
        if (!this.isLinkTarget(e.target, this.labelFor)) {
            return false;
        }
    },
    onRealClick: function (e) {
        setTimeout(jcf.lib.bind(function () {
            this.refreshState();
        }, this), 10);
        e.stopPropagation();
    },
    toggle: function (e) {
        if (!this.realElement.disabled) {
            if (this.realElement.checked) {
                this.realElement.checked = false;
            } else {
                this.realElement.checked = true;
            }
        }
        this.refreshState();
        jcf.lib.fireEvent(this.realElement, 'change');
        return false;
    },
    refreshState: function () {
        if (this.realElement.checked) {
            jcf.lib.addClass(this.fakeElement, this.options.checkedClass);
            jcf.lib.removeClass(this.fakeElement, this.options.uncheckedClass);
            if (this.labelFor) {
                jcf.lib.addClass(this.labelFor, this.options.labelActiveClass);
            }
        } else {
            jcf.lib.removeClass(this.fakeElement, this.options.checkedClass);
            jcf.lib.addClass(this.fakeElement, this.options.uncheckedClass);
            if (this.labelFor) {
                jcf.lib.removeClass(this.labelFor, this.options.labelActiveClass);
            }
        }
        if (this.realElement.disabled) {
            jcf.lib.addClass(this.fakeElement, this.options.disabledClass);
            if (this.labelFor) {
                jcf.lib.addClass(this.labelFor, this.options.labelDisabledClass);
            }
        } else {
            jcf.lib.removeClass(this.fakeElement, this.options.disabledClass);
            if (this.labelFor) {
                jcf.lib.removeClass(this.labelFor, this.options.labelDisabledClass);
            }
        }
    }
});

// custom upload field module
jcf.addModule({
    name: 'file',
    selector: 'input[type="file"]',
    defaultOptions: {
        buttonWidth: 30,
        bigFontSize: 200,
        buttonText: 'Browse...',
        wrapperClass: 'file-area',
        focusClass: 'file-focus',
        disabledClass: 'file-disabled',
        opacityClass: 'file-input-opacity',
        noFileClass: 'no-file',
        extPrefixClass: 'extension-',
        uploadStructure: '<div class="jcf-input-wrapper"><div class="jcf-wrap"></div><label class="jcf-fake-input"><span><em></em></span></label><a class="jcf-upload-button"><span></span></a></div>',
        uploadFileNameSelector: 'label.jcf-fake-input span em',
        uploadButtonSelector: 'a.jcf-upload-button span',
        inputWrapper: 'div.jcf-wrap'
    },
    setupWrapper: function () {
        jcf.lib.addClass(this.fakeElement, this.options.wrapperClass);
        this.fakeElement.innerHTML = this.options.uploadStructure;
        this.realElement.parentNode.insertBefore(this.fakeElement, this.realElement);
        this.fileNameInput = jcf.lib.queryBySelector(this.options.uploadFileNameSelector, this.fakeElement)[0];
        this.uploadButton = jcf.lib.queryBySelector(this.options.uploadButtonSelector, this.fakeElement)[0];
        this.inputWrapper = jcf.lib.queryBySelector(this.options.inputWrapper, this.fakeElement)[0];

        this.origElem = jcf.lib.nextSibling(this.realElement);
        if (this.origElem && this.origElem.className.indexOf('file-input-text') > -1) {
            this.origElem.parentNode.removeChild(this.origElem);
            this.origTitle = this.origElem.innerHTML;
            this.fileNameInput.innerHTML = this.origTitle;
        }
        this.uploadButton.innerHTML = this.realElement.title || this.options.buttonText;
        this.realElement.removeAttribute('title');
        this.fakeElement.style.position = 'relative';
        this.realElement.style.position = 'absolute';
        this.realElement.style.zIndex = 100;
        this.inputWrapper.appendChild(this.realElement);
        this.oTop = this.oLeft = this.oWidth = this.oHeight = 0;

        jcf.lib.addClass(this.realElement, this.options.opacityClass);
        jcf.lib.removeClass(this.realElement, jcf.baseOptions.hiddenClass);
        this.inputWrapper.style.width = this.inputWrapper.parentNode.offsetWidth + 'px';

        this.shakeInput();
        this.refreshState();
        this.addEvents();
    },
    addEvents: function () {
        jcf.lib.event.add(this.realElement, 'change', this.onChange, this);
        if (!jcf.isTouchDevice) {
            jcf.lib.event.add(this.fakeElement, 'mousemove', this.onMouseMove, this);
            jcf.lib.event.add(this.fakeElement, 'mouseover', this.recalcDimensions, this);
        }
    },
    onMouseMove: function (e) {
        this.realElement.style.top = Math.round(e.pageY - this.oTop - this.oHeight / 2) + 'px';
        this.realElement.style.left = (e.pageX - this.oLeft - this.oWidth + this.options.buttonWidth) + 'px';
    },
    onChange: function () {
        this.refreshState();
    },
    getFileName: function () {
        return this.realElement.value.replace(/^[\s\S]*(?:\\|\/)([\s\S^\\\/]*)$/g, "$1");
    },
    getFileExtension: function () {
        return this.realElement.value.lastIndexOf('.') < 0 ? false : this.realElement.value.substring(this.realElement.value.lastIndexOf('.') + 1).toLowerCase();
    },
    updateExtensionClass: function () {
        var currentExtension = this.getFileExtension();
        if (currentExtension) {
            this.fakeElement.className = this.fakeElement.className.replace(new RegExp('(\\s|^)' + this.options.extPrefixClass + '[^ ]+', 'gi'), '')
            jcf.lib.addClass(this.fakeElement, this.options.extPrefixClass + currentExtension)
        }
    },
    shakeInput: function () {
        // make input bigger
        jcf.lib.setStyles(this.realElement, {
            fontSize: this.options.bigFontSize,
            lineHeight: this.options.bigFontSize,
            heigth: 'auto',
            top: 0,
            left: this.inputWrapper.offsetWidth - this.realElement.offsetWidth
        });
        // IE styling fix
        if ((/(MSIE)/gi).test(navigator.userAgent)) {
            this.tmpElement = document.createElement('span');
            this.inputWrapper.insertBefore(this.tmpElement, this.realElement);
            this.inputWrapper.insertBefore(this.realElement, this.tmpElement);
            this.inputWrapper.removeChild(this.tmpElement);
        }
    },
    recalcDimensions: function () {
        var o = jcf.lib.getOffset(this.fakeElement);
        this.oTop = o.top;
        this.oLeft = o.left;
        this.oWidth = this.realElement.offsetWidth;
        this.oHeight = this.realElement.offsetHeight;
    },
    refreshState: function () {
        jcf.lib.setStyles(this.realElement, {opacity: 0});
        this.fileNameInput.innerHTML = this.getFileName() || this.origTitle || '';
        if (this.realElement.disabled) {
            jcf.lib.addClass(this.fakeElement, this.options.disabledClass);
            if (this.labelFor) {
                jcf.lib.addClass(this.labelFor, this.options.labelDisabledClass);
            }
        } else {
            jcf.lib.removeClass(this.fakeElement, this.options.disabledClass);
            if (this.labelFor) {
                jcf.lib.removeClass(this.labelFor, this.options.labelDisabledClass);
            }
        }
        if (this.realElement.value.length) {
            jcf.lib.removeClass(this.fakeElement, this.options.noFileClass);
        } else {
            jcf.lib.addClass(this.fakeElement, this.options.noFileClass);
        }
        this.updateExtensionClass();
    }
});


/*! Hammer.JS - v1.0.5 - 2013-04-07
 * http://eightmedia.github.com/hammer.js
 *
 * Copyright (c) 2013 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */
;(function (t, e) {
    "use strict";
    function n() {
        if (!i.READY) {
            i.event.determineEventTypes();
            for (var t in i.gestures)i.gestures.hasOwnProperty(t) && i.detection.register(i.gestures[t]);
            i.event.onTouch(i.DOCUMENT, i.EVENT_MOVE, i.detection.detect), i.event.onTouch(i.DOCUMENT, i.EVENT_END, i.detection.detect), i.READY = !0
        }
    }

    var i = function (t, e) {
        return new i.Instance(t, e || {})
    };
    i.defaults = {
        stop_browser_behavior: {
            userSelect: "none",
            touchAction: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    }, i.HAS_POINTEREVENTS = navigator.pointerEnabled || navigator.msPointerEnabled, i.HAS_TOUCHEVENTS = "ontouchstart" in t, i.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i, i.NO_MOUSEEVENTS = i.HAS_TOUCHEVENTS && navigator.userAgent.match(i.MOBILE_REGEX), i.EVENT_TYPES = {}, i.DIRECTION_DOWN = "down", i.DIRECTION_LEFT = "left", i.DIRECTION_UP = "up", i.DIRECTION_RIGHT = "right", i.POINTER_MOUSE = "mouse", i.POINTER_TOUCH = "touch", i.POINTER_PEN = "pen", i.EVENT_START = "start", i.EVENT_MOVE = "move", i.EVENT_END = "end", i.DOCUMENT = document, i.plugins = {}, i.READY = !1, i.Instance = function (t, e) {
        var r = this;
        return n(), this.element = t, this.enabled = !0, this.options = i.utils.extend(i.utils.extend({}, i.defaults), e || {}), this.options.stop_browser_behavior && i.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior), i.event.onTouch(t, i.EVENT_START, function (t) {
            r.enabled && i.detection.startDetect(r, t)
        }), this
    }, i.Instance.prototype = {
        on: function (t, e) {
            for (var n = t.split(" "), i = 0; n.length > i; i++)this.element.addEventListener(n[i], e, !1);
            return this
        }, off: function (t, e) {
            for (var n = t.split(" "), i = 0; n.length > i; i++)this.element.removeEventListener(n[i], e, !1);
            return this
        }, trigger: function (t, e) {
            var n = i.DOCUMENT.createEvent("Event");
            n.initEvent(t, !0, !0), n.gesture = e;
            var r = this.element;
            return i.utils.hasParent(e.target, r) && (r = e.target), r.dispatchEvent(n), this
        }, enable: function (t) {
            return this.enabled = t, this
        }
    };
    var r = null, o = !1, s = !1;
    i.event = {
        bindDom: function (t, e, n) {
            for (var i = e.split(" "), r = 0; i.length > r; r++)t.addEventListener(i[r], n, !1)
        }, onTouch: function (t, e, n) {
            var a = this;
            this.bindDom(t, i.EVENT_TYPES[e], function (c) {
                var u = c.type.toLowerCase();
                if (!u.match(/mouse/) || !s) {
                    (u.match(/touch/) || u.match(/pointerdown/) || u.match(/mouse/) && 1 === c.which) && (o = !0), u.match(/touch|pointer/) && (s = !0);
                    var h = 0;
                    o && (i.HAS_POINTEREVENTS && e != i.EVENT_END ? h = i.PointerEvent.updatePointer(e, c) : u.match(/touch/) ? h = c.touches.length : s || (h = u.match(/up/) ? 0 : 1), h > 0 && e == i.EVENT_END ? e = i.EVENT_MOVE : h || (e = i.EVENT_END), h || null === r ? r = c : c = r, n.call(i.detection, a.collectEventData(t, e, c)), i.HAS_POINTEREVENTS && e == i.EVENT_END && (h = i.PointerEvent.updatePointer(e, c))), h || (r = null, o = !1, s = !1, i.PointerEvent.reset())
                }
            })
        }, determineEventTypes: function () {
            var t;
            t = i.HAS_POINTEREVENTS ? i.PointerEvent.getEvents() : i.NO_MOUSEEVENTS ? ["touchstart", "touchmove", "touchend touchcancel"] : ["touchstart mousedown", "touchmove mousemove", "touchend touchcancel mouseup"], i.EVENT_TYPES[i.EVENT_START] = t[0], i.EVENT_TYPES[i.EVENT_MOVE] = t[1], i.EVENT_TYPES[i.EVENT_END] = t[2]
        }, getTouchList: function (t) {
            return i.HAS_POINTEREVENTS ? i.PointerEvent.getTouchList() : t.touches ? t.touches : [{
                        identifier: 1,
                        pageX: t.pageX,
                        pageY: t.pageY,
                        target: t.target
                    }]
        }, collectEventData: function (t, e, n) {
            var r = this.getTouchList(n, e), o = i.POINTER_TOUCH;
            return (n.type.match(/mouse/) || i.PointerEvent.matchType(i.POINTER_MOUSE, n)) && (o = i.POINTER_MOUSE), {
                center: i.utils.getCenter(r),
                timeStamp: (new Date).getTime(),
                target: n.target,
                touches: r,
                eventType: e,
                pointerType: o,
                srcEvent: n,
                preventDefault: function () {
                    this.srcEvent.preventManipulation && this.srcEvent.preventManipulation(), this.srcEvent.preventDefault && this.srcEvent.preventDefault()
                },
                stopPropagation: function () {
                    this.srcEvent.stopPropagation()
                },
                stopDetect: function () {
                    return i.detection.stopDetect()
                }
            }
        }
    }, i.PointerEvent = {
        pointers: {}, getTouchList: function () {
            var t = this, e = [];
            return Object.keys(t.pointers).sort().forEach(function (n) {
                e.push(t.pointers[n])
            }), e
        }, updatePointer: function (t, e) {
            return t == i.EVENT_END ? this.pointers = {} : (e.identifier = e.pointerId, this.pointers[e.pointerId] = e), Object.keys(this.pointers).length
        }, matchType: function (t, e) {
            if (!e.pointerType)return !1;
            var n = {};
            return n[i.POINTER_MOUSE] = e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == i.POINTER_MOUSE, n[i.POINTER_TOUCH] = e.pointerType == e.MSPOINTER_TYPE_TOUCH || e.pointerType == i.POINTER_TOUCH, n[i.POINTER_PEN] = e.pointerType == e.MSPOINTER_TYPE_PEN || e.pointerType == i.POINTER_PEN, n[t]
        }, getEvents: function () {
            return ["pointerdown MSPointerDown", "pointermove MSPointerMove", "pointerup pointercancel MSPointerUp MSPointerCancel"]
        }, reset: function () {
            this.pointers = {}
        }
    }, i.utils = {
        extend: function (t, n, i) {
            for (var r in n)t[r] !== e && i || (t[r] = n[r]);
            return t
        }, hasParent: function (t, e) {
            for (; t;) {
                if (t == e)return !0;
                t = t.parentNode
            }
            return !1
        }, getCenter: function (t) {
            for (var e = [], n = [], i = 0, r = t.length; r > i; i++)e.push(t[i].pageX), n.push(t[i].pageY);
            return {
                pageX: (Math.min.apply(Math, e) + Math.max.apply(Math, e)) / 2,
                pageY: (Math.min.apply(Math, n) + Math.max.apply(Math, n)) / 2
            }
        }, getVelocity: function (t, e, n) {
            return {x: Math.abs(e / t) || 0, y: Math.abs(n / t) || 0}
        }, getAngle: function (t, e) {
            var n = e.pageY - t.pageY, i = e.pageX - t.pageX;
            return 180 * Math.atan2(n, i) / Math.PI
        }, getDirection: function (t, e) {
            var n = Math.abs(t.pageX - e.pageX), r = Math.abs(t.pageY - e.pageY);
            return n >= r ? t.pageX - e.pageX > 0 ? i.DIRECTION_LEFT : i.DIRECTION_RIGHT : t.pageY - e.pageY > 0 ? i.DIRECTION_UP : i.DIRECTION_DOWN
        }, getDistance: function (t, e) {
            var n = e.pageX - t.pageX, i = e.pageY - t.pageY;
            return Math.sqrt(n * n + i * i)
        }, getScale: function (t, e) {
            return t.length >= 2 && e.length >= 2 ? this.getDistance(e[0], e[1]) / this.getDistance(t[0], t[1]) : 1
        }, getRotation: function (t, e) {
            return t.length >= 2 && e.length >= 2 ? this.getAngle(e[1], e[0]) - this.getAngle(t[1], t[0]) : 0
        }, isVertical: function (t) {
            return t == i.DIRECTION_UP || t == i.DIRECTION_DOWN
        }, stopDefaultBrowserBehavior: function (t, e) {
            var n, i = ["webkit", "khtml", "moz", "ms", "o", ""];
            if (e && t.style) {
                for (var r = 0; i.length > r; r++)for (var o in e)e.hasOwnProperty(o) && (n = o, i[r] && (n = i[r] + n.substring(0, 1).toUpperCase() + n.substring(1)), t.style[n] = e[o]);
                "none" == e.userSelect && (t.onselectstart = function () {
                    return !1
                })
            }
        }
    }, i.detection = {
        gestures: [], current: null, previous: null, stopped: !1, startDetect: function (t, e) {
            this.current || (this.stopped = !1, this.current = {
                inst: t,
                startEvent: i.utils.extend({}, e),
                lastEvent: !1,
                name: ""
            }, this.detect(e))
        }, detect: function (t) {
            if (this.current && !this.stopped) {
                t = this.extendEventData(t);
                for (var e = this.current.inst.options, n = 0, r = this.gestures.length; r > n; n++) {
                    var o = this.gestures[n];
                    if (!this.stopped && e[o.name] !== !1 && o.handler.call(o, t, this.current.inst) === !1) {
                        this.stopDetect();
                        break
                    }
                }
                return this.current && (this.current.lastEvent = t), t.eventType == i.EVENT_END && !t.touches.length - 1 && this.stopDetect(), t
            }
        }, stopDetect: function () {
            this.previous = i.utils.extend({}, this.current), this.current = null, this.stopped = !0
        }, extendEventData: function (t) {
            var e = this.current.startEvent;
            if (e && (t.touches.length != e.touches.length || t.touches === e.touches)) {
                e.touches = [];
                for (var n = 0, r = t.touches.length; r > n; n++)e.touches.push(i.utils.extend({}, t.touches[n]))
            }
            var o = t.timeStamp - e.timeStamp, s = t.center.pageX - e.center.pageX, a = t.center.pageY - e.center.pageY, c = i.utils.getVelocity(o, s, a);
            return i.utils.extend(t, {
                deltaTime: o,
                deltaX: s,
                deltaY: a,
                velocityX: c.x,
                velocityY: c.y,
                distance: i.utils.getDistance(e.center, t.center),
                angle: i.utils.getAngle(e.center, t.center),
                direction: i.utils.getDirection(e.center, t.center),
                scale: i.utils.getScale(e.touches, t.touches),
                rotation: i.utils.getRotation(e.touches, t.touches),
                startEvent: e
            }), t
        }, register: function (t) {
            var n = t.defaults || {};
            return n[t.name] === e && (n[t.name] = !0), i.utils.extend(i.defaults, n, !0), t.index = t.index || 1e3, this.gestures.push(t), this.gestures.sort(function (t, e) {
                return t.index < e.index ? -1 : t.index > e.index ? 1 : 0
            }), this.gestures
        }
    }, i.gestures = i.gestures || {}, i.gestures.Hold = {
        name: "hold",
        index: 10,
        defaults: {hold_timeout: 500, hold_threshold: 1},
        timer: null,
        handler: function (t, e) {
            switch (t.eventType) {
                case i.EVENT_START:
                    clearTimeout(this.timer), i.detection.current.name = this.name, this.timer = setTimeout(function () {
                        "hold" == i.detection.current.name && e.trigger("hold", t)
                    }, e.options.hold_timeout);
                    break;
                case i.EVENT_MOVE:
                    t.distance > e.options.hold_threshold && clearTimeout(this.timer);
                    break;
                case i.EVENT_END:
                    clearTimeout(this.timer)
            }
        }
    }, i.gestures.Tap = {
        name: "tap",
        index: 100,
        defaults: {
            tap_max_touchtime: 250,
            tap_max_distance: 10,
            tap_always: !0,
            doubletap_distance: 20,
            doubletap_interval: 300
        },
        handler: function (t, e) {
            if (t.eventType == i.EVENT_END) {
                var n = i.detection.previous, r = !1;
                if (t.deltaTime > e.options.tap_max_touchtime || t.distance > e.options.tap_max_distance)return;
                n && "tap" == n.name && t.timeStamp - n.lastEvent.timeStamp < e.options.doubletap_interval && t.distance < e.options.doubletap_distance && (e.trigger("doubletap", t), r = !0), (!r || e.options.tap_always) && (i.detection.current.name = "tap", e.trigger(i.detection.current.name, t))
            }
        }
    }, i.gestures.Swipe = {
        name: "swipe",
        index: 40,
        defaults: {swipe_max_touches: 1, swipe_velocity: .7},
        handler: function (t, e) {
            if (t.eventType == i.EVENT_END) {
                if (e.options.swipe_max_touches > 0 && t.touches.length > e.options.swipe_max_touches)return;
                (t.velocityX > e.options.swipe_velocity || t.velocityY > e.options.swipe_velocity) && (e.trigger(this.name, t), e.trigger(this.name + t.direction, t))
            }
        }
    }, i.gestures.Drag = {
        name: "drag",
        index: 50,
        defaults: {
            drag_min_distance: 10,
            drag_max_touches: 1,
            drag_block_horizontal: !1,
            drag_block_vertical: !1,
            drag_lock_to_axis: !1,
            drag_lock_min_distance: 25
        },
        triggered: !1,
        handler: function (t, n) {
            if (i.detection.current.name != this.name && this.triggered)return n.trigger(this.name + "end", t), this.triggered = !1, e;
            if (!(n.options.drag_max_touches > 0 && t.touches.length > n.options.drag_max_touches))switch (t.eventType) {
                case i.EVENT_START:
                    this.triggered = !1;
                    break;
                case i.EVENT_MOVE:
                    if (t.distance < n.options.drag_min_distance && i.detection.current.name != this.name)return;
                    i.detection.current.name = this.name, (i.detection.current.lastEvent.drag_locked_to_axis || n.options.drag_lock_to_axis && n.options.drag_lock_min_distance <= t.distance) && (t.drag_locked_to_axis = !0);
                    var r = i.detection.current.lastEvent.direction;
                    t.drag_locked_to_axis && r !== t.direction && (t.direction = i.utils.isVertical(r) ? 0 > t.deltaY ? i.DIRECTION_UP : i.DIRECTION_DOWN : 0 > t.deltaX ? i.DIRECTION_LEFT : i.DIRECTION_RIGHT), this.triggered || (n.trigger(this.name + "start", t), this.triggered = !0), n.trigger(this.name, t), n.trigger(this.name + t.direction, t), (n.options.drag_block_vertical && i.utils.isVertical(t.direction) || n.options.drag_block_horizontal && !i.utils.isVertical(t.direction)) && t.preventDefault();
                    break;
                case i.EVENT_END:
                    this.triggered && n.trigger(this.name + "end", t), this.triggered = !1
            }
        }
    }, i.gestures.Transform = {
        name: "transform",
        index: 45,
        defaults: {transform_min_scale: .01, transform_min_rotation: 1, transform_always_block: !1},
        triggered: !1,
        handler: function (t, n) {
            if (i.detection.current.name != this.name && this.triggered)return n.trigger(this.name + "end", t), this.triggered = !1, e;
            if (!(2 > t.touches.length))switch (n.options.transform_always_block && t.preventDefault(), t.eventType) {
                case i.EVENT_START:
                    this.triggered = !1;
                    break;
                case i.EVENT_MOVE:
                    var r = Math.abs(1 - t.scale), o = Math.abs(t.rotation);
                    if (n.options.transform_min_scale > r && n.options.transform_min_rotation > o)return;
                    i.detection.current.name = this.name, this.triggered || (n.trigger(this.name + "start", t), this.triggered = !0), n.trigger(this.name, t), o > n.options.transform_min_rotation && n.trigger("rotate", t), r > n.options.transform_min_scale && (n.trigger("pinch", t), n.trigger("pinch" + (1 > t.scale ? "in" : "out"), t));
                    break;
                case i.EVENT_END:
                    this.triggered && n.trigger(this.name + "end", t), this.triggered = !1
            }
        }
    }, i.gestures.Touch = {
        name: "touch",
        index: -1 / 0,
        defaults: {prevent_default: !1, prevent_mouseevents: !1},
        handler: function (t, n) {
            return n.options.prevent_mouseevents && t.pointerType == i.POINTER_MOUSE ? (t.stopDetect(), e) : (n.options.prevent_default && t.preventDefault(), t.eventType == i.EVENT_START && n.trigger(this.name, t), e)
        }
    }, i.gestures.Release = {
        name: "release", index: 1 / 0, handler: function (t, e) {
            t.eventType == i.EVENT_END && e.trigger(this.name, t)
        }
    }, "object" == typeof module && "object" == typeof module.exports ? module.exports = i : (t.Hammer = i, "function" == typeof t.define && t.define.amd && t.define("hammer", [], function () {
            return i
        }))
})(this), function (t, e) {
    "use strict";
    t !== e && (Hammer.event.bindDom = function (n, i, r) {
        t(n).on(i, function (t) {
            var n = t.originalEvent || t;
            n.pageX === e && (n.pageX = t.pageX, n.pageY = t.pageY), n.target || (n.target = t.target), n.which === e && (n.which = n.button), n.preventDefault || (n.preventDefault = t.preventDefault), n.stopPropagation || (n.stopPropagation = t.stopPropagation), r.call(this, n)
        })
    }, Hammer.Instance.prototype.on = function (e, n) {
        return t(this.element).on(e, n)
    }, Hammer.Instance.prototype.off = function (e, n) {
        return t(this.element).off(e, n)
    }, Hammer.Instance.prototype.trigger = function (e, n) {
        var i = t(this.element);
        return i.has(n.target).length && (i = t(n.target)), i.trigger({type: e, gesture: n})
    }, t.fn.hammer = function (e) {
        return this.each(function () {
            var n = t(this), i = n.data("hammer");
            i ? i && e && Hammer.utils.extend(i.options, e) : n.data("hammer", new Hammer(this, e || {}))
        })
    })
}(window.jQuery || window.Zepto);


// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
;(function () {
    var cache = {};

    this.tmpl = function tmpl(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                // Introduce the data as local variables using with(){}
                "with(obj){p.push('" +

                // Convert the template into pure JavaScript
                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
})();


/*! Copyright 2012, Ben Lin (http://dreamerslab.com/)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 1.0.16
 *
 * Requires: jQuery >= 1.2.3
 */
;(function ($) {
    $.fn.addBack = $.fn.addBack || $.fn.andSelf;

    $.fn.extend({

        actual: function (method, options) {
            // check if the jQuery method exist
            if (!this[method]) {
                throw '$.actual => The jQuery method "' + method + '" you called does not exist';
            }

            var defaults = {
                absolute: false,
                clone: false,
                includeMargin: false
            };

            var configs = $.extend(defaults, options);

            var $target = this.eq(0);
            var fix, restore;

            if (configs.clone === true) {
                fix = function () {
                    var style = 'position: absolute !important; top: -1000 !important; ';

                    // this is useful with css3pie
                    $target = $target.clone().attr('style', style).appendTo('body');
                };

                restore = function () {
                    // remove DOM element after getting the width
                    $target.remove();
                };
            } else {
                var tmp = [];
                var style = '';
                var $hidden;

                fix = function () {
                    // get all hidden parents
                    $hidden = $target.parents().addBack().filter(':hidden');
                    style += 'visibility: hidden !important; display: block !important; ';

                    if (configs.absolute === true) style += 'position: absolute !important; ';

                    // save the origin style props
                    // set the hidden el css to be got the actual value later
                    $hidden.each(function () {
                        // Save original style. If no style was set, attr() returns undefined
                        var $this = $(this);
                        var thisStyle = $this.attr('style');

                        tmp.push(thisStyle);
                        // Retain as much of the original style as possible, if there is one
                        $this.attr('style', thisStyle ? thisStyle + ';' + style : style);
                    });
                };

                restore = function () {
                    // restore origin style values
                    $hidden.each(function (i) {
                        var $this = $(this);
                        var _tmp = tmp[i];

                        if (_tmp === undefined) {
                            $this.removeAttr('style');
                        } else {
                            $this.attr('style', _tmp);
                        }
                    });
                };
            }

            fix();
            // get the actual value with user specific methed
            // it can be 'width', 'height', 'outerWidth', 'innerWidth'... etc
            // configs.includeMargin only works for 'outerWidth' and 'outerHeight'
            var actual = /(outer)/.test(method) ?
                $target[method](configs.includeMargin) :
                $target[method]();

            restore();
            // IMPORTANT, this plugin only return the value of the first element
            return actual;
        }
    });
})(jQuery);