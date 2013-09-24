﻿/// <reference path="//Microsoft.WinJS.1.0/js/base.js" 
(function () {
    var PlaceModel = WinJS.Class.define(function (placeDto) {
        this.group = placeDto.group;
        this.latitude = placeDto.latitude;
        this.longitude = placeDto.longitude;
        this.name = placeDto.name;
        this.placeIndentifier = placeDto.placeIndentifier;
        this.url = placeDto.url;
        this.visited = "notvisitedPlace";

    }, {
        group: 0,
        latitude: "",
        longitude: "",
        name: "",
        placeIndentifier: 0,
        url: "",
        visited: "visitedPlace"
    })


    var PlaceDetails = WinJS.Class.define(function (placeDetailsDto) {
        this.name = placeDetailsDto.name;
        this.url = placeDetailsDto.url;
        this.placeIndentifier = placeDetailsDto.placeIndentifier;
        this.group = placeDetailsDto.group;
        this.longitude = placeDetailsDto.longitude;
        this.latitude = placeDetailsDto.latitude;
        this.information = placeDetailsDto.information;
    }, {
        name: "",
        url: "",
        placeIndentifier: 0,
        group: 0,
        longitude: "",
        latitude: "",
        information: ""
    });


    var UserGreetingModel = WinJS.Class.define(function (userMessage) {
        this.userMessage = userMessage
    }, {
        userMessage : ""
    })


    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "Models", {
        PlaceModel: PlaceModel,
        PlaceDetails: PlaceDetails,
        UserGreetingModel: UserGreetingModel
    })
}())