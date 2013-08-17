# jquery-render-tweets

Renders tweets from Twitter's API to HTML. This plugin does not communicate with Twitter's API directly, but instead provides a flexible way to specify a custom endpoint or execute a custom AJAX request.

It is recommended to use a server-side cache when requesting tweets to help prevent going over Twitter's [rate limit](https://dev.twitter.com/docs/rate-limiting/1.1). See [connect-user-tweets](https://github.com/posco2k8/connect-user-tweets) for a Node.js based solution.

## Example

Visit [http://neilgoodman.net](http://neilgoodman.net) to see an example of this plugin in use.

## Install

This plugin is offered as a Bower package for convenience:

`$ bower install jquery-render-tweets`

You can then include the plugin in your HTML:

```html
<script src="/bower_components/jquery/jquery.js">
<script src="/bower_components/jquery-render-tweets/lib/jquery.render-tweets.js">
```

A minified version of the plugin is available here:

```html
<script src="/bower_components/jquery-render-tweets/dist/jquery.render-tweets.min.js">
```

## Usage

```javascript
$(function () {
    // The rendered HTML will be appended to the <body> element.
    $('body').renderTweets({
        tweets: [], // Inject the tweet data directly if you have it.
        template: function (data) {}, // Specify a standard JST function to render the tweets. Data contains: { tweets: [...] }
        url: '/tweets' // The URL to lookup tweets. Can also be a function that takes in a callback as its first parameter which should be called when the request is complete.
    });
});
```

## Reference

### Methods

- __render__: Render the tweets into the attached DOM element.
- __refresh__: Fetch the tweets using the `url` setting and then call `render`
- __remove__: Destroys the plugin data.
- `$.renderTweets.parseTweet`: A utility method to parse a tweet and turn @names, #tags, and links into HTML. This can be used inside of template helpers. 

### Events

All events are triggered on the attached DOM element:

```javascript
$('body')
    .renderTweets({ url: '/tweets' })
    .on('render', function (event, data) {
        // Awesome handler.
    })
    .on('renderCompleted', function (event) {
        // Even more awesome handler.
    });
```

- __render__: Triggered right before the rendered HTML is attached to the DOM. The rendered HTML wrapped in a jQuery object is passed as a parameter.
- __renderCompleted__: Triggered after the rendered HTML has been attached to the DOM.
- __request__: Triggered when the AJAX request for tweets has been made. The jQuery `$.Deferred` object from the AJAX call is passed as a parameter.
- __requestCompleted__: Triggered when the AJAX request completes successfully. The data returned from the request is given as a parameter. 

### Examples

Using an URL to get tweets:

```javascript
$(function () {
    $('body').renderTweets({
        url: '/tweets'
    });
});
```
Making a custom AJAX request:

```javascript
$(function () {
    $('body').renderTweets({
        url: function (callback) {
            return $.get(
                '/tweets', 
                function (data) {
                    callback(data);
                }, 
                'json'
            );
        }
    });
});
```
Using a custom template:

```javascript
$(function () {
    $('body').renderTweets({
        template: Handlebars.compile($('#tweets-template').html()), // Handlebars is used as an example. You can use any templating engine that can create a JST function.
        url: '/tweets'
    });
});
```

Render inside of an AJAX call:

```javascript
$(function () {
    .get(
        '/tweets', 
        function (data) {
            $('body').renderTweets({
                tweets: data
            });
        }, 
        'json'
    );
});
```

Manually render:

```javascript
$(function () {
    $('body').renderTweets('render');
});
```

Manually refresh and render:

```javascript
$(function () {
    $('body').renderTweets('refresh');
});
```

Destroy the plugin:

```javascript
$(function () {
    $('body').renderTweets('remove');
});
```