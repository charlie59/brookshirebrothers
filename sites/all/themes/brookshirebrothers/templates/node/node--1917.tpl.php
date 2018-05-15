<?php
/*
 * Code to get entity values -- not necessary unless we want address
$query = new EntityFieldQuery();
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
echo $_GET['store'];
exit;
if (isset($_GET['store'])) {

  $frase_uno = '';
  $frase_dos = '';
  if ((isset($_COOKIE['defaultStore'])) && ($_COOKIE['defaultStore'] > 0)) {
    $frase_uno = 'Store ' . $_COOKIE['defaultStore'] . ' is your Weekly Ad default (uncheck to unset)';
  } else {
    $frase_dos = 'Set store ' . $_GET['store'] . ' as your Weekly Ad default';
  }

  ?>
    <section class="text-block">
        <div class="field-name-body" id="weekly-ad">
            <p><input type="checkbox" id="default_store_id"<?php
              if ((isset($_COOKIE['defaultStore'])) && ($_COOKIE['defaultStore'] > 0)) {
                echo ' checked="checked"> <span id="default_store_text">' . $frase_uno . '</span>';
              }
              else {
                echo '> <span id="default_store_text">' . $frase_dos . '</span>';
              }

              ?></p>
        </div>


        <script type="text/javascript">
          jQuery(document).ready(function () {
            jQuery("#default_store_id").change(function () {
              if (jQuery(this).is(":checked")) {
                var now = new Date();
                now.setTime(now.getTime() + 1 * 3600 * 1000 * 24 * 360 * 10);
                document.cookie = "defaultStore=" + "<?php echo $_GET['store']; ?>;" + " expires=" + now.toUTCString() + "; path=/;secure;";
                jQuery("#default_store_text").text('<?php echo $frase_uno; ?>');
              }
              else {
                document.cookie = "defaultStore=" + ";path=/;secure;";
                jQuery("#default_store_text").text('<?php echo $frase_dos; ?>');
              }
            });
          });
        </script>
    </section>

    <iframe src="https://mydigitalpublication.com/publication/?pid=142&co=US&pc=<?php echo $_GET['store']; ?>"
            width="100%" height="1200px" frameborder="0"></iframe>

<?php
} else { ?>
<script type="text/javascript">
  window.location = "https://www.brookshirebrothers.com/store-locator?weekly-ad=true";
</script>
<?php } ?>
