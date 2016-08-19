<?php if ($delta==4):?>
<?php
    $variables = array();
    $variables['links'] = $content;
    $variables['attributes'] = array('class' => 'main-menu');
  ?>
  
<nav id="nav">
	<div class="open-close">
		<a class="opener" href="#"><?php print t('Menu');?></a>
			<div class="slide">
				<?php print menu_block_links_main($variables) ?>
			
			</div>
	</div>
</nav>
   
<?php elseif ($delta==6): ?>

<?php
    $variables = array();
    $variables['links'] = $content;
    $variables['attributes'] = array('class' => 'sub-nav');
?>
<div class="open-close2">
<a class="opener2" href="#"><span>IN THIS SECTION</span></a>
<div class="slide2">
	<?php print menu_block_links_sidebar($variables) ?>
</div>
</div>
				
<?php else:?>
<?php
    $variables = array();
    $variables['links'] = $content;
    $variables['attributes'] = array('class' => '');
 ?>
<?php print menu_block_links($variables) ?>
<?php endif;?>
