present.js: markdown presentations 
==================================
I had a need for presentations that are easily created and
edited from a text editor. present.js generates HTML slides
from Markdown-formatted files.

`index.html` loads the slideshow. The url GET parameter `md`
sets the markdown source document filename. The browser should 
default to looking in the current directory.

Documentation
-------------
(TODO)

**Url parameters**

* **md** &mdash; markdown file to load. Defaults to example.md.
* **t** &mdash; specifies the time in minutes remaining. 
	Defaults to 15.
* **anim** &mdash; slide animation mode. 
	* 'slide' (default)
	* 'fade'
	* 'none'

**Markdown Extensions / Replacements**

* \-\- becomes an emdash (&mdash;)

Libraries
---------
(All batteries are included.)

* [Showdown](http://attacklab.net/showdown/) for markdown parsing
* Backbone 0.5.3 and Underscore 1.1.7
* jQuery 1.8.2, and plugins:
	* jquery.ba-hashchange.js
	* jquery.easing.js
	* jquery.getUrlParam.js
	* jquery.hotkeys.js

Alternatives
------------
* [S5](http://meyerweb.com/eric/tools/s5/), one of the original 
  HTML slide systems. 
* [Deck.js](http://imakewebthings.github.com/deck.js/), built 
  for rolling your own modern HTML presentations. I would 
  recommend this if you want to hack on something.
* [Reveal.js](http://lab.hakim.se/reveal-js/), a very modern 
  and fancy CSS3 presentation. This guy does awesome JS stuff.

BSD 2-clause license
--------------------
Copyright (c) 2010 - 2012, Brandon Thomas

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

