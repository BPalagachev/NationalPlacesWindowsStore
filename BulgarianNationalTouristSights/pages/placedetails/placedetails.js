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
                });

                comments.then(function (data) {
                    BulgarianNationalTouristSights.PlaceDetailsCodeBehind.renderComments(data);
                    BulgarianNationalTouristSights.PlaceDetailsCodeBehind.showContextualCommands();
                    BulgarianNationalTouristSights.PlaceDetailsCodeBehind.attachShowCommentsForm();
                    BulgarianNationalTouristSights.PlaceDetailsCodeBehind.attachVisitPlace();
                }, function (error) {
                    var bp = 3;
                });
            });
        },

        unload: function () {
            BulgarianNationalTouristSights.PlaceDetailsCodeBehind.hideContextualCommands();
            BulgarianNationalTouristSights.PlaceDetailsCodeBehind.detachShowCommentsForm();
            BulgarianNationalTouristSights.PlaceDetailsCodeBehind.detachVisitPlace();

            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
