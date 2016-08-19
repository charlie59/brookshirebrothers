<?php
    $variables = array();
    $variables['links'] = $content;
    $variables['attributes'] = array('class' => 'sub-nav');
  ?>
  
<div class="open-close2">  
	<a class="opener2" href="#"><span><?php print t('IN THIS SECTION');?></span></a>
	<div class="slide2">
		<?php print menu_block_links($variables) ?>
	</div>
</div>
