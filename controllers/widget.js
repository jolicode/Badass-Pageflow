var pageflow = {
    // lists of the pages controllers
    pages: [],

    // lists of the pages views
    pagesViews: [],

    // lists of the positions of the pages on the grid
    // each position is an object with two attributes (top and left). The first page is at (0,0).
    // sample values can be: (-1, 0), (2, 1), etc.
    pagesGridPositions: [],

    addChild: function(properties) {
        // Launch previous Page preHide
        if (pageflow.pages.length >= 1) {
            pageflow.pages[pageflow.pages.length - 1].preHide();
        }

        var direction = properties.direction || {top: 0, left: 1};
        var newPage = Widget.createController('page', properties);

        // call the new Page "preShow" hook
        newPage.preShow();

        if ((pageflow.pages.length > 0) && (!properties.backButton || !properties.backButton.hidden || true !== properties.backButton.hidden)) {
            // set back button
            var backButton = Widget.createController('page/backButton', { properties: properties.backButton || {}, pageflow: pageflow}).getView();
            newPage.setNavLeft(backButton);
        }

        var currentPageId = pageflow.getCurrentPageId();

        var newPageView = newPage.getView();
        pageflow.pages.push(newPage);
        pageflow.pagesViews.push(newPageView);

        // add the new page to the grid positions
        pageflow.pagesGridPositions.push(pageflow.computePagePosition(direction));

        // eventually resize / move the pageflow view in order to be able
        // to add the new page while keeping the current page on screen
        var gridDimensions = pageflow.getGridDimensions();
        var currentPosition = pageflow.getGridCoordinatesForPage(currentPageId);

        $.pageflow.width = gridDimensions.width;
        $.pageflow.height = gridDimensions.height;
        $.pageflow.top = currentPosition.top;
        $.pageflow.left = currentPosition.left;

        // move all the page views
        _.each(pageflow.pagesViews, pageflow.fixPagePosition);

        // add the page at the right position
        $.pageflow.add(newPageView);

        // animate the pageflow in the right direction
        var currentPageId = pageflow.getCurrentPageId();
        var currentPosition = pageflow.getGridCoordinatesForPage(currentPageId);

        if (pageflow.pages.length > 1) {
            $.pageflow.animate({ left: currentPosition.left, top: currentPosition.top, duration: 300 }, function() {
                $.pageflow.left = currentPosition.left;
                $.pageflow.top = currentPosition.top;
            });
        } else {
            $.pageflow.top = currentPosition.top;
            $.pageflow.left = currentPosition.left;
        }

        // Launch previous Page postHide
        if (pageflow.pages.length >= 2) {
            pageflow.pages[pageflow.pages.length - 2].postHide();
        }

        // call the new Page "postShow" hook
        newPage.postShow();
    },

    back: function() {
        var previousPage = pageflow.getPreviousPage();

        if (previousPage) {
            var currentPosition = pageflow.getGridCoordinatesForPage(pageflow.getCurrentPageId() - 1);

            $.pageflow.animate({ left: currentPosition.left, top: currentPosition.top, duration: 300 }, function() {
                $.pageflow.left = currentPosition.left;
                $.pageflow.top = currentPosition.top;
                pageflow.removeLastPage(true, true);
            });
        }
    },

    clear: function() {
        var currentPage = pageflow.getCurrentPage();
        if (currentPage)
            currentPage.preHide();
        $.pageflow.width = 0;
        $.pageflow.height = 0;
        $.pageflow.removeAllChildren();
        if (currentPage)
            currentPage.postHide();

        pageflow.pages = [];
        pageflow.pagesViews = [];
    },

    /**
     * Returns a new position object
     */
    computePagePosition: function(direction) {
        var position, parentPosition;

        if (pageflow.pagesGridPositions.length > 0) {
            parentPosition = pageflow.getPageGridPosition(pageflow.pagesGridPositions.length - 1);
            position = {
                top: parentPosition.top + direction.top,
                left: parentPosition.left + direction.left
            };
        } else {
            position = {top: 0, left: 0};
        }

        return position;
    },

    countPages: function() {
        return pageflow.pages.length;
    },

    fixPagePosition: function(pageView, id) {
        var position = pageflow.getGridCoordinatesForPage(id);
        pageView.top = -position.top;
        pageView.left = -position.left;
    },

    getCurrentPage: function() {
        return pageflow.getPage(pageflow.pages.length - 1);
    },

    getCurrentPageGridPosition: function() {
        return pageflow.getPageGridPosition(pageflow.pagesGridPositions.length - 1);
    },

    getCurrentPageId: function() {
        return Math.max(0, pageflow.pages.length - 1);
    },

    getCurrentPageView: function() {
        return pageflow.getPageView(pageflow.pagesViews.length - 1);
    },

    getGridCoordinatesForPage: function(page) {
        var rect = pageflow.getGridRect();
        var position = pageflow.getPageGridPosition(page);
        var top = rect.minTop - position.top;
        var left = rect.minLeft - position.left;

        return {
            top: top * Alloy.Globals.jolicode.pageflow.height,
            left: left * Alloy.Globals.jolicode.pageflow.width
        };
    },

    getGridDimensions: function() {
        return {
            height: pageflow.getGridHeight() * Alloy.Globals.jolicode.pageflow.height,
            width: pageflow.getGridWidth() * Alloy.Globals.jolicode.pageflow.width
        };
    },

    getGridHeight: function() {
        var rect = pageflow.getGridRect();
        return 1 + rect.maxTop - rect.minTop;
    },

    getGridRect: function() {
        var minLeft = 0;
        var maxLeft = 0;
        var minTop = 0;
        var maxTop = 0;

        _.each(pageflow.pagesGridPositions, function(position) {
            minLeft = Math.min(minLeft, position.left);
            maxLeft = Math.max(maxLeft, position.left);
            minTop = Math.min(minTop, position.top);
            maxTop = Math.max(maxTop, position.top);
        });

        return {
            minLeft: minLeft,
            maxLeft: maxLeft,
            minTop: minTop,
            maxTop: maxTop,
        };
    },

    getGridWidth: function() {
        var rect = pageflow.getGridRect();
        return 1 + rect.maxLeft - rect.minLeft;
    },

    getPage: function(page) {
        return pageflow.hasPage(page) ? pageflow.pages[page] : null;
    },

    getPageGridPosition: function(page) {
        return pageflow.pagesGridPositions[page] ? pageflow.pagesGridPositions[page] : null;
    },

    getPageView: function(page) {
        return pageflow.pagesViews[page] ? pageflow.pagesViews[page] : null;
    },

    getPreviousPage: function() {
        if (pageflow.pages.length >= 2) {
            return pageflow.getPage(pageflow.getCurrentPageId() - 1);
        } else {
            return null;
        }
    },

    getViewportCoordinates: function(position) {

    },

    gotoPage: function(page) {
        var first = true;

        while (pageflow.pages.length > page + 1) {
            pageflow.removeLastPage(first, pageflow.pages.length == page + 2);
            first = false;
        }
    },

    hasPage: function(page) {
        return (pageflow.pages[page] !== undefined);
    },

    initialize: function() {
        $.pageflow.height = Alloy.Globals.jolicode.pageflow.height;
    },

    /**
     * Removes the last page of the pageflow.
     *
     * @param boolean callPrePostHide indicates whether the pre/post mixins of the removed view must be called
     * @param boolean callPrePostHide indicates whether the pre/post mixins of the previous view, if it exists, must be called
     */
    removeLastPage: function(callPrePostHide, callPrePostShow) {
        var remove = pageflow.pages.pop();
        remove.removeEventListeners();

        if (callPrePostHide) {
            remove.preHide();
        }

        var removeView = pageflow.pagesViews.pop();
        $.pageflow.remove(removeView);
        pageflow.pagesGridPositions.pop();

        if (callPrePostHide) {
            remove.postHide();
        }

        var currentPage = pageflow.getCurrentPage();

        if (callPrePostShow && currentPage) {
            currentPage.preShow();
        }

        // move the grid to adapt its new dimensions
        var currentPageId = pageflow.getCurrentPageId();
        var currentPosition = pageflow.getGridCoordinatesForPage(currentPageId);
        $.pageflow.top = currentPosition.top;
        $.pageflow.left = currentPosition.left;

        // move all the page views
        _.each(pageflow.pagesViews, pageflow.fixPagePosition);

        // fix grid size
        var gridDimensions = pageflow.getGridDimensions();
        $.pageflow.width = gridDimensions.width;
        $.pageflow.height = gridDimensions.height;

        if (callPrePostShow && currentPage){
            currentPage.postShow();
        }
    },

    /**
     * Replaces the page at a given position
     */
    replacePage: function(page, properties) {
        if (pageflow.hasPage(page)) {
            page = pageflow.getPage(page);
            page.replace(properties);
        }
    },
};

// initialize stuff
pageflow.initialize();

// expose widget's public API
exports.addChild = pageflow.addChild;
exports.back = pageflow.back;
exports.clear = pageflow.clear;
exports.countPages = pageflow.countPages;
exports.getCurrentPage = pageflow.getCurrentPage;
exports.getCurrentPageView = pageflow.getCurrentPageView;
exports.getPage = pageflow.getPage;
exports.getPageView = pageflow.getPageView;
exports.gotoPage = pageflow.gotoPage;
exports.replacePage = pageflow.replacePage;
