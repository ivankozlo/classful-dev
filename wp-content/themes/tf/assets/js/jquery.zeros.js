jQuery.fn.zeros = function() {
 
	/**
	 * Set the cursor position
	 * @param {object} ctrl 
	 * @param {int} pos 
	 */
	if( ! window.hasOwnProperty('icSetCaretPosition') ){
		window.icSetCaretPosition = function( ctrl, pos ){
			// Modern browsers
			if (ctrl.setSelectionRange) {
			ctrl.focus();
			ctrl.setSelectionRange(pos, pos);
			
			// IE8 and below
			} else if (ctrl.createTextRange) {
			var range = ctrl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
			}
		}
	}

	if( ! window.hasOwnProperty('icLastCursorPos') ){
		window.icLastCursorPos = false;
	}

	if( ! window.hasOwnProperty('icLastKeyPressed') ){
		window.icLastKeyPressed = false;
	}

    return this.each(function() {

		$(this).on('input', function(e){
	
			var _self = $( this ); // leave this var
			
			_self.val( _self.val().replace('.00', '' ) );
			_self.val( _self.val().replace('.0', '' ) );
			_self.val( _self.val().replace('.', '' ) );
		
			_self.val( _self.val() + '.00' );
		
			if( icLastKeyPressed == 46 ){		
				icSetCaretPosition( _self[0], icLastCursorPos );
			}
			else{
				icSetCaretPosition( _self[0], _self.val().length - 3 );
			}
		}).on('keydown', function(e){
			
			var _self = $(this);
			
			icLastCursorPos = _self[0].selectionStart;
			icLastKeyPressed = e.keyCode;	
			
			if( 
				e.keyCode == 46 // delete
				|| (e.keyCode >= 48 && e.keyCode <= 57) // 0-9
				|| e.keyCode == 37 // left arrow
				|| e.keyCode == 39 // right arrow
				|| e.keyCode == 8 // backspace
				|| e.keyCode == 9 // tab
				|| e.keyCode == 116 // window refresh key
				|| (e.keyCode >= 96 && e.keyCode <= 105 ) // 0-9 more keyboards support
			){
				if( e.keyCode == 8 && _self.val().length > 3 ){
		
					if( 
						_self.val().length == icLastCursorPos
						|| _self.val().length - 1 == icLastCursorPos 
						|| _self.val().length - 2 == icLastCursorPos
					)
					{
						_self.val( _self.val().substr( 0, ( _self.val().length - 4 ) ) + '.00' );
						icSetCaretPosition( _self[0], _self.val().length - 3 );
						return false;
					}
					else if( icLastCursorPos < _self.val().length - 2 ){				
		
						var part_1 = _self.val().substr(0, icLastCursorPos - 1  );
						var part_2 = _self.val().substr( icLastCursorPos, _self.val().length  );
		
						_self.val( part_1 + part_2 );		
						icSetCaretPosition( _self[0], icLastCursorPos - 1 );
		
						return false;
					}
				}
		
				// do not delete the dot (.)00
				if( e.keyCode == 46 && icLastCursorPos == _self.val().length - 3 ){
					return false;
				}
		
				return true;
			}
		
			return e.preventDefault();
		});
    });
};
