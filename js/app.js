var map;

// initialize the map
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

}

// this function creates a new marker and adds it to the observableArray of markers
function addMarker(place){
    var coordinates = {
        lat: place.location.lat,
        lng: place.location.lng
    }

    self.marker = new google.maps.Marker({
        map: map,
        position: coordinates,
        animation: google.maps.Animation.DROP,
        clickable: true
    })

    if (self.marker){
        self.markerArray().push([coordinates, self.marker]);
        google.maps.event.addListener(self.marker, "click", function(){
        stopAnimation();
        animateMarker(coordinates);
        showWikiInfo(place);
    });
    }

}

// This function hides all the markers from the map by setting their 'visible' option to false
function hideMarkers(){
  for(var i=0; i<self.markerArray().length; i++){
    self.markerArray()[i][1].setVisible(false);
  }
}

// This function shows all the markers on the map by setting their 'visible' option to true
function displayMarkers(){
  for(var i=0; i<self.markerArray().length; i++){
    self.markerArray()[i][1].setVisible(true);
  }
}


// This function drops the selected marker when the corresponding list item is clicked
function animateMarker(coordinate){
  ko.computed(function(){
    ko.utils.arrayForEach(self.markerArray(), function(marker){
      if(coordinate.lat === marker[0].lat && coordinate.lng === marker[0].lng){
        marker[1].setVisible(true);
        marker[1].setAnimation(google.maps.Animation.DROP);
      }
    });
  });
}

// This function stops the animation of all the markers on the map
function stopAnimation(){
  for(var i=0; i<self.markerArray().length; i++){
    self.markerArray()[i][1].setAnimation(null);
  }
}

// shows the marker that corresponds with the given place
function displayMarkersPlace(place){
  for(var i=0;i<self.markerArray().length; i++){
    if(place.location.lat == self.markerArray[i][0].lat && place.location.lng == self.markerArray()[i][0].lng){
      self.markerArray[i][1].setVisible(true);
    }
  }
}

// this function uses the wikipedia api to get summary information about the given place, and then displays said information in the sidebar
function showWikiInfo(place){
    var pageID = place.pageID;
    var urlString = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&pageids="+pageID+"&exintro=1&explaintext=1"
    var info;

    $.ajax({
        url: urlString,
        dataType: "json",
        async: true,
        success: function(data){
            // get the info from the json object
            info = data.query.pages[pageID].extract;
            // need to assign to knockout observable
            self.place_name(place.name);
            self.place_info(info);

        },
        error: function(data){
            wikiLoadError();
        }
    });

}


var AppViewModel = function(){
    var self = this;

    this.markerArray = ko.observableArray([]);
    this.searchQuery = ko.observable();

    this.place_name = ko.observable();
    this.place_info = ko.observable();

    this.apiError = ko.observable(false);
    this.error_message = ko.observable();

    // filters locations displayed in the list based on the given search query
    this.searchResult = ko.computed(function(){
        query = self.searchQuery();
        if (!query){
            displayMarkers();
            return placesData;
        } else {
            hideMarkers();
            return ko.utils.arrayFilter(placesData, function(place){
                if(place.name.toLowerCase().indexOf(query) >= 0){
                    return place;
                }
            });
        }

    });

    // displays the wikipedia info for the given place and animates the corresponding marker on the map
    this.viewPlaceOnMap = function(place){
        var coordinate = {lat: place.location.lat, lng: place.location.lng};
        stopAnimation();
        hideMarkers();
        animateMarker(coordinate);
        showWikiInfo(place);
    };

};


// This function is called when there is an error loading the Google Maps API
function googleMapLoadError(){
  self.error_message("Error: Unable to load Google Maps");
  self.apiError(true);
}

// This function is called when there is an error while loading data from the Wikipedia API
function wikiLoadError(){
  self.error_message("Error: unable to load wikipedia info");
  self.apiError(true);
}


// apply bindings
ko.applyBindings(AppViewModel());
