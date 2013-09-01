(function () {
    "use strict";
    
    WinJS.UI.Pages.define("/pages/home/home.html", {
        init: function (element, options) {
            return BulgarianNationalTouristSights.ViewModels.loadAllPlaces();
        },   
        ready: function (element, options) {
        }
    });
})();
