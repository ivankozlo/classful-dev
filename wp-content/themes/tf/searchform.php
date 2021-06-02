<form method="get" id="searchform" class="searchform" action="<?php echo home_url(); ?>/">
	<fieldset>
		<div class="form__field">
			<label for="s" class="form__label visually-hidden"><?php _e( 'Zoeken', TFTEXTDOMAIN ); ?></label>
			<input type="text" class="form__input" value="<?php the_search_query(); ?>" name="s" id="s" placeholder="<?php _e( 'Zoeken', TFTEXTDOMAIN ); ?>" />
		</div>
		<button type="submit" class="button button--secondary" id="searchsubmit"><span class="sr-only"><?php _e( 'Zoeken', TFTEXTDOMAIN ); ?></span> <i class="fas fa-search"></i></button>
	</fieldset>
</form>
