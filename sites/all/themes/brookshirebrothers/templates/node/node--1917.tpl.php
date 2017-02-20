<p><input type="checkbox" id="default_store_id"> Set this store as your default</p>


<iframe src="https://mydigitalpublication.com/publication/?pid=142&co=US&pc=<?php echo $_GET['store']; ?>" width="100%" height="1200px" frameborder="0"></iframe>

<script type="text/javascript">
    $(document).ready(function() {
        $("#default_store_id").change(function() {
            if ($(this).is(":checked")) {
                alert("checked");
                var d = new Date();
                var ex = new Date(d.getTime() + 10 * 365 * 24 * 60 * 60);
                document.cookie = "defaultStore=" + "<?php echo $_GET['store']; ?>;" + "expires=" + ex + ";path=/;";
            } else {
                alert("not checked");
                document.cookie = "defaultStore=" + ";path=/;";
            }
        });
    }(jQuery));
</script>