(function () {
    "use strict";
    
    WinJS.UI.Pages.define("/pages/home/home.html", {
        init: function (element, options) {
           
        },   
        ready: function (element, options) {
            // BulgarianNationalTouristSights.HomeCodeBehind.attachUserManageEvent();
            // BulgarianNationalTouristSights.ViewModels.markAsVisited();
            BulgarianNationalTouristSights.ViewModels.getVisitedPlaced();
        }
    });
})();
