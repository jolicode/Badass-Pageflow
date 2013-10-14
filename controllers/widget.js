var pageflow = {
    pages: [],
    pagesViews: [],

    addChild: function(properties) {
        // Launch previous Page preHide
        if (pageflow.pages.length >= 1) {
            pageflow.pages[pageflow.pages.length - 1].preHide();
        }

        var newPage = Widget.createController('page', properties);

        // Launch new Page preShow
        newPage.preShow();

        if ((pageflow.pages.length > 0) && (!properties.backButton || !properties.backButton.hidden || true !== properties.backButton.hidden)) {
            // set back button
            var backButton = Widget.createController('page/backButton', { properties: properties.backButton || {}, pageflow: pageflow}).getView();
            newPage.setNavLeft(backButton);
        }

        var newPageView = newPage.getView();
        pageflow.pages.push(newPage);
        pageflow.pagesViews.push(newPageView);
        $.pageflow.width = pageflow.pages.length * Alloy.Globals.jolicode.pageflow.width;
        $.pageflow.add(newPageView);

        var left = (1 - pageflow.pages.length) * Alloy.Globals.jolicode.pageflow.width;

        if (pageflow.pages.length > 1) {
            $.pageflow.animate({ left: left, duration: 200 }, function() {
                $.pageflow.left = left;
            });
        } else {
            $.pageflow.left = left;
        }

        // Launch previous Page postHide
        if (pageflow.pages.length >= 2) {
            pageflow.pages[pageflow.pages.length - 2].postHide();
        }
        // Launch new Page postShow
        newPage.postShow();
    },

    back: function() {
        var left = (2 - pageflow.pages.length) * Alloy.Globals.jolicode.pageflow.width;
        pageflow.pages[pageflow.pages.length - 1].preHide();

        if (pageflow.pages.length >= 2) {
            pageflow.pages[pageflow.pages.length - 2].preShow();
        }

        $.pageflow.animate({ left: left, duration: 200 }, function() {
            pageflow.removeLastPage();
        });
    },

    clear: function() {
        $.pageflow.width = 0;
        $.pageflow.height = 0;
        $.pageflow.removeAllChildren();

        pageflow.pages = [];
        pageflow.pagesViews = [];
    },

    countPages: function() {
        return pageflow.pages.length;
    },

    getCurrentPage: function() {
        return pageflow.getPage(pageflow.pages.length - 1);
    },

    getCurrentPageView: function() {
        return pageflow.getPageView(pageflow.pagesViews.length - 1);
    },

    getPage: function(page) {
        return pageflow.pages[page] ? pageflow.pages[page] : null;
    },

    getPageView: function(page) {
        return pageflow.pagesViews[page] ? pageflow.pagesViews[page] : null;
    },

    gotoPage: function(page) {
        while (pageflow.pages.length > page + 1) {
            pageflow.removeLastPage();
        }
    },

    initialize: function() {
        $.pageflow.height = Alloy.Globals.jolicode.pageflow.height;
    },

    removeLastPage: function() {
        var left = (2 - pageflow.pages.length) * Alloy.Globals.jolicode.pageflow.width;
        $.pageflow.left = left;
        var remove = pageflow.pages.pop();
        remove.removeEventListeners();
        var removeView = pageflow.pagesViews.pop();
        $.pageflow.remove(removeView);
        $.pageflow.width = pageflow.pages.length * Alloy.Globals.jolicode.pageflow.width;
    }
};


pageflow.initialize();

exports.addChild = pageflow.addChild;
exports.back = pageflow.back;
exports.clear = pageflow.clear;
exports.countPages = pageflow.countPages;
exports.getCurrentPage = pageflow.getCurrentPage;
exports.getCurrentPageView = pageflow.getCurrentPageView;
exports.gotoPage = pageflow.gotoPage;
