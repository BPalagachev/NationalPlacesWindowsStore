(function () {
    "use strict";
    var visitedPlaces;


    WinJS.UI.Pages.define("/pages/home/home.html", {
        init: function (element, options) {
            visitedPlaces = BulgarianNationalTouristSights.ViewModels.getVisitedPlaced();
        },
        ready: function (element, options) {
            visitedPlaces.then(function () {
                //BulgarianNationalTouristSights.HomeCodeBehind.loadScrollPosition();
            });

            // BulgarianNationalTouristSights.HomeCodeBehind.attachUserManageEvent();
            // BulgarianNationalTouristSights.ViewModels.markAsVisited();
        },
        updateLayout: function (element, viewState, lastViewState) {
            
        },
        unload: function () {
           // BulgarianNationalTouristSights.HomeCodeBehind.saveScrollPosition();
        }
    });
})();
