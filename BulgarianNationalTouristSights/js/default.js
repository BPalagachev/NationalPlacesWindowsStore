// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    //var storage = Windows.Storage.ApplicationData.current.temporaryFolder;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {

                //var container = document.createElement("div");
                //document.body.appendChild(container);

                //BulgarianNationalTouristSights.Data.allPlaces().then(function (data) {
                //    var p = document.createElement("p");
                //    p.innerText = JSON.stringify(data);
                //    container.appendChild(p);
                //}, function (error) {
                //    var p = document.createElement("p");
                //    p.innerText = JSON.stringify(error.responseText);
                //    container.appendChild(p);
                //});


               

               
                //var places = BulgarianNationalTouristSights.ViewModels.allPlaces;

















                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();
})();
