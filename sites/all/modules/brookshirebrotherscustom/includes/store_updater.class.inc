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
  Phone,
  Store_Director_Formula__c,
  Store_Hours__c,
  Beverage_Depot_Location__c,
  Has_Bakery__c,
  Has_Deli__c,
  Has_Weekly_Ad__c,
  Has_Floral__c,
  Redbox__c,
  Store_Location__Latitude__s,
  Store_Location__Longitude__s,
  BB_Pharmacy__c,
  Pharmacy_Number__c,
  Pharmacist_Text__c,
  Pharmacy_State_Board_Number__c,
  Pharmacy_Phone__c,
  Pharmacy_Fax__c,
  Pharmacy_Hours__c,
  Has_Pharmacy_Drive_Thru__c,
  Offers_Flu_Shot__c,
  Has_Fuel__c,
  Fuel_Brand__c,
  BB_Tobacco_Barn__c,
  Tobacco_Barn_Number__c,
  Tobacco_Barn_Manager_Text__c,
  Tobacco_Barn_Hours__c,
  Has_Subway__c,
  Subway_Phone__c,
  Subway_Director__c,
  Has_Washateria__c,
  Washateria_Phone__c,
  Washateria_Director__c,
  Has_Car_Wash__c,
  Car_Wash_Phone__c,
  Car_Wash_Director__c,
  Has_Mr_Payroll__c,
  Mr_Payroll_Phone__c";
  var $sObjectType = "Account";

  /**
   * @var array
   */
  var $ids = [];

  /**
   * @var array
   */
  var $sfstores = [];

  /**
   * Store_Updater constructor.
   */
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

  /**
   * Retrieve ids of Salesforce Account records
   * @return array
   */
  function _get_ids() {
    $query = "Select Id from Account Where Type = 'BB Store'";
    $response = $this->mySforceConnection->query($query);
    $ids = [];
    foreach ($response->records as $object) {
      $ids[] = $object->Id[0];
    }
    return $ids;
  }

  /**
   * Retrieve field values from Salesforce
   * @return object
   */
  function _get_sfstores() {
    $sfstores = $this->mySforceConnection->retrieve($this->fieldList, $this->sObjectType, $this->ids);
    return (object) $sfstores;
  }

  function _update() {
    if (count($this->sfstores) > 0) {
      $ptr = 0;
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
          // var_dump($result['node']);
          // exit;
          if (isset($result['node'])) {
            $arr = array_values($result['node']);
            $nid = $arr[0]->nid;
            // echo $nid . "\n";
            $wrapper = entity_metadata_wrapper('node', $nid);
            $fields = explode(',', $this->fieldList);
            $wrapper->field_specification = []; // clear field_specification (Departments)
            foreach ($fields as $field) {
              $fixed = trim($field);
              $value = $object->fields->$fixed;
              // echo $fixed . ': ' . $value  . "\n";
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
                case "Phone":
                  $wrapper->field_store_phone->set($value);
                  break;
                case "Store_Director_Formula__c":
                  $wrapper->field_store_manager->set($value);
                  break;
                case "Store_Hours__c":
                  $wrapper->field_store_hours->set($value);
                  break;
                case "Has_Weekly_Ad__c":
                  $val = $value == 'true'? 1: 0;
                  $wrapper->field_weekly_ad->set($val);
                  break;
                case "Beverage_Depot_Location__c":
                  $val = $value == 'true'? 1: 0;
                  if ($val === 1) {
                    $wrapper->field_specification[] = 7; // 7 is tid for Beverage
                  }
                  $wrapper->field_beverage_depot->set($val);
                  break;
                case "Has_Bakery__c":
                  $val = $value == 'true'? 1: 0;
                  if ($val === 1) {
                    $wrapper->field_specification[] = 8; // 8 is tid for Bakery
                  }
                  $wrapper->field_bakery->set($val);
                  break;
                case "Has_Deli__c":
                  $val = $value == 'true'? 1: 0;
                  if ($val === 1) {
                    $wrapper->field_specification[] = 9; // 9 is tid for Deli
                  }
                  $wrapper->field_deli->set($val);
                  break;
                case "Has_Floral__c":
                  $val = $value == 'true'? 1: 0;
                  if ($val === 1) {
                    $wrapper->field_specification[] = 10; // 10 is tid for Floral
                  }
                  $wrapper->field_floral->set($val);
                  break;
                case "Redbox__c":
                  $val = $value == 'true'? 1: 0;
                  $wrapper->field_redbox->set($val);
                  break;
                case "Store_Location__Latitude__s":
                  $wrapper->field_latitude->set($value);
                  break;
                case "Store_Location__Longitude__s":
                  $wrapper->field_longitude->set($value);
                  break;
                case "BB_Pharmacy__c":
                  $val = $value == 'true'? 1: 0;
                  if ($val === 1) {
                    $wrapper->field_specification[] = 3; // 3 is tid for Pharmacy
                    $wrapper->field_pharmacy->set(1);
                  } else {
                    $wrapper->field_pharmacy->set(0);
                    $wrapper->field_pharmacy_number->set('');
                  }
                  break;
                case "Pharmacy_Number__c":
                  $wrapper->field_pharmacy_number->set($value);
                  break;
                case "Pharmacist_Text__c":
                  $wrapper->field_pharmacist->set($value);
                  break;
                case "Pharmacy_State_Board_Number__c":
                  $wrapper->field_state_board_number->set($value);
                  break;
                case "Pharmacy_Phone__c":
                  $wrapper->field_pharmacy_phone->set($value);
                  break;
                case "Pharmacy_Fax__c":
                  $wrapper->field_pharmacy_fax->set($value);
                  break;
                case "Pharmacy_Hours__c":
                  $wrapper->field_pharmacy_hours->set($value);
                  break;
                case "Has_Pharmacy_Drive_Thru__c":
                  $val = $value == 'true'? 1: 0;
                  if ($val === 1) {
                    $wrapper->field_specification[] = 4; // 4 is tid for Drive-Thru Pharmacy
                  }
                  $wrapper->field_drive_thru->set($val);
                  break;
                case "Offers_Flu_Shot__c":
                  $val = $value == 'true'? 1: 0;
                  if ($val === 1) {
                    $wrapper->field_specification[] = 5; // 5 is tid for Flu Shot
                  }
                  $wrapper->field_flu_shot->set($val);
                  break;
                case "Has_Fuel__c":
                  $val = $value == 'true'? 1: 0;
                  if ($val === 1) {
                    $wrapper->field_specification[] = 6; // 6 is tid for Fule
                  }
                  $wrapper->field_fuel->set($val);
                  break;
                case "Fuel_Brand__c":
                  $wrapper->field_fuel_brand->set($value);
                  break;
                case "BB_Tobacco_Barn__c":
                  $val = $value == 'true'? 1: 0;
                  $wrapper->field_tobacco_barn->set($val);
                  break;
                case "Tobacco_Barn_Number__c":
                  $wrapper->field_barn_number->set($value);
                  break;
                case "Tobacco_Barn_Manager_Text__c":
                  $wrapper->field_barn_manager->set($value);
                  break;
                case "Tobacco_Barn_Hours__c":
                  $wrapper->field_barn_hours->set($value);
                  break;
                case "Has_Subway__c":
                  $val = $value == 'true'? 1: 0;
                  $wrapper->field_tobacco_barn->set($val);
                  break;
                case "Subway_Phone__c":
                  $wrapper->field_subway_phone->set($value);
                  break;
                case "Subway_Director__c":
                  $wrapper->field_subway_director->set($value);
                  break;
                case "Has_Washateria__c":
                  $val = $value == 'true'? 1: 0;
                  $wrapper->field_washateria->set($val);
                  break;
                case "Washateria_Phone__c":
                  $wrapper->field_washateria_phone->set($value);
                  break;
                case "Washateria_Director__c":
                  $wrapper->field_washateria_director->set($value);
                  break;
                case "Has_Car_Wash__c":
                  $val = $value == 'true'? 1: 0;
                  $wrapper->field_car_wash->set($val);
                  break;
                case "Car_Wash_Phone__c":
                  $wrapper->field_car_wash_phone->set($value);
                  break;
                case "Car_Wash_Director__c":
                  $wrapper->field_car_wash_director->set($value);
                  break;
                case "Has_Mr_Payroll__c":
                  $val = $value == 'true'? 1: 0;
                  $wrapper->field_mr_payroll->set($val);
                  break;
                case "Mr_Payroll_Phone__c":
                  $wrapper->field_mr_payroll_phone->set($value);
                  break;
              }
            }
            // var_dump($wrapper->getPropertyInfo());
            $wrapper->save();
            $ptr ++;
            echo $ptr . "\n";
            flush();
          }
        }
      }
      watchdog('store_updater', "Updated  %num Store Locations", $variables = array('%num' => $ptr), $severity = WATCHDOG_NOTICE);
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

