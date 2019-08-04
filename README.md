# Qlik Sense App Icon Generator

The requirements for a Qlik Sense App Icon are:
- Suitable format - ideally PNG file, but can be JPG, JPEG or GIF
- Correct size or aspect - actual size for the hub is 168x108 pixels (although the help site says 8:5 - https://help.qlik.com/en-US/sense/June2019/Subsystems/Hub/Content/Sense_Hub/Apps/change-thumbnail-app.htm, and in-app this is also different)

# Usage

This has been packaged as an extension, so just upload it under extensions in the QMC, then navigate to /extensions/AppIconBuilder/AppIconBuilder.html to create some icons.

Note that prior to use, you'll need to configure the background image, and optionally font colours and sizes.

# To do

Current backlog:
* Add config for source image (source, scaling, opacity) or for a single colour background
* Add config for app name (font, colour, size, location)
* Add wrapping for app names
* Add integration with QRS API for auto generation, and to allow pushing into a defined content library
