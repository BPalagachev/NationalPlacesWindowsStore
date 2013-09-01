/// <reference path="NationalPlacesApi/NationalPlacesClient.js" />

(function () {
    var tempStorage = Windows.Storage.ApplicationData.current.temporaryFolder;
    var applicationSettings = Windows.Storage.ApplicationData.current.localSettings;
    var vault = new Windows.Security.Credentials.PasswordVault();

    var apiClient = NationalPlacesApi.getClient("http://localhost:45021/api/", applicationSettings, vault);

    var cacheAllPlacesFilaName = "allplacescache.txt";
    var cachePlaceFilaNameRoot = "placeNumber";

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

    var getPlaceDetails = function (placeId) {
        return tempStorage.getFileAsync(cachePlaceFilaNameRoot + placeId + ".txt")
             .then(function (file) {
                 return Windows.Storage.FileIO.readTextAsync(file);
             })
            .then(function (text) {
                var placeDetails = JSON.parse(text);
                return placeDetails;
            })
            .then(function (placeDetails) {
                return placeDetails;
            }, function (error) {
                return apiClient.places.placeDetails(placeId).then(function (data) {
                    return data;
                }).then(function (data) {
                    return tempStorage.createFileAsync(cachePlaceFilaNameRoot + placeId + ".txt",
                        Windows.Storage.CreationCollisionOption.replaceExisting)
                    .then(function (file) {
                        var allPlacesStr = JSON.stringify(data);
                        Windows.Storage.FileIO.writeTextAsync(file, allPlacesStr);
                        return data;
                    })
                })
            });

       // return apiClient.places.placeDetails(placeId);
    }

    var getComments = function (placeId) {
        var currentUser = apiClient.users.isUserLoggedIn();
        var promise = new WinJS.Promise(function (success, error) {
            //if (currentUser) {
            if(true){

                apiClient.places.getComments("48qzyuMtxDKrlvJoLzSYwqzcSDvZpXrBVffOeXUbtZrwPadoBd", placeId)// currentUser.sessionKey
                .then(function(comments){
                    success(comments);
                })
            }
            else {
                error("You need to be logged in to view comments")
            }
        });
        
        return promise;
    }
       
    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "Data", {
        allPlaces: getAllPlaces,
        getPlaceDetails: getPlaceDetails,
        getComments: getComments
    });

    }())