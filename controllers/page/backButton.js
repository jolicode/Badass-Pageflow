var properties = arguments[0];

if (!!properties && !!properties.properties && !!properties.properties.backgroundImage)
  $.button.backgroundImage = properties.properties.backgroundImage;
$.button.title = properties.properties.title;
$.clickZoneBack.addEventListener('click', properties.properties.callback || function(e) {
    properties.pageflow.back();
});
