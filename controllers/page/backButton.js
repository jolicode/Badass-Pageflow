var properties = arguments[0];

$.button.backgroundImage = properties.properties.backgroundImage || WPATH('images/button/back.png');
$.button.title = properties.properties.title || L('back');
$.button.addEventListener('click', function(e) {
    properties.pageflow.back();
});
