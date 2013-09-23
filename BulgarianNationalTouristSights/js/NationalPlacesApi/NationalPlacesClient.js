(function () {
    var httpRequester = {
        _constructHeader: function (customHeaders) {
            customHeaders = customHeaders || {};
            var headers = {
                "Content-Type": "application/json"
            }

            for (var prop in customHeaders) {
                headers[prop] = customHeaders[prop];
            }

            return headers;
        },
        getJson: function (url, customHeaders) {
            var headers = httpRequester._constructHeader(customHeaders);

            return WinJS.xhr({
                type: "GET",
                url: url,
                headers: headers
            });
        },
        postJson: function (url, data, customHeaders) {
            var headers = httpRequester._constructHeader(customHeaders);

            return WinJS.xhr({
                type: "POST",
                url: url,
                data: JSON.stringify(data),
                headers: headers
            });
        },
        putJson: function (url, data, customHeaders) {
            var headers = httpRequester._constructHeader(customHeaders);

            return WinJS.xhr({
                type: "PUT",
                url: url,
                data: JSON.stringify(data),
                headers: headers
            });
        }
    }

    var Users = WinJS.Class.define(function (serviceUrl, settings, sensitiveStorage) {
        this.serviceUrl = serviceUrl;
        this.sensitiveStorage = sensitiveStorage;
        this.settings = settings;

        this.userInfo = {};

        if (this.settings.values["currentUser"]) {
            this._initialzeData(this.settings.values["currentUser"]);
        }
    }, {
        register: function (userName, nickName, password) {
            var self = this;
            var registerUrl = this.serviceUrl + "register";
            var authCode = CrypoJS.SHA1(userName + password).toString();
            var registerData = {
                username: userName,
                displayName: nickName,
                authCode: authCode
            };

            var registerPromise = httpRequester.postJson(registerUrl, registerData)
                .then(function (data) {
                    var loginData = JSON.parse(data.responseText);
                    self._saveUserData(userName, loginData.displayName, loginData.sessionKey, authCode);
                    return loginData;
                });
            return registerPromise;

        },
        login: function (username, password) {
            var self = this;
            var loginUrl = this.serviceUrl + "login";
            var authCode = CrypoJS.SHA1(username + password).toString();
            var loginData = {
                username: username,
                authCode: authCode
            };

            var loginPromise = httpRequester.postJson(loginUrl, loginData).then(function (data) {
                var loginData = JSON.parse(data.responseText);
                self._saveUserData(username, loginData.displayName, loginData.sessionKey, authCode);
                return loginData;
            });

            return loginPromise;
        },
        logout: function () {
            var self = this;
            var logoutUrl = this.serviceUrl + "logout";
            var header = {
                'X-sessionKey': this.userInfo.sessionKey
            };

            var logoutPromise = httpRequester.putJson(logoutUrl, null, header).then(function () {
                self._unloadUserData();
            });

            return logoutPromise;
        },
        isUserLoggedIn: function () {
            if (this.settings.values["currentUser"] && this.userInfo.sessionKey) {
                return this.userInfo;
            }
            return false;
        },
        _saveUserData: function (userName, nickName, sessionKey, authCode) {
            this.userInfo = {
                userName: userName,
                nickName: nickName,
                sessionKey: sessionKey,
                authCode: authCode
            };

            this.settings.values["currentUser"] = userName;
            this.sensitiveStorage
                .add(new Windows.Security.Credentials.PasswordCredential("nickName", userName, nickName));
            this.sensitiveStorage
                .add(new Windows.Security.Credentials.PasswordCredential("sessionKey", userName, sessionKey));
            this.sensitiveStorage
                .add(new Windows.Security.Credentials.PasswordCredential("authCode", userName, authCode));

        },
        _unloadUserData: function () {
            var username = this.settings.values["currentUser"];
            this.settings.values["currentUser"] = undefined;
            var testCredentials = this.sensitiveStorage.findAllByUserName(username);
            for (var i = 0; i < testCredentials.length; i++) {
                this.sensitiveStorage.remove(testCredentials[i]);
            }
        },
        _initialzeData: function (userName) {
            var userInfo = {
                userName: userName
            };
            var testCredentials = this.sensitiveStorage.findAllByUserName(userName);
            for (var i = 0; i < testCredentials.length; i++) {
                var currentCred = this.sensitiveStorage.retrieve(
                                                 testCredentials.getAt(i).resource,
                                                 testCredentials.getAt(i).userName);
                userInfo[currentCred.resource] = currentCred.password;
            }

            this.userInfo = userInfo;
            return userInfo;
        }
    }, {
    });

    var Places = WinJS.Class.define(function (servieUrl, users) {
        this.serviceUrl = servieUrl;
        this.user = users;

    }, {
        getAllPlaces: function () {
            var url = this.serviceUrl + "getAll";
            return httpRequester.getJson(url).then(function (data) {
                return JSON.parse(data.responseText);
            });
        },
        visit: function (sessionKey, latitude, longitude, cipher, placeId) {
            headers = { "X-sessionKey": sessionKey };
            var url = this.serviceUrl + "visit";
            var token = this._cipherCoordinates(latitude, longitude, cipher)
            var data = {
                "coordstoken": token,
                "placeId": placeId
            }

            return httpRequester.postJson(url, data, headers);
        },
        myplaces: function (sessionKey) {
            headers = { "X-sessionKey": sessionKey };
            var url = this.serviceUrl + "myplaces";
            return httpRequester.getJson(url, headers).then(function (data) {
                return JSON.parse(data.responseText);
            }, function () {
                return [];
            });
        },
        placeDetails: function (identifier) {
            var url = this.serviceUrl + "details?identifier=" + identifier;
            return httpRequester.getJson(url).then(function (data) {
                return JSON.parse(data.responseText);
            });
        },
        comment: function (sessionKey, latitude, longitude, identifier, cipher, text) {
            headers = { "X-sessionKey": sessionKey };
            var url = this.serviceUrl + "comment";
            var token = this._cipherCoordinates(latitude, longitude, cipher)

            var data =
                {
                    "identifier": identifier,
                    "coordstoken": token,
                    "content": text
                }

            return httpRequester.postJson(url, data, headers);
        },
        getComments: function(sessionKey, placeId){
            headers = { "X-sessionKey": sessionKey };
            var url = this.serviceUrl + "getcomments?identifier=" + placeId;

            return httpRequester.getJson(url, headers).then(function (data) {
                return JSON.parse(data.responseText);
            });
        },
        _cipherCoordinates: function (latitude, longitude, cipher) {
            var coordinates = latitude + ";" + longitude;

            var token = [];
            for (var i = 0; i < coordinates.length; i++) {
                var cipherChar = cipher[i % cipher.length].charCodeAt(0);
                var coordsChar = coordinates[i].charCodeAt(0);
                var current = coordsChar ^ cipherChar;
                token.push(String.fromCharCode(current));

            }

            var ciphered = token.join("");
            return ciphered;
        }
    }, {
    });

    var Client = WinJS.Class.define(function (baseUrl, storage, sensitiveStorage) {
        this.baseUrl = baseUrl;
        this.storage = storage;
        this.users = new Users(this.baseUrl + "users/", storage, sensitiveStorage);
        this.places = new Places(this.baseUrl + "places/");
    }, {

    }, {
    });

    WinJS.Namespace.define("NationalPlacesApi", {
        getClient: function (baseUrl, storage, sensitiveStorage) {
            return new Client(baseUrl, storage, sensitiveStorage);
        }
    });
}())