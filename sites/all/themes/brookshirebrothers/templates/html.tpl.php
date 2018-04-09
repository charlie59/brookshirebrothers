<?php if (isset($_GET['ajax']) and $_GET['ajax'] == 1): ?>
  <?php
  $weekly_ad_array = [];
  if (isset($_GET['weeklyad']) and $_GET['weeklyad'] == "true") {
    $weekly_ad = db_query("SELECT DISTINCT entity_id as field_store_association_nid from field_data_field_weekly_ad INNER JOIN node ON field_data_field_weekly_ad.entity_id=node.nid where field_weekly_ad_value=1");
    foreach ($weekly_ad as $record) {
      $weekly_ad_array[] = $record->field_store_association_nid;
    }
  } ?>
  <?php header('Content-Type: application/json; charset=utf-8'); ?>
  <?php $results = entity_load_by_type('node', 'store_location'); ?>
  <?php $i = 0; ?>
    <script type="text/javascript">
        var locationCoordinates = [
          <?php foreach($results as $resul) {?>
          <?php if(($_GET['weeklyad'] != "true") || ($_GET['weeklyad'] == "true" && in_array($resul->nid, $weekly_ad_array)))
          { ?>
          <?php if (isset($resul->field_weekly_ad_association)) $node_week = node_load ($resul->field_weekly_ad_association['und'][0]['nid']); ?>
            {
                type: "FeatureCollection",
                features: [{
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: "<?php echo $resul->field_latitude['und'][0]['value'];?>, <?php echo $resul->field_longitude['und'][0]['value'];?>"
                    },
                    properties: {
                        title: "<?php print $resul->field_display_title['und'][0]['value'];?>",
                        address: "<?php print $resul->gsl_addressfield['und'][0]['thoroughfare'];?>",
                        locality: " <?php print $resul->gsl_addressfield['und'][0]['locality'];?>, <?php print $resul->gsl_addressfield['und'][0]['administrative_area'];?> <span><?php print $resul->gsl_addressfield['und'][0]['postal_code'];?></span>",
                        tel: "<?php print $resul->field_store_phone['und'][0]['value'];?>",
                        hrefad: "<?php if (isset($node_week)) echo
                          $node_week->field_upload_the_pdf['und'][0]['filename'];?>",
                        hrefdetails: "<?php print drupal_get_path_alias('node/' . $resul->nid);?>",
                    },
                    keywords: "<?php if (isset($resul->field_department['und'][0])): foreach($resul->field_department['und'] as $term_id): $term = taxonomy_term_load($term_id['tid']);?> <?php echo $term->name;?>,<?php endforeach; ?><?php foreach($resul->field_specification['und'] as $term_id): $term = taxonomy_term_load($term_id['tid']);?> <?php echo $term->name;?>,<?php endforeach; ?><?php endif; ?><?php if (isset($resul->field_locations['und'][0])): foreach($resul->field_locations['und'] as $term_id): $term = taxonomy_term_load($term_id['tid']);?> <?php echo $term->name;?>,<?php endforeach; ?><?php endif; ?>"
                }]
            }<?php if (++$i != count($results)) { ?><?php echo ','; ?><?php }}}?>]
    </script>
<?php else: ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <meta name="format-detection" content="telephone=no">
      <?php print $head; ?>
        <title><?php print $head_title; ?></title>
        <script type="text/javascript">
            var pathInfo = {
                base: '<?php echo url(path_to_theme(), ['absolute' => TRUE]); ?>',
                css: 'css/',
                js: 'js/',
                swf: 'swf/',
            }
        </script>
        <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,600,700,900,400italic|Roboto+Condensed:400,300,700|Open+Sans' rel='stylesheet' type='text/css'>
      <?php print $styles; ?>
        <!--[if lt IE 9]><link rel="stylesheet" type="text/css" href="<?php echo url(path_to_theme(), ['absolute' => TRUE]); ?>/ie.css" /><![endif]-->
        <!--[if IE]><script type="text/javascript" src="<?php echo url(path_to_theme(), ['absolute' => TRUE]); ?>/js/ie.js"></script><![endif]-->
      <?php print $scripts; ?>
        <script>
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                        (i[r].q = i[r].q || []).push(arguments)
                    }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
            ga('create', 'UA-55518501-1', 'auto');
            ga('send', 'pageview');
        </script>
        <!-- Facebook Pixel Code v2 Ago 9 2017 -->
        <script>
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '289758774833297'); // Brookshire Brothers.
          fbq('track', 'PageView');
        </script>
        <noscript><img height="1" width="1" style="display:none"
                       src="https://www.facebook.com/tr?id=289758774833297&ev=PageView&noscript=1"
            /></noscript>
        <!-- DO NOT MODIFY -->
        <!-- End Facebook Pixel Code -->
    </head>
    <body class="<?php print $classes; ?>" <?php print $attributes; ?>>
    <div id="loader" class="loader" style=""></div>
    <?php if (drupal_is_front_page() == FALSE) : ?>
    <div id="wrapper">
      <?php else: ?>
        <div id="wrapper" class="inner">
          <?php endif; ?>
            <div id="skip-link">
                <a href="#main-content" class="element-invisible element-focusable"><?php print t('Skip to main content'); ?></a>
            </div>
          <?php print $page_top; ?>
          <?php print $page; ?>
          <?php print $page_bottom; ?>
        </div>
        <script type="text/javascript" src="https://6311223.collect.igodigital.com/collect.js"></script>
        <script type="text/javascript">
          etmc.push(["setOrgId", "6311223"]);
          etmc.push(["trackPageView"]);
        </script>
        /* added April 9 2018 per KBrown */
        <script type="text/javascript" src="http://6235051.collect.igodigital.com/collect.js"></script>
        <script type="text/javascript">
          _etmc.push(["setOrgId", "6235051"]);
          _etmc.push(["trackPageView"]);
        </script>

        <script src="/sites/all/themes/brookshirebrothers/js/jquery.main.js"></script>
    </body>
    </html>
<?php endif; ?>

