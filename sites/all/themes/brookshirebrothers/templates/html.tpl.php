<?php if(isset($_GET['ajax']) and $_GET['ajax'] == 1 ):?>
<?php
$weekly_ad_array=Array();
  if(isset($_GET['weeklyad']) and $_GET['weeklyad']=="true") {
		$weekly_ad = db_query("SELECT DISTINCT entity_id as field_store_association_nid from field_data_field_weekly_ad INNER JOIN node ON field_data_field_weekly_ad.entity_id=node.nid where field_weekly_ad_value=1");
		foreach ($weekly_ad as $record) {
		$weekly_ad_array[]=$record->field_store_association_nid; }
  } ?>
<?php header('Content-Type: application/json; charset=utf-8');?>
<?php $results = entity_load_by_type('node', 'store_location');?>
<?php $i=0;?>
<script type="text/javascript">
	var locationCoordinates = [
	<?php foreach($results as $resul) {?>
  <?php if(($_GET['weeklyad']!="true") || ($_GET['weeklyad']=="true" && in_array($resul->nid, $weekly_ad_array) ))
  { ?>
	<?php $node_week = node_load($resul->field_weekly_ad_association['und'][0]['nid']); ?>
	{
		type:"FeatureCollection",
		features:[{
				type:"Feature",
				geometry:{
					type:"Point",
					coordinates:"<?php echo $resul->field_latitude['und'][0]['value'];?>, <?php echo $resul->field_longitude['und'][0]['value'];?>"
				},
				properties:{
					title: "<?php print $resul->field_display_title['und'][0]['value'];?>",
					address: "<?php print $resul->gsl_addressfield['und'][0]['thoroughfare'];?>",
					locality: " <?php print $resul->gsl_addressfield['und'][0]['locality'];?>, <?php print $resul->gsl_addressfield['und'][0]['administrative_area'];?> <span><?php print $resul->gsl_addressfield['und'][0]['postal_code'];?></span>",
					tel: "<?php print $resul->field_store_phone['und'][0]['value'];?>",
					hrefad: "<?php echo $node_week->field_upload_the_pdf['und'][0]['filename'];?>",
					hrefdetails: "<?php print drupal_get_path_alias('node/'. $resul->nid);?>",
				},
				keywords: "<?php foreach($resul->field_department['und'] as $term_id): $term = taxonomy_term_load($term_id['tid']);?> <?php echo $term->name;?>,<?php endforeach; ?><?php foreach($resul->field_specification['und'] as $term_id): $term = taxonomy_term_load($term_id['tid']);?> <?php echo $term->name;?>,<?php endforeach; ?> <?php foreach($resul->field_locations['und'] as $term_id): $term = taxonomy_term_load($term_id['tid']);?> <?php echo $term->name;?>,<?php endforeach; ?>"
		}]
	}<?php if (++$i != count($results)){?><?php echo ',';?><?php }}}?>]
</script>
<?php else: ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="format-detection" content="telephone=no">
  <meta property="og:image" content="/sites/all/themes/brookshirebrothers/images/og_celebrate.png">
  <?php print $head; ?>
  <title><?php print $head_title; ?></title>
  <script type="text/javascript">
     var pathInfo = {
        base: '<?php echo url(path_to_theme(), array('absolute' => TRUE)); ?>',
        css: 'css/',
        js: 'js/',
        swf: 'swf/',
     }
  </script>
  <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,600,700,900,400italic|Roboto+Condensed:400,300,700|Open+Sans' rel='stylesheet' type='text/css'>
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
  <script type="text/javascript">window.jQuery || document.write('<script src="<?php echo url(path_to_theme(), array('absolute' => TRUE)); ?>/js/jquery-1.8.3.min.js"><\/script>')</script>
  <script type="text/javascript" src="https://maps.google.com/maps/api/js?sensor=true&libraries=geometry"></script>
  <?php print $styles; ?>
  <!--[if lt IE 9]><link rel="stylesheet" type="text/css" href="<?php echo url(path_to_theme(), array('absolute' => TRUE)); ?>/ie.css" /><![endif]-->
  <!--[if IE]><script type="text/javascript" src="<?php echo url(path_to_theme(), array('absolute' => TRUE)); ?>/js/ie.js"></script><![endif]-->
  <?php print $scripts; ?>
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	  ga('create', 'UA-55518501-1', 'auto');
	  ga('send', 'pageview');
	</script>
  <link rel="stylesheet" href="/css/app.css">
  <script src="/js/vendor/modernizr.js"></script>
</head>
<body class="<?php print $classes; ?>" <?php print $attributes;?>>
<div id="loader" class="loader" style=""></div>
<?php if (drupal_is_front_page()==false) :?>
<div id="wrapper">
<?php else:?>
<div id="wrapper" class="inner">
<?php endif;?>
  <div id="skip-link">
    <a href="#main-content" class="element-invisible element-focusable"><?php print t('Skip to main content'); ?></a>
  </div>
  <?php print $page_top; ?>
  <?php print $page; ?>
  <?php print $page_bottom; ?>
</div>
<script data-main="/js/app" src="/js/vendor/require.js"></script>
    <script type="text/javascript" src="http://6242176.collect.igodigital.com/collect.js"></script>
    <script type="text/javascript">
        _etmc.push(["setOrgId", "6242176"]);
        _etmc.push(["trackPageView"]);
    </script>
</body>
</html>
<?php endif;?>
