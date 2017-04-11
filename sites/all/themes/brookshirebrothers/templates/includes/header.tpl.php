<header id="header">
    <div class="header-holder">
        <strong class="logo"><a href="<?php print $front_page ?>">Brookshire
                Brothers - A Celebration of Family and Community</a></strong>
        <strong class="logo-print"><img
                    src="<?php echo url(path_to_theme(), array('absolute' => TRUE)); ?>/images/logo.png"
                    alt="" width="290" height="62"></strong>

        <div id="block-search-form" style="float: right;"
             class="block block-search contextual-links-region clearfix">

            <div class="contextual-links-wrapper contextual-links-processed"><a
                        class="contextual-links-trigger" href="#">Configure</a>
                <ul class="contextual-links">
                    <li class="block-configure first last"><a
                                href="/admin/structure/block/manage/search/form/configure?destination=node/70">Configure
                            block</a></li>
                </ul>
            </div>
            <form action="/departments/bakery" method="post"
                  id="search-block-form" accept-charset="UTF-8" _lpchecked="1">
                <div>
                    <div class="container-inline">
                        <h2 class="element-invisible">Search form</h2>
                        <div class="form-item form-type-textfield form-item-search-block-form">
                            <label class="element-invisible"
                                   for="edit-search-block-form--2">Search </label>
                            <input title="Enter the terms you wish to search for."
                                   type="text" id="edit-search-block-form--2"
                                   name="search_block_form" value="" size="15"
                                   maxlength="128" class="form-text">
                        </div>
                        <div class="form-actions form-wrapper"
                             id="edit-actions"><input type="submit"
                                                      id="edit-submit" name="op"
                                                      value="Search"
                                                      class="form-submit"></div>
                        <input type="hidden" name="form_build_id"
                               value="form-PABRcuL-imX8Zn97rV-62Mea9w77AGRyMbhWhvFi_V8">
                        <input type="hidden" name="form_token"
                               value="TVZJFiDMVBfJ4yXiCpLC3HfEgCSPtXE5zvRrJdGOhBY">
                        <input type="hidden" name="form_id"
                               value="search_block_form">
                    </div>
                </div>
            </form>
        </div>
    </div>
  <?php $block = block_load('menu_block', '4');
  $block = _block_render_blocks(array($block));
  $block = _block_get_renderable_array($block);
  print drupal_render($block); ?>
  <?php //print render($page['header']); ?>
</header>