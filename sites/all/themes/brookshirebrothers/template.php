<?php
/**
 * Return a themed breadcrumb trail.
 *
 * @param $breadcrumb
 *   An array containing the breadcrumb links.
 *
 * @return a string containing the breadcrumb output.
 */
function brookshirebrothers_breadcrumb($variables) {
  $breadcrumb = $variables['breadcrumb'];

  if (!empty($breadcrumb)) {
    // Provide a navigational heading to give context for breadcrumb links to
    // screen-reader users. Make the heading invisible with .element-invisible.
    $output = '<h2 class="element-invisible">' . t('You are here') . '</h2>';

    $output .= '<div class="breadcrumb">' . implode(' › ', $breadcrumb) . '</div>';
    return $output;
  }
}

function brookshirebrothers_preprocess_html(&$vars) {
 //
}

/**
 * Override or insert variables into the page template.
 */
function brookshirebrothers_preprocess_page(&$vars) {
  if (isset($vars['node'])) {
    $vars['theme_hook_suggestions'][] = 'page__' . str_replace('_', '--', $vars['node']->type);
  }
  $vars['tabs2'] = [
    '#theme' => 'menu_local_tasks',
    '#secondary' => $vars['tabs']['#secondary'],
  ];
  unset($vars['tabs']['#secondary']);

  if (isset($vars['main_menu'])) {
    $vars['primary_nav'] = theme('links__system_main_menu', [
      'links' => $vars['main_menu'],
      'attributes' => [
        'class' => ['links', 'inline', 'main-menu'],
      ],
      'heading' => [
        'text' => t('Main menu'),
        'level' => 'h2',
        'class' => ['element-invisible'],
      ],
    ]);
  }
  else {
    $vars['primary_nav'] = FALSE;
  }
  if (isset($vars['secondary_menu'])) {
    $vars['secondary_nav'] = theme('links__system_secondary_menu', [
      'links' => $vars['secondary_menu'],
      'attributes' => [
        'class' => ['links', 'inline', 'secondary-menu'],
      ],
      'heading' => [
        'text' => t('Secondary menu'),
        'level' => 'h2',
        'class' => ['element-invisible'],
      ],
    ]);
  }
  else {
    $vars['secondary_nav'] = FALSE;
  }

  // Prepare header.
  $site_fields = [];
  if (!empty($vars['site_name'])) {
    $site_fields[] = $vars['site_name'];
  }
  if (!empty($vars['site_slogan'])) {
    $site_fields[] = $vars['site_slogan'];
  }
  $vars['site_title'] = implode(' ', $site_fields);
  if (!empty($site_fields)) {
    $site_fields[0] = '<span>' . $site_fields[0] . '</span>';
  }
  $vars['site_html'] = implode(' ', $site_fields);

  // Set a variable for the site name title and logo alt attributes text.
  $slogan_text = $vars['site_slogan'];
  $site_name_text = $vars['site_name'];
  $vars['site_name_and_slogan'] = $site_name_text . ' ' . $slogan_text;

  // set pharmacy var for store locator
  if (arg(1) == '46') {

    // set var for maps api key
    global $conf;
    $vars['google_maps_api_key'] = $conf['google_maps_api_key'];

    if (isset($_GET['pharmacy']) && $_GET['pharmacy'] == "true") {
      $vars['pharmacy'] = $_GET['pharmacy'];
    }
  }

  /* Add choozle pixel */
  $ru = request_uri();
  $arr = ['/', '/anywhere'];
  if (in_array($ru, $arr)) {
    drupal_add_js('//nexus.ensighten.com/choozle/5204/Bootstrap.js', 'external');
  }

}

/**
 * Override or insert variables into the node template.
 */
function brookshirebrothers_preprocess_node(&$vars) {
  $vars['submitted'] = $vars['date'] . ' — ' . $vars['name'];
}

/**
 * Override or insert variables into the comment template.
 */
