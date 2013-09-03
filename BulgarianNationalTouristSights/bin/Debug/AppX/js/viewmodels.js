﻿(function () {
    var applicationSession = WinJS.Application.sessionState;

    var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
    var data = BulgarianNationalTouristSights.Data;
    var models = BulgarianNationalTouristSights.Models;
    var tempStorage = Windows.Storage.ApplicationData.current.temporaryFolder;
    var gpsDevice = new Windows.Devices.Geolocation.Geolocator();

    var apiClient = BulgarianNationalTouristSights.apiClient;

    var placeDetails;
    var applicationSessionState = {};
    var allplacesList = new WinJS.Binding.List([]);
    var allPlaces = allplacesList.createGrouped(getGroupKey, getGroupData, compareGroups);

    function compareGroups(leftKey, rightKey) {
        return leftKey - rightKey;
    }

    function getGroupKey(dataItem) {
        return dataItem.group;
    }

    function getGroupData(dataItem) {
        return "";
    }

    var loadAllPlaces = function () {
        return data.allPlaces().then(function (places) {
            places.forEach(function (place) {
                allPlaces.push(new models.PlaceModel(place));
            })
        }).then(function () {
            var userInfo = apiClient.users.isUserLoggedIn();
            if (userInfo) {
                apiClient.places.myplaces(userInfo.sessionKey).then(function (visitedPlacesArr) {
                    for (var i = 0; i < visitedPlacesArr.length; i++) {
                        markPlaceAsVisited(visitedPlacesArr[i]);
                    }
                })
            }
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
        roamingSettings.values["romaingUserName"] = userName;
        return apiClient.users.register(userName, nickName, password);
    }

    var userLogout = function () {
        return apiClient.users.logout()
    }

    var userLogIn = function (username, password) {
        return apiClient.users.login(username, password).then(function () {
            var userInfo = apiClient.users.isUserLoggedIn();
            roamingSettings.values["romaingUserName"] = userInfo.userName;
            if (userInfo) {
                apiClient.places.myplaces(userInfo.sessionKey).then(function (visitedPlacesArr) {
                    for (var i = 0; i < visitedPlacesArr.length; i++) {
                        markPlaceAsVisited(visitedPlacesArr[i]);
                    }
                })
            }
        });
    }

    var commentPlace = function (placeId, text) {
        var userInfo = apiClient.users.isUserLoggedIn();
        return getLocation().then(function (pos) {
            var latitude = pos.coordinate.latitude;
            var longitude = pos.coordinate.longitude;
            return apiClient.places.comment(userInfo.sessionKey, latitude, longitude, placeId, userInfo.authCode, text)
        })
    }

    var visitPlace = function () {
        var userInfo = apiClient.users.isUserLoggedIn();
        return getLocation().then(function (pos) {
            var latitude = pos.coordinate.latitude;
            var longitude = pos.coordinate.longitude;
            return apiClient.places.visit(userInfo.sessionKey, latitude, longitude, userInfo.authCode);
        })
    }

    var markPlaceAsVisited = function (placeId) {
        for (var i = 0; i < allPlaces.length; i++) {
            var place = allPlaces.getItem(i).data;
            if (place.placeIndentifier == placeId) {
                place.visited = "placeVisited";
                if (place.name.indexOf("(visited)") <= 0) {
                    place.name += "(visited)";
                }
            }
        }
    }

    var unmarkVisitedPlaces = function () {
        for (var i = 0; i < allPlaces.length; i++) {
            var place = allPlaces.getItem(i).data;
            place.visited = "notVisitedPlace";
            place.name = place.name.substring(0, place.name.indexOf("(visited)"));
        }

    }

    var getVisitedPlaced = function () {
        var userInfo = apiClient.users.isUserLoggedIn();
        if (userInfo) {
            apiClient.places.myplaces(userInfo.sessionKey).then(function (visitedPlacesArr) {
                for (var i = 0; i < visitedPlacesArr.length; i++) {
                    markPlaceAsVisited(visitedPlacesArr[i]);
                }
            }, function (error) {
                var er = 5;
            })
        }
    }

    var getLocation = function () {
        return gpsDevice.getGeopositionAsync();
    }

    var loadSessionState = function () {
        if (WinJS.Application.sessionState["NationalPlacesState"]) {
            applicationSessionState = JSON.parse(WinJS.Application.sessionState["NationalPlacesState"]);
        }
    }

    var persistSessionState = function () {
        applicationSession["NationalPlacesState"] = JSON.stringify(applicationSessionState);
    }

    var saveKeyToSessionState = function (key, dataObj) {
        applicationSessionState[key] = dataObj;
    }

    var loadKeyToSessionState = function (key) {
        return applicationSessionState[key];
    }


    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "ViewModels", {
        loadAllPlaces: loadAllPlaces,
        allPlaces: allPlaces,
        loadPlaceDetails: loadPlaceDetails,
        currentPlace: placeDetails,
        loadComments: loadComments,
        loadUsersGreetingsMessage: loadUsersGreetingsMessage,
        registerUser: registerUser,
        userLogout: userLogout,
        userLogIn: userLogIn,
        commentPlace: commentPlace,
        visitPlace: visitPlace,
        markAsVisited: markPlaceAsVisited,
        unmarkVIsitedPlaces: unmarkVisitedPlaces,
        roamingUserName: roamingSettings.values["romaingUserName"],
        loadSessionState: loadSessionState,
        persistSessionState: persistSessionState,
        applicationSessionState: applicationSessionState,
        saveKeyToSessionState: saveKeyToSessionState,
        loadKeyToSessionState: loadKeyToSessionState,
        getVisitedPlaced: getVisitedPlaced
    })

}())