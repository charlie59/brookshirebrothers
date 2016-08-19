<?php

/**
 * @file
 * Admin callbacks for the Quantcast module.
 */

/**
 * Implements hook_admin_settings().
 */
function quantcast_admin_settings_form() {
  // General settings.
  $form['account'] = array(
    '#type'           => 'fieldset',
    '#title'          => t('General settings'),
  );
  $form['account']['quantcast_account'] = array(
    '#type'           => 'textfield',
    '#title'          => t('Quantcast P-Code'),
    '#default_value'  => variable_get('quantcast_account', ''),
    '#required'       => TRUE,
    '#description'    => t('If you do not already have a Quantcast P-Code, please acquire it by registering at <a href="@qc_url">Quantcast.com</a>.', array('@qc_url' => 'http://www.quantcast.com/user/signup')),
  );
  // Advanced settings.
  $form['advanced'] = array(
    '#type'           => 'fieldset',
    '#title'          => t('Advanced settings'),
    '#collapsible'    => TRUE,
    '#collapsed'      => TRUE,
  );
  $form['advanced']['quantcast_js_scope'] = array(
    '#type'           => 'select',
    '#title'          => t('Javascript Scope'),
    '#description'    => t('Quantcast recommends adding its Javascript code to the footer, right before &lt;/body&gt; tag and any other measurement tags. See <a href="@qc_implementation_guide_url">Web Measurement Implementation Guide</a> for more details.', array('@qc_implementation_guide_url' => 'http://www.quantcast.com/learning-center/guides/webmeasurement')),
    '#options'        => array(
      'header'          => t('Header'),
      'footer'          => t('Footer'),
    ),
    '#default_value'  => variable_get('quantcast_js_scope', 'footer'),
  );
  $form['advanced']['quantcast_js_weight'] = array(
    '#type'           => 'weight',
    '#title'          => t('Javascript Weight'),
    '#description'    => t('Quantcast recommends adding its Javascript code before any other measurement tags in page footer. View the source of your page after providing your P-Code above and make sure to set appropriate weight here so that Quantcast code is included before for example Google Analytics code.'),
    '#default_value'  => variable_get('quantcast_js_weight', 0),
  );
  return system_settings_form($form);
}
