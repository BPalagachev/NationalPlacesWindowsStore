(function () {
    var data = BulgarianNationalTouristSights.Data;
    var models = BulgarianNationalTouristSights.Models;

    var allPlaces = new WinJS.Binding.List([]);
    var placeDetails;
    var placeComments = [];

    var loadAllPlaces = function () {
        return data.allPlaces().then(function (places) {
            places.forEach(function (place) {
                allPlaces.push(new models.PlaceModel(place));
            })
        });
    };

    var loadPlaceDetails = function (placeId) {
        return data.getPlaceDetails(placeId).then(function (data) {
            placeDetails = new WinJS.Binding.as(new models.PlaceDetails(data));
            return placeDetails;
        });

    };

    var loadComments = function (placeId) {
        return data.getComments(placeId).then(function (data) {
            
            return data;
        })
    }


    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "ViewModels", {
        loadAllPlaces: loadAllPlaces,
        allPlaces: allPlaces,
        loadPlaceDetails: loadPlaceDetails,
        currentPlace: placeDetails,
        loadComments: loadComments
    })

}())