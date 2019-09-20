# Qlik Sense App Icon Generator

The requirements for a Qlik Sense App Icon are:
- Suitable format - ideally PNG file, but can be JPG, JPEG or GIF
- Correct size or aspect - actual size for the hub is 168x108 pixels (although the help site says 8:5 - https://help.qlik.com/en-US/sense/June2019/Subsystems/Hub/Content/Sense_Hub/Apps/change-thumbnail-app.htm, and in-app this is also different)

# Usage

This has been packaged as an extension, so just upload it under extensions in the QMC, then navigate to /extensions/AppIconBuilder/AppIconBuilder.html to create some icons.

Example implementation:
![Default configuration, with a green logo generated](screenshot.png)

Note that prior to use, you'll need to configure the background image, and optionally font colours and sizes in config.json.

# Configuration

As of v2.0, configuration is via a config.json file. Two templates are included by default:
* qlik_green - uses a partially green background image with white app name text
* qlik_white - uses a fully white background image with dark text

# To do

Current backlog:
* Add word splitting for app names with words longer than the full width (currently these overflow)
* Add handling for transparent background images
* Add integration with QRS API for auto generation, and to allow pushing into a defined content library

# Done

* Initial version (v1.0)
* Add config for source image (source, scaling, opacity) or for a single colour background (v2.0)
* Add config for app name (font, colour, size, location) (v2.0)
* Add wrapping for app names (v2.0)
* Update wbl file to include correct references (v2.0.1)
* Add reference back to GitHub for future versions (v2.0.1)
* Update .gitignore to include mac and other formats (and remove from deployment package) (v2.0.1)

# Updates

## v2.0.1

* Updated wbl file to include correct references for editing in the dev-hub
* Add reference back to GitHub for future versions
* Tidied unwanted system files and gitignore

## v2.0

* Moved to using releases
* Tidied up readme and other files around the extension
* Introduced "templates". These are be defined in config.json so that the user can then select between different themes
* Changed file naming so that all alphanumeric characters are permitted in the download file name
* Added some limited error output

## v1.0

* Initial version
