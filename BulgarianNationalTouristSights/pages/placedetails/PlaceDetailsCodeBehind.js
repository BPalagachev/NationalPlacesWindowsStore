﻿(function () {
    var currentPlaceId = 0;
    var renderedComments = [];

    var submitComment = function (placeId) {
        var text = document.getElementById("comments-textarea").value;

        var statusDisplay = document.getElementById("addcomments-status-msg");

        BulgarianNationalTouristSights.ViewModels.commentPlace(placeId, text).then(function () {
            statusDisplay.innerText = "Comment added!"
            var formContainer = document.getElementById("add-comment-container").innerHTML = "";
            renderedComments.push({
                authorname: "You just commented: ",
                content: text
            });
            renderComments(renderedComments);

        }, function (error) {
            statusDisplay.innerText = error.responseText;
        });
    }

    var visitPlace = function () {
        var visitedPlaceInfo = WinJS.Utilities.query("input[type=hidden]")[0];
        var placeId = visitedPlaceInfo.value;
        return BulgarianNationalTouristSights.ViewModels.visitPlace().then(function () {
            var statusDisplay = document.getElementById("addcomments-status-msg");
            statusDisplay.innerText = "Place marked as visited";
        }).then(function(){
            BulgarianNationalTouristSights.ViewModels.markAsVisited(placeId);
        });
    }

    var openCommentsForm = function () {
        var formContainer = document.getElementById("add-comment-container");
        WinJS.UI.Pages.render("/pages/placedetails/addcomment.html", formContainer);
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
        detachVisitPlace: detachVisitPlace
    });
}())
