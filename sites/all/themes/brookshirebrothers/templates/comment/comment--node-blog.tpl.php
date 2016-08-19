<?php
// Base theme
?>
<div class="comments-list">

  <div class="comment-author">
    <span><?php print $author; ?></span> said...
  </div>

  <div class="comment-text">
    <div class="content"<?php print $content_attributes; ?>>
      <?php
        // We hide the comments and links now so that we can render them later.
        hide($content['links']);
        print render($content);
      ?>
    </div>
  </div>
  <div class="comment-date">
    <?php echo date("F j, Y H:i", $content["comment_body"]["#object"]->created); ?>
  </div>
  <?php unset($content['links']["comment"]["#links"]["comment-reply"]); ?>
  <?php print render($content['links']); ?>
</div>
