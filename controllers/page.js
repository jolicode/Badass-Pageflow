var args = arguments[0] || {};

var api = {
    navBar: null,
    navBarView: null,
    pageController: null,
    pageView: null,

    /**
     * Builds the navBar content
     */
    buildNavBar: function(properties) {
        // create the nav bar
        return Widget.createController(
            'page/navBar',
            properties.navBar ? properties.navBar : {}
        );
    },

    /**
     * Builds the page content
     */
    buildPage: function(properties) {
        properties.arguments = properties.arguments || {};
        properties.arguments.containingPage = $.container;

        if (properties.containerProperties) {
            $.container.height = properties.containerProperties.height || Alloy.Globals.jolicode.pageflow.height;
            $.container.width = properties.containerProperties.width || Alloy.Globals.jolicode.pageflow.width;
        }

        return Alloy.createController(properties.controller, properties.arguments);
    },

    clearNavRight: function() {
        api.navBar.removeRightContent();
    },

    getContent: function() {
        return api.pageView;
    },

    getNavBar: function() {
        return api.navBar;
    },

    getNavCenter: function() {
        return api.navBar.getCenterContent();
    },

    getNavLeft: function() {
        return api.navBar.getLeftContent();
    },

    getNavRight: function() {
        return api.navBar.getRightContent();
    },

    hideNavBar: function() {
        api.pageView.setTop(0);
    },

    initialize: function(properties) {
        api.replace(properties);
    },

    preHide: function() {
        if (api.pageController.preHide) {
            api.pageController.preHide();
        }
    },

    preShow: function() {
        if (api.pageController.preShow) {
            api.pageController.preShow();
        }
    },

    postHide: function() {
        if (api.pageController.postHide) {
            api.pageController.postHide();
        }
    },

    postShow: function() {
        if (api.pageController.postShow) {
            api.pageController.postShow();
        }
    },

    removeEventListeners: function() {
        if (api.pageController.removeEventListeners) {
            api.pageController.removeEventListeners();
        }
    },

    replace: function(properties) {
        if (api.pageView) {
            $.container.remove(api.pageView);

            // cleanup
            api.removeEventListeners();
            api.pageController = null;
            api.pageView = null;
        }

        if (api.navBar) {
            $.container.remove(api.navBarView);
            api.navBar = null;
            api.navBarView = null;
        }

        api.navBar = api.buildNavBar(properties);
        api.navBarView = api.navBar.getView();

        if (!properties.navBarHidden) {
            $.container.add(api.navBarView);
        }

        api.pageController = api.buildPage(properties);
        api.pageView = api.pageController.getView();
        $.container.add(api.pageView);
    },

    setNavCenter: function(content, options) {
        api.navBar.setCenterContent(content, options);
    },

    setNavLeft: function(content, options) {
        api.navBar.setLeftContent(content, options);
    },

    setNavRight: function(content, options) {
        api.navBar.setRightContent(content, options);
    },

    setNavTitle: function(title, options) {
        api.navBar.setTitle(title, options);
    },

    showNavBar: function() {
        api.pageView.setTop(51);
    }
};

api.initialize(args);

exports.clearNavRight = api.clearNavRight;
exports.getContent = api.getContent;
exports.getNavBar = api.getNavBar;
exports.hideNavBar = api.hideNavBar;
exports.getNavCenter = api.getNavCenter;
exports.getNavLeft = api.getNavLeft;
exports.getNavRight = api.getNavRight;
exports.preHide = api.preHide;
exports.postHide = api.postHide;
exports.preShow = api.preShow;
exports.postShow = api.postShow;
exports.removeEventListeners = api.removeEventListeners;
exports.replace = api.replace;
exports.setNavCenter = api.setNavCenter;
exports.setNavLeft = api.setNavLeft;
exports.setNavRight = api.setNavRight;
exports.setNavTitle = api.setNavTitle;
exports.showNavBar = api.showNavBar;
