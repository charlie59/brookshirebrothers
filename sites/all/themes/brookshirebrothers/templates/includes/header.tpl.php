<header id="header">
		<div class="header-holder">
			<strong class="logo"><a href="<?php print $front_page ?>">Brookshire Brothers - A Celebration of Family and Community</a></strong>
			<strong class="logo-print"><img src="<?php echo url(path_to_theme(), array('absolute' => TRUE)); ?>/images/logo.png" alt="" width="290" height="62"></strong>
			<div class="our-company">
			<?php 
				$block = block_load('block', '1');
				$block =_block_render_blocks(array($block));
				$block =_block_get_renderable_array($block);
					print drupal_render($block);
				?>
			</div>
		</div>
		<?php $block = block_load('menu_block', '4');
		$block =_block_render_blocks(array($block));
		$block =_block_get_renderable_array($block);
			print drupal_render($block); ?>
		<?php //print render($page['header']); ?>
</header>