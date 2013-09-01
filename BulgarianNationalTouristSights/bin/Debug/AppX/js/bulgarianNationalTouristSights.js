/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />

(function () {
    var applicationSettings = Windows.Storage.ApplicationData.current.localSettings;
    var vault = new Windows.Security.Credentials.PasswordVault();
    var apiClient = NationalPlacesApi.getClient("http://localhost:45021/api/", applicationSettings, vault);

    WinJS.Namespace.define("BulgarianNationalTouristSights", {
        apiClient : apiClient
    });
}())