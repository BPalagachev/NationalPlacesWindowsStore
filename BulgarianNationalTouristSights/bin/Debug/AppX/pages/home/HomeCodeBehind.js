(function () {
    var attachUserManageEvent = function () {
        var btnUserState = document.getElementById("cmdManageUsers");
        var menu = document.getElementById("user-manage-menu").winControl;
        var appBar = document.getElementById("appbar-id").winControl;

        btnUserState.addEventListener("click", function (event) {
            menu.show();
        });

        var btnUserRegister = document.getElementById("navigate-user-register");
        btnUserRegister.addEventListener("click", function (event) {
            menu.hide();
            appBar.hide();
            WinJS.Navigation.navigate("/pages/users/usersl.html", { state: "register" });
        });

        var btnUserLogIn = document.getElementById("navigate-user-lonin");
        btnUserLogIn.addEventListener("click", function (event) {
            menu.hide();
            appBar.hide();
            WinJS.Navigation.navigate("/pages/users/usersl.html", { state: "login" });
        });

        var btnUserLogIn = document.getElementById("navigate-user-logout");
        btnUserLogIn.addEventListener("click", function (event) {
            menu.hide();
            appBar.hide();
            WinJS.Navigation.navigate("/pages/users/usersl.html", { state: "logout" });
        });
    }

    var goToDetailsPage = function (invokedEvent) {
        invokedEvent.detail.itemPromise.then(function (item) {
            WinJS.Navigation.navigate("/pages/placedetails/placedetails.html", {
                invokedPlace: item.data
            });
        });
    }

    WinJS.Utilities.markSupportedForProcessing(goToDetailsPage);


    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "HomeCodeBehind", {
        goToDetailsPage: goToDetailsPage,
        attachUserManageEvent: attachUserManageEvent
    });
}())
