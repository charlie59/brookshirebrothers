<nav class="top-menu">
<?php 
	$block = block_load('menu_block', '1');
	$block =_block_render_blocks(array($block));
	$block =_block_get_renderable_array($block);
		print drupal_render($block);
	?>
</nav>