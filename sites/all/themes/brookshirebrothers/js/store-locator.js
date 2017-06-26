/* jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/* global define, $, JSLINT, brackets,  */
var google_maps_api_key = google_maps_api_key;

function getCookie(name) {
    "use strict";
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {c = c.substring(1, c.length);}
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}

$(document).ready(function () {
    "use strict";
    // use cookie value if it has been set for session
    var zip = getCookie("storezip");
    if (zip !== null) {
        $("#search").val(zip);
        initMap(zip);
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
            $("#search").addClass('italic').val('...finding your location');
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                // console.log(pos);
                var latlng = pos.lat + "," + pos.lng;
                // https://developers.google.com/maps/documentation/geocoding/intro#reverse-restricted
                $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&result_type=street_address&key=' + google_maps_api_key, function (data) {
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
                                    var zip = obj.address_components[j].short_name;
                                    $("#search").removeClass('italic').val(zip);
                                    initMap(zip);
                                    break;
                                }
                            }
                            // set cookie
                            document.cookie = "storezip=" + zip;

                        }
                    } else {
                        $("#search").removeClass('italic').val('');
                    }
                });
            }, function errorCallback(error) {
                console.log(error);
            }
            );
        } else {
            console.log("no geolocation support");
        }
    }

    // More options
    $("#moreoptions").click(function() {
        if ($("#moreoptionssection").hasClass('invisible')) {
            $("#moreoptionssection").removeClass('invisible');
            $("#moreoptions").text('Less options');
        } else {
            $("#moreoptionssection").addClass('invisible');
            $("#moreoptions").text('More options');
        }
    });

    function initMap(zip) {
        console.log(zip);
        if (zip !== null) {
            if (zip.length > 0) {
                $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?&key=" + google_maps_api_key + "&address=" + zip, function(data) {
                    console.log(data);
                    if (data.status === 'OK') {
                        var lat = data.results[0].geometry.location.lat;
                        var lng = data.results[0].geometry.location.lng;
                        console.log(lat + ' ' + lng);

                        var uluru = {lat: lat, lng: lng};
                        var map = new google.maps.Map(document.getElementById('map'), {
                            zoom: 8,
                            center: uluru,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            imageDefaultUI: true
                        });
                    }
                });
            }
        }
    }
});