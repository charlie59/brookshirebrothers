<?php

/**
 * @file
 * Age Verification administration functions.
 */

/**
 * Form constructor for Age Verification settings.
 */
function age_verification_admin_form($form, &$form_state) {
  $form['age_verification_selected'] = array(
    '#type' => 'select',
    '#title' => t('Age Limit'),
    '#options' => array(
      662695992 => t('21'),
      631139040 => t('20'),
      599582088 => t('19'),
      568025136 => t('18'),
      536468184 => t('17'),
      504911232 => t('16'),
      473354280 => t('15'),
      441797328 => t('14'),
    ),
    '#default_value' => variable_get('age_verification_selected', ''),
    '#description' => t('Set this to the age limit you require.'),
  );
  $form['age_verification_urls'] = array(
    '#type' => 'textarea',
    '#title' => t('Relative URLs'),
    '#rows' => 3,
    '#cols' => 20,
    '#default_value' => variable_get('age_verification_urls', 'user'),
    '#description' => t('Enter the node relative urls of the pages that the age verification should ignore. In example, user or node/62 or cookie-policy. One per line.'),
  );

  $form['age_verification_description'] = array(
    '#type' => 'textarea',
    '#title' => t('Form description'),
    '#rows' => 3,
    '#cols' => 20,
    '#default_value' => variable_get('age_verification_description', ''),
    '#description' => t('Add any description information or links you want to display under the form. Links & HTML tags: are allowed.'),
  );

  $form['age_verification_user_agents'] = array(
    '#type' => 'textarea',
    '#title' => t('Search User Agents'),
    '#rows' => 3,
    '#cols' => 20,
    '#default_value' => variable_get('age_verification_user_agents', "Googlebot\nGooglebot-Mobile\nGooglebot-Image\nbingbot\nmsnbot\nslurp"),
    '#description' => '<p>' . t('Add any extra Search bots you do not want to be blocked from indexing your site. The default is Google "Googlebot" "Googlebot-Mobile" "Googlebot-Image", "Bing "bingbot", MSN "msnbot", Yahoo "slurp".') . '</p>',
  );
  return system_settings_form($form);
}
