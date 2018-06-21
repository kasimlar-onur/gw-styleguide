;(function($, window, document) {
  'use strict';
  //var currentLang = $('html').attr('lang') || 'de';
  var app = {
    // initPlaceholder: function() {
    //   $('input, textarea').placeholder();
    // },

    initResizeNav: function() {
      var $menu = $('.m-nav'),
        $main = $('.l-main');

      if (window.matchMedia('(min-width: 1201px)').matches) {
        setTimeout(function () {
          if ($main.innerHeight() > 750) {
            $menu.css('min-height', $main.innerHeight());
            $menu.css('height', 'auto');
          }
        }, 500);
      } else {
        $menu.css('min-height', '0');
      }
    },
    initNav: function() {
      var $menu = $('.m-nav'),
        $openMenu = $('.js-open-nav'),
        $link = $('.m-nav__link:not(.js-open-nav)'),
        $wrapper = $('.wrapper');

      app.initResizeNav();

      $openMenu.on('click', function(e) {
        e.preventDefault();

        $(this).toggleClass('is-opened');
        $menu.toggleClass('is-opened');
        $wrapper.toggleClass('menu-is-opened');

        if (!$menu.hasClass('is-opened')) {
          app.scrollTo($menu, '.m-header', 100, true);
        }

        $.each($link, function() {
          var submenu = $(this).parent().find('.m-nav__submenu');

          if ($(this).parent().find('.m-nav__submenu').hasClass('is-opened')) {
            submenu.removeClass('is-opened');
          }
        });

      });

      $link.on('click', function (e) {
        var $this = $(this);

        e.preventDefault();

        if ($this.parent().hasClass('m-nav__item--submenu')) {

          var submenu = $this.parent().find('.m-nav__submenu');

          if ($menu.hasClass('is-opened')) {
            $('.m-nav__submenu').removeClass('is-opened-right');
            submenu.toggleClass('is-opened');
          }
        }
      });

      $link.on('mouseenter', function() {
        var $this = $(this);

        if (window.matchMedia('(min-width: 1200px)').matches) {
          if ($this.parent().hasClass('m-nav__item--submenu') &&
            !$this.parent().find('.m-nav__submenu').hasClass('is-opened') &&
            !$menu.hasClass('is-opened')) {
            var $submenu = $this.parent().find('.m-nav__submenu');

            $menu.addClass('is-opened-right');
            $submenu.addClass('is-opened-right');

          } else if (!$(this).siblings().hasClass('is-opened')) {
            $('.m-nav__submenu').removeClass('is-opened-right');
            $(this).siblings().addClass('is-opened-right');
          }
        }
      });

      $('.m-nav__item').on('mouseleave', function() {
        var $this = $(this);

        if ($this.hasClass('m-nav__item--submenu')) {
          var submenu = $this.find('.m-nav__submenu');

          if ($menu.hasClass('is-opened-right')) {
            submenu.removeClass('is-opened-right');
          }
        }
      });

      $('.m-nav').on('mouseleave', function() {
        $(this).removeClass('is-opened-right');
        $(this).find('.m-nav__submenu.is-opened-right').removeClass('is-opened-right');
      });
    },
    // initMatchHeight: function() {
    //   $('.js-match-height').matchHeight();
    //
    //   for (var i = 1; i < 10; i++) {
    //     $('.js-match-height-' + i).matchHeight();
    //   }
    //
    //   $('.collapse').on('shown.bs.collapse', function() {
    //     $.fn.matchHeight._maintainScroll = true;
    //     $.fn.matchHeight._update();
    //   });
    // },
    initSelectPicker: function() {
      var $select = $('select.form-control');

      $select.on('change', function () {
        var $val = $(this).val();

        if (window.matchMedia('(max-width:1199px)').matches) {
          if ($val === '4') {
            $('.m-datepicker').addClass('is-visible');
          }
        }
      });

      // Init Select2
      $select.each(function() {
        var select2Options = {
          minimumResultsForSearch: Infinity,
          theme: 'form-control',
          width: $select.attr('data-width') || '100%',
        };

        $(this).select2(select2Options).on('select2:open', function() {
          var $formGroup = $(this).parents('form').find('.m-form__group');

          $('body').append('<div class="overlay"></div>');
          $('.overlay').addClass('is-visible');

          $.each($formGroup, function () {
            $(this).css('z-index', '1');
          });

        }).on('select2:close', function() {
          var $formGroup = $(this).parents('form').find('.m-form__group'),
              $selectFocused = $(this).
            parent().
            find('.select2-container--focus');

          $('.overlay').removeClass('is-visible');
          $('.overlay').remove();

          $.each($formGroup, function () {
            $(this).removeAttr('style');
          });

          $selectFocused.removeClass('select2-container--focus');

        });
      });

      $select.each(function() {
        var $this = $(this),
          link = $this.data('link'),
          icon = $this.attr('data-icon'),
          placeholder = $this.attr('data-custom-placeholder'),
          $select2Container = $this.next('.select2-container'),
          $selectionRendered = $select2Container.find(
            '.select2-selection__rendered');

        if ($selectionRendered.length) {
          // add icon
          if (typeof icon !== 'undefined') {
            $selectionRendered.before('<span class="select2-selection__custom-placeholder">' +
              '<span class="select2-selection__icon">' +
              icon +
              '</span>' +
              '</span>');
          }

          // add placeholder for multiple select
          if (typeof placeholder !== 'undefined' &&
            typeof $this.attr('multiple') !== 'undefined') {
            $select2Container.find('.select2-selection__custom-placeholder').
              append(placeholder);

          }

          if (typeof link !== 'undefined' && link) {
            var $link = $(link).first();
            $link.html('<i class="fa fa-info-circle" aria-hidden="true"></i>');
            $select2Container.addClass('select2-container--custom-link');
            $select2Container.append('<span class="select2-container__custom-link">' +
              $link[0].outerHTML +
              '</span>');
          }
        }
      });
      $select.on('select2:open', function() {

        if ($(this).hasClass('form-control--white--alt')) {
          $('span.select2-container').addClass('color-alt');
        }
        if ($(this).hasClass('form-control--show-title')) {
          $('span.select2-container').addClass('top-fixed');
        }
        if ($(this).hasClass('form-control--mobile-fixed-width')) {
          $('span.select2-container').addClass('mobile-fixed-width');
        }
      });

    },
    /**
     * Togglable tabs based on Bootstrap with support for double navigation.
     *
     * @link http://getbootstrap.com/javascript/#tabs
     *
     * TODO: Methods, Events
     */
    initTabs: function() {
      var createTabUrl = function(hashUrl, prefix, trimPrefix) {
        if (hashUrl.indexOf('#') === 0) {
          hashUrl = hashUrl.substring(1);
        }

        // remove from the beginning of the target url the prefix to trim
        if (trimPrefix) {
          var trimPrefixRegexp = new RegExp('^' + trimPrefix, 'i');
          hashUrl = hashUrl.replace(trimPrefixRegexp, '');
        }

        // add prefix to the url
        if (prefix) {
          hashUrl = prefix + hashUrl;
        }

        return '#' + hashUrl;
      };

      $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var $root = $(e.currentTarget).parents('.js-nav-tabs'),
          changeUrl = !!$root.data('change-url') || false,
          urlTrimPrefix = $root.data('url-trim-prefix') || '',
          urlPrefix = $root.data('url-prefix') || '',
          hashUrl = e.target.hash;

        if (hashUrl) {
          if (changeUrl) {
            window.location.hash = createTabUrl(hashUrl, urlPrefix,
              urlTrimPrefix);
          }
        }
      });

      // change tab on page init
      if (window.location.hash) {
        $('.js-nav-tabs[data-init-change-tab]').each(function() {
          var $this = $(this),
            urlTrimPrefix = $this.data('url-trim-prefix') || '',
            urlPrefix = $this.data('url-prefix') || '',
            // urlTrimPrefix and urlPreifx parameters are used in another way intentionally,
            // becasuse we want to reverse the URL creation
            hashUrl = createTabUrl(window.location.hash, urlTrimPrefix,
              urlPrefix),
            $targetTab = $('a[data-toggle="tab"][href="' + hashUrl + '"]',
              $this);

          if (!$this.data('init-change-tab')) {
            return;
          }

          if ($targetTab) {
            $targetTab.tab('show');
          }
        });
      }
    },
    /**
     * Scroll to specific element or position with animation.
     *
     * @param $target
     * @param scrollTop
     * @param duration
     * @param checkHeader
     */
    scrollTo: function($target, scrollTop, duration, checkHeader) {
      if (!scrollTop && !$target.length) {
        return;
      }

      scrollTop = scrollTop || $target.eq(0).offset().top;
      duration = duration || 'normal';

      $('html, body').animate({
        scrollTop: scrollTop,
      }, duration);
    },
    initScrollTo: function() {
      $('[data-scroll-to]').on('click', function(e) {
        var $this = $(this),
          $target = $($this.attr('data-scroll-to')),
          scrollTop = ($target.attr('id') === 'top') ? '0' : null,
          delay = parseInt($this.attr('data-delay'));

        setTimeout(function() {
          app.scrollTo($target, scrollTop, null, true);
        }, (isNaN(delay)) ? 0 : delay);

        e.preventDefault();
      });
    },
    initTooltip: function() {
      $('[data-toggle="tooltip"]').tooltip();
    },
    initFiltersMenu: function() {
      var $dropdownOpen = $('.m-filter-results__item__arrow');

      $dropdownOpen.on('click', function(e) {
        e.preventDefault();

        $(this).toggleClass('m-filter-results__item__arrow--active');
        $(this).parent().find('.m-filter-results__dropdown').toggle();
        $(this).parent().find('.m-filter-results__item__found').toggle();
      });
    },

    initShowContent: function() {
      $('.js-open-content').on('click', function(e) {
        e.preventDefault();

        app.initResizeNav();

        var $contentToShow = $(this).data('content');
        var $content = $('*[data-show=' + $contentToShow + ']');

        if ($content.data('show-mobile')) {
          if (window.matchMedia('(max-width:767px)').matches) {
            $content.toggleClass('is-opened');

            if ($content.hasClass('is-opened')) {
              $(this).text('Hide details');
            } else {
              $(this).text('Show Details');
            }
          }
        } else {
          $content.toggleClass('is-opened');
        }

        // $(this).toggleClass('show-more-content--open');
      });
    },
    initSort: function() {
      var $selectCustom = $('.select-custom'),
          $selectCustomItem = $('.select-custom__item'),
          sort = document.getElementById('sort'),
          $icons = $('table th a'),
          noDragClass = 'select-custom--no-drag',
          $body = $('body');

      function toggleTag (item) {
        var tagsClass = 'select-custom__tags',
          $tagName  = item.find('.fa-checkbox-custom__label').text(),
          $tagId    = item.find('.fa-checkbox-custom__input').attr('id');

        // check if input is checked
        if (item.find('.fa-checkbox-custom__input').is(':checked')) {

          // check if tags container exists
          if ( $('.' + tagsClass).length > 0) {
            item.parents('.select-custom').parent().find('.' + tagsClass).append('<span class="select-custom__tag" data-tag="' + $tagId + '"><span class="select-custom__tag__remove"><i class="fa fa-close"></i></span>' + $tagName + '</span>');
          } else {
            item.parents('.select-custom').after('<div class="select-custom__tags"></div>');
            item.parents('.select-custom').parent().find('.' + tagsClass).append('<span class="select-custom__tag" data-tag="' + $tagId + '"><span class="select-custom__tag__remove"><i class="fa fa-close"></i></span>' + $tagName + '</span>');
          }

        } else {
          item.parents('.select-custom').parent().find('.' + tagsClass + ' [data-tag="' + $tagId + '"]').remove();
        }
      }

      $body.on('click', '.select-custom__tag__remove', function () {
        var $tag = $(this).parent().data('tag');

        $('#' + $tag).removeAttr('checked');
        $(this).parent().remove();
      });

      $selectCustom.on('click', function() {
        $selectCustom.toggleClass('is-active');
        app.toggleOverlay();
      });

      $body.on('click', '.overlay', function() {
        $selectCustom.removeClass('is-active');
      });

      $selectCustomItem.on('click', function() {
        var item = $(this).find('.select-custom__item__name'),
            $itemText = item.text();

        item.parent().siblings().removeClass('is-active');
        item.parent().addClass('is-active');

        if ( !$(this).parents().hasClass(noDragClass)) {
          $('.select-custom__selected').html($itemText);
        } else {
          toggleTag($(this));
        }
      });

      $selectCustomItem.find('.select-custom__item__icon').
        on('click', function() {

          if ($(this).parent().hasClass('is-active')) {
            $('.select-custom__selected').html('');
          }

          $(this).parent().remove();

        });

      if (sort) {
        Sortable.create(sort); // jshint ignore:line
      }

      // $('table th').on('mouseover', function() {
      //   $(this).find('.table__icon--second').css('opacity', '1');
      // });

      $('.table-v1__icon--second a').on('click', function() {
        var $parent = $(this).parents('.table-v1__row'),
          $sortOrder = $(this).data('sort');

        if ( ! $(this).parent().siblings().find('[data-sort-icon=' + $sortOrder + ']').hasClass('is-visible') ) {
          $parent.find('.table-v1__icon [data-sort-icon]').removeClass('is-visible brand-color');
          $(this).parent().siblings().find('[data-sort-icon=' + $sortOrder + ']').addClass('is-visible brand-color');
        } else {
          $parent.find('.table-v1__icon [data-sort-icon]').removeClass('is-visible brand-color');
        }
      });

      $.each($icons, function() {

        var i = 0;

        $(this).on('click', function(e) {

          e.preventDefault();
          i++;

          if (i === 2) {
            i = 0;
          }

          $(this).find('span[class^=icon-]').eq(i).show();
          $(this).find('span[class^=icon-]').eq(i).siblings().hide();
        });
      });
    },
    initSearch: function() {
      var $searchField = $('.m-search'),
        $searchBtn = $('[data-slide="search-field"]'),
        $header = $('.m-header');

      $searchBtn.on('mouseenter', function () {

        if (window.matchMedia('(min-width: 768px)').matches) {
          $searchField.addClass('is-opened');
        }
      });

      $searchBtn.on('click', function() {

        if (!$searchField.hasClass('is-focused')) {
          $searchField.find('input').focus();
          $searchField.addClass('is-focused');
        } else {
          $searchField.removeClass('is-focused');
        }
      });

      $header.on('mouseleave', function() {
        if (!$searchField.find('input').is(':focus')) {
          $searchField.removeClass('is-focused is-opened');
        }
      });

      $searchField.find('input').on('focusout', function () {
        $searchField.removeClass('is-focused is-opened');
      });
    },
    initInfoModal: function () {
      var $infoModal = $('.m-info-modal'),
        $close = $infoModal.find('.m-info-modal__close');

      function removeModal () {
        $infoModal.remove();
      }

      $close.on('click', function () {
        var $this = $(this),
          $parent = $(this).parent(),
          modalInfoId = '#modalInfo';

        $(modalInfoId).modal('toggle');
        $(modalInfoId).on('hidden.bs.modal', function () {
          $parent.parents('.m-section--scroll-mobile-disabled').removeClass('m-section--scroll-mobile-disabled').addClass('m-section--scroll-mobile-enabled');
          $this.parent().addClass('fade-out');
          setTimeout(removeModal, 500);
        });
      });
    },
    initResponsiveTables: function () {
      $('.table-responsive').basictable({
        breakpoint: 767
      });
    },
    initDatepicker: function () {
      $('.input-daterange').datepicker({
        language: "de",
        templates: {
          leftArrow: '<span class="icon-angle-left"></span>',
          rightArrow: '<span class="icon-angle-right"></span>'
        }
      });
    },
    initPortalFilters: function () {
      var $filters = $('.m-portal-news__filters__list'),
        $filterItem = $filters.find('.m-portal-news__filters__item'),
        $items   = $('.m-portal-news__content__col');

      $filterItem.find('.fa-checkbox-custom__input').on('click', function (e) {
        var $this = $(this),
          $checkbox = $this,
          $category = $checkbox.val();
        $checkbox.toggleClass('active');

        if ( $checkbox.is(':checked')) {
          resetFilters();
          showFilteredItems($category);
          $checkbox.prop('checked', true);
        } else {
          resetFilteredElements();
          resetFilters();
        }
      });

      function resetFilters () {
        $.each($filterItem, function () {
          var $this = $(this),
            $checkbox = $this.find('.fa-checkbox-custom__input');

          $checkbox.removeAttr('checked');
        });
      }

      function showFilteredItems (category) {
        $.each($items, function () {
          var $this = $(this),
            $itemCategory = $this.data('category');

          if (category !== '0') {
            if ($itemCategory !== category) {
              $this.hide();
            } else {
              $this.show();
            }
          } else {
            $this.show();
          }
        });
      }

      function resetFilteredElements () {
        $.each($items, function () {
          var $this = $(this);

          if ($this.is(':hidden')) {
            $this.show();
          }
        });
      }
    },
    initNotificationsDropdown: function () {
      var $note = $('.m-note'),
          $btnOpen  = $('.js-open-note');

      function changePosition (btnPosTop, btnPosLeft) {
        var $btnPosTop = (btnPosTop ? btnPosTop : $btnOpen.offset().top);
        var $btnPosLeft = (btnPosLeft ? btnPosLeft : $btnOpen.offset().left);

        if (window.matchMedia('(max-width: 767px)').matches) {
          $note.css({
            top: $btnPosTop + 57,
            left: 'auto',
            right: 0
          });
        } else {
          $note.css({
            top: $btnPosTop + 57,
            left: $btnPosLeft - ($note.innerWidth() - 60),
            right: 'auto'
          });
        }
      }

      changePosition();

      $btnOpen.on('click', function () {
        var $btnPos = $(this).offset();

        if (!$note.hasClass('is-visible')) {
          $note.addClass('is-visible');

          setTimeout(function () {
            $note.addClass('fade-in');
          }, 0);
        } else {
          $note.removeClass('fade-in');

          $note.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
            function() {
              $note.removeClass('is-visible');
            });
        }

        app.toggleOverlay();
        changePosition($btnPos.top, $btnPos.left);
      });

      $('body').on('click', '.overlay', function() {
        $note.removeClass('fade-in');

        setTimeout(function () {
          $note.removeClass('is-visible');

        }, 400);
        app.toggleOverlay();
      });

      $(window).on('resize', function () {
        changePosition();
      });
    },
    toggleOverlay: function () {
      if ($('.overlay').length > 0) {
        $('.overlay').removeClass('is-visible');
        $('.overlay').remove();
      } else {
        $('body').append('<div class="overlay"></div>');
        $('.overlay').addClass('is-visible');
      }
    },
    initNoteBar: function () {
      var $noteBar = $('.m-note-bar'),
          $menu    = $('.m-nav'),
          $openMenu = $('.js-open-nav');

      function changePosition () {
        var $noteBarInner = $noteBar.find('.m-note-bar__inner');

        $menu.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
          function() {
            var $menuWidth = $menu.innerWidth();
            $noteBarInner.css('padding-left', ($menuWidth + 40));
          });
      }

      $openMenu.on('click', function () {
        changePosition();
      });
    },
  };

  $(document).ready(function() {
    // app.initPlaceholder();
    app.initNav();
    app.initScrollTo();
    app.initSelectPicker();
    app.initTabs();
    // app.initMatchHeight();
    app.initTooltip();
    app.initFiltersMenu();
    app.initSort();
    app.initShowContent();
    app.initSearch();
    app.initInfoModal();
    app.initResponsiveTables();
    app.initDatepicker();
    app.initPortalFilters();
    app.initNotificationsDropdown();
    app.initNoteBar();
  });

  $(window).on('resize', function () {
    app.initResizeNav();
  });

})(jQuery, window, document);