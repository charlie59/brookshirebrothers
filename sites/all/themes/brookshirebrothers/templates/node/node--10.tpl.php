<?php $slide_page = field_get_items('node', $node, 'field_slide_page');
if(!empty($slide_page)) { ?>
<div class="carousel add">
	<div class="mask">
	<div class="slideset">
	<?php foreach($slide_page as $item) {
	$fc = field_collection_field_get_entity($item);?>
			<div class="slide">
				<?php if (isset($fc->field_slide_image['und'][0]['filename'])):?>
				<div class="img-box">
					<img src="/sites/default/files/<?php print $fc->field_slide_image['und'][0]['filename'];?>" alt="">
				</div>
				<?php endif;?>
				<div class="caption">
					<strong class="title"><?php print $fc->field_title_slide['und'][0]['value'];?></strong>
					<?php if (isset($fc->field_body_slide['und'][0]['value'])):?>
					<?php print $fc->field_body_slide['und'][0]['value'];?>
					<?php endif;?>
					<?php if (isset($fc->field_link_slide['und'][0]['value'])):?>
					<a class="btn-learnmore" href="/<?php print $fc->field_link_slide['und'][0]['value'];?>">
            <?php
            if(isset($fc->field_link_text_slide['und'][0]['value'])):
              echo $fc->field_link_text_slide['und'][0]['value'];
            else:
              print t('Learn More');
            endif;
            ?>
          </a>
					<?php endif;?>
				</div>
			</div>
		<?php } ?>
	</div>
	</div>
	<a class="btn-prev" href="#"><?php print t('Previous');?></a>
	<a class="btn-next" href="#"><?php print t('Next');?></a>
</div>
<?php }
?>
	<?php if (!empty($node->field_display_title['und'][0]['value'])):?>
    <?php echo $node->field_display_title['und'][0]['value'];?>
	<?php endif;?>
    <?php //print render($content);?>
	<?php if (!empty($node->body['und'][0]['value'])):?>
	<?php echo $node->body['und'][0]['value'];?>
	<?php endif;?>

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
	<?php if (!empty($node->field_body_continuation['und'][0]['value'])):?>
	<div class="box-refill">
	<?php echo $node->field_body_continuation['und'][0]['value'];?>
	</div>

	<?php endif;?>
