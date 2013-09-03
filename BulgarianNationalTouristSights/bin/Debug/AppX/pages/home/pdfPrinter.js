(function () {

    var printManager = Windows.Graphics.Printing.PrintManager.getForCurrentView();
    printManager.onprinttaskrequested = onPrintTaskRequested;

    function onPrintTaskRequested(printEvent) {
        var printTask = printEvent.request.createPrintTask("Print Sample", function (args) {
            var test = MSApp.getHtmlPrintDocumentSource(document)
            args.setSource(test);

            // Register the handler for print task completion event
            printTask.oncompleted = onPrintTaskCompleted;
        });
    }

    function onPrintTaskCompleted(printTaskCompletionEvent) {
        // Notify the user about the failure
        if (printTaskCompletionEvent.completion === Windows.Graphics.Printing.PrintTaskCompletion.failed) {
            WinJS.log && WinJS.log("Failed to print.", "sample", "error");
        }
    }
})();