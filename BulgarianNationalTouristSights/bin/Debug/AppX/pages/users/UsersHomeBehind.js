(function () {
    var register = function () {
        var registerUserName = document.getElementById("username-register").value;
        var registerNickName = document.getElementById("displayname-register").value;
        var registerPassword = document.getElementById("password-register").value;
        var registerPasswordRepeat = document.getElementById("password-repeat-register").value;

        if (registerPassword == registerPasswordRepeat) {
            BulgarianNationalTouristSights
                .ViewModels.registerUser(registerUserName, registerNickName, registerPassword)
                .then(function (data) {
                    WinJS.Navigation.navigate("/pages/home/home.html", {});

                }, function (error) {
                    var errorMessage = document.getElementById("user-error-messages");
                    errorMessage.innerHTML = error.responseText;
                })

        }
        else {
            var errorMessage = document.getElementById("user-error-messages");
            errorMessage.innerHTML = "Password mismatch";
        }

    }

    var login = function () {
        var loginUserName = document.getElementById("username-login").value;
        var loginPassword = document.getElementById("password-login").value;

        BulgarianNationalTouristSights
           .ViewModels.userLogIn(loginUserName, loginPassword)
           .then(function (data) {
               WinJS.Navigation.navigate("/pages/home/home.html", {});

           }, function (error) {
               var errorMessage = document.getElementById("user-error-messages");
               errorMessage.innerHTML = error.responseText;
           })
    }




    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "UsersHomeBehind", {
        register: register,
        login: login
    });
}())
