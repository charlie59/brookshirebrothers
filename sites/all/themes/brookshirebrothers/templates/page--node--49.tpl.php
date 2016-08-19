<div class="w2">
<?php include path_to_theme().'/templates/includes/nav_menu_header.tpl.php'; ?>
<div class="w1">
		<?php include path_to_theme().'/templates/includes/header.tpl.php'; ?>
     
      <div id="main-wrapper"><div id="main" class="clearfix">
      <div id="content" class="column"><div class="section">
        
        <?php //if ($messages): ?>
          <div id="messages"><div class="section clearfix">
            <?php print $messages; ?>
          </div></div> <!-- /.section, /#messages -->
        <?php //endif; ?>
      </div></div> <!-- /.section, /#content -->
    </div></div>
          
</div> 
<?php include path_to_theme().'/templates/includes/footer.tpl.php'; ?>
</div> 