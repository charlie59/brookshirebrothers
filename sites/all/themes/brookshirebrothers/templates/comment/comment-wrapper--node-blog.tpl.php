<?php
// Base theme
?>
<div id="comments" class="<?php print $classes; ?>"<?php print $attributes; ?>>
  <?php if ($content['comments'] && $node->type != 'forum'): ?>
  <h2 class="title">
    <?php $comment_count=$node->comment_count>1?" COMMENTS:":" COMMENT:"; ?>
    <?php print $node->comment_count.$comment_count; ?></h2>
  <?php endif; ?>

  <?php print render($content['comments']); ?>
  <?php  $content['comment_form']['#action'] = ''; ?>
  <?php if ($content['comment_form']): ?>
    <h2 class="title comment-form"><?php print t('POST A COMMENT:'); ?></h2>
    <?php print render($content['comment_form']); ?>
  <?php endif; ?>
</div>
