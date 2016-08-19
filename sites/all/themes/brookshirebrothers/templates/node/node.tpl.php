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
<section class="text-block">
	<?php if (!empty($node->field_display_title['und'][0]['value'])):?>
    <h1><?php echo $node->field_display_title['und'][0]['value'];?></h1>
	<?php endif;?>
    <?php print render($content);?>
	<?php /*if (!empty($node->body['und'][0]['value'])):?>
	<?php echo $node->body['und'][0]['value'];?>
	<?php endif;*/?>
</section>