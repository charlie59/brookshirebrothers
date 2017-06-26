<?php if(isset($node)) $slide_page = field_get_items('node', $node, 'field_slide_page');
if(!empty($slide_page)):?>
<div class="w2 inner">
<?php else:?>
<div class="w2 inner2">
<?php endif;?>

	<?php include 'includes/nav_menu_header.tpl.php'; ?>
	<div class="w1">
			<?php include 'includes/header.tpl.php'; ?>

		<div id="main">
			
			<div class="main-holder <?php if (empty($page['sidebar_first'])): echo 'add-main-holder' ; endif;?> ">
				<section id="content" class="filter-location">
					<?php if ($tabs): ?><div id="tabs-wrapper" class="clearfix"><?php endif; ?>
					<?php if ($tabs): ?><?php print render($tabs); ?></div><?php endif; ?>
					<?php print render($tabs2); ?>
					<?php if ($action_links): ?><ul class="action-links"><?php print render($action_links); ?></ul><?php endif; ?>
					<?php print $messages; ?>
					<?php print render($page['content']); ?>
				</section>
				<?php if ($page['sidebar_first']): ?>
				<aside id="sidebar">
					
					<?php print render($page['sidebar_first']); ?>
					
				</aside>
				<?php endif; ?>
			</div>
		</div>
	</div>							
	<?php include 'includes/footer.tpl.php'; ?>
</div>


