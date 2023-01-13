// withdave
// Simple script to build icons the right size for Qlik Sense
// Update reminder: Readme (change log and version), version on HTML H1

// Primary page functions
(function ($) {

    // Create a variable to hold the loaded configuration within the parent function
    var templateList;

    // Hide javascript error as we initialise
    $("div#qsi-error").hide();

    // Load config from config.json
    $.getJSON('config.json', function (data) {
        // Just in case we want to take a peek
        // console.log(data);
    }).done(function (data) {
        // Assign object to templateList
        templateList = data;
        // Populate the template with options
        $.each(data.templates, function (template) {
            $("<option>").attr("value", template).text(template).appendTo("#qsi-template");
            console.log("Recognised template: " + template);
        });
    }).fail(function () {
        console.error("App Icon Builder: Error loading configuration - it's likely that the config.json file isn't structured correctly.")
        $("div#qsi-error").show();
        $("div#qsi-error").html("Error: There was an error loading config.json. Please check the file and refresh this page.");
    });

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

        // We'd better load that config!
        // Determine which config has been selected 
        // There's no error checking so if the config is invalid it'll error or look odd
        var iconTemplate = $("#qsi-template").val();
        
        // Get app icon config from the form
        var appName = $("#qsi-appname").val();
        var fileName = "AppIcon_" + appName.replace(/[^a-zA-Z0-9]+/g, "");
        var appType = $("#qsi-apptype").val().toUpperCase();

        // Get app icon config from the relevant JSON config
        // Background
        var backgroundAlpha = templateList.templates[iconTemplate].background.imageAlpha;
        var backgroundColour = templateList.templates[iconTemplate].background.colour;
        var backgroundImg = new Image();
        if (templateList.templates[iconTemplate].background.image.length > 0) {
            backgroundImg.src = "backgrounds/" + templateList.templates[iconTemplate].background.image;
        } else {
            backgroundImg.src = "backgrounds/empty.png";
        }

        // App Name
        var appNameFont = templateList.templates[iconTemplate].appName.font;
        var appNameSize = templateList.templates[iconTemplate].appName.fontSize;
        var appNameColour = templateList.templates[iconTemplate].appName.colour;
        var appNameAlign = templateList.templates[iconTemplate].appName.align;
        var appNameLocX = templateList.templates[iconTemplate].appName.locX;
        var appNameLocY = templateList.templates[iconTemplate].appName.locY;

        // App type
        var appTypeFont = templateList.templates[iconTemplate].appType.font;
        var appTypeSize = templateList.templates[iconTemplate].appType.fontSize;
        var appTypeColour = templateList.templates[iconTemplate].appType.colour;
        var appTypeAlign = templateList.templates[iconTemplate].appType.align;
        var appTypeLocX = templateList.templates[iconTemplate].appType.locX;
        var appTypeLocY = templateList.templates[iconTemplate].appType.locY;

        // Get canvas
        var canvas = document.getElementById("qsi-canvas");
        var context = canvas.getContext("2d");

        // Set size of canvas
        canvas.width = templateList.templates[iconTemplate].background.canvasX;
        canvas.height = templateList.templates[iconTemplate].background.canvasY;

        // Draw a full background on the canvas
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = backgroundColour;
        context.fill();

        console.log("Generating icon with name [" + appName + "] and type [" + appType + "] with template [" + iconTemplate + "].");

        // Prep for background image and load it in
        backgroundImg.onload = function () {
            
            // Work out the aspect ratio of the canvas and draw the background image this size in the centre
            var hRatio = canvas.width / backgroundImg.width;
            var vRatio = canvas.height / backgroundImg.height;
            var ratio = Math.min(hRatio, vRatio);
            var centreShift_x = (canvas.width - backgroundImg.width * ratio) / 2;
            var centreShift_y = (canvas.height - backgroundImg.height * ratio) / 2;
            context.globalAlpha = backgroundAlpha;
            
            if (templateList.templates[iconTemplate].background.image.length > 0) {
                context.drawImage(backgroundImg, 0, 0, backgroundImg.width, backgroundImg.height,
                    centreShift_x, centreShift_y, backgroundImg.width * ratio, backgroundImg.height * ratio);
            }
            context.globalAlpha = 1;

            // Overlay the text for App Name
            context.font = appNameSize + "pt " + appNameFont;
            context.textAlign = appNameAlign;
            context.fillStyle = appNameColour;
            var maxWidth = canvas.width - (appNameLocX * 2);
            var lineHeight = appNameSize + 8;
            wrapText(context, appName, appNameLocX, appNameLocY, maxWidth, lineHeight);

            // Overlay the text for App Type
            context.font = appTypeSize + "pt " + appTypeFont;
            context.textAlign = appTypeAlign;
            context.fillStyle = appTypeColour;
            context.fillText(appType, appTypeLocX, appTypeLocY);

            // Now enable the download button and set the name of the button to the icon filename
            $("#qsiDownload").prop('disabled', false);
            $("#qsiDownload").text("Download [" + fileName + ".png]");

        };

    });

    // Logic to download canvas
    $("#qsiDownload").on("click", function () {

        // This should be refactored
        var fileNameStart = $("#qsiDownload").text().indexOf("_") + 1;
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


