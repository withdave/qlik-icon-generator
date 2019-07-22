// withdave
// 22/07/2019
// Simple script to build icons the right size for Qlik Sense

(function($){
    // Logic to build image
	$("#qsi-config").on("qsi-generateImage", function(e){
  	    e.preventDefault();
        
        // Get app name and canvas
        var appName = $("#qsi-appname").val();
        var canvas  = document.getElementById("qsi-canvas");
        var context = canvas.getContext("2d");
        
        // Prep for background image and load it in
        var backgroundImg       = new Image();
        backgroundImg.onload    = function(){
            
            // Work out the aspect ratio of the canvas and draw the background image this size in the centre
            var hRatio = canvas.width  / backgroundImg.width    ;
            var vRatio = canvas.height / backgroundImg.height  ;
            var ratio  = Math.min ( hRatio, vRatio );
            var centreShift_x = ( canvas.width - backgroundImg.width * ratio ) / 2;
            var centreShift_y = ( canvas.height - backgroundImg.height * ratio ) / 2;  
            context.clearRect(0,0,canvas.width, canvas.height);
            context.globalAlpha = 0.5;
            context.drawImage(backgroundImg, 0,0, backgroundImg.width, backgroundImg.height,
                        centreShift_x,centreShift_y,backgroundImg.width*ratio, backgroundImg.height*ratio);
            context.globalAlpha = 1;

            // Now overlay the text
            context.font = "20pt Calibri";
            context.fillText(appName, 10, 25);
        };

        // Specify path to background image
        backgroundImg.src = "icon_background.jpg"; 
    });
  
    // Logic to download canvas
    $("#qsiDownload").on("click", function(){
        var canvas = document.getElementById("qsi-canvas");
        var fullQuality = canvas.toDataURL("image/png", 1.0);
        window.open(fullQuality);
    });
})(jQuery);
