<?php
	// Kill if being directly accessed
	if ( ! empty( $_SERVER[ 'SCRIPT_FILENAME' ] ) && 'comments.php' == basename( $_SERVER[ 'SCRIPT_FILENAME' ] ) ) {
		die ( 'Please do not load this page directly. Thanks!' );
	}

	// If password requested
	if ( post_password_required() ) { 
?>
	<p class="nocomments">This post is password protected. Enter the password to view comments.</p>
<?php
		return;
	}
?>

<div id="comments">

<?php if ( have_comments() ) : ?>

	<h2><?php comments_number( 'No Responses', 'One Response', '% Responses' );?> to <?php the_title(); ?></h2>

	<ol class="commentlist">
		<?php 
			$gravatar = get_option( 'theme_gravatar' );
			$size = get_option( 'theme_gravatar_size' );
			if ( $gravatar==true ) { 
				wp_list_comments( 'avatar_size='.$size.'&type=comment' );
			} else {
				wp_list_comments( 'type=comment' );
			}
		?>
	</ol>    

	<?php if ( $comments_by_type[ 'pings' ] ) : ?>
    <h2 id="pings">Trackbacks/Pingbacks</h2>
    <ol class="commentlist">
		<?php wp_list_comments( 'type=pings' ); ?>
    </ol>
    <?php endif; ?>

	<ul id="prev-next">
		<li id="prev"><?php previous_comments_link() ?></li>
		<li id="next"><?php next_comments_link() ?></li>
	</ul>
 
<?php 
	else :
		// If comments are open, but there are no comments
		if ( 'open' == $post->comment_status ) {
		} else {
?>
		<p class="nocomments">Comments are closed.</p>
<?php 	
		} 
	endif; 
?>

</div>

<?php if ( 'open' == $post->comment_status ) : ?>

<div id="respond">

	<h2><?php comment_form_title( 'Leave a Reply', 'Leave a Reply to %s' ); ?></h2>
	<p class="cancel-comment-reply">
		<?php cancel_comment_reply_link(); ?>
	</p>

	<?php if ( get_option( 'comment_registration' ) && !$user_ID ) : ?>
		<p>You must be <a href="<?php echo get_option( 'siteurl' ); ?>/wp-login.php?redirect_to=<?php echo urlencode( get_permalink() ); ?>">logged in</a> to post a comment.</p>
	<?php else : ?>
		<form action="<?php echo get_option( 'siteurl' ); ?>/wp-comments-post.php" method="post" id="commentform">
			<fieldset>
			<?php if ( $user_ID ) : ?>
			<p class="loggedin">Logged in as <a href="<?php echo get_option( 'siteurl' ); ?>/wp-admin/profile.php"><?php echo $user_identity; ?></a>. <a href="<?php echo wp_logout_url(); ?>" title="Log out of this account">Logout &raquo;</a></p>
			<?php else : ?>
			<p class="text">
				<label for="author">Name<?php if ( $req ) echo " ( required )"; ?></label>
				<input type="text" name="author" id="author" value="<?php echo $comment_author; ?>" />
			</p>
			<p class="text">
				<label for="email">Mail ( will not be published )<?php if ( $req ) echo " ( required )"; ?></label>
				<input type="text" name="email" id="email" value="<?php echo $comment_author_email; ?>" />
			</p>
			<p class="text">
				<label for="url">Website</label>
				<input type="text" name="url" id="url" value="<?php echo $comment_author_url; ?>" />
			</p>
	<?php endif; ?>
			<p>
				<textarea name="comment" id="comment" rows="10" cols="50"></textarea>
			</p>
			<p>
				<input type="submit" name="submit" id="submit" value="Submit Comment" />
				<input type="hidden" name="comment_post_ID" value="<?php echo $id; ?>" />
				<?php comment_id_fields(); ?>
				<?php do_action( 'comment_form', $post->ID ); ?>
			</p>
		</fieldset>
	</form>
<?php endif;?>
</div>
<?php endif; ?>