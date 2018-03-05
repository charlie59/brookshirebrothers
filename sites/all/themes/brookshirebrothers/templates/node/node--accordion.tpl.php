<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>

  <?php print render($title_prefix); ?>
  <?php if (!$page): ?>
    <h2<?php print $title_attributes; ?>>
      <a href="<?php print $node_url; ?>"><?php print $title; ?></a>
    </h2>
  <?php endif; ?>
  <?php print render($title_suffix); ?>

  <?php if ($display_submitted): ?>
    <div class="meta submitted">
      <?php print $user_picture; ?>
      <?php print $submitted; ?>
    </div>
  <?php endif; ?>

<?php $accordion = field_get_items('node', $node, 'field_accordion');
	if(!empty($accordion)) { ?>
	<ul class="accordion">
		<?php foreach($accordion as $item) {
		$fc = field_collection_field_get_entity($item);?>
			<li>
				<?php if (isset($fc->field_title_accordion['und'][0]['value'])):?>
				<a class="opener" href="#"><?php print $fc->field_title_accordion['und'][0]['value'];?> </a>
				<?php endif;?>
				<?php if (isset($fc->field_body_accordion['und'][0]['value'])):?>
				<div class="slide2">
					<div class="text-area">
						<?php print $fc->field_body_accordion['und'][0]['value'];?>
					</div>
				</div>
				<?php endif;?>
			</li>
		<?php } ?>
	</ul>
	<?php }
	?>

  <?php
    // Remove the "Add new comment" link on the teaser page or if the comment
    // form is being displayed on the same page.
    if ($teaser || !empty($content['comments']['comment_form'])) {
      unset($content['links']['comment']['#links']['comment-add']);
    }
    // Only display the wrapper div if there are links.
    $links = render($content['links']);
    if ($links):
  ?>
    <div class="link-wrapper">
      <?php print $links; ?>
    </div>
  <?php endif; ?>

  <?php print render($content['comments']); ?>

</div>
