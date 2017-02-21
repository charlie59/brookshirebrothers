<section class="text-block">
<div class="field-name-body">
    <p><?php

      if ( (isset($_COOKIE['defaultStore'])) && ($_COOKIE['defaultStore'] > 0)) {
        echo 'This store is your default (uncheck to unset) <input type="checkbox" id="default_store_id" checked="checked">';
      }  else {
        echo 'Set this store as your default <input type="checkbox" id="default_store_id" checked="">';
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
                } else {
                    document.cookie = "defaultStore=" + ";path=/;";
                }
            });
        }(jQuery));
    </script>
</section>

<iframe src="https://mydigitalpublication.com/publication/?pid=142&co=US&pc=<?php echo $_GET['store']; ?>" width="100%" height="1200px" frameborder="0"></iframe>
