<?php

/**
 * Functions to update Store Locations from Salesforce
 */

class Store_Updater {

  var $mySforceConnection;

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

  function _get_fields() {

  }

  function updater() {
    $ids = $this->_get_ids();
    print_r($ids);
  }

}

function brookshirebrotherscustom_store_updater_two() {



  require_once(SOAP_CLIENT_BASEDIR . '/SforcePartnerClient.php');
  require_once(SOAP_CLIENT_BASEDIR . '/SforceHeaderOptions.php');
  require_once(SOAP_CLIENT_BASEDIR . '/SforceBaseClient.php');

  try {
    $mySforceConnection = new SforcePartnerClient();
    $mySforceConnection->createConnection(SOAP_CLIENT_BASEDIR . '/partner.wsdl.xml');
    $mySforceConnection->login(SOAP_CLIENT_USER, SOAP_CLIENT_PASSWORD);

    $ids = _get_ids($mySforceConnection);

    $fieldList = "Store_Number__c, BillingStreet, BillingCity, BillingState, BillingPostalCode, Has_Weekly_Ad__c, Allows_Rx_Transfer_and_Refills__c";
    $sObjectType = "Account";

    $response = $mySforceConnection->retrieve($fieldList, $sObjectType, $ids);
    print_r($response);


  } catch (Exception $e) {
    echo $mySforceConnection->getLastRequest();
    echo $e->faultstring;
  }
}

