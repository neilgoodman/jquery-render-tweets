# jquery-render-tweets

Renders tweets from Twitter's API JSON response to HTML. This plugin does not communicate with Twitter's API directly, but instead provides a flexible way to specify a custom endpoint or execute a custom AJAX request.

It is recommended to use a server-side cache when requesting tweets to help prevent going over Twitter's [rate limit](https://dev.twitter.com/docs/rate-limiting/1.1). See [connect-user-tweets](https://github.com/posco2k8/connect-user-tweets) for a Node.js based solution.

## Install

This plugin is offered as a Bower package for convenience:

`$ bower install jquery-render-tweets`

You can then include the plugin in your HTML:

```html
<script src="/bower_components/jquery/jquery.min.js">
<script src="/bower_components/jquery-render-tweets/jquery.render-tweets.min.js">
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

## Examples

Using a URL to get tweets:

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
    $('body').renderTweets('render');
});
```

Destroy the plugin:

```javascript
$(function () {
    $('body').renderTweets('remove');
});
```