(function() {
  var Df = window.Diafilm = function(elem, opts) {
    var df = this;

    this.elem = elem;
    this.opts = opts || {};
    var slidesWrap = elem.find('.df-slides');
    this.slides = slidesWrap.find('.df-slide');
    df.slidesWidth = slidesWrap.width();
    df.slidesHeight = slidesWrap.height();
    df.slidesOffs = this.slides.length > 1 ? this.slides.slice(1, 2).position().top : 0;

    var thumbsWrap = elem.find('.df-thumbs');
    df.thumbsWidth = thumbsWrap.width();
    df.thumbsHeight = df.thumbsWidth / (df.slidesWidth / df.slidesHeight);
    this.slides.each(function(index) {
      $('<div class="df-thumb" unselectable="on" style="width: ' + df.thumbsWidth + 'px; height: ' + df.thumbsHeight + 'px;"><div style="width: ' + df.slidesWidth + 'px; height: ' + df.slidesHeight + 'px; transform-origin: 0 0; transform: scale(' + (df.thumbsWidth / df.slidesWidth) + ')" onselectstart="event.stopPropagation();return false;" onmousedown="return false;">' + this.innerHTML + '</div></div>').click(function() {
        df.slide(index);
        return false;
      }).appendTo(thumbsWrap);
    });
    this.thumbs = elem.find('.df-thumb');

    this.slide(0);
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