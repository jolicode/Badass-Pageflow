var properties = arguments[0] || {};

var containers = {
    'center': $.center,
    'right': $.right,
    'left': $.left
};

var controllers = {
    'center': null,
    'right': null,
    'left': null
};

exports.getContent = function(position) {
    return controllers[position];
};

exports.getCenterContent = function() {
    return exports.getContent('center');
};

exports.getLeftContent = function() {
    return exports.getContent('left');
};

exports.getRightContent = function() {
    return exports.getContent('right');
};

exports.removeCenterContent = function() {
    setContent('center', null);
};

exports.removeLeftContent = function() {
    setContent('left', null);
};

exports.removeRightContent = function() {
    setContent('right', null);
};

exports.setBackgroundColor = function(backgroundColor) {
    $.navBar.backgroundColor = backgroundColor;
};

exports.setBackgroundImage = function(backgroundImage) {
    $.navBar.backgroundImage = backgroundImage;
};

exports.setCenterContent = function(view, options) {
    setContent('center', view, options);
};

exports.setLeftContent = function(view, options) {
    setContent('left', view, options);
};

exports.setRightContent = function(view, options) {
    setContent('right', view, options);
};

exports.setTitle = function(title, options) {
    var view = Widget.createController('page/title', title).getView();
    setContent('center', view, options);
};

setContent = function(containerName, view, options) {
    container = containers[containerName];
    options = options || {};

    if (container.content) {
        container.remove(container.content);
    }

    if (null !== view) {
        if (typeof view === 'string') {
            // view must be created
            controllers[containerName] = Alloy.createController(view, options);
            var view = controllers[containerName].getView();
        } else {
            controllers[containerName] = null;
        }

        // set some basic properties
        if (!view.right && !view.left) {
            view.center = { x: '50%', y: '50%' };
        }
        if (!view.height) {
            view.height = Titanium.UI.SIZE;
        }
        if (!view.width) {
            view.width = Titanium.UI.SIZE;
        }

        // copy options to the generated view
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                view[key] = options[key];
            }
        }

        if (view !== null) {
            container.add(view);
        }
    }

    // eventually remove container's contained view
    if (container.content && container.content !== null) {
        container.remove(container.content);
    }

    container.content = view;
};

if (properties.left) {
    exports.setLeftContent(properties.left, properties.leftOptions ? properties.leftOptions : {});
}

if (properties.right) {
    exports.setRightContent(properties.right, properties.rightOptions ? properties.rightOptions : {});
}

if (properties.title) {
    exports.setTitle(properties.title, properties.titleOptions ? properties.titleOptions : {});
}

if (properties.center) {
    exports.setCenterContent(properties.center, properties.centerOptions ? properties.centerOptions : {});
}

if (properties.backgroundColor) {
    exports.setBackgroundColor(properties.backgroundColor);
}

if (properties.backgroundImage) {
    exports.setBackgroundImage(properties.backgroundImage);
}
