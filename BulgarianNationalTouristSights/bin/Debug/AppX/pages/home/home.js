(function () {
    "use strict";
    var visitedPlaces;
    
    WinJS.UI.Pages.define("/pages/home/home.html", {
        init: function (element, options) {
            visitedPlaces = BulgarianNationalTouristSights.ViewModels.getVisitedPlaced();
        },   
        ready: function (element, options) {
            // BulgarianNationalTouristSights.HomeCodeBehind.attachUserManageEvent();
            // BulgarianNationalTouristSights.ViewModels.markAsVisited();
        }
    });
})();