function brookshirebrothers_preprocess_comment(&$vars) {
  $vars['submitted'] = $vars['created'] . ' — ' . $vars['author'];
}

/**
 * Override or insert variables into the block template.
 */
function brookshirebrothers_preprocess_block(&$vars) {
  $vars['title_attributes_array']['class'][] = 'title';
  $vars['classes_array'][] = 'clearfix';
}

/**
 * Override or insert variables into the region template.
 */
function brookshirebrothers_preprocess_region(&$vars) {
  if ($vars['region'] == 'header') {
    $vars['classes_array'][] = 'clearfix';
  }
}

/**
 * Styles the menu for a Menu Block module. This function is called inside
 * templates/menu-block-wrapper.tpl.php
 */
function l1($text, $path, $myclass1, array $options = []) {
  global $language_url;
  static $use_theme = NULL;

  // Merge in defaults.
  $options += [
    'attributes' => [],
    'html' => FALSE,
  ];

  // Append active class.
  if (($path == $_GET['q'] || ($path == '<front>' && drupal_is_front_page())) &&
    (empty($options['language']) || $options['language']->language == $language_url->language)
  ) {
    $options['attributes']['class'][] = 'active';
  }

  if (isset($options['attributes']['title']) && strpos($options['attributes']['title'], '<') !== FALSE) {
    $options['attributes']['title'] = strip_tags($options['attributes']['title']);
  }

  if (!isset($use_theme) && function_exists('theme')) {
    // Allow edge cases to prevent theme initialization and force inline link
    // rendering.
    if (variable_get('theme_link', TRUE)) {
      drupal_theme_initialize();
      $registry = theme_get_registry(FALSE);

      $use_theme = !isset($registry['link']['function']) || ($registry['link']['function'] != 'theme_link');
      $use_theme = $use_theme || !empty($registry['link']['preprocess functions']) || !empty($registry['link']['process functions']) || !empty($registry['link']['includes']);
    }
    else {
      $use_theme = FALSE;
    }
  }
  if ($use_theme) {
    return theme('link', [
      'text' => $text,
      'path' => $path,
      'options' => $options,
    ]);
  }
  if ($myclass1 == 'mark pos3') {
    return '<a class="btn-lightbox" href="#popup1"><span>' . ($options['html'] ? $text : check_plain($text)) . '</span></a>';
  }
  else {
    return '<a href="' . check_plain(url($path, $options)) . '"' . drupal_attributes($options['attributes']) . '><span>' . ($options['html'] ? $text : check_plain($text)) . '</span></a>';
  }
}

/**
 * @param $variables
 * @param int $level
 *
 * @return string
 */
function menu_block_links($variables, $level = 1) {
  $links = $variables['links'];
  $attributes = $variables['attributes'];
  array_pop($links);
  array_pop($links);
  global $language_url;
  $output = '';
  if (!empty($links)) {
    $output .= '<ul' . drupal_attributes($attributes) . '>';
    $num_links = count($links);
    foreach ($links as $link) {
      $class = $link['#attributes']['class'];
      if (count($class)) {
        $class = ' class="' . implode(' ', $class) . '"';
      }
      else {
        $class = '';
      }
      $output .= '<li' . $class . '>';
      if (isset($link['#href'])) {
        $output .= l($link['#title'], $link['#href'], $link);
      }
      $children = $link['#below'];
      if (count($children)) {
        $level++;
        $vars = [];
        $vars['links'] = $children;
        $vars['attributes'] = ['class' => 'level-' . $level];
        $output .= menu_block_links($vars, $level);
        $level--;
      }
      $output .= "</li>\n";
    }
    $output .= '</ul>';
  }
  return $output;
}

/**
 * @param $variables
 * @param int $level
 *
 * @return string
 */
