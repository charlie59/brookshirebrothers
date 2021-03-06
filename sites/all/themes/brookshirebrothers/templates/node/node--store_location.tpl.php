<?php
// dpm ($node);
/* is this a stand alone Tobacco Barn? */
if (($node->field_tobacco_barn['und'][0]['value'] == 1) && (count($node->field_department) == 0)) {
  $hours = isset($node->field_barn_hours['und'][0]['value']) ? $node->field_barn_hours['und'][0]['value'] : "";
  $manager = isset($node->field_barn_manager['und'][0]['value']) ? $node->field_barn_manager['und'][0]['value'] : "";
} else {
  $hours = isset($node->field_store_hours['und'][0]['value']) ? $node->field_store_hours['und'][0]['value'] : "";
  $manager = isset($node->field_store_manager['und'][0]['value']) ? $node->field_store_manager['und'][0]['value'] : "";
}
$phone = isset($node->field_store_phone['und'][0]['value']) ? $node->field_store_phone['und'][0]['value'] : "";
?>

<h1><?php print t('Store Details'); ?></h1>
<section class="store-section google-map-holder">
    <div class="store-info">
      <?php if (!empty($node->gsl_addressfield)): ?>
          <address class="address">
            <?php if (isset($node->field_display_title['und'][0]['value'])): ?>
              <?php echo $node->field_display_title['und'][0]['value']; ?><br/>
            <?php endif; ?>
            <?php echo $node->gsl_addressfield['und'][0]['thoroughfare']; ?><br/>
            <?php echo $node->gsl_addressfield['und'][0]['locality']; ?>,
            <?php echo $node->gsl_addressfield['und'][0]['administrative_area']; ?>
            <?php echo $node->gsl_addressfield['und'][0]['postal_code']; ?>
          </address>
      <?php endif; ?>
        <div class="box">
          <?php if ($node->field_weekly_ad['und'][0]['value'] == 1): ?>
              <a href="<?php echo $node->field_weekly_ad_link['und'][0]['value']; ?>" target="_blank"
                 class="btn-weekly">Weekly Ad</a>
          <?php endif; ?>
          <?php if (isset($node->field_prescription_refill_link['und'][0]['value'])): ?>
              <a href="<?php echo $node->field_prescription_refill_link['und'][0]['value']; ?>"
                 target="_blank" class="btn-refill">Refill Prescription</a>
          <?php endif;
          $map_link = 'https://www.google.com/maps/search/?api=1&query=' . urlencode($node->gsl_addressfield['und'][0]['thoroughfare'] . ', ' .
              $node->gsl_addressfield['und'][0]['locality'] . ' '
              . $node->gsl_addressfield['und'][0]['administrative_area'] . ' '
              . $node->gsl_addressfield['und'][0]['postal_code']);
          ?>
            <a href="<?php echo $map_link; ?>" target="_blank"" class="btn-map">Map</a>
            <!--<a class="map-box" href="<?php echo $map_link; ?>" target="_blank"><span class="map-txt">Map</span><img
                        src="/sites/all/themes/brookshirebrothers/images/map-img1.jpg"
                        alt=""></a>-->
        </div>
    </div>
    <!-- store -->
    <div class="detail-box">
        <strong class="title"><?php print t('STORE'); ?></strong>
        <dl>
          <?php if (isset($node->field_store_name['und'][0]['value'])): ?>
              <dt><?php print t('Store Name:'); ?></dt>
              <dd><?php echo $node->field_store_name['und'][0]['value']; ?></dd>
          <?php endif; ?>
          <?php if (!empty($hours)): ?>
              <dt><?php print t('Store Hours:'); ?></dt>
              <dd><?php echo $hours; ?></dd>
          <?php endif; ?>
          <?php if (!empty($manager)): ?>
              <dt><?php print t('Store Manager:'); ?></dt>
              <dd><?php echo $manager; ?></dd>
          <?php endif; ?>
          <?php if (!empty($phone)): ?>
              <dt class="tel-txt"><?php print t('Phone:'); ?></dt>
              <dd><a class="tel" href="tel:<?php echo $phone; ?>"><?php echo $phone; ?></a>
              </dd>
          <?php endif; ?>
        </dl>
    </div>
    <!-- features -->
    <div class="detail-box">
        <strong class="title"><?php print t('FEATURES'); ?></strong>
        <dl>
          <?php if ($node->field_pharmacy['und'][0]['value'] == 1): ?>
              <dt><?php print t('Pharmacy:'); ?></dt>
              <dd>√</dd>
          <?php endif; ?>
          <?php if ($node->field_drive_thru['und'][0]['value'] == 1): ?>
              <dt><?php print t('Drive-Thru Pharmacy:'); ?></dt>
              <dd>√</dd>
          <?php endif; ?>
          <?php if ($node->field_flu_shot['und'][0]['value'] == 1): ?>
              <dt><?php print t('Offers Flu Shot:'); ?></dt>
              <dd>√</dd>
          <?php endif; ?>
          <?php if ($node->field_beverage_depot['und'][0]['value'] == 1): ?>
              <dt><?php print t('Beverage Depot:'); ?></dt>
              <dd>√</dd>
          <?php endif; ?>
          <?php if ($node->field_bakery['und'][0]['value'] == 1): ?>
              <dt><?php print t('Bakery:'); ?></dt>
              <dd>√</dd>
          <?php endif; ?>
          <?php if ($node->field_deli['und'][0]['value'] == 1): ?>
              <dt><?php print t('Deli:'); ?></dt>
              <dd>√</dd>
          <?php endif; ?>
          <?php if ($node->field_floral['und'][0]['value'] == 1): ?>
              <dt><?php print t('Floral:'); ?></dt>
              <dd>√</dd>
          <?php endif; ?>
          <?php if (isset($node->field_bissell_rental) && $node->field_bissell_rental['und'][0]['value'] == 1): ?>
              <dt><?php print t('Bissell Rental:'); ?></dt>
              <dd>√</dd>
          <?php endif; ?>
          <?php if (isset($node->field_redbox) && $node->field_redbox['und'][0]['value'] == 1): ?>
              <dt><?php print t('Redbox:'); ?></dt>
              <dd>√</dd>
          <?php endif; ?>
        </dl>
      <?php if ((!empty($node->field_bbros_text_signup__c['und'][0]['value'])) || (!empty($node->field_tbarn_text_signup__c['und'][0]['value']))): ?>
          <p>
            <?php if (!empty($node->field_bbros_text_signup__c['und'][0]['value'])): ?>
              <?php print t('To sign up to Brookshire Brothers Promo Alerts: '); ?>
              <?php print $node->field_bbros_text_signup__c['und'][0]['value']; ?>
            <?php endif; ?>
            <?php if (!empty($node->field_tbarn_text_signup__c['und'][0]['value'])): ?>
                <br/>
              <?php print t('To sign up to Tobacco Barn Promo Alerts: '); ?>
              <?php print $node->field_tbarn_text_signup__c['und'][0]['value']; ?>
            <?php endif; ?>
          </p>
      <?php endif; ?>
    </div>

    <!-- pharmacy -->
  <?php if ($node->field_pharmacy['und'][0]['value'] == 1): ?>
      <div class="detail-box">
          <strong class="title"><?php print t('PHARMACY'); ?></strong>
          <dl>
            <?php if (isset($node->field_pharmacy_hours['und'][0]['value'])): ?>
                <dt><?php print t('Pharmacy Hours:'); ?></dt>
                <dd><?php echo $node->field_pharmacy_hours['und'][0]['value']; ?></dd>
            <?php endif; ?>
            <?php if (isset($node->field_pharmacist['und'][0]['value'])): ?>
                <dt><?php print t('Pharmacist:'); ?></dt>
                <dd><?php echo $node->field_pharmacist['und'][0]['value']; ?></dd>
            <?php endif; ?>
            <?php if (isset($node->field_pharmacy_phone['und'][0]['value'])): ?>
                <dt class="tel-txt"><?php print t('Pharmacy Phone:'); ?></dt>
                <dd><a class="tel"
                       href="tel:<?php echo $node->field_pharmacy_phone['und'][0]['value']; ?>"><?php echo $node->field_pharmacy_phone['und'][0]['value']; ?></a>
                </dd>
            <?php endif; ?>
            <?php if (isset($node->field_pharmacy_fax['und'][0]['value'])): ?>
                <dt><?php print t('Pharmacy Fax:'); ?></dt>
                <dd><?php echo $node->field_pharmacy_fax['und'][0]['value']; ?></dd>
            <?php endif; ?>
            <?php if (isset($node->field_state_board_number['und'][0]['value'])): ?>
                <dt><?php print t('State Board Number:'); ?></dt>
                <dd><?php echo $node->field_state_board_number['und'][0]['value']; ?></dd>
            <?php endif; ?>
          </dl>
      </div>
  <?php endif; ?>
    <!-- fuel -->
  <?php if ($node->field_fuel['und'][0]['value'] == 1): ?>
      <div class="detail-box">
          <strong class="title"><?php print t('FUEL'); ?></strong>
          <dl>
            <?php if (isset($node->field_fuel_brand['und'][0]['value'])): ?>
                <dt><?php print t('Fuel Brand(s):'); ?></dt>
                <dd><?php echo $node->field_fuel_brand['und'][0]['value']; ?></dd>
            <?php endif; ?>
          </dl>
      </div>
  <?php endif; ?>
    <!-- show tobacco barn info, but only if not the main location: see node 111 -->
  <?php if (($node->field_tobacco_barn['und'][0]['value'] == 1) && (count($node->field_department) > 0)): ?>
      <div class="detail-box">
          <strong class="title"><?php print t('TOBACCO BARN'); ?></strong>
          <dl>
            <?php if (isset($node->field_barn_hours['und'][0]['value'])): ?>
                <dt><?php print t('Barn Hours:'); ?></dt>
                <dd><?php echo $node->field_barn_hours['und'][0]['value'] ?></dd>
            <?php endif; ?>
            <?php if (isset($node->field_barn_manager['und'][0]['value'])): ?>
                <dt><?php print t('Barn Manager:'); ?></dt>
                <dd><?php echo $node->field_barn_manager['und'][0]['value'] ?></dd>
            <?php endif; ?>
            <?php if (isset($node->field_barn_number['und'][0]['value'])): ?>
                <dt><?php print t('Barn Number:'); ?></dt>
                <dd><?php echo $node->field_barn_number['und'][0]['value'] ?></dd>
            <?php endif; ?>
          </dl>
      </div>
  <?php endif; ?>
    <!-- subway -->
  <?php if ($node->field_subway['und'][0]['value'] == 1): ?>
      <div class="detail-box">
          <strong class="title"><?php print t('SUBWAY'); ?></strong>
          <dl>
            <?php if (isset($node->field_subway_phone['und'][0]['value'])): ?>
                <dt><?php print t('Subway Phone:'); ?></dt>
                <dd><?php echo $node->field_subway_phone['und'][0]['value'] ?></dd>
            <?php endif; ?>
            <?php if (isset($node->field_subway_director['und'][0]['value'])): ?>
                <dt><?php print t('Subway Director:'); ?></dt>
                <dd><?php echo $node->field_subway_director['und'][0]['value'] ?></dd>
            <?php endif; ?>
          </dl>
      </div>
  <?php endif; ?>
    <!-- washateria -->
  <?php if ($node->field_washateria['und'][0]['value'] == 1): ?>
      <div class="detail-box">
          <strong class="title"><?php print t('WASHATERIA'); ?></strong>
          <dl>
              <dt><?php print t('Washateria Director:'); ?></dt>
              <dd><?php echo $node->field_washateria_director['und'][0]['value'] ?></dd>
              <dt><?php print t('Washateria Phone:'); ?></dt>
              <dd><?php echo $node->field_washateria_phone['und'][0]['value'] ?></dd>
          </dl>
      </div>
  <?php endif; ?>
    <!-- car wash -->
  <?php if ($node->field_car_wash['und'][0]['value'] == 1): ?>
      <div class="detail-box">
          <strong class="title"><?php print t('CAR WASH'); ?></strong>
          <dl>
            <?php if (isset($node->field_car_wash_director['und'][0]['value'])): ?>
                <dt><?php print t('Car Wash Director:'); ?></dt>
                <dd><?php echo $node->field_car_wash_director['und'][0]['value'] ?></dd>
            <?php endif; ?>
            <?php if (isset($node->field_car_wash_phone['und'][0]['value'])): ?>
                <dt><?php print t('Car Wash Phone:'); ?></dt>
                <dd><?php echo $node->field_car_wash_phone['und'][0]['value'] ?></dd>
            <?php endif; ?>
          </dl>
      </div>
  <?php endif; ?>
    <!-- mr payroll -->
  <?php if ($node->field_mr_payroll['und'][0]['value'] == 1): ?>
      <div class="detail-box">
          <strong class="title"><?php print t('MR. PAYROLL'); ?></strong>
          <dl>
              <dt><?php print t('Mr. Payroll Phone:'); ?></dt>
              <dd><?php echo $node->field_mr_payroll_phone['und'][0]['value'] ?></dd>
          </dl>
      </div>
  <?php endif; ?>
</section>
