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

    $(df.slidesWrap).bind('mousewheel', function(event) {
      if (event.originalEvent.wheelDelta >= 0) {
        df.prev();
      } else {
        df.next();
      }
    });

    this.slide(0);
  }

  Df.prototype.resize = function() {
    var df = this;

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
  }
  Df.prototype.fullscreen = function(toggle) {
    var df = this;

    if (toggle === undefined) {
      toggle = !df.fs;
    }

    df.fs = toggle;

    var wrap = df.slidesWrap.get(0);
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
    index = Math.min(Math.max(index, 0), this.slides.length - 1);
    if (index == -1) {
      return;
    }

    this.index = index;
    this.slides.first().css('marginTop', - index * this.slidesOffs);

    this.slides.toggleClass('active', false).slice(index, index + 1).toggleClass('active', true);
    this.thumbs.toggleClass('active', false).slice(index, index + 1).toggleClass('active', true);

    if (this.opts.onSlide) {
      this.opts.onSlide.call(this, this.index);
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