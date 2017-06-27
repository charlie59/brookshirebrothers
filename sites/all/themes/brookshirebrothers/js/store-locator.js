/* jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/* global define, jQuery, JSLINT, brackets,  */
var google_maps_api_key = google_maps_api_key;
var storeZip = getCookie("storeZip");
var storeMap;
var storeLocations;


function getCookie(name) {
    "use strict";
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}

jQuery(document).ready(function () {
    "use strict";

    /*
     * make map based on storeZip
     */
    function initMap(storeZip) {
        // console.log(storeZip);
        if (storeZip !== null) {
            if (storeZip.length > 0) {
                jQuery.getJSON("https://maps.googleapis.com/maps/api/geocode/json?&key=" + google_maps_api_key + "&address=" + storeZip, function (data) {
                    // console.log(data);
                    if (data.status === 'OK') {
                        var lat = data.results[0].geometry.location.lat;
                        var lng = data.results[0].geometry.location.lng;
                        // console.log(lat + ' ' + lng);
                        jQuery("#map_container").html('<div id="storeMap" style="height:300px;"></div>');
                        var uluru = {lat: lat, lng: lng};
                        storeMap = new google.maps.Map(document.getElementById('storeMap'), {
                            zoom: 8,
                            center: uluru,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            imageDefaultUI: true
                        });

                        var infoWindow = new google.maps.InfoWindow(), marker, i;
                        var num_markers = storeLocations.length;
                        var markers = [];
                        for (var j = 0; j < num_markers; j++) {
                            var res = storeLocations[j][1].split(",");
                            // console.log(storeLocations[j][0]);
                            markers[j] = new google.maps.Marker({
                                position: {lat: parseFloat(res[0].trim()), lng: parseFloat(res[1].trim())},
                                map: storeMap,
                                title: storeLocations[j][0]
                            });
                            // Allow each marker to have an info window
                            google.maps.event.addListener(markers[j], 'click', (function (marker, j) {
                                // console.log(marker);
                                return function () {
                                    infoWindow.setContent(this.title);
                                    infoWindow.open(storeMap, marker);
                                }
                            })(markers[j], j));
                        }
                    }
                });
            }
        }
    }

    // filter location init
    function initFilterLocation() {
        "use strict";

        function stopLookup() {
            searchBox.removeClass('italic').val('');
        }

        var activeClass = 'filter-active';
        var searchBox = jQuery("#search");

        // use cookie value if it has been set for session
        if (storeZip !== null) {
            searchBox.val(storeZip);
        } else {
            // check for Geolocation support
            if ("geolocation" in navigator) {

                /* navigator.permissions only in Chrome Jun 2017 */
                /*navigator.permissions.query({'name': 'geolocation'})
                 .then(function (permissionStatus) {
                 console.log('geolocation permission state is ', permissionStatus.state);
                 permissionStatus.onchange = function() {
                 console.log('geolocation permission state has changed to ', this.state);
                 };
                 if (permissionStatus.state === 'granted') {

                 }
                 });
                 */

                searchBox.addClass('italic').val('...finding your location');
                navigator.geolocation.getCurrentPosition(function (position) {
                        var timer = setTimeout(stopLookup, 10000);
                        var pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        // console.log(pos);
                        var latlng = pos.lat + "," + pos.lng;
                        // https://developers.google.com/maps/documentation/geocoding/intro#reverse-restricted
                        jQuery.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&result_type=street_address&key=' + google_maps_api_key, function (data) {
                            // console.log(data);
                            // this check should take care of errors
                            if (data.status === 'OK') {
                                if (data.results[0]) {
                                    /**
                                     * @typedef {Object} obj
                                     * @property {string} address_components
                                     */
                                    var obj = data.results[0];
                                    var j = 0;
                                    for (j = 0; j < obj.address_components.length; j++) {
                                        if (obj.address_components[j].types[0] === 'postal_code') {
                                            // console.log("Zip Code: " + obj.address_components[j].short_name);
                                            storeZip = obj.address_components[j].short_name;
                                            searchBox.removeClass('italic').val(storeZip);
                                            break;
                                        }
                                    }
                                    // set cookie
                                    document.cookie = "storeZip=" + storeZip;
                                    clearTimeout(timer);
                                }
                            } else {
                                searchBox.removeClass('italic').val('');
                            }
                        });
                    }, function (error) {
                        // alert(error);
                        alert('We were unable to determine your location. Please enter a zip code.'); // actually
                        // useful
                        // console.log(error);
                        searchBox.removeClass('italic').val('');
                    }
                );
            } else {
                console.log("no geolocation support");
            }
        }

        // More options
        jQuery("#moreoptions").click(function () {
            if (jQuery("#moreoptionssection").hasClass('invisible')) {
                jQuery("#moreoptionssection").removeClass('invisible');
                jQuery("#moreoptions").text('Less options');
            } else {
                jQuery("#moreoptionssection").addClass('invisible');
                jQuery("#moreoptions").text('More options');
            }
        });

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
            var resultText = filterHolder.find('.result-text');
            var selectedMiles = filterHolder.find('.selected-miles');
            var yourAddress = filterHolder.find('.your-location');
            var overClass = 'over';

            filterHolder.hide();

            function sendForm(e) {
                storeZip = searchBox.val(); // they might gone back to the form and changed it from the cookie value
                var weeklyad = holder.find('.weekly-ad');
                storeLocations = [];
                jQuery("#storeMap").remove();
                jQuery('#loader').show();
                var literLocation = form.find('.filter-location-area');
                e.preventDefault();
                jQuery.ajax({
                    type: 'get',
                    cache: false,
                    url: form.attr('action'),
                    data: 'ajax=1&weeklyad=' + weeklyad.val(),
                    dataType: 'text',
                    success: function (data) {
                        var selectedOption = distanceSelect.children().eq(distanceSelect.get(0).selectedIndex);
                        selectedDistance = parseInt(selectedOption.text(), 10);

                        if (selectedOption.hasClass(overClass)) {
                            selectedDistance = 99999;
                        }

                        jQuery(data).appendTo(jQuery('body'));
                        resultCount.text('0');
                        selectedMiles.text(selectedOption.text());

                        getPosition(literLocation.val()).done(function (results) {
                            var currCoord = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
                            var dataObject = getCoordinates(locationCoordinates, currCoord, selectedDistance);
                            var html = '';
                            var lat = results[0].geometry.location.lat();
                            var lng = results[0].geometry.location.lng();

                            for (var i in dataObject) {
                                // console.log(dataObject[i].features[0].properties);
                                // add properties
                                var num = parseInt(i) + 1;
                                dataObject[i].features[0].properties.i = i;
                                dataObject[i].features[0].properties.num = num;
                                var locality = dataObject[i].features[0].properties.locality.replace(/<[^>]+>/g, '');
                                var city = dataObject[i].features[0].properties.locality.replace(/,.*/g, '');
                                var address = dataObject[i].features[0].properties.address + ',' + locality;
                                var encoded = address.replace(/[\s]+/g, '+');
                                // console.log(city);
                                var info = '<div class="infoDiv"><a href="https://www.google.com/maps/place/' + encoded + '" target="_blank">' + city + "</a></div>";
                                var storeLocation = [info, dataObject[i].features[0].geometry.coordinates];
                                storeLocations.push(storeLocation);
                                html += tmpl("result_tmpl", dataObject[i].features[0].properties);
                            }

                            filterList.html(html);
                        });
                        yourAddress.text(literLocation.val());
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

                function checkAddress() {
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
                            checkAddress();
                        }
                    }
                }

                checkAddress();
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
                        key = jQuery.trim(key)
                        jQuery.each(checkboxArray, function (el2, key2) {
                            key2 = jQuery.trim(key2);
                            if (key.toLowerCase() === key2.toLowerCase()) {
                                // console.log(obj);
                                resultsArray.push(obj);
                                return true
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
                // console.log(currArr.length);
                selectedMiles.text(distanceSelect.children().eq(distanceSelect.get(0).selectedIndex).text())
                if (currArr.length > 0) {
                    initMap(storeZip);
                }
                currArr.length === 1 ? resultText.text('Store') : resultText.text('Stores');
            }

            form.submit(sendForm);
            backBtn.bind('click', sendForm);
        });
    }

    initFilterLocation();

});