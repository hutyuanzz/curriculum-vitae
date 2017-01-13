$('.project__content').slick({
  infinite: true,
  slidesToShow: 1,
  slidesToScroll:1,
  arrows: false,
  dot: false,
  fade: true,
  asNavFor: '.project'
});

$('.project').slick({
  infinite: true,
  slidesToShow: 3,
  slidesToScroll:1,
  dot: false,
  centerMode: true,
  focusOnSelect: true,
  asNavFor: '.project__content',

  responsive: [
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        centerMode: false,
      }
    }
  ]
});


;(function($, window, undefined) {

  var menu = $('.main-nav'),
      menuItem = menu.find('li'),
      about = $('#about'),
      skill = $('#skill'),
      profile = $('#profile'),
      contact = $('#contact');
  menuItem.click(function(){
    active = menu.find('.active');
    active.removeClass('active');
    $(this).find('a').addClass('active');
  });

  function srool(a,b){
    var top = a.offset().top - 150,
        bot = top + a.outerHeight();

      if (b >= top && b <= bot) {
        menuItem.find('.active').removeClass('active');
        var id = '#' + a.attr('id');
        menuItem.find('[href ='+ id +']').addClass('active');
      }
  }

  $(window).scroll(function(){

    var windownTop =  $(window).scrollTop();
    srool(about,windownTop);
    srool(skill,windownTop);
    srool(profile,windownTop);
    srool(contact,windownTop);
   });



}(jQuery, window));


;(function($, window, undefined) {

  var tabEdu = $('#edu'),
      tabInfo = $('#info'),
      contentEdu = $('#edu-content'),
      textItem = contentEdu.find('.edu__text');


  tabInfo.click(function(){
    textItem.removeClass('animete-run');
  });

  tabEdu.click(function(){
    var i = 0 ;
    var intervar = setInterval(function(){
      textItem.eq(i).addClass('animete-run');
      i++;
      if( i >= textItem.length) {
        clearInterval(intervar);
      }
    },1000);

  });

}(jQuery, window));



/* ========================================
 * app-plugin-radial-progress.js
 * ======================================== */

(function($, d3, undefined) {
  'use strict';

  var pluginName = 'radial-progress';
  var pi = Math.PI;


  /*________________________________________________________________
                                                  Public Function */
  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {

    init: function() {
      var that = this,
          elm = this.element,
          $arcItems = elm.find('.item-skill'),
          $win = $(window),
          opt = that.options,

          svgHeight = opt.svgHeight;

      this.vars = {};
      this.vars.radius = opt.svgWidth / 2;
      this.vars.border = this.vars.radius * 1 / 3 + 5;


      $arcItems.each(function() {
        that.drawArc(this);

        if(!$(this).hasClass('animated') && $win.scrollTop() + $win.height() >= $(this).offset().top + svgHeight) {
          that.draw(this);
        }
      });

      $win.off('scroll.' + pluginName).on('scroll.' + pluginName, function(){
        $arcItems.each(function() {
          if(!$(this).hasClass('animated') && $win.scrollTop() + $win.height() >= $(this).offset().top + svgHeight) {
            that.draw(this);
          }
        });
      });
    },

    draw: function(item) {
      var that = this,

          startPercent = 0;

      that.drawItem(item);
      $(item).addClass('animated');


      function timeoutFunc() {
        var arcValue = (startPercent / 100) * 2 * pi;

        var $arcItem = $(item);
        if (startPercent > $arcItem.data('value')) {
          if($arcItem.next().css('opacity') < 1) {
            $arcItem.next().animate({opacity: 1}, (100 - $arcItem.data('value')) * that.options.timeAnimate);
          }
          return;
        }

        that.updateProgress(item, arcValue);
        that.updateNumPer(item,startPercent);
        $arcItem.next().css('opacity', startPercent / 100);

        startPercent += 1;
        if (startPercent <= 100) {
          that.timeoutID = setTimeout(timeoutFunc, that.options.timeAnimate);
        }
      }

      that.timeoutID = setTimeout(timeoutFunc, that.options.timeAnimate);
    },

    createArc: function() {
      var that = this;
      return d3.arc()
        .innerRadius(that.vars.radius - that.vars.border)
        .outerRadius(that.vars.radius)
        .startAngle(0);
    },

    drawItem: function drawItem(arcItem) {
      var that = this,
          radialProgress = d3.select(arcItem).select('svg').select('g');

      radialProgress.append('path')
          .attr('class', 'foreground')
          .attr('d', that.createArc().endAngle(0))
          .attr('fill', that.options.colorAcr);
    },

    drawArc: function drawText(arcItem) {
      var that = this,
          opt = that.options,
          svgWidth = opt.svgWidth,
          svgHeight = opt.svgHeight;


      var radialProgress = d3.select(arcItem).append('svg')
        .attr('width', svgWidth).attr('height', svgHeight)
          .append('g').attr(
            'transform',
            'translate(' +svgWidth/2+ ',' + svgHeight/2+')'
          );

      radialProgress.attr('width', svgWidth).attr('height', svgHeight)
        .append('path')
          .attr('d', that.createArc().endAngle(10))
          .attr('fill', that.options.bgColorAcr);

      radialProgress.append('circle')
        .attr('cx', '0')
        .attr('cy', '0')
        .attr('r', that.vars.radius - that.vars.border)
        .style('fill', that.options.bgInner);

      radialProgress.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 8)
        .attr('class', 'numPer')
        .attr('font-size', that.options.fontSize)
        .attr('fill', that.options.textColor)
        .text(0);
    },


    updateProgress: function updateProgress(item, arcValue) {
      var $arcItem = $(item);
      var $foreground = $arcItem.find('.foreground');

      $foreground.attr('d', this.createArc().endAngle(arcValue));
    },

    updateNumPer: function updateNumPer(item, arcValue){
      var $arcItem = $(item);
      var $numPer = $arcItem.find('.numPer');

      $numPer.text(arcValue + '%');
    },

    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    svgHeight: 110,
    svgWidth: 110,
    bgColorAcr: '#D8D8D8',
    colorAcr: 'black',
    bgInner: 'white',
    timeAnimate: 10,
    fontSize: 21,
    textColor:'#4A4A4A',
  };

  /*________________________________________________________________
                                                  Default Options */

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

})(window.jQuery, window.d3);


