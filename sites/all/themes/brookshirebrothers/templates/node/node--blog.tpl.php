<section class="text-block blog-detail">
  <div class="content-wrapper">
    <div class="post-date">
      <?php echo date("l F j, Y", $node->created); ?>
    </div>
    <div class="title">
      <?php echo $node->title; ?>test
    </div>
    <div class="body">
      <?php echo $node->body["und"][0]["safe_value"]; ?>
    </div>
    <div class="details">
      <div class="align-left">
        <div class="author">
          POSTED BY <a href="/blog/author/<?php echo $node->name; ?>"><?php echo $node->name; ?></a>
        </div>
        <?php if(!empty($node->field_blog_tags)): ?>
          <?php $tag_count=count($node->field_blog_tags["und"]); ?>
          <div class="tags">
            TAGS:
            <?php foreach($node->field_blog_tags["und"] as $index=>$tag): ?>
              <a href="/blog/tag/<?php echo !empty($tag["taxonomy_term"]->name)?$tag["taxonomy_term"]->name:taxonomy_term_load($tag["tid"])->name; ?>"><?php echo $tag["taxonomy_term"]->name!=""?$tag["taxonomy_term"]->name:taxonomy_term_load($tag["tid"])->name; ?><?php echo ($index+1)<$tag_count?", ":""; ?></a>
           <?php endforeach; ?>
          </div>
        <?php endif; ?>

        <?php if(!empty($node->field_blog_categories)): ?>
        <?php $category_count=count($node->field_blog_categories["und"]); ?>
          <div class="categories">
            CATEGORIES:
            <?php foreach($node->field_blog_categories["und"] as $index=>$category): ?>
              <a href="/blog/category/<?php echo !empty($category["taxonomy_term"]->name)?$category["taxonomy_term"]->name:taxonomy_term_load($category["tid"])->name; ?>"><?php echo $category["taxonomy_term"]->name!=""?$category["taxonomy_term"]->name:taxonomy_term_load($category["tid"])->name; ?><?php echo ($index+1)<$category_count?", ":""; ?></a>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>

      <div class="align-right">
        <?php
        $block = module_invoke('service_links', 'block_view', 'service_links');
        print $block['content'];
        ?>
      </div>

    </div>
  </div>

  <?php print render($content["comments"]); ?>
</section>
<script type="text/javascript">
  $(function() {
  $("#comments #comment-form .form-item-name input").attr("placeholder","Your name (required)");
  $("#comments #comment-form .form-item-mail input").attr("placeholder","Your email address (required)");
  $("#comments #comment-form .field-name-comment-body textarea").attr("placeholder","Type your comment here ...");

	$('[placeholder]').focus(function() {
		var input = $(this);
		if (input.val() == input.attr('placeholder')) {
			input.val('');
			input.removeClass('placeholder');
		}
	}).blur(function() {
		var input = $(this);
		if (input.val() == '' || input.val() == input.attr('placeholder')) {
			input.addClass('placeholder');
			input.val(input.attr('placeholder'));
		}
	}).blur();
	$('[placeholder]').parents('form').submit(function() {
		$(this).find('[placeholder]').each(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
			}
		})
	});
});
</script>