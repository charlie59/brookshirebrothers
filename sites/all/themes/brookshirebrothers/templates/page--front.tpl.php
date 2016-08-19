<?php print render($page['content']['metatags']); ?>
<div class="w2">
<?php include 'includes/nav_menu_header.tpl.php'; ?>
<div class="w1">
		<?php include 'includes/header.tpl.php'; ?>
		<div id="container">
			<?php print views_embed_view('gallery_show', 'block');?>
			<?php 
					$block = block_load('block', '2');
					$block =_block_render_blocks(array($block));
					$block =_block_get_renderable_array($block);
						print drupal_render($block);
						?>
			
			<?php //print render($page['content_top']); ?>
			
			<section class="three-col">
			<?php //print render($page['content_bottom']); ?>
				<article class="col">
					<?php 
						$block = block_load('block', '3');
						$block =_block_render_blocks(array($block));
						$block =_block_get_renderable_array($block);
							print drupal_render($block);
					?>
				</article>
				<article class="col">
					<?php
						$block = block_load('block', '4');
						$block =_block_render_blocks(array($block));
						$block =_block_get_renderable_array($block);
							print drupal_render($block);
					?>
				</article>
				<article class="col">
					<?php 
						$block = block_load('block', '5');
						$block =_block_render_blocks(array($block));
						$block =_block_get_renderable_array($block);
							print drupal_render($block);
					?>
				</article>
			</section>
		</div>  
<?php /*
      <div id="center"><div id="squeeze"><div class="right-corner"><div class="left-corner">
          <?php print $breadcrumb; ?>
          <a id="main-content"></a>
          <?php if ($tabs): ?><div id="tabs-wrapper" class="clearfix"><?php endif; ?>
          <?php print render($title_prefix); ?>
          <?php if ($title): ?>
            <h1<?php print $tabs ? ' class="with-tabs"' : '' ?>><?php print $title ?></h1>
          <?php endif; ?>
          <?php print render($title_suffix); ?>
          <?php if ($tabs): ?><?php print render($tabs); ?></div><?php endif; ?>
          <?php print render($tabs2); ?>
          <?php print $messages; ?>
          <?php print render($page['help']); ?>
          <?php if ($action_links): ?><ul class="action-links"><?php print render($action_links); ?></ul><?php endif; ?>
          <div class="clearfix">
            <?php print render($page['content']); ?>
          </div>
          <?php print $feed_icons ?>
          <?php print render($page['footer']); ?>
      </div></div></div></div> 
*/?>
</div> 
<?php include 'includes/footer.tpl.php'; ?>
</div> 
