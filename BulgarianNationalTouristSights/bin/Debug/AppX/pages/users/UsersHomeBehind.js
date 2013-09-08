(function () {
    var register = function () {
        var progress = document.getElementById("register-loading");
        progress.style.display = "block";

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
                    progress.style.display = "none";
                    var errorMessage = document.getElementById("user-error-messages");
                    var errorMsg;
                    if (error.responseText && error.responseText.length != 0) {
                        errorMsg = JSON.parse(error.responseText).Message;
                        errorMsg = errorMsg.replace(/\n/g, '<br />');
                    } else {
                        errorMsg = "Please try again later";
                    }

                    var errorSpan = BulgarianNationalTouristSights.DomGenerator.getErrorContainer(errorMsg);
                    errorMessage.innerHTML = "";
                    errorMessage.appendChild(errorSpan);
                })
        }
        else {
            progress.style.display = "none";
            var errorMessage = document.getElementById("user-error-messages");
            var errorSpan = BulgarianNationalTouristSights.DomGenerator.getErrorContainer("Password mismatch");
            errorMessage.innerHTML = "";
            errorMessage.appendChild(errorSpan);
        }

    }

    var login = function () {
        var progress = document.getElementById("login-loading");
        progress.style.display = "block";

        var loginUserName = document.getElementById("username-login").value;
        var loginPassword = document.getElementById("password-login").value;

        BulgarianNationalTouristSights
           .ViewModels.userLogIn(loginUserName, loginPassword)
           .then(function (data) {
               progress.style.display = "none";
               WinJS.Navigation.navigate("/pages/home/home.html", {});

           }, function (error) {
               progress.style.display = "none";
               var errorMessage = document.getElementById("user-error-messages");
               var errorMsg = "";
               if (error.responseText && error.responseText.length != 0) {
                   errorMsg = JSON.parse(error.responseText).Message;
                   errorMsg = errorMsg.replace(/\n/g, '<br />');
               }
               else {
                   errorMsg = "Please try again later";
               }
               var errorSpan = BulgarianNationalTouristSights.DomGenerator.getErrorContainer(errorMsg);
               errorMessage.innerHTML = "";
               errorMessage.appendChild(errorSpan);
           })
    }




    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "UsersHomeBehind", {
        register: register,
        login: login
    });
}())
