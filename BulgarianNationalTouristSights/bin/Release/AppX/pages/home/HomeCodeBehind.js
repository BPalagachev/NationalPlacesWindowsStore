(function () {
    var goToDetailsPage = function (invokedEvent) {
        invokedEvent.detail.itemPromise.then(function (item) {
            WinJS.Navigation.navigate("/pages/placedetails/placedetails.html", {
                invokedPlace: item.data
            });
        });
    }

    WinJS.Utilities.markSupportedForProcessing(goToDetailsPage);

    var saveScrollPosition = function () {
        var listView = document.getElementById("list-view-maincontent").winControl;
        var scrollPostion = listView.currentItem;
        BulgarianNationalTouristSights.ViewModels.mainScrollPosition = scrollPostion;
        listView.removeEventListener("loadingstatechanged", handleListViewStateChaged);
    }

    var loadScrollPosition = function () {
        var listView = document.getElementById("list-view-maincontent").winControl;

        listView.addEventListener("loadingstatechanged", handleListViewStateChaged);
     }

    var handleListViewStateChaged = function () {
        var listView = document.getElementById("list-view-maincontent").winControl;

        if (listView.loadingState == "viewPortLoaded") {
            if (BulgarianNationalTouristSights.ViewModels.mainScrollPosition != null) {
                listView.ensureVisible(BulgarianNationalTouristSights.ViewModels.mainScrollPosition.index);
                //listView.currentItem = BulgarianNationalTouristSights.ViewModels.mainScrollPosition;
                //listView.currentItem.showFocus = true;
                //BulgarianNationalTouristSights.ViewModels.mainScrollPosition = null;
            }
        }
        listView.removeEventListener("loadingstatechanged", handleListViewStateChaged);
    }

    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "HomeCodeBehind", {
        goToDetailsPage: goToDetailsPage,
        saveScrollPosition: saveScrollPosition,
        loadScrollPosition: loadScrollPosition
    });
}())
