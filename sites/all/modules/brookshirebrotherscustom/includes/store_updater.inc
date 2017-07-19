<?php

require ("store_updater.class.inc");

/**
 * Functions loads Class to update Store Locations
 */
function brookshirebrotherscustom_store_updater() {
  $store_update = new Store_Updater();
  $store_update->updater();
}

