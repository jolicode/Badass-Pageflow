var properties = arguments[0];

$.button.backgroundImage = properties.properties.backgroundImage;
$.button.title = properties.properties.title || L('back');
$.button.addEventListener('click', properties.properties.callback || function(e) {
    properties.pageflow.back();
});
