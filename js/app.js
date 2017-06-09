var map;
var markerArray = [];

var noteworthyPlace = function(data){
    this.name = data.name;
    this.location = data.location;
    this.info = data.info;
};

function initMap(){

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: {lat: 43.64798, lng: -79.37724}
    });

    infoWindow = new google.maps.InfoWindow();

    var bounds = new google.maps.LatLngBounds();

    for(var i=0; i<placesData.length; i++){
        addMarker(placesData[i]);
        bounds.extend(placesData[i].location);
    }
    map.fitBounds(bounds);

};

function addMarker(place){
    var coordinates = {
        lat: place.location.lat,
        lng: place.location.lng
    }

    self.marker = new google.maps.Marker({
        map: map,
        position: coordinates,
        animation: google.maps.Animation.DROP
    })

    if (self.marker){
        markerArray.push([coordinates, self.marker]);
        // add event listener here as well?
    }

};

function currentMarker(place){
    var cur;
    for(var i=0; i<markerArray.length; i++){
        cur = markerArray[i];
        if (cur[0].lat == place.location.lat && cur[0].lng == place.location.lng){
            return cur;
        }
    }
}

function showPlaceInfo(place){
    var infoWindow = new google.maps.InfoWindow({
        content: place.info
    });

    var marker = currentMarker(place);


    // NEED TO INDENTIFY MARKER SOMEHOW UUGHAIUDHGUAOSDHGOA;IHGIOWEHFO'IAHWRGOIAWHEGH'IOAWEGHIIAWERGHI
    infoWindow.open(map, marker[1]);
}

function AppViewModel(){
    var self = this;

    this.placeList = ko.observableArray([]);
    placesData.forEach(function(place){
        self.placeList.push(new noteworthyPlace(place));
    })

    // this.markerArray = ko.observableArray([]);




}

ko.applyBindings(new AppViewModel());