;(function($, window) {
  'use strict';

  var pluginName = 'googleMaps';



  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {

    init: function() {
      var that = this;

      $.getScript('https://www.google.com/jsapi', function(){
        window.google.load('maps', '3', { other_params: 'libraries=places&sensor=false', callback: function(){
            that.googleMaps();
        }});
      });
    },

    googleMaps: function() {

      var that =this;
      var googleMaps = window.google.maps;
      var mapItems = that.element.find('.map');
      var arrayMap = [];

      mapItems.each(function(){
        var $mapItem = $(this);

        var myCenter = new googleMaps.LatLng($mapItem.data('value').lat , $mapItem.data('value').lng);

        var mapOptions = {
          center: myCenter,
          zoom: $mapItem.data('value').zoom,
          mapTypeId: $mapItem.data('value').type
        };

        var map = new googleMaps.Map(this, mapOptions);
        arrayMap.push(map);

      });


    },

    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    varCallback : 'myMap'
  };

   $(function() {
      $('[data-google-maps]').googleMaps({});
  });

}(jQuery, window));


;(function($, window,undefined) {
  'use strict';

  var pluginName = 'loadMore';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {

    init: function() {
      var that = this;
      that.load();
    },

    load: function() {
      var that =this,
          elm = that.element,
          btnLoad = elm.find('.btn-load'),
          contentLoad = elm.find('.content-load'),
          Urljson = elm.data('load'),
          count = 0;

          btnLoad.click(function(event) {



            event.preventDefault();
            $.getJSON(Urljson, function(data) {
                var max = count + 2;

                if ( max > data.content.length) {
                  max = data.content.length;
                }

                for (count; count < max; count++) {
                  var title = '<h2 class="load-title">' + data.content[count].title+ '</h2>';
                  var price = '<p class="load-price">'+data.content[count].price +'</p>';
                  var img = '<img src =' + data.content[count].img +'>';
                  var li  = '<li class="fadeIn">'+ img+ title + price +'</li>';
                  contentLoad.append(li);

                }
            });

          });
      },



    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    varCallback : 'myMap'
  };

   $(function() {
      $('[data-load]').loadMore({});
  });

}(jQuery, window));

/**
 *  @ pluginMenu
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */

;(function($, window, undefined) {
  'use strict';

  var pluginName = 'pluginMenu';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var elm = this.element,
          btnNav = elm.find('.navbar-btn'),
          btnClose = elm.find('.main-nav__close'),
          navBar = elm.find('.main-nav__wrapper'),
          navItem = navBar.find('>:nth-child(2)').children('li'),
          social = navBar.find('.links-social-header'),
          // menuSocial = elm.find('.links-social-header__wrapper'),
          subNavItem = navBar.find('.sub-nav__item'),
          animateClass = null,
          onClass = null;

          btnNav.click(function(){
            navBar.addClass('animate');
            navBar.addClass('on');
            navItem.css('display','block');
            animateClass = elm.find('.animate');
            btnNav.hide();
            onClass = elm.find('.on');
          });


          function reset() {
            btnNav.show();
            social.show();
            navItem.show().find('>:nth-child(1)').show();
            subNavItem.show();
          }

          btnClose.click(function(){
            navBar.hide();
            navItem.show();
            animateClass.removeClass('animate');
            onClass.removeClass('on');
            reset();
          });

          function ravenous(){


            if (window.matchMedia('(max-width: 991px)').matches) {
              navBar.hide();
            } else {
              navBar.show();
              navItem.css('display','inline-block');

              if($('.animate').find('.animate').hasClass('animate')) {
                animateClass.removeClass('animate');
              }

              if($('.on').find('.animate').hasClass('on')) {
                onClass.removeClass('on');
              }
              reset();
            }
          }

          $(window).resize(ravenous);
          ravenous();
    },

    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
  };

  $(function() {
      $('[data-menu]').pluginMenu({
    });
  });

}(jQuery, window));


/**
 *  @ tabAbout
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */

;(function($, window, undefined) {
  'use strict';

  var pluginName = 'tabAbout';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
        var that = this,
            elm = that.element,
            tabItem = elm.find('.tab-header').find('.tab-header-item'),
            ContentItem = elm.find('.tab-content'),
            team = 0;

            tabItem.eq(0).addClass('active');

            tabItem.click(function(){
              var index = $(this).index();
              tabItem.removeClass('active');
              $(this).addClass('active');

              if(team !== index){
                team = index;

                ContentItem.hide();
                ContentItem.eq(index).show();
              }
            });

    },

    checkSearch: function(){
    },

    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {

  };

  $(function() {
      $('[data-tab-about]').tabAbout({
    });
  });

}(jQuery, window));
