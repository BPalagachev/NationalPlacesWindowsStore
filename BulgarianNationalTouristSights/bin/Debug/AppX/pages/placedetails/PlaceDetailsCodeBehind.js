﻿(function () {
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
                authorname: "You just commented: ",
                content: text
            });
            renderComments(renderedComments);

        }, function (error) {
            if (error.responseText) {
                var errorMsg = JSON.parse(error.responseText).Message;
                var errorSpan = BulgarianNationalTouristSights.DomGenerator.getErrorContainer(errorMsg);
                statusDisplay.innerHTML = "";
                statusDisplay.appendChild(errorSpan);
            }
            else {
                var errorSpan = BulgarianNationalTouristSights
                    .DomGenerator.getErrorContainer("You cannot be localized right now. Please try again!");
                statusDisplay.innerHTML = "";
                statusDisplay.appendChild(errorSpan);
            }
        });
    }

    var visitPlace = function () {
        var statusDisplay = document.getElementById("addcomments-status-msg");
        statusDisplay.innerHTML = '<progress class="win-ring win-large" />';

        var visitedPlaceInfo = WinJS.Utilities.query("input[type=hidden]")[0];
        var placeId = visitedPlaceInfo.value;
        return BulgarianNationalTouristSights.ViewModels.visitPlace().then(function () {
            var msgSpan = BulgarianNationalTouristSights
                .DomGenerator.getStatusOkContainer("Place marked as visited");
            statusDisplay.innerHTML = "";
            statusDisplay.appendChild(msgSpan);
        }).then(function(){
        }, function (error) {
            var errorSpan = BulgarianNationalTouristSights
                    .DomGenerator.getErrorContainer("You cannot be localized right now. Please try again!");
            statusDisplay.innerHTML = "";
            statusDisplay.appendChild(errorSpan);
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
        openCommentsForm: openCommentsForm
    });
}())
