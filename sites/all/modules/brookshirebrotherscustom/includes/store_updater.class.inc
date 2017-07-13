<?php

/**
 * Functions to update Store Locations from Salesforce
 */

class Store_Updater {

  var $mySforceConnection;
  var $fieldList = "Store_Number__c,
  Name,
  BillingStreet,
  BillingCity,
  BillingState,
  BillingPostalCode,
  Pharmacy_Number__c,
  Has_Weekly_Ad__c,
  Allows_Rx_Transfer_and_Refills__c";
  var $sObjectType = "Account";

  var $ids = [];
  var $sfstores = [];


  function __construct() {

    require_once (SOAP_CLIENT_BASEDIR.'/SforcePartnerClient.php');
    require_once (SOAP_CLIENT_BASEDIR.'/SforceHeaderOptions.php');
    require_once (SOAP_CLIENT_BASEDIR.'/SforceBaseClient.php');

    try {
      $this->mySforceConnection = new SforcePartnerClient();
      $this->mySforceConnection->createConnection(SOAP_CLIENT_BASEDIR.'/partner.wsdl.xml');
      $this->mySforceConnection->login(SOAP_CLIENT_USER, SOAP_CLIENT_PASSWORD);
    } catch (Exception $e) {
      echo $this->mySforceConnection->getLastRequest();
      echo $e->faultstring;
    }

  }

  function _get_ids() {
    $query = "Select Id from Account Where Type = 'BB Store'";
    $response = $this->mySforceConnection->query($query);
    $ids = [];
    foreach ($response->records as $object) {
      $ids[] = $object->Id[0];
    }
    return $ids;
  }

  function _get_sfstores() {
    $sfstores = $this->mySforceConnection->retrieve($this->fieldList, $this->sObjectType, $this->ids);
    return $sfstores;
  }

  function _update() {
    if (count($this->sfstores) > 0) {
      foreach ($this->sfstores as $object) {
        // echo $object->fields->Store_Number__c . " ";
        $store_number = $object->fields->Store_Number__c;
        if (!empty($store_number)) {
          $query = new EntityFieldQuery;
          $result = $query
            ->entityCondition('entity_type', 'node')
            ->entityCondition('bundle', 'store_location')
            ->fieldCondition('field_number_store', 'value', $store_number, '=')
            ->execute();
          $arr = array_values($result['node']);
          $nid = $arr[0]->nid;
          $vid = $arr[0]->vid;
          echo $nid . " ";
          $node = node_load($nid, $vid);
          // print_r($node);
          $field_number_store = $node->field_number_store['und'][0]['value'];
          // echo $field_number_store . "\n";

          // update on match
          if ($field_number_store === $store_number) {

            // echo $field_number_store . " matched!\n";
            $wrapper = entity_metadata_wrapper('node', $nid);
            $fields = explode(',', $this->fieldList);
            $wrapper->field_specification = []; // clear field_specification (Departments)

            foreach ($fields as $field) {
              $fixed = trim($field);
              $value = $object->fields->$fixed;
              echo $value  . "\n";
              switch ($fixed) {
                case "Name":
                  $wrapper->field_display_title->set($value);
                  $wrapper->field_store_name->set($value);
                  /* taxonomies */
                  if ($foo = taxonomy_get_term_by_name($fixed)) {
                    $foo_keys = array_keys($foo);
                    $wrapper->field_department->set($foo_keys[0]);
                    $wrapper->field_locations->set($foo_keys[0]);
                  }
                  break;
                case "BillingStreet":
                  $wrapper->gsl_addressfield->thoroughfare->set($value);
                  break;
                case "BillingCity":
                  $wrapper->gsl_addressfield->locality->set($value);
                  break;
                case "BillingState":
                  $wrapper->gsl_addressfield->administrative_area->set($value);
                  break;
                case "BillingPostalCode":
                  $wrapper->gsl_addressfield->postal_code->set($value);
                  break;
                case "Pharmacy_Number__c":
                  /*
                   * If the Pharmacy Number is not 0 these fields must be set
                   * field_specification (multiple select from taxonomy)
                   * field_pharmacy (boolean)
                   * field_pharmacy_number
                   */
                  if (!empty($value)) {
                    $wrapper->field_specification[] = 3;
                    $wrapper->field_pharmacy->set(1);
                    $wrapper->field_pharmacy_number->set($value);
                  } else {
                    $wrapper->field_pharmacy->set(0);
                    $wrapper->field_pharmacy_number->set('');
                  }

                case "Has_Weekly_Ad__c":
                  $val = $value == 'true'? 1: 0;
                  $wrapper->field_weekly_ad->set($val);

              }
            }
            // var_dump($wrapper->getPropertyInfo());
            $wrapper->save();
            exit;
          }
        }
      }
    }
  }


  /**
   * Main function
   */
  function updater() {
    $this->ids = $this->_get_ids();
    $this->sfstores = $this->_get_sfstores();
    $this->_update();
  }

}

