<?php
/*$query = new EntityFieldQuery();
$query->entityCondition('entity_type', 'node')
  ->entityCondition('bundle', 'store_location')
  ->propertyCondition('status', 1)
  ->fieldCondition('field_number_store', 'value', $_GET['store'], '=');
$result = $query->execute();
$result = $query->execute();
if (isset($result['node'])) {
  $item_nid = array_keys($result['node']);
  $item = entity_load('node', $item_nid);
  var_dump($item);
}*/
?>
<section class="text-block">
<div class="field-name-body">
    <p><input type="checkbox" id="default_store_id"<?php
      if ( (isset($_COOKIE['defaultStore'])) && ($_COOKIE['defaultStore'] > 0)) {
        echo ' checked="checked"> <span id="default_store_text">Store ' . $_COOKIE['defaultStore'] .' is your Weekly Ad default (uncheck to unset)</span>';
      }  else {
        echo '> <span id="default_store_text">Set store ' . $_COOKIE['defaultStore'] .' as your Weekly Ad default</span>';
      }

      ?></p>
</div>


    <script type="text/javascript">
        $(document).ready(function() {
            $("#default_store_id").change(function() {
                if ($(this).is(":checked")) {
                    var now = new Date();
                    now.setTime(now.getTime() + 1 * 3600 * 1000 * 24 * 360 * 10);
                    document.cookie = "defaultStore=" + "<?php echo $_GET['store']; ?>;" + " expires=" + now.toUTCString() + "; path=/;";
                    $("#default_store_text").text('Store <?php echo $_COOKIE['defaultStore']; ?> is your Weekly Ad default (uncheck to unset)');
                } else {
                    document.cookie = "defaultStore=" + ";path=/;";
                    $("#default_store_text").text('Set store <?php echo $_COOKIE['defaultStore']; ?> as your Weekly Ad default');
                }
            });
        }(jQuery));
    </script>
</section>

<iframe src="https://mydigitalpublication.com/publication/?pid=142&co=US&pc=<?php echo $_GET['store']; ?>" width="100%" height="1200px" frameborder="0"></iframe>
