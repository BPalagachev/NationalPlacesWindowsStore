(function () {
    "use strict";
    
    WinJS.UI.Pages.define("/pages/home/home.html", {
        init: function (element, options) {
            return BulgarianNationalTouristSights.ViewModels.loadAllPlaces().then(function(){
                BulgarianNationalTouristSights.ViewModels.unmarkVIsitedPlaces()
            });
        },   
        ready: function (element, options) {
            // BulgarianNationalTouristSights.HomeCodeBehind.attachUserManageEvent();
            // BulgarianNationalTouristSights.ViewModels.markAsVisited();

        }
    });
})();
