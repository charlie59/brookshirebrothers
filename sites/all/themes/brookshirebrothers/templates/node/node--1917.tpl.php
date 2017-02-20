<p><input type="checkbox" id="default_store_id"> Set this store as your default</p>


<iframe src="https://mydigitalpublication.com/publication/?pid=142&co=US&pc=<?php echo $_GET['store']; ?>" width="100%" height="1200px" frameborder="0"></iframe>

<script type="text/javascript">
    $(document).ready(function() {
        document.cookie = "defaultStore=" + "<?php echo $_GET['store']; ?>" + ";path=/;";
        alert('y');
        $("#default_store_id").change(function() {
            var d = new Date();
            var ex = new Date(d.getTime() + 30 * 24 * 3600 * 100000); // plus 3000 days
        });
    }(jQuery));
</script>