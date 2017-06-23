/* jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/* global define, $, JSLINT, brackets */
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
    } else {
        // check for Geolocation support
        if (navigator.geolocation) {
            navigator.permissions.query({'name': 'geolocation'})
                .then(function (permission) {
                    // console.log(permission.state);
                    if (permission.state === 'granted') {
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
                                    var zip;
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
                                                zip = obj.address_components[j].short_name;
                                                $("#search").removeClass('italic').val(zip);
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
                        });
                    }
                });
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
});