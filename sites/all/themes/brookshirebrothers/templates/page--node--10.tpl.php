<div class="form-page">
<div class="w2">
<?php include path_to_theme().'/templates/includes/nav_menu_header.tpl.php'; ?>
    <div class="w1">
			<?php include path_to_theme().'/templates/includes/header.tpl.php'; ?>
		<div id="main">
				<div class="main-holder">
					<section id="content">
						<form action="#" class="form-block">
						<?php $display_title = field_get_items('node', $node, 'field_display_title');?>
								<h1><?php print $display_title[0]['value'];?></h1>
								<?php if ($tabs): ?><div id="tabs-wrapper" class="clearfix"><?php endif; ?>
								<?php if ($tabs): ?><?php print render($tabs); ?></div><?php endif; ?>
								<?php print render($tabs2); ?>
								<?php if ($action_links): ?><ul class="action-links"><?php print render($action_links); ?></ul><?php endif; ?>
								<?php print $messages; ?>
								<?php print render($page['content']); ?>
								<?php if ($page['content_bottom']): ?>
								<?php print render($page['content_bottom']); ?>
								<?php endif; ?>
									
						</form>
					</section>
					<?php if ($page['sidebar_first']): ?>
					<aside id="sidebar">
						<?php print render($page['sidebar_first']); ?>
					</aside>
					<?php endif; ?>
					
				</div>
		</div>
    </div> 
 
<?php include path_to_theme().'/templates/includes/footer.tpl.php'; ?>
 </div>
 </div>
