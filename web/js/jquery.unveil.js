(function(e){e.fn.unveil=function(){function i(){r=t.filter(function(){var t=e(this),n=e(window),r=n.scrollTop(),i=r+n.height(),s=t.offset().top,o=s+t.height();return o>=r&&s<=i});n=r.trigger("unveil");t=t.not(n)}var t=this,n,r;this.one("unveil",function(){this.setAttribute("src",this.getAttribute("data-src"));this.removeAttribute("data-src")});e(window).scroll(i);i();return this}})(jQuery)