function menu_block_links_main($variables, $level = 1) {
  $links = $variables['links'];
  $attributes = $variables['attributes'];
  array_pop($links);
  array_pop($links);
  global $language_url;
  $output = '';
  if (!empty($links)) {
    if ($level == 2) {
      $output .= '<div class="dropdown"><ul' . drupal_attributes($attributes) . '>';
    }
    else {
      $output .= '<ul' . drupal_attributes($attributes) . '>';
    }
    $num_links = count($links);
    foreach ($links as $link) {
      $class = $link['#attributes']['class'];
      if (count($class)) {
        $class = ' class="' . implode(' ', $class) . '"';
      }
      else {
        $class = '';
      }
      $output .= '<li' . $class . '>';
      if (isset($link['#href'])) {
        $output .= l1($link['#title'], $link['#href'], $link);
      }

      /*if ($link['#original_link']['menu_name'] == 'main-menu' and $level == 1 and !empty ($link['#localized_options']['attributes']['title'])){
          $output .=  '<div class="img-holder">'.$link['#localized_options']['attributes']['title'].'</div>';
       }*/
      $children = $link['#below'];
      if (count($children)) {
        $level++;
        $vars = [];
        $vars['links'] = $children;

        if ($level == 2) {

          $vars['attributes'] = ['class' => 'alt level-' . $level];
        }
        else {
          $vars['attributes'] = ['class' => 'level-' . $level];
        }

        $output .= menu_block_links_main($vars, $level);
        $level--;
      }
      $output .= "</li>\n";
    }
    if ($level == 2) {
      $output .= '</ul></div>';
    }
    else {
      $output .= '</ul>';
    }
  }
  return $output;
}

/**
 * @param $variables
 * @param int $level
 *
 * @return string
 */
function menu_block_links_sidebar($variables, $level = 1) {
  $links = $variables['links'];
  $attributes = $variables['attributes'];
  array_pop($links);
  array_pop($links);
  global $language_url;
  $output = '';
  if (!empty($links)) {
    $output .= '<ul' . drupal_attributes($attributes) . '>';
    $num_links = count($links);
    foreach ($links as $link) {
      $class = $link['#attributes']['class'];
      if (count($class)) {
        $class = ' class="' . implode(' ', $class) . '"';
      }
      else {
        $class = '';
      }
      $output .= '<li' . $class . '>';
      if (isset($link['#href'])) {
        $output .= l($link['#title'], $link['#href'], $link);
      }
      $children = $link['#below'];
      if (count($children)) {
        $level++;
        $vars = [];
        $vars['links'] = $children;
        $vars['attributes'] = ['class' => 'inner-nav ' . $level];
        $output .= menu_block_links_sidebar($vars, $level);
        $level--;
      }
      $output .= "</li>\n";
    }
    $output .= '</ul>';
  }
  return $output;
}


/**
 * @param $entity_type
 * @param $bundle
 *
 * @return bool
 */
function entity_load_by_type($entity_type, $bundle) {
  global $language;
  $query = new EntityFieldQuery();
  $query->entityCondition('entity_type', $entity_type)
    ->entityCondition('bundle', $bundle);
  $results = $query->execute();
  if (!empty($results['node'])) {
    $nids = array_keys($results['node']);
    $nodes = entity_load($entity_type, $nids);
    return $nodes;
  }
  else {
    return FALSE;
  }
}

/**
 * @param string $date
 *
 * @return int
 */
function Age($date = 'now') {
  return intval(substr(date('Ymd') - date('Ymd', strtotime($date)), 0, -4));
}

/**
 * @param $vars
 */
function brookshirebrothers_preprocess_views_view(&$vars) {
  $view = $vars['view'];

  // Load the blog.js javascript file when showing the Blog view's page display.
  if ($view->name == 'webisodes_archive' || 'webisodes_amy' || 'webisodes_sarah' || 'webisodes_uncorked' && $view->current_display == 'page') {
    global $theme;
    drupal_add_js(drupal_get_path('theme', $theme) . '/js/active-player.js');
  }
}

/**
 * @param $form
 * @param $form_state
 * @param $form_id
 */
function brookshirebrothers_node_submit($node, $form, &$form_state) {
  dsm($form);
  dsm($node);
}