/// <reference path="../../js/datalayer.js" />
/// <reference path="../../js/viewmodels.js" />
/// <reference path="../../js/bulgarianNationalTouristSights.js" />
/// <reference path="../../js/models.js" />
/// <reference path="../../js/NationalPlacesApi/NationalPlacesClient.js" />

// For an introduction to the Page Control template, see the following documentation:

// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
   
    var details;
    var comments;

    WinJS.UI.Pages.define("/pages/placedetails/placedetails.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        init: function (element, options) {
            details = BulgarianNationalTouristSights.ViewModels.loadPlaceDetails(options.invokedPlace.placeIndentifier);
            comments = BulgarianNationalTouristSights.ViewModels.loadComments(options.invokedPlace.placeIndentifier);
            BulgarianNationalTouristSights.PlaceDetailsCodeBehind.currentPlaceId = options.invokedPlace.placeIndentifier;
        },
        ready: function (element, options) {
            WinJS.UI.processAll().then(function () {
                var placeDetailsTemplate = document.getElementById("place-datails-template").winControl;
                var placeDetailsContainer = document.getElementById("place-datails");

                details.then(function (data) {
                    placeDetailsTemplate.render(data, placeDetailsContainer);
                }).then(function () {
                    var visitedPlaceInfo = WinJS.Utilities.query("input[type=hidden]")[0];
                    var placeId = visitedPlaceInfo.value;
                    var sessionData = BulgarianNationalTouristSights.ViewModels.loadKeyToSessionState("comment" + placeId);
                    if (sessionData && sessionData.text != "") {
                        BulgarianNationalTouristSights.PlaceDetailsCodeBehind.openCommentsForm();
                    }
                }).then(function(){
                    var laodingDetails = document.getElementById("loading-details");
                    if (laodingDetails) {
                        laodingDetails.style.display = "none";
                    }
                }, function () {
                    var laodingDetails = document.getElementById("loading-details");
                    if (laodingDetails) {
                        laodingDetails.innerHTML = "Data unavailable. Please try again later!";
                    }
                }).done();

                comments.then(function (data) {
                    BulgarianNationalTouristSights.PlaceDetailsCodeBehind.renderComments(data);
                }).then(function () {
                    var laodingDetails = document.getElementById("loading-comments");
                    if (laodingDetails) {
                        laodingDetails.style.display = "none";
                    }
                }, function (error) {
                    var laodingDetails = document.getElementById("loading-comments");
                    if (laodingDetails) {
                        if (error && error.responseText) {
                            laodingDetails.innerHTML = error.responseText;
                        }
                        else {
                            laodingDetails.innerHTML = "Data unavailable. Please try again later!";
                        }
                    }
                }).done();

                BulgarianNationalTouristSights.PlaceDetailsCodeBehind.showContextualCommands();
                BulgarianNationalTouristSights.PlaceDetailsCodeBehind.attachShowCommentsForm();
                BulgarianNationalTouristSights.PlaceDetailsCodeBehind.attachVisitPlace();
            });
            var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dataTransferManager.addEventListener("datarequested", BulgarianNationalTouristSights.PlaceDetailsCodeBehind.shareTextFileHandler);
        },

        unload: function () {
            BulgarianNationalTouristSights.PlaceDetailsCodeBehind.hideContextualCommands();
            BulgarianNationalTouristSights.PlaceDetailsCodeBehind.detachShowCommentsForm();
            BulgarianNationalTouristSights.PlaceDetailsCodeBehind.detachVisitPlace();
            BulgarianNationalTouristSights.PlaceDetailsCodeBehind.savePageSession();

            var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dataTransferManager.removeEventListener("datarequested", BulgarianNationalTouristSights.PlaceDetailsCodeBehind.shareTextFileHandler);
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
        }
    });
})();
