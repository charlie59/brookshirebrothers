<?php if ($delta==2):?>
<?php
    $variables = array();
    $variables['links'] = $content;
    $variables['attributes'] = array();
	$variables['attributes'] = array('class' => 'footer_menu');
  ?>

<?php print menu_block_links($variables) ?>

<?php else:?>
  <?php
    $variables = array();
    $variables['links'] = $content;
    $variables['attributes'] = array();
  ?>

<?php print menu_block_links($variables) ?>
<?php endif;?>
