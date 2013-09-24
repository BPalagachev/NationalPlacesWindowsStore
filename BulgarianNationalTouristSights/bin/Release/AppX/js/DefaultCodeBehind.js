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

        var btnLogOut = document.getElementById("navigate-user-logout");
        btnLogOut.addEventListener("click", function (event) {
            menu.hide();
            appBar.hide();
            var flyoutContainer = document.getElementById("logout-flyout");
            var flyout = flyoutContainer.winControl;
            var logoutstatus = document.getElementById("logout-status-msg");
            BulgarianNationalTouristSights.ViewModels.userLogout().then(function (success) {
                logoutstatus.innerText = "Logout Successfully!";
                flyout.show(btnLogOut);
                WinJS.Navigation.navigate("/pages/home/home.html", {});
            }).then(function () {
                BulgarianNationalTouristSights.ViewModels.unmarkVIsitedPlaces();
            }).then(function () { }, function (error) {
                logoutstatus.innerText = "Please try later!";
                flyout.show(btnLogOut);
            })
        });
    }

    var markPageLoaded = function () {
        var progress = document.getElementById("page-loading");
        var contentHost = document.getElementById("contenthost");
        progress.style.display = "none";
        contentHost.style.display = "block";

    }

    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "DefaultCodeBehind", {
        attachUserManageEvent: attachUserManageEvent,
        markPageLoaded: markPageLoaded
    });
}())
