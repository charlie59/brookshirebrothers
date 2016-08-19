<section class="text-block event-detail">
  <div class="back-events"><a href="/beverage-depot/events">&laquo; BACK TO EVENTS</a></div>
  <div class="content-wrapper">
  <div class="top-content">
    <div class="featured-image"><img src="<?php echo file_create_url($node->field_event_featured_image['und'][0]['uri']); ?>" /></div>
    <div class="title"><?php echo $node->title; ?></div>
    <div class="details"><?php echo $node->field_event_details['und'][0]['value']; ?></div>
  </div>
  <div class="main-content">
    <?php  echo $node->field_event_description['und'][0]['value']; ?>
  </div>
  <ul class="gallery">
    <?php $count=0; ?>
    <?php foreach($node->field_event_gallery_images['und'] as $image): ?>
    <li class="gallery-image<?php echo ++$count%3==0?" no-margin":"";?><?php echo $count%2==0?" even":" odd";?>"><img src="<?php echo file_create_url($image['uri']); ?>" /></li>
    <?php endforeach; ?>

    <?php
    $block = module_invoke('service_links', 'block_view', 'service_links');
    print $block['content'];
    ?>
  </ul>
  </div>
</section>

