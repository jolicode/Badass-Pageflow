# Badass Pageflow Alloy widget


## Description

The [Titanium Alloy](https://github.com/appcelerator/alloy) "Badass Pageflow" widget allows to manage flows of pages: open a child window, go back to the parent window, close the current pageflow, move to a page by its index, etc.

A "Pageflow" is therefore comparable to a [NavigationGroup](http://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iPhone.NavigationGroup), except it is cross-platform and it allows a greater personnalization. In particular, the Pageflow widget allows to translate in every direction, and not only on a horizontal path.

## Demo

[Watch the video on Youtube](http://www.youtube.com/watch?v=kwnS2c9_z9U)

## Compatibility

The widget has been tested with Alloy 1.3.0


## Install

This widget is intended to be included in a Titanium Alloy application. There are several install possibilities:

### Manual install

Simply drop the widget's content in the folder `app/widgets/com.jolicode.pageflow` of your project, and declare the dependency in the `app/config.json` file:


    "dependencies": {
        "com.jolicode.pageflow": "1.1"
    }


### Submodule install

Add the widget's repository as a Git Submodule of your project:

    $ git submodule add https://github.com/jolicode/Badass-Pageflow.git app/widgets/com.jolicode.pageflow

Then, declare the dependency in the `app/config.json` file:


    "dependencies": {
        "com.jolicode.pageflow": "1.1"
    }


## Configuration and getting started

The widget works even when the android anyDensity property is set to false. In order to achieve this, please add the following lines on top of you `alloy.js` file:


```js
Alloy.Globals.jolicode = {};
Alloy.Globals.jolicode.pageflow = {};
Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth;

if (OS_ANDROID) {
    Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.logicalDensityFactor;
    Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
}
```


## Public API and examples

The pageflow widget exposes a public API, which allows to manipulate barely every aspect of the pageflow, the page content or the navigation bar.

### Pageflow object

#### Creating a new page flow

Creating a new pageflow is done in two steps:

 * add the widget to the view (say, `index.xml`):


        <Widget src="com.jolicode.pageflow" id="pageflow" />


 * and populate the pageflow with a first page (in `index.js`):

    ```js
    $.pageFlow.addChild({
        arguments: { products: selectedItems },
        controller: 'cart/productsList',
        backButton: {
            backgroundImage: '/images/button/back-green.png',
            left: 10
        },
        navBar: {
            backgroundColor: '#F5F5F9',
            right: 'cart/navBarRight'
        },
        direction: {
            top: .5,
            left: 1
        }
    });
    ```


In order to be able to add Child views to the pageflow in an other controller, you may want to reference the pageflow from using `Alloy.Globals`:


```js
Alloy.Globals.pageFlow = $.pageflow;
```


Each child in the pageflow may have several properties:

 * `arguments`: the arguments to pass to the page controller, which may be grabbed using the `arguments` var
 * `controller`: the name of the controller to instantiate
 * `backButton`: the properties of the back button. You may also set the `navBar.left` property. In order to hide the default displayed back button, simply set the `backButton.hidden` property to `true`
 * `navBar`: the properties of the navBar:
   * `backgroundColor`
   * `right`: name of the controller to load in the right nav button position
   * `center`: name of the controller to load in the center nav button position
   * `left`: name of the controller to load in the left nav button position
 * `direction`: the direction in which the new child should be opened:
   * `top`: +1 for one screen below, -1 for one screen upper, 0 for an horizontal path. You may use floating values
   * `left`: +1 for one screen on the right, -1 for one screen on the left, 0 for a vertical transition. You may use floating values


#### Closing the current page of the pageflow

Closing a page of the pageflow is done using the `back()` method:

```js
Alloy.Globals.pageFlow.back();
```


#### Programatically moving the pageflow

You may also want to go back to a specific page of the pageflow, which is possible by passing its index to the `gotoPage()` method:


```js
// say we are on the page 4
Alloy.Globals.pageFlow.gotoPage(2);
```


#### Closing a pageflow

It may happen that, after completing a workflow, you simply want to close a pageflow in order to got back to the previous layer of windows/views. In order to do so, use the `clear()` method, which will clear all the pages of the window (and call a specific `remoeveEventListeners()` method on each page controller, if it exists) and close the pageflow parent window:


```js
Alloy.Globals.pageFlow.clear();
```


#### Retrieving the current page

You may want to access the current page of a pageflow. In order to do so, two methods are available:

 * `getCurrentPage()` returns the current page's controller
 * `getCurrentPageView()` returns the current page's view, which may be useful to inject UI elements in it.


#### Counting pages

The `countPages()` method allows to get the size of the pageflow, ie. the number of pages contained in the pageflow.


#### Replace a page

The `replacePage()` method allows to replace the page at a certain position of the pageflow. Say you are on the page 3, and want to replace the content of the page 2. Juste call `replacePage()` and it will build the new page content, remove the old one and replace it with the new one:

```js
Alloy.Globals.pageFlow.replacePage(
    2, // here the id of the page to be changed
    {
        arguments: { products: selectedItems },
        controller: 'cart/productsList',
        backButton: {
            backgroundImage: '/images/button/back-green.png',
            left: 10
        },
        navBar: {
            backgroundColor: '#F5F5F9',
            right: 'cart/navBarRight'
        }
    }
);
```

This will not change the coordinates of the page in the pageflow (which is currently not possible), but it will replace its content.


### Page object

A pageflow is made of `Pages`, which display the content of your application. Each page contains a NavBar (optionnaly hidden) and a content zone, which displays the `controller` passed to the pageflow `addChild()` method.

Pages feature the following methods:


 * `clearNavRight`: allows to clear the right nav position
 * `getContent`: returns the view of the controller displayed within the page
 * `getNavBar`: returns the navBar object, which allows to manipulate the navigation bar
 * `hideNavBar`: hides the navbar
 * `removeEventListeners`: clears the event listeners defined in the page content. This may be useful to remove event listeners associated to the Ti.App namespace (see "Removing event listeners" below)
 * `replace`: replaces the page content. Takes as argument the same like the `addChild` method
 * `setNavCenter`: sets the navBar center item. Pass `null` to clear the navBar center content
 * `setNavLeft`: sets the navBar left item. Pass `null` to clear the navBar left content
 * `setNavRight`: sets the navBar right item. Pass `null` to clear the navBar right content
 * `setNavTitle`: sets the navigation bar title (a shortcut to NavCenter)
 * `showNavBar`: shows the navigation bar


### Hooks

Several hooks are available in the page display process. In order to use them, the controller of the page content must expose the following methods in its public API:

 * `preHide`: executed before hiding the page (either closing it or displaying a new child)
 * `postHide`: executed after the page has been hidden
 * `preShow`: executed before displaying the page
 * `postShow`: executed once the page is displayed

Say you add a child window to a pageflow:


```js
$.pageFlow.addChild({
    arguments: { url: videoUrl },
    controller: 'mediaplayer/videoplayer'
});
```

In that case, if the controller `app/controllers/mediaplayer/videoplayer.js` exposes as a public API one or several of these hooks, they will be executed:

```js
// app/controllers/mediaplayer/videoplayer.js
var properties = arguments[0] || {};

// do several things
$.videoPlayer.url = properties.videoUrl;

// ...

// stop the video player before hiding the view
exports.preHide = function() {
    $.videoPlayer.stop();
};

// start the video once the page is displayed
exports.postShow = function() {
    $.videoPlayer.play();
};
```


### Removing event listeners

Your application may use custom event listeners, attached to the `Ti.App` namespace. For instance:


```js
Ti.App.addEventListener('com.acme.whatever', function() {
    alert('The "com.acme.whatever" event happened !');
});
```


If the user opens the page defining this event listener more than one time, the handler will be executed several times (the number of times this page has been displayed). In that case, the alert window would be displayed more than once. this is of course a bad behavior that you wouldn't want to see.

In order to avoid this problem, the page object seeks for a rpublic method `removeEventListeners()` in the page content controller, in which you may unattach global event listeners:


```js
// initialize the page
var handler = function() {
    alert('The "com.acme.whatever" event happened !');
};
Ti.App.addEventListener('com.acme.whatever', handler);
// ...

// expose a way to unattach global event listeners
exports.removeEventListeners = function() {
    Ti.App.removeEventListener('com.acme.whatever', handler);
    Ti.App.removeEventListener('com.acme.otherEvent', otherHandler);
};
```


## Styles and customization

The widget uses several class names which allows to personnalize its look and feel according to your app requirements. You could for instance create a `theme` which defines the way the back buttons is displayed, etc.:

 * com.jolicode.pageflow
 * com.jolicode.pageflow.page
 * com.jolicode.pageflow.backButton
 * com.jolicode.pageflow.navBar
 * com.jolicode.pageflow.navBar.center
 * com.jolicode.pageflow.navBar.left
 * com.jolicode.pageflow.navBar.right


## License and credits

This widget is made available by [JoliCode](http://jolicode.com/) under the MIT license.


## Wishlist

 * a pageflow manager, in order to keep track of all opened pageflows and avoid polutting Alloy.Globals with several pageflow names
 * more personnalization

## Changelog

### master

 * added a `replacePage()` method, which allows to replace the content of a page at a certain position

### 1.3 - 2014-02-19

 * have the widget pages be more configurable

### 1.1 - 2013-10-31

 * added the possibility to open child views in every direction, not only on a horizontal path

### 1.0 - 2013-07-10

 * initial release of the widget
 * features pageflows management and customization
