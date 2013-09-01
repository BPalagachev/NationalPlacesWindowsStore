(function () {
    var data = BulgarianNationalTouristSights.Data;
    var models = BulgarianNationalTouristSights.Models;
    var tempStorage = Windows.Storage.ApplicationData.current.temporaryFolder;
   
    var apiClient = BulgarianNationalTouristSights.apiClient;


    var allPlaces = new WinJS.Binding.List([]);
    var placeDetails;

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

    var loadUsersGreetingsMessage = function () {
        var userInformation = data.getUserInformation();
        var userMessage = {};
        if (userInformation) {
            var msg = "Hello, " + userInformation.nickName;
            userMessage = new models.UserGreetingModel(msg);
        }
        else {
            userMessage = new models.UserGreetingModel("Please consider joining us");
        }

        return userMessage;
    }

    var registerUser = function (userName, nickName, password) {
       return  apiClient.users.register(userName, nickName, password);
    }

    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "ViewModels", {
        loadAllPlaces: loadAllPlaces,
        allPlaces: allPlaces,
        loadPlaceDetails: loadPlaceDetails,
        currentPlace: placeDetails,
        loadComments: loadComments,
        loadUsersGreetingsMessage: loadUsersGreetingsMessage,
        registerUser: registerUser
    })

}())