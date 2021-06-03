<?php
/*
 * Template Name: Feeds page
 * description: >-
  Page template without sidebar
 */
$current_user = wp_get_current_user();

get_header(); ?>

<div class="container-fluid container-fluid--max">
  <div class="h4 post-type">
    <div class="post-type-item active">
      Home
    </div>
    <div class="post-type-item ">
      Trending
    </div>
  </div>
  <div class="page-wrapper">
    <div class="create-post-section">
      <div class="custom-card">
        <div class="d-flex flex-row">
          <div class="avatar">
            <?php
            if ( ($current_user instanceof WP_User) ) {
              echo get_avatar( $current_user->user_email, 40 );
            }
            ?>
          </div>
          <div class="custom-card-description">
            <div class="h4 user-name">
              <?php
              if ( ($current_user instanceof WP_User) ) {
                echo  $current_user->display_name;
              }
              ?>
            </div>
            <div class="file-upload">
              <span>Share an image or video</span>
              <i class="fas fa-images"></i>
              <i class="fas fa-video"></i>
              <input type="file" name="post-file-attachment" accept="image/*, video/*">
            </div>
          </div>
        </div>
      </div>
      <div class="custom-card hidden post-content-input">
        <div class="d-flex flex-row">
          <div class="avatar">
            <?php
            if ( ($current_user instanceof WP_User) ) {
              echo get_avatar( $current_user->user_email, 40 );
            }
            ?>
          </div>
          <div class="custom-card-description">
            <div class="h4 user-name">
              <?php
              if ( ($current_user instanceof WP_User) ) {
                echo  $current_user->display_name;
              }
              ?>
              <select class="" name="post-discoverable-option">
                <option value="discoverable">Discoverable</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
        </div>
        <div class="d-flex flex-column">
          <div class="preview">
            <img src="https://picsum.photos/600/300" alt="File upload preview" height="200" width="400">
          </div>
          <input class="form-input" type="text" name="post-title-input" value="" placeholder="Title*">
          <span class="text-danger text-xxs danger post-title-validation hidden">You need to input the post title</span>
          <input class="form-input" type="text" name="post-link-input" value="" placeholder="Link">
          <div class="tags-input mt-2">
            <div class="d-flex justify-content-between">
              <span class="text-muted">Add tags relating to your post</span>
              <span class="tags-left"><span class="tags-count">10</span> left</span>
            </div>
            <div class="tags-input-field d-flex mt-2">
              <input type="text" name="tag-name" value="" placeholder="For ex. teacherlife, classful, teacheroutfit" class="pl-3">
              <button type="button" name="button" class="add-tag">Add</button>
            </div>
            <div class="tags mt-2 d-flex">

            </div>
          </div>
          <div class="submit-post d-flex justify-content-between mt-5">
            <button type="button" name="button" class="form-control btn btn-default">Save to</button>
            <button type="button" name="post-submit" class="ml-5 form-control btn btn-secondary">Post</button>
          </div>
        </div>
      </div>
    </div>
    <div class="posts-section">
      <?php
        $args = array(
          'post_type'=> 'post',
          'orderby'    => 'ID',
          'post_status' => 'publish',
          'order'    => 'DESC',
          'posts_per_page' => -1
        );
        $result = new WP_Query( $args );
        if ( $result->have_posts() ) :
          while ( $result->have_posts() ) : $result->the_post();
            $post_id = get_the_ID();
            $category = get_the_category($post_id);
            foreach($category as $c){//get_post_meta( $post->ID, '_discoverable_post_meta', true );

              if($c->slug == 'feeds' && get_post_meta( $post_id, '_discoverable_post_meta', true ) != 'hidden'){
                // Render posts
                ?>
                <div class="custom-card">
                  <div class="post-attachment">
                    <img src="https://picsum.photos/600/300" alt="Post attachment" height="300" width="600">
                  </div>
                  <div class="post-attachment-space">

                  </div>
                  <div class="d-flex flex-row">
                    <div class="avatar">
                      <?php
                      if ( ($current_user instanceof WP_User) ) {
                        echo get_avatar( $current_user->user_email, 50 );
                      }
                      ?>
                    </div>
                    <div class="custom-card-description">
                      <div class="h4 user-name mb-0 d-flex justify-content-between align-items-center">
                        <span>
                          <?php
                          if ( ($current_user instanceof WP_User) ) {
                            echo  $current_user->display_name;
                          }
                          ?>
                        </span>
                        <i class="fa fa-ellipsis-h"></i>
                      </div>
                      <span>218 followers - 2 mins</span>
                    </div>
                  </div>
                  <div class="post-title h3 mt-5">
                    <?php
                      echo "<a href=".get_post_meta( $post_id, '_link_post_meta', true ).">".get_the_title()."</a>";
                    ?>
                  </div>
                  <div class="post-tags-section d-flex flex-wrap flex-row">
                    <div class="post-tags" style="width: 80%">
                      <?php
                        $tags = get_the_tags();
                        if($tags && count($tags) <= 5){
                          ?>
                          <div class="short-post">
                          <?php
                            foreach($tags as $tag){
                              echo "<span class='post-tag'>#" . $tag->slug . "</span>";
                            }
                          ?>
                          </div>
                          <?php
                        }
                        if($tags && count($tags) > 5){
                          ?>
                          <div class="full-post hidden">
                          <?php
                            foreach($tags as $tag){
                              echo "<span class='post-tag'>#" . $tag->slug . "</span>";
                            }
                          ?>
                          </div>
                          <div class="short-post">
                          <?php
                            $count = 0;
                            foreach($tags as $tag){
                              $count ++;
                              if($count > 5){
                                break;
                              }
                              echo "<span class='post-tag'>#" . $tag->slug . "</span>";
                            }
                          ?>...
                          </div>
                          <?php
                        }
                      ?>
                    </div>
                    <?php
                      if($tags && count($tags) > 5){
                        ?>
                        <div class="showmore text-right" style="width: 20%">
                          View more
                        </div>
                        <?php
                      }
                    ?>

                  </div>
                  <hr/>
                  <div class="post-actions d-flex justify-content-between mt-5">
                    <div class="post-action post-action-like">
                      <i class="far fa-heart mr-2"></i>
                      <span>45</span>
                    </div>
                    <div class="post-action post-action-retweet">
                      <i class="fas fa-retweet mr-2"></i>
                      <span>3</span>
                    </div>
                    <div class="post-action post-action-comment">
                      <i class="far fa-comment mr-2"></i>
                      <span>5</span>
                    </div>
                    <div class="post-action post-action-download">
                      <i class="fas fa-download mr-2"></i>
                      <span>4</span>
                    </div>
                  </div>
                </div>
                <?php
              }else{
                continue;
              }
            }
          endwhile;
        else :
          echo "No posts found";
        endif;
      ?>
    </div>
  </div>
</div>

<?php get_footer(); ?>
