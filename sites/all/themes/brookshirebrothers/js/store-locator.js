/* jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/* global define, $, JSLINT, brackets */
var google_maps_api_key = google_maps_api_key;
$(document).ready(function () {
    "use strict";
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
                                if (data.results[0]) {
                                    var obj = data.results[0];
                                    var j = 0;
                                    for (j = 0; j < obj.address_components.length; j++) {
                                        if (obj.address_components[j].types[0] === 'postal_code') {
                                            // console.log("Zip Code: " + obj.address_components[j].short_name);
                                            var zip = obj.address_components[j].short_name;
                                            $("#search").removeClass('italic').val(zip);
                                            break;
                                        }
                                    }
                                }
                            } else {
                                $("#search").removeClass('italic').val('');
                            }
                        });
                    });
                } else {
                    // do something to ask for location permission?
                }
            });
    }
    // More options
    $("#moreoptions").click(function() {if ($("#moreoptionssection").hasClass('invisible')) {$("#moreoptionssection").removeClass('invisible');} else {$("#moreoptionssection").addClass('invisible');}});
});