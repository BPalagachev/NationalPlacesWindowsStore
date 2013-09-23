(function () {
    var sessionState = WinJS.Application.sessionState;
    var currentPlaceId = 0;
    var renderedComments = [];

    var submitComment = function (placeId) {
        var text = document.getElementById("comments-textarea").value;

        var statusDisplay = document.getElementById("addcomments-status-msg");
        statusDisplay.innerHTML = '<progress class="win-ring win-large" />';

        BulgarianNationalTouristSights.ViewModels.commentPlace(placeId, text).then(function () {
            statusDisplay.innerText = "Comment added!"
            var formContainer = document.getElementById("add-comment-container").innerHTML = "";
            renderedComments.unshift({
                authorname: "You just ",
                content: text
            });
            renderComments(renderedComments);

        }, function (error) {
            if (error.responseText) {
                var errorMsg = JSON.parse(error.responseText).Message;
                var errorSpan = BulgarianNationalTouristSights.DomGenerator.getErrorContainer(errorMsg);
                if (statusDisplay) {
                    statusDisplay.innerHTML = "";
                    statusDisplay.appendChild(errorSpan);
                }
            }
            else {
                var errorSpan = BulgarianNationalTouristSights
                    .DomGenerator.getErrorContainer("You cannot be localized right now. Please try again!");
                if (statusDisplay) {
                    statusDisplay.innerHTML = "";
                    statusDisplay.appendChild(errorSpan);
                }
            }
        });
    }

    var visitPlace = function () {
        var statusDisplay = document.getElementById("addcomments-status-msg");
        statusDisplay.innerHTML = '<progress class="win-ring win-large" />';

        var visitedPlaceInfo = WinJS.Utilities.query("input[type=hidden]")[0];
        var placeId = visitedPlaceInfo.value;
        return BulgarianNationalTouristSights.ViewModels.visitPlace(placeId).then(function () {
            var msgSpan = BulgarianNationalTouristSights
                .DomGenerator.getStatusOkContainer("Place marked as visited");
            if (statusDisplay) {
                statusDisplay.innerHTML = "";
                statusDisplay.appendChild(msgSpan);
            }
        }).then(function(){
        }, function (error) {
            var errorMsg = "";
            if (error.responseText) {
                errorMsg = JSON.parse(error.responseText).Message;
            }
            else {
                errorMsg = "You cannot be localized right now. Please try again!";
            }

            var errorSpan = BulgarianNationalTouristSights
                    .DomGenerator.getErrorContainer(errorMsg);

            if (statusDisplay) {
                statusDisplay.innerHTML = "";
                statusDisplay.appendChild(errorSpan);
            }
        });
    }

    var openCommentsForm = function () {
        var formContainer = document.getElementById("add-comment-container");
        var currentform = document.getElementById("add-comment-form");
        if (currentform) {
            formContainer.innerHTML = "";
        }
        else {
            WinJS.UI.Pages.render("/pages/placedetails/addcomment.html", formContainer).then(function () {
                loadPageSession();
            });
        }
    }

    var showPlacesCommands = function () {
        var appBar = document.getElementById("appbar-id").winControl;
        var placeDetailsCommands
                        = document.querySelectorAll(".placeDetails");
        appBar.showCommands(placeDetailsCommands);
    }

    var attachShowCommentsForm = function () {
        var btn = document.getElementById("cmdAddComment");
        btn.addEventListener("click", openCommentsForm);
    }

    var attachVisitPlace = function () {
        var btn = document.getElementById("cmdVisitPlace");
        btn.addEventListener("click", visitPlace);
    }

    var detachVisitPlace = function () {
        var btn = document.getElementById("cmdVisitPlace");
        btn.detachEvent("click", visitPlace);
    }

    var detachShowCommentsForm = function () {
        var btn = document.getElementById("cmdAddComment");
        btn.detachEvent("click", openCommentsForm);
    }


    var hidePlacesCommands = function () {
        var appBar = document.getElementById("appbar-id").winControl;
        var placeDetailsCommands
                    = document.querySelectorAll(".placeDetails");
        appBar.hideCommands(placeDetailsCommands);
    }

    var renderComments = function (data) {
        renderedComments = data;
        var commentsTemplete = document.getElementById("comments-template").winControl;
        var commentsContainer = document.getElementById("coments-container");
        var repeater = new CustomControls.Repeater(commentsTemplete);
        repeater.render(data, commentsContainer);

    }

    var savePageSession = function () {
        var visitedPlaceInfo = WinJS.Utilities.query("input[type=hidden]")[0];
        if (!visitedPlaceInfo || !visitedPlaceInfo.value) {
            return;
        }
        var placeId = visitedPlaceInfo.value;
        var commentsTextArea = document.getElementById("comments-textarea");
        if (commentsTextArea) {
            var commentsState = commentsTextArea.innerText;
            var data = {
                id: placeId,
                text: commentsState
            }

            BulgarianNationalTouristSights.ViewModels.saveKeyToSessionState("comment" + placeId, data);
        }
    }

    var loadPageSession = function () {
        var visitedPlaceInfo = WinJS.Utilities.query("input[type=hidden]")[0];
        var placeId = visitedPlaceInfo.value;

        var sessionData = BulgarianNationalTouristSights.ViewModels.loadKeyToSessionState("comment" + placeId);
        if (sessionData && sessionData.text != "") {
            var commentsTextArea = document.getElementById("comments-textarea");
            commentsTextArea.value = sessionData.text;
        }
    }

    var saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", function () {
        var visitedPlaceInfo = WinJS.Utilities.query("input[type=hidden]")[0];
        var placeId = visitedPlaceInfo.value;
        return BulgarianNationalTouristSights.ViewModels.loadPlaceDetails(placeId).then(function () {
            var savePicker = new Windows.Storage.Pickers.FileSavePicker();
            savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
            savePicker.defaultFileExtension = ".txt"
            savePicker.fileTypeChoices.insert("Text Document", [".txt"])
            savePicker.suggestedFileName = "My Sight";

            savePicker.pickSaveFileAsync().then(function (file) {
                BulgarianNationalTouristSights.ViewModels.loadPlaceDetails(placeId).then(function (data) {
                    var text = "Place name: " + data.name + "\r\n";
                    text += "Additional Information: " + data.information + "\r\n";
                    text += "Latitude: " + data.latitude + "\r\n";
                    text += "Longitude: " + data.longitude + "\r\n";
                    text += "URL: " + data.url + "\r\n";
                    if (file) {
                        Windows.Storage.FileIO.writeTextAsync(file, text);
                    }
                });
            });
        });
    });

    var shareTextFileHandler = function (event) {
        var dataRequest = event.request;
        dataRequest.data.properties.title = "National Places Of Bulgaria";
        dataRequest.data.properties.description = "Visited place repost";
        dataRequest.data.properties.fileTypes.replaceAll([".txt"]);
        var visitedPlaceInfo = WinJS.Utilities.query("input[type=hidden]")[0];
        var placeId = visitedPlaceInfo.value;
        var placeName = document.getElementById("place-name").innerText;
        var placeInfo ={
            placeId: placeId,
            name: placeName
        };

        var deferral = dataRequest.getDeferral();

        BulgarianNationalTouristSights.ViewModels.getTextToShare(placeInfo).then(function(shareText){
            var localFolder = Windows.Storage.ApplicationData.current.localFolder;
            localFolder.createFileAsync("National Places Of Bulgaria.txt", Windows.Storage.CreationCollisionOption.replaceExisting).done(function (file) {
                Windows.Storage.FileIO.writeTextAsync(file, shareText).done(function () {
                    dataRequest.data.setStorageItems([file]);
                    deferral.complete();
                });
            });
        }, function (error) {
            deferral.complete();
        }).done(null, function (err) {
            deferral.complete();
        });
    }
    
    WinJS.Namespace.defineWithParent(BulgarianNationalTouristSights, "PlaceDetailsCodeBehind", {
        showContextualCommands: showPlacesCommands,
        hideContextualCommands: hidePlacesCommands,
        attachShowCommentsForm: attachShowCommentsForm,
        detachShowCommentsForm: detachShowCommentsForm,
        submitComment: submitComment,
        currentPlaceId: currentPlaceId,
        renderComments: renderComments,
        visitPlace: visitPlace,
        attachVisitPlace: attachVisitPlace,
        detachVisitPlace: detachVisitPlace,
        savePageSession: savePageSession,
        loadPageSession: loadPageSession,
        openCommentsForm: openCommentsForm,
        shareTextFileHandler: shareTextFileHandler,
    });
}())
