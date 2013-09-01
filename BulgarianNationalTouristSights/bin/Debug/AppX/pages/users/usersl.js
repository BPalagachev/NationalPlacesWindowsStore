﻿// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/users/usersl.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var userContainer = document.getElementById("user-container");

            if (options.state == "register") {
                WinJS.UI.Pages.render("/pages/users/userregister.html", userContainer);
            } else if (options.state == "login") {
                WinJS.UI.Pages.render("/pages/users/userlogin.html", userContainer);
            }

            // TODO: Initialize the page here.
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
