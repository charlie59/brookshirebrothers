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
<div class="store-block">
<?php foreach ($rows as $id => $row): ?>
 <section class="even odd">
    <?php print $row; ?>
</section>

<?php endforeach; ?>
</div>
