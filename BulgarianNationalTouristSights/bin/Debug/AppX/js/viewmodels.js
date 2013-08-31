(function () {
    var data = BulgarianNationalTouristSights.Data;
    var models = BulgarianNationalTouristSights.Models;

    var allPlaces = new WinJS.Binding.List([]);

    var loadAllPlaces = function () {
        return data.allPlaces().then(function(places){
            places.forEach(function (place) {
                allPlaces.push(new models.PlaceModel(place));
            })
        });
       
    }


    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "ViewModels",{
        loadAllPlaces: loadAllPlaces,
        allPlaces: allPlaces
    })

}())