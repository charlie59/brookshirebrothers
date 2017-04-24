<section class="text-block blog-detail">
  <div class="content-wrapper">
    <div class="post-date">
      <?php echo date("l F j, Y", $node->created); ?>
    </div>
    <div class="title">
      <?php echo filter_xss($node->title); ?>
    </div>
    <div class="body">
      <?php echo $node->body["und"][0]["safe_value"]; ?>
    </div>
    <div class="details">
        <div class="author">
          POSTED BY <a href="/blog/author/<?php echo $node->name; ?>"><?php echo $node->name; ?></a>
        </div>
        <?php if(!empty($node->field_blog_tags)): ?>
          <?php $tag_count=count($node->field_blog_tags["und"]); ?>
          <div class="tags">
            TAGS:
            <?php foreach($node->field_blog_tags["und"] as $index=>$tag):
            $term_path = drupal_get_path_alias('taxonomy/term/' . $tag["tid"]) ;
            ?>
              <a href="/<?php echo $term_path; ?>"><?php echo $tag["taxonomy_term"]->name!=""?$tag["taxonomy_term"]->name:taxonomy_term_load($tag["tid"])->name; ?><?php echo ($index+1)<$tag_count?", ":""; ?></a>
           <?php endforeach; ?>
          </div>
        <?php endif; ?>

        <?php if(!empty($node->field_blog_categories)): ?>
        <?php $category_count=count($node->field_blog_categories["und"]); ?>
          <div class="categories">
            CATEGORIES:
            <?php foreach($node->field_blog_categories["und"] as $index=>$category):
            $term_path = drupal_get_path_alias('taxonomy/term/' . $category["tid"]) ;
            ?>
              <a href="/<?php echo $term_path; ?>"><?php echo $category["taxonomy_term"]->name!=""?$category["taxonomy_term"]->name:taxonomy_term_load($category["tid"])->name; ?><?php echo ($index+1)<$category_count?", ":""; ?></a>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
    </div>
      <div class="addtoany">
        <?php print render($content['links']); ?>
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
