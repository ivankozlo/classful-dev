/**
 * Conversation
 *
 * ------> js/src/custom/conversation.js
 */
jQuery(document).ready(function($) {

  const $win = $(window),
        $body = $('body'),
        $conv = $('.conversation');

  // Check if conversation is present on this page.
  if ( $conv.length > 0 ) {

    const $convField = $('#conversationMessageField'),
          $convSubmit = $('#conversationMessageSubmit');

    // Apply autogrow functionality to the textarea message field.
    $convField.autogrow();

    // Event: On keyup
    $convField.on('keyup', debounce(
      function(e) {
        const $this = $(this);
        toggleSubmit( $this );
      }, 200
    ));

    /**
     * Toggle Submit Button
     * @param {Object} $el jQuery element object.
     */
    function toggleSubmit( $el ) {
      if ( $el.val() !== '' ) {
        $convSubmit.removeAttr('disabled');
        $convSubmit.removeClass('disabled');
      } else {
        $convSubmit.attr('disabled', 'disabled');
        $convSubmit.addClass('disabled');
      }
    }

  }

});