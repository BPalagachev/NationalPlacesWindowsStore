(function () {
        var getErrorContainer = function (message) {
            var errorspan = document.createElement("span");
            errorspan.className = "error-status";
            errorspan.innerHTML = message;
            return errorspan;
        }

        var getStatusOkContainer = function (message) {
            var okspan = document.createElement("span");
            okspan.className = "ok-status";
            okspan.innerHTML = message;
            return okspan;
        }


    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "DomGenerator", {
        getErrorContainer: getErrorContainer,
        getStatusOkContainer: getStatusOkContainer
    })
}())