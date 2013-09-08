(function () {
    var goToDetailsPage = function (invokedEvent) {
        invokedEvent.detail.itemPromise.then(function (item) {
            WinJS.Navigation.navigate("/pages/placedetails/placedetails.html", {
                invokedPlace: item.data
            });
        });
    }

    var updateVistView = function () {
        var listViewContainer = document.getElementById("list-view-maincontent");
        var listViewControl = listViewContainer.winControl;

    }

    WinJS.Utilities.markSupportedForProcessing(goToDetailsPage);

    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "HomeCodeBehind", {
        goToDetailsPage: goToDetailsPage,
      });
}())
