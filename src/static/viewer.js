// // Fetching user's ATC session informations from API
// let userSession = {};

// fetch(ATC_API_URL, {}).then(response => response.json()).then(result => {
//     if (result && result["result"] == "not found")
//         return

//     for (let session of result["items"]) {
//         // Separate each session by it's connection ID
//         let session_id = session["connection_id"]["id"];
//         userSession[session_id] = session;

//         // Long line. Not in the whole file, but still bad
//         // Open to any suggestions about fix it
//         let sessionElement = "<div id='" + session_id + "' class='fox_button fox_atc mb-2 p-2 text-center text-bg-white border border-1 rounded-3'>" + session["connection_id"]["callsign"] + "</div>";
//         $("#fox_atc").append(sessionElement);
//     }

//     // Click event handler to left menu button
//     $(".fox_atc").click(function() {
//         if ($(this).hasClass("fox_atc_active")) return;
        
//         $(".fox_atc_active").removeClass("fox_atc_active");
//         $(this).addClass("fox_atc_active");

//         showSession(userSession[$(this).attr("id")]);
//     });

//     showSession(result["items"][0]);
// });

// // Fetching user's flightplans from VATSIM API
// let userFlightplans = {};

// fetch(FLIGHTPLANS_API_URL, {}).then(response => response.json()).then(result => {
//     if (result && result["result"] == "not found")
//         return

//     for (let flightplan of result) {
//         // Separate each flight by it's connection ID
//         // Like it was with ATC session's
//         let flightplan_id = flightplan["id"]
//         userFlightplans[flightplan_id] = flightplan;
//         userFlightplans[flightplan_id]["not_filed"] = flightplan["connection_id"] === 0
        
//         // Long line again
//         let flightplanElement = "<div id="+ flightplan_id +" class='fox_button mb-2 p-2 text-center text-bg-white border border-1 rounded-3'>" + flightplan["callsign"] + "</div>";
//         $("#fox_flightplans").append(flightplanElement);
//     }

//     $(".fox_button").click(function() {
//         if ($(this).hasClass("fox_active")) return;
    
//         $(".fox_active").removeClass("fox_active");
//         $(this).addClass("fox_active");
    
//         showFlight(userFlightplans[$(this).attr("id")]);
//     });

//     showFlight(result[0]);
// });

// // Fetching airports information
// // Get it from localhost
// // Becase I think it would be much faster than getting it from VATSIM API
// let airports = {};

// $.getJSON("/static/data/airports.json", function(json) {
//         airports = json;
//     }
// );

// Map creation
const MAP_ELEMENT = L.map("fox_map");
const MAP_DEFAULT_TARGET = L.latLng("0", "0");
const MAP_DEFAULT_ZOOM_VIEW = 2;
let line = null;
MAP_ELEMENT.setView(MAP_DEFAULT_TARGET, MAP_DEFAULT_ZOOM_VIEW);

L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | VATSIM Fox by <a href="https://uw935.t.me/" style="text-decoration: underline; cursor: pointer;">uw935</a> (1606255)',
    subdomains: "abcd",
    maxZoom: 20,
    minZoom: 2
}).addTo(MAP_ELEMENT);

// Function to delete route line from map
function mapDeleteDraws() {
    if (!line) return;
    MAP_ELEMENT.removeLayer(line);
    line = null;
}

// Function to draw flight path on map
function mapDrawFlight(flight) {
    if (!flight) return;
    mapDeleteDraws();

    let departureAirport = flight["dep"];
    let arrivalAirport = flight["arr"];

    line = L.polyline([
        [
            airports[departureAirport]["lat"],
            airports[departureAirport]["lon"]
        ],
        [
            airports[arrivalAirport]["lat"],
            airports[arrivalAirport]["lon"]
        ]
    ], {color: "red"}).addTo(MAP_ELEMENT);

    MAP_ELEMENT.fitBounds(line.getBounds());
}

// Function to show data in right flight bar
function showFlight(flight) {
    if (!flight) return;

    // Changing text in each class
    // FP before _ - means flightplan
    $(".fp_is_filed").text(flight["not_filed"] ? "This flightplan wasn't used" : "");
    $(".fp_callsign").text(flight["callsign"]);
    $(".fp_depa_city").text(airports[flight["dep"]]["city"]);
    $(".fp_arra_city").text(airports[flight["arr"]]["city"]);
    $(".fp_aicraft").text(flight["aircraft"]);
    $(".fp_entime").text(flight["hrsenroute"] + ":" + flight["minenroute"]);
    $(".fp_depa").text(flight["dep"]);
    $(".fp_arra").text(flight["arr"]);
    $(".fp_altna").text(flight["alt"]);
    $(".fp_type").text(flight["flight_type"]);
    $(".fp_speed").text(flight["cruisespeed"]);
    $(".fp_alt").text(flight["altitude"]);
    $(".fp_route").text(flight["route"]);
    $(".fp_remarks").text(flight["rmks"]);
    $(".fp_squawk").text(flight["assignedsquawk"]);
    $(".fp_filed").text(flight["filed"].replace("T", " "));

    mapDrawFlight(flight);
}

// Function to show ATC session 
function showSession(session) {
    if (!session) return;

    $(".atc_callsign").text(session["connection_id"]["callsign"]);
    $(".atc_start_time").text(session["connection_id"]["start"].replace("T", " "));
    $(".atc_end_time").text(session["connection_id"]["end"].replace("T", " "));
    $(".atc_trackedair").text(session["aircrafttracked"]);
    $(".atc_seenair").text(session["aircraftseen"]);
    $(".atc_squawks").text(session["squawksassigned"]);
    $(".atc_transfers").text(session["handoffsinitiated"]);
    $(".atc_received").text(session["handoffsreceived"]);
}
