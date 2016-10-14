<?php if(isset($node)) $slide_page = field_get_items('node', $node, 'field_slide_page');
if(!empty($slide_page)):?>
<div class="w2 inner">
<?php else:?>
<div class="w2">
<?php endif;?>
	<?php include path_to_theme().'/templates/includes/nav_menu_header.tpl.php'; ?>
	<div class="w1">
		<?php include path_to_theme().'/templates/includes/header.tpl.php'; ?>
		<div id="main">
			<div class="main-holder <?php if (empty($page['sidebar_first'])): echo 'add-main-holder' ; endif;?> ">
				<section id="content" class="filter-location">
					<?php if ($tabs): ?><div id="tabs-wrapper" class="clearfix"><?php endif; ?>
					<?php if ($tabs): ?><?php print render($tabs); ?></div><?php endif; ?>
					<?php print render($tabs2); ?>
					<?php if ($action_links): ?><ul class="action-links"><?php print render($action_links); ?></ul><?php endif; ?>
					<?php print $messages; ?>
					<?php print render($page['content']); ?>
					<?php
					$month = '';
					$day = '';
					$year = '';
					$agree = false;
					if (count($_POST)) {
						$month = filter_xss($_POST['month']);
						$day = filter_xss($_POST['day']);
						$year = filter_xss($_POST['year']);
						$error = array();
						if(!$month) {
							$error[] = '* Month is a required field.';
						}
						if (!$day) {
							$error[] = '* Day is a required field.';
						}
						if (!$year) {
							$error[] = '* Year is a required field.';
						}
						if (!isset($_POST['agree'])) {
							$error[] = '* Please check the Terms Of Use.';
						} else {
							$agree = true;
						}
						if ($month && $day && $year && $agree) {
							$age = "$year-$month-$day";
							if (Age($age) >= 21) {
								setcookie('age-validated', 1, time() + (90 * 24 * 60 * 60), NULL, NULL, NULL, 1);
								drupal_goto('beverage-depot/beverage-depot');
							} else {
								drupal_goto('access-denied');
							}
						} else {
							foreach ($error as $value) {
								echo '<div class="age-val-error">' . $value . '</div>';
							}
						}
					}
					?>
					<div class="age-val-form">
					<form action="<?php echo $_SERVER['REQUEST_URI'] ?>" method="post">
						<fieldset>
							<input id="month" class="required" type="text" name="month" value="<?php echo $month ?>" maxlength="2" pattern="\d*"><input id="day" class="required" type="text" name="day" value="<?php echo $day ?>" maxlength="2" pattern="\d*"><input id="year" class="required" type="text" name="year" value="<?php echo $year ?>" maxlength="4" pattern="\d*">
							<div class="labels">
								<label for="month">MM</label><label for="day">DD</label><label for="year" class="yy">YYYY</label>
							</div>
							<div class="terms">
								<input type="checkbox" id="agree" name="agree"<?php if ($agree) echo ' checked="checked"' ?>> Check to agree with <a href="/terms-of-use">Terms of Use</a> and <a href="/privacy-policy">Privacy Policy</a>.
							</div>
							<input type="submit" value="Verify My Age" class="btn-verify">
						</fieldset>
					</form>
					</div>
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
