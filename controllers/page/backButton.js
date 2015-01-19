var properties = arguments[0];

_.each(properties.properties, function(value, key) {
    $.button[key] = value;
});

$.button.title = properties.properties.title;
$.button.addEventListener('click', properties.properties.callback || function(e) {
    properties.pageflow.back();
});
