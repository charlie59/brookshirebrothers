<?php

/**
 * @file
 * Default simple view template to display a list of rows.
 *
 * @ingroup views_templates
 */
?>

<?php if (!empty($title)): ?>
  <h3><?php print $title; ?></h3>
<?php endif; ?>
<?php $count=0; ?>
<?php foreach ($rows as $id => $row): ?>
  <div class="<?php print $classes_array[$id]?$classes_array[$id]:""; ?> <?php print ++$count%3==0?" no-margin":"";  ?> ">
    <?php print $row; ?>
  </div>
<?php endforeach; ?>