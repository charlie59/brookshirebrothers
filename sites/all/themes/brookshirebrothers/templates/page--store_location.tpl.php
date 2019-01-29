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
                    <?php
                    $frase_uno = '';
                    $frase_dos = '';
                    if ((isset($_COOKIE['defaultStore'])) && ($_COOKIE['defaultStore'] > 0)) {
                      $frase_uno = 'Store ' . $_COOKIE['defaultStore'] . ' is your Weekly Ad default (uncheck to unset)';
                    } else {
                      $frase_dos = 'Set store ' . $_GET['store'] . ' as your Weekly Ad default';
                    }
                    ?>
                    <section class="text-block">
                        <div class="field-name-body" id="weekly-ad">
                            <p><input type="checkbox" id="default_store_id"<?php
                              if ((isset($_COOKIE['defaultStore'])) && ($_COOKIE['defaultStore'] > 0)) {
                                echo ' checked="checked"> <span id="default_store_text">' . $frase_uno . '</span>';
                              } else {
                                echo '> <span id="default_store_text">' . $frase_dos . '</span>';
                              } ?></p>
                        </div>
                        <script type="text/javascript">
                          jQuery(document).ready(function () {
                            jQuery('#default_store_id').change(function () {
                              if (jQuery(this).is(':checked')) {
                                var now = new Date()
                                now.setTime(now.getTime() + 1 * 3600 * 1000 * 24 * 360 * 10)
                                document.cookie = 'defaultStore=' + "<?php echo $_GET['store']; ?>;" + ' expires=' + now.toUTCString() + '; path=/;secure;'
                                jQuery('#default_store_text').text('<?php echo $frase_uno; ?>')
                              }
                              else {
                                document.cookie = 'defaultStore=' + ';path=/;secure;'
                                jQuery('#default_store_text').text('<?php echo $frase_dos; ?>')
                              }
                            })
                          })
                        </script>
                    </section>
				</aside>
				<?php endif; ?>
			</div>
		</div>
	</div>							
	<?php include 'includes/footer.tpl.php'; ?>
</div>


