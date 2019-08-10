// withdave
// Simple script to build icons the right size for Qlik Sense

// Primary page functions
(function ($) {

    // Logic to wrap app name text
    // Sourced from https://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
    };

    // Logic to build image
    $("#qsi-config").on("submit", function (e) {
        e.preventDefault();

        // Get app icon config
        var appName = $("#qsi-appname").val();
        var fileName = "AppIcon_" + appName.replace(/[^a-zA-Z]+/g, "");
        var appType = $("#qsi-apptype").val().toUpperCase();
        var backGroundAlpha = Number($("#qsi-bgalpha").val());

        // Now do some in-app config
        var appNameSize = 16;
        var appTypeSize = 8;

        // Get canvas
        var canvas = document.getElementById("qsi-canvas");
        var context = canvas.getContext("2d");

        // Draw a full background on the canvas
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
        context.fill();

        // Set the background alpha value to 1 if it's not a numeric value
        if (isNaN(backGroundAlpha)) {
            var backGroundAlpha = 1;
        } else {
            var backGroundAlpha = Math.min(Math.abs(backGroundAlpha), 1);
        };

        console.log("Generating icon with name [" + appName + "] and type [" + appType + "]. Background alpha [" + backGroundAlpha + "], filename [" + fileName + "]");

        // Prep for background image and load it in
        var backgroundImg = new Image();
        backgroundImg.onload = function () {

            // Work out the aspect ratio of the canvas and draw the background image this size in the centre
            var hRatio = canvas.width / backgroundImg.width;
            var vRatio = canvas.height / backgroundImg.height;
            var ratio = Math.min(hRatio, vRatio);
            var centreShift_x = (canvas.width - backgroundImg.width * ratio) / 2;
            var centreShift_y = (canvas.height - backgroundImg.height * ratio) / 2;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.globalAlpha = backGroundAlpha;
            context.drawImage(backgroundImg, 0, 0, backgroundImg.width, backgroundImg.height,
                centreShift_x, centreShift_y, backgroundImg.width * ratio, backgroundImg.height * ratio);
            context.globalAlpha = 1;

            // Overlay the text for App Name
            context.font = appNameSize + "pt Sans-Serif";
            context.fillStyle = '#333';
            var locationY = 27;
            var locationX = 10;
            var maxWidth = canvas.width - (locationX * 2);
            var lineHeight = appNameSize + 8;
            wrapText(context, appName, locationX, locationY, maxWidth, lineHeight);

            // Overlay the text for App Type
            context.font = appTypeSize + "pt Sans-Serif";
            context.fillStyle = '#333';
            context.fillText(appType, 10, 96);

            // Now enable the download button and set the name of the button to the icon filename
            $("#qsiDownload").prop('disabled', false);
            $("#qsiDownload").text("Download [" + fileName + ".png]");

        };

        // Specify path to background image
        backgroundImg.src = "icon_background.png";
    });

    // Logic to download canvas
    $("#qsiDownload").on("click", function () {

        // This should be refactored
        var fileNameStart = $("#qsiDownload").text().indexOf("_")+1;
        var fileNameLen = Math.max($("#qsiDownload").text().indexOf(".") - 1 - $("#qsiDownload").text().indexOf("_"), 0);
        console.log("Loading filename from position " + fileNameStart + " for " + fileNameLen + " characters.");

        if (fileNameStart !== -1) {

            var fileName = "AppIcon_" + $("#qsiDownload").text().substring(fileNameStart, fileNameStart + fileNameLen);

            // Quickly correct zero length file names
            if (fileNameLen === 0) {
                var fileName = "AppIcon_Empty";
            }

            console.log("Downloading [" + fileName + "]");

            // Using FileSaver as this allows us to set the download file name
            var canvas = document.getElementById("qsi-canvas");
            canvas.toBlob(function (blob) {
                saveAs(blob, fileName + ".png");
            });
        }

    });
})(jQuery);


