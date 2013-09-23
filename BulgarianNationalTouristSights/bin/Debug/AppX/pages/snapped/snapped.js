// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/snapped/snapped.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var appBar = document.getElementById("appbar-id").winControl;
            var placeDetailsCommands
                        = document.querySelectorAll("#appbar-id button");
            appBar.hideCommands(placeDetailsCommands);
            // TODO: Initialize the page here.
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.

            var appBar = document.getElementById("appbar-id").winControl;
            var placeDetailsCommands
                            = document.querySelectorAll("#appbar-id button");
            appBar.showCommands(placeDetailsCommands);  
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
