<footer id="footer">
	<div class="footer-holder">
		<div class="list-holder">
			<?php
				$block = block_load('menu_block', '2');
				$block =_block_render_blocks(array($block));
				$block =_block_get_renderable_array($block);
				print drupal_render($block);
			?>
			<?php
				$block = block_load('menu_block', '3');
				$block =_block_render_blocks(array($block));
				$block =_block_get_renderable_array($block);
				print drupal_render($block);
			?>
		</div>
		<?php
			 $block = block_load('block', '6');
			 $block =_block_render_blocks(array($block));
			 $block =_block_get_renderable_array($block);
			 print drupal_render($block);
		?>
        <div class="our-company">
      <?php
      $block = block_load('block', '1');
      $block =_block_render_blocks(array($block));
      $block =_block_get_renderable_array($block);
      print drupal_render($block);
      ?>
        </div>
	</div>
	<div class="footer-legal">
		<strong>&copy; <?php echo date("Y") ?> Copyright Brookshire Brothers, Inc. All rights reserved.</strong><br>
		Certain activities provided via the website may be covered by U.S. Patent 5,930,474.
	</div>
	<?php //print render($page['footer']); ?>
</footer>
