var properties = arguments[0] || {};

// create the nav bar
var navBar = Widget.createController(
    'page/navBar',
    properties.navBar ? properties.navBar : {}
);

if (!properties.navBarHidden) {
    $.container.add(navBar.getView());
}

// create the central content zone
properties.arguments = properties.arguments || {};
properties.arguments.containingPage = $.container;

var pageController = Alloy.createController(properties.controller, properties.arguments);
var pageContent = pageController.getView();
$.container.add(pageContent);

var api = {
    clearNavRight: function() {
        navBar.removeRightContent();
    },

    getContent: function() {
        return pageContent;
    },

    getNavBar: function() {
        return navBar;
    },

    hideNavBar: function() {
        pageContent.setTop(0);
    },

    preHide: function() {
        if (pageController.preHide) {
            pageController.preHide();
        }
    },

    preShow: function() {
        if (pageController.preShow) {
            pageController.preShow();
        }
    },

    postHide: function() {
        if (pageController.postHide) {
            pageController.postHide();
        }
    },

    postShow: function() {
        if (pageController.postShow) {
            pageController.postShow();
        }
    },

    removeEventListeners: function() {
        if (pageController.removeEventListeners) {
            pageController.removeEventListeners();
        }
    },

    setNavCenter: function(content, options) {
        navBar.setCenterContent(content, options);
    },

    setNavLeft: function(content, options) {
        navBar.setLeftContent(content, options);
    },

    setNavRight: function(content, options) {
        navBar.setRightContent(content, options);
    },

    setNavTitle: function(title, options) {
        navBar.setTitle(title, options);
    },

    showNavBar: function() {
        pageContent.setTop(51);
    }
};


exports.clearNavRight = api.clearNavRight;
exports.getContent = api.getContent;
exports.getNavBar = api.getNavBar;
exports.hideNavBar = api.hideNavBar;
exports.preHide = api.preHide;
exports.postHide = api.postHide;
exports.preShow = api.preShow;
exports.postShow = api.postShow;
exports.removeEventListeners = api.removeEventListeners;
exports.setNavCenter = api.setNavCenter;
exports.setNavLeft = api.setNavLeft;
exports.setNavRight = api.setNavRight;
exports.setNavTitle = api.setNavTitle;
exports.showNavBar = api.showNavBar;
