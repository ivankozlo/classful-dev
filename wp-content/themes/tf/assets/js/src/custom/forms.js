/**
 * Forms
 */
jQuery(document).ready(function($) {

  // Fancy Checkboxes
  $('.gform_wrapper input[type="checkbox"]').ezMark();

  // Selectbox
  $('select:not(body.outreach-template select):not(.no-selectbox select)').selectbox();
  $('.sbOptions li:first-child').addClass('active');
  $('.sbOptions li a').click(function() {
    var $this = $(this);
    $this.closest('li').addClass('sbActive').siblings().removeClass('sbActive');
  });

  // Run on GravityForm post render event.
  $(document).on('gform_post_render', function(event, form_id, current_page){

    // Reinitialize ezMark
    var $checkboxes = $('.gform_wrapper input[type="checkbox"]');

    if ( ! $checkboxes.closest('.ez-checkbox').length ) {
      $('.gform_wrapper input[type="checkbox"]').ezMark();
    }

    // Reinitialize Selectbox.
    $('select:not(body.outreach-template select):not(.no-selectbox select)').selectbox();
    $('.sbOptions li:first-child').addClass('active');
  });

  /**
   * Range Slider
   */
  $('.range-slider').each(function() {
    var $this = $(this),
        options = {
          // hide_min_max: true,
          onChange: function(slider) {
          // console.log(slider);
          },
          onFinish: function(slider) {
            // console.log(slider);
          }
        };

    // If the range slider is two side, then add
    // a custom CSS class to the container.
    if ( $this.data('type') === 'double' ) {
      options['extra_classes'] = 'range-slider--double';
    }

    // If the range slider is single, then add
    // a custom CSS class to the container.
    if ( $this.data('type') === 'single' ) {
      options['extra_classes'] = 'range-slider--single';
    }

    $this.ionRangeSlider(options);

    var thisRange = $this.data('ionRangeSlider');

  });
});

/**
 * Submit Search on Enter
 */
jQuery(document).ready(function($) {

  // Traversing: Run through each item
  $('.submit-on-enter').each(function(i, el) {
    let $this = $(el),
        $input = $this.find('input.form-control');

    // Event: On keyup
    $input.on('keyup', function(e) {
      if ( e.which == 13 ) {
        $this.submit();
      }
    });

  });

});

/**
 * Checkable Table
 */
jQuery(document).ready(function($) {
  checkableTable();

  function checkableTable() {

    // Define variables.
    const $table = $(this),
          $rows = $table.find('tbody > tr'),
          $mainCheckbox = $table.find('thead input[type=checkbox]'),
          $mainTitle = $table.find('thead .table-col-title'),
          mainOrigTitle = $mainTitle.text(),
          $checkboxes = $rows.find('input[type=checkbox]');

    // Event: On click
    $rows.on('click', function(e) {

      let $thisRow = $(this),
          $checkbox = $thisRow.find('input[type=checkbox]');

      if (e.target.type !== 'checkbox') {
        $(':checkbox', this).trigger('click');
      }

    });

    // Event: On change
    $checkboxes.on('change', function(e) {
      let $checkbox = $(this);

      if ( $checkbox ) {

      }
    });

    // On change of the checkboxes.
    $checkboxes.on('change', function() {
      let $checkbox = $(this),
          checkedLength = getCheckedLength( $rows );

      // Check if any of the checkbox in this table is checked.
      if ( checkedLength > 0 ) {
        if ( ! $mainCheckbox.is(':checked') ) {
          checkMainCheckbox();
        }

        $mainTitle.text( checkedLength + ' selected' );
      } else {
        if ( $mainCheckbox.is(':checked') ) {
          uncheckMainCheckbox();
        }

        $mainTitle.text( mainOrigTitle );
      }
    });

    // Event: On click
    $mainCheckbox.on('click', function(e) {
      // Traversing: Run through each item
      $checkboxes.each(function(i, el) {
        el.checked = e.target.checked;
      });

      // Check if any of the checkbox in this table is checked.
      if ( e.target.checked ) {
        $mainTitle.text( $checkboxes.length + ' selected' );
      } else {
        $mainTitle.text( mainOrigTitle );
      }
    });

    // Event: On click
    $mainTitle.on('click', function(e) {
      $mainCheckbox.click();
    });

    /**
     * Is Any Checkbox Checked
     * @param {object} $el element to find all the checkbox in
     */
    function getCheckedLength( $el ) {
      return $el.find('input[type=checkbox]').filter(':checked').length;
    }

    /**
     * Check Main Checkbox
     */
    function checkMainCheckbox(  ) {
      $mainCheckbox[0].checked = true;
    }

    /**
     * Uncheck Main Checkbox
     */
    function uncheckMainCheckbox(  ) {
      $mainCheckbox[0].checked = false;
    }

    /**
     * Uncheck Main Checkbox
     */
    function toggleMainCheckbox(  ) {
      if ( ! $mainCheckbox.is(':checked') ) {
        checkMainCheckbox();
      } else {
        uncheckMainCheckbox();
      }
    }

  }
});