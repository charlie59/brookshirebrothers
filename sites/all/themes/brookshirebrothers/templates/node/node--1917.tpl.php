<?php
/**
 *
 * Weekly Ad Node
 * This file redirects legacy store links to the digital publications
 * TODO move to a preprocess function
 *
 */

if (isset($_GET['store'])) {
  $query = new EntityFieldQuery();
  $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'store_location')
    ->propertyCondition('status', 1)
    ->fieldCondition('field_number_store', 'value', $_GET['store'], '=');
  $result = $query->execute();
  $item_nid = array_keys($result['node']);
  $nid = $item_nid[0];
  $item = entity_load('node', $item_nid);
  $link = $item["$nid"]->field_weekly_ad_link['und'][0]['value'];
  ?>
    <script type="text/javascript">
      window.location.href = "<?php echo $link; ?>"
    </script>
  <?php
} else { ?>
    <script type="text/javascript">
      window.location = 'https://www.brookshirebrothers.com/store-locator?weekly-ad=true'
    </script>
<?php } ?>
