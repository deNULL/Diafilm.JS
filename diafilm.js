(function() {
  var Df = window.Diafilm = function(elem, opts) {
    var df = this;

    this.elem = elem;
    this.opts = opts || {};
    this.slidesWrap = elem.find('.df-slides');
    this.slides = df.slidesWrap.find('.df-slide');

    this.thumbsWrap = elem.find('.df-thumbs');

    this.slides.each(function(index) {
      $('<div class="df-thumb" unselectable="on">' +
          '<div onselectstart="return false;" onmousedown="return false;">' +
            this.innerHTML +
          '</div>' +
        '</div>').click(function() {
        df.slide(index);
        return false;
      }).appendTo(df.thumbsWrap);
    });
    this.thumbs = elem.find('.df-thumb');

    this.resize();

    $(window).resize(function() {
      df.resize();
    });

    $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function() {
      df.resize();
    });

    var scrollDist = 0;
    $(df.slidesWrap).bind('DOMMouseScroll mousewheel', function(event) {
      scrollDist += event.originalEvent.wheelDelta;
      //console.log(event.originalEvent.wheelDelta);
      if (scrollDist >= 200) {
        scrollDist = 0;
        df.prev();
      } else
      if (scrollDist <= -200) {
        scrollDist = 0;
        df.next();
      }
      return false;
    });

    $(this.slidesWrap).bind('touchend', function(event){
      var now = new Date().getTime();
      var lastTouch = $(this).data('lastTouch') || now + 1 /** the first time this will make delta a negative number */;
      var delta = now - lastTouch;
      if (delta < 200 && delta > 0) {
        df.fullscreen();
      }
      $(this).data('lastTouch', now);
    });

    this.slide(0);
  }

  Df.prototype.keydown = function(event) {
    if (event.which >= 49 && event.which <= 57) { // 1-9
      this.slide(event.which - 49);
      return false;
    }

    switch (event.which) {
      case 39: // right
      case 40: // down
      case 34: // page down
      case 32: // space
      case 13: // enter
        this.next();
        return false;
      case 37: // left
      case 38: // up
      case 33: // page up
        this.prev();
        return false;
      case 36: // home
        this.slide(0);
        return false;
      case 35: // end
        this.slide(this.slides.length - 1);
        return false;
      case 48: // 0
        this.slide(9);
        return false;
    }
  }
  Df.prototype.resize = function() {
    var df = this;

    df.fs = (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    if (df.fs) {
      df.elem.css({
        width: '100%',
        height: '100%'
      });
      df.slidesWrap.css({
        width: '100%',
        height: '100%'
      });
      df.thumbsWrap.css({
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: '-25%',
        width: '25%'
      })
    } else {
      df.elem.css({
        width: '',
        height: ''
      });
      df.slidesWrap.css({
        width: '',
        height: ''
      });
      df.thumbsWrap.css({
        position: '',
        top: '',
        bottom: '',
        right: '',
        width: ''
      });
    }

    df.slidesWidth = df.slidesWrap.width();
    df.slidesHeight = df.slidesWrap.height();

    df.slidesOffs = (df.slides.length > 1) ? (df.slides.slice(1, 2).position().top - parseFloat(df.slides.first().css('marginTop'))) : 0;
    df.slides.first().css('marginTop', - df.index * df.slidesOffs);

    df.thumbsWidth = df.thumbsWrap.width();
    df.thumbsHeight = df.thumbsWidth / (df.slidesWidth / df.slidesHeight);
    df.thumbs.each(function(index) {
      $(this).css({
        width: df.thumbsWidth + 'px',
        height: df.thumbsHeight + 'px'
      });
      $(this.children[0]).css({
        width: df.slidesWidth + 'px',
        height: df.slidesHeight + 'px',
        transform: 'scale(' + (df.thumbsWidth / df.slidesWidth) + ')',
        webkitTransform: 'scale(' + (df.thumbsWidth / df.slidesWidth) + ')',
        mozTransform: 'scale(' + (df.thumbsWidth / df.slidesWidth) + ')',
        msTransform: 'scale(' + (df.thumbsWidth / df.slidesWidth) + ')',
        oTransform: 'scale(' + (df.thumbsWidth / df.slidesWidth) + ')',
      });
    });
    df.thumbsOffs = (df.thumbs.length > 1) ? (df.thumbs.slice(1, 2).position().top - df.thumbs.first().position().top) : 0;
  }
  Df.prototype.fullscreen = function(toggle) {
    var df = this;

    if (toggle === undefined) {
      toggle = !df.fs;
    }

    df.fs = toggle;

    var wrap = df.elem.get(0);
    if (toggle) {
      if (wrap.requestFullscreen) {
        wrap.requestFullscreen();
      } else if (wrap.msRequestFullscreen) {
        wrap.msRequestFullscreen();
      } else if (wrap.mozRequestFullScreen) {
        wrap.mozRequestFullScreen();
      } else if (wrap.webkitRequestFullscreen) {
        wrap.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else
      if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else
      if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else
      if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    df.resize();
  }
  Df.prototype.slide = function(index) {
    var df = this;
    if (typeof index != 'number') {
      df.slides.each(function(i) {
        if (this.id == index) {
          df.slide(i);
          return false;
        }
      });
      return;
    }

    index = Math.min(Math.max(index, 0), df.slides.length - 1);
    if (index == -1) {
      return;
    }

    df.index = index;
    df.slides.first().css('marginTop', - index * df.slidesOffs);

    df.slides.toggleClass('active', false).slice(index, index + 1).toggleClass('active', true);
    df.thumbs.toggleClass('active', false).slice(index, index + 1).toggleClass('active', true);

    var thumb = df.thumbs.slice(index, index + 1);
    var thumbTop = thumb.position().top;
    var thumbBottom = thumbTop + thumb.outerHeight() + parseFloat(thumb.css('marginBottom')) * 2;
    var scrollTop = df.thumbsWrap.scrollTop();
    if (thumbTop < 0) {
      df.thumbsWrap.animate({
        scrollTop: scrollTop + thumbTop
      }, 100);
    } else
    if (thumbBottom > df.thumbsWrap.height()) {
      df.thumbsWrap.animate({
        scrollTop: scrollTop - (df.thumbsWrap.height() - thumbBottom)
      }, 100);
    }

    if (df.opts.onSlide) {
      df.opts.onSlide.call(df, df.index);
    }
  }
  Df.prototype.prev = function(offset) {
    offset = offset || 1;
    this.slide(this.index - offset);
  }
  Df.prototype.next = function(offset) {
    offset = offset || 1;
    this.slide(this.index + offset);
  }
})();