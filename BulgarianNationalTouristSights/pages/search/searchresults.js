// For an introduction to the Search Contract template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232512

// TODO: Add the following script tag to the start page's head to
// subscribe to search contract events.
//  
// <script src="/pages/search/searchresults.js"></script>

(function () {
    "use strict";
    WinJS.Binding.optimizeBindingReferences = true;

    var appModel = Windows.ApplicationModel;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var searchPageURI = "/pages/search/searchresults.html";

    ui.Pages.define(searchPageURI, {
        ready: function (element, options) {
            BulgarianNationalTouristSights.ViewModels.searchQuery.queryText = options.queryText;
            WinJS.Binding.processAll(element, BulgarianNationalTouristSights.ViewModels);
            BulgarianNationalTouristSights.ViewModels.submitSearchText(options.queryText);
        }
    });

    WinJS.Application.addEventListener("activated", function (args) {
        if (args.detail.kind === appModel.Activation.ActivationKind.search) {
            args.setPromise(ui.processAll().then(function () {
                if (!nav.location) {
                    nav.history.current = { location: Application.navigator.home, initialState: {} };
                }
                return nav.navigate(searchPageURI, { queryText: args.detail.name });
            }));
        }
    });

    appModel.Search.SearchPane.getForCurrentView().onquerysubmitted
        = function (args) { nav.navigate(searchPageURI, args); };
})();
