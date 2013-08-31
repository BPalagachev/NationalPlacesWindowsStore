/// <reference path="NationalPlacesApi/NationalPlacesClient.js" />

(function () {
    var tempStorage = Windows.Storage.ApplicationData.current.temporaryFolder;
    var applicationSettings = Windows.Storage.ApplicationData.current.localSettings;
    var vault = new Windows.Security.Credentials.PasswordVault();

    var apiClient = NationalPlacesApi.getClient("http://localhost:45021/api/", applicationSettings, vault);

    var cacheAllPlacesFilaName = "allplacescache.txt";

    var allPlaces = [];

    var getAllPlaces = function () {

        if (allPlaces.length == 0) {
            return loadPlaceData();
        } else {
            var promise = new WinJS.Promise(function (success, error){
                success(allPlaces);
            })
            return promise;
        }
    }

    var loadPlaceData = function () {

        return  tempStorage.getFileAsync(cacheAllPlacesFilaName)
             .then(function (file) {
                 return Windows.Storage.FileIO.readTextAsync(file);
             })
            .then(function (text) {
                allPlaces = JSON.parse(text);
                return allPlaces;
            })
            .then(function (places) {
                return places;
            }, function (error) {
                return apiClient.places.getAllPlaces().then(function (data) {
                    allPlaces = data;
                    return data;
                }).then(function (data) {
                    return tempStorage.createFileAsync(cacheAllPlacesFilaName, Windows.Storage.CreationCollisionOption.replaceExisting)
                    .then(function (file) {
                        var allPlacesStr = JSON.stringify(data);
                        Windows.Storage.FileIO.writeTextAsync(file, allPlacesStr);
                        return allPlaces;
                    })
                })
            });
    }

    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "Data", {
        allPlaces: getAllPlaces
    });

}())