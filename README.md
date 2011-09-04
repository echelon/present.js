**present.js: simple presentation generator**

I had a need for presentations that are easily created and manipulated
in a text editor. Thus I wrote present.js to generate HTML slideshow 
presentations from Markdown-formatted files.

`presentation.html` loads the slideshow. The url GET parameter `md`
sets the markdown source document filename. The browser should 
default to looking in the current directory.

Libraries
---------
(All are included in the repository.)

* [Showdown](http://attacklab.net/showdown/) for markdown parsing
* [Backbone.js](http://documentcloud.github.com/backbone/) and 
  [Underscore.js](http://documentcloud.github.com/underscore/)
  for architecture
* jQuery and several plugins

Alternatives
------------
* [S5](http://meyerweb.com/eric/tools/s5/), one of the original HTML slideshow
  systems. 
* [Deck.js](http://imakewebthings.github.com/deck.js/), built for rolling your
  own modern HTML slideshow.

