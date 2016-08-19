	<div class="w2">
		<?php include path_to_theme().'/templates/includes/nav_menu_header.tpl.php'; ?>
		<div class="w1">
			<?php include path_to_theme().'/templates/includes/header.tpl.php'; ?>
			<div id="main">
				<div class="main-holder">
					<section id="content" class="filter-location store-location">
						<form action="/store-locator" class="form-block add-form location-form">
              <?php if(isset($_GET['weekly-ad']) && $_GET['weekly-ad']=="true"){ ?>
								<input type="hidden" name="weekly-ad" class="weekly-ad" value="true">
								<h1><?php print t('Find a Weekly Ad');?></h1>
								<?php } else { ?>
								<h1><?php print t('Find a Store');?></h1>
              <?php } ?>
									<div class="row-holder">
										<div class="row-box">
											<label for="search"><?php print t('Search by City, State or Zip Code');?></label>
											<div class="row">
												<input class="filter-location-area" id="search" type="text" required>
											</div>
										</div>
										<div class="row-box add-select">
											<label><?php print t('Search within:');?></label>
											<select class="filter-distance">
												<option><?php print t('20 miles');?></option>
												<option><?php print t('30 miles');?></option>
												<option><?php print t('40 miles');?></option>
												<option class="over"><?php print t('50 miles+');?></option>
											</select>
										</div>
									</div>
									<section class="form-holder add-method">
										<div class="checkbox-area add-area">
											<?php
												$vocabulary = taxonomy_vocabulary_machine_name_load('department');
												$terms = taxonomy_get_tree($vocabulary->vid);
												$courses = array();
												$i=0;
												foreach($terms as $term) {
													$courses[$term->tid] = $term->name; ?>
													<div class="check-box">
														<?php if((isset($_GET['brookshirebrothers']) && $_GET['brookshirebrothers']=="true" && $term->name=="Brookshire Brothers") || (isset($_GET['brookshirebrothersexpress']) && $_GET['brookshirebrothersexpress']=="true" && $term->name=="Brookshire Brothers Express")) { ?>
															<input value="<?php print $term->name;?>" checked="checked" id="check<?php echo $i;?>" type="checkbox">
															<label for="check<?php echo $i;?>"><?php print $term->name;?> </label>
	                            <?php }else{ ?>
														<input value="<?php print $term->name;?>" id="check<?php echo $i;?>" type="checkbox">
														<label for="check<?php echo $i;?>"><?php print $term->name;?> </label>
														<?php } ?>
													</div>
											<?php $i++;} ?>
										</div>
										<div class="checkbox-area add-checkbox">
											<span class="txt add-txt"><?php print t('Include results with:');?></span>
											<?php
												$vocabulary = taxonomy_vocabulary_machine_name_load('specification');
												$terms = taxonomy_get_tree($vocabulary->vid);
												$courses = array();
												foreach($terms as $term) {
													$courses[$term->tid] = $term->name; ?>
													<div class="check-box">
                            <?php if(isset($_GET['pharmacy']) && $_GET['pharmacy']=="true" && $term->name=="Pharmacy"){ ?>
														<input value="<?php print $term->name;?>" checked="checked" id="check<?php echo $i;?>" type="checkbox">
														<label for="check<?php echo $i;?>"><?php print $term->name;?> </label>
                            <?php }else{ ?>
														<input value="<?php print $term->name;?>" id="check<?php echo $i;?>" type="checkbox">
														<label for="check<?php echo $i;?>"><?php print $term->name;?> </label>
                            <?php } ?>
													</div>
											<?php $i++;} ?>
										</div>
										<div class="checkbox-area add-area">
											<span class="txt"><?php print t('Find locations of:');?></span>
											<?php
												$vocabulary = taxonomy_vocabulary_machine_name_load('locations');
												$terms = taxonomy_get_tree($vocabulary->vid);
												$courses = array();
												foreach($terms as $term) {
													$courses[$term->tid] = $term->name; ?>
													<div class="check-box">
														<?php if((isset($_GET['cormies']) && $_GET['cormies']=="true" && $term->name=="Cormie’s Grocery") || (isset($_GET['davids']) && $_GET['davids']=="true" && $term->name=="David’s") || (isset($_GET['davidsexpress']) && $_GET['davidsexpress']=="true" && $term->name=="David’s Express") || (isset($_GET['pecanfoods']) && $_GET['pecanfoods']=="true" && $term->name=="Pecan Foods") || (isset($_GET['polk']) && $_GET['polk']=="true" && $term->name=="Polk Pick-It-Up") || (isset($_GET['tobaccobarn']) && $_GET['tobaccobarn']=="true" && $term->name=="Tobacco Barn")) { ?>
															<input value="<?php print $term->name;?>" checked="checked" id="check<?php echo $i;?>" type="checkbox">
															<label for="check<?php echo $i;?>"><?php print $term->name;?> </label>
	                            <?php }else{ ?>
														<input value="<?php print $term->name;?>" id="check<?php echo $i;?>" type="checkbox">
														<label for="check<?php echo $i;?>"><?php print $term->name;?> </label>
														<?php } ?>
													</div>
											<?php $i++;} ?>
										</div>
									</section>
									<div class="btn-holder add-btn">
										<input class="btn-submit" type="submit" value="SEARCH">
									</div>
						</form>
						<section class="content-holder filter-holder">
              <?php if(isset($_GET['weekly-ad']) && $_GET['weekly-ad']=="true"){ ?>
								<input type="hidden" name="weekly-ad" class="weekly-ad" value="true">
								<h1>Choose a Store to See This Week&rsquo;s Ads</h1>
								<?php } else { ?>
								<h1>Stores Near You</h1>
              <?php } ?>
								<ul class="info-box">
									<li><span class="result-count">12</span> Stores within <span class="selected-miles">100 miles</span> of <span class="your-location">Texas</span></li>
									<li><a href="#" class="back-btn">Search Again</a></li>
								</ul>
								<script type="text/html" id="result_tmpl">
									<section class="<%=(i % 2 == 1 ? " even" : "even odd")%>">
										<div class="store-info">
											<strong class="title"><%=title%></strong>
											<address><%=address%><br><%=locality%></address>
											<span class="tel"><%=tel%></span>
										</div>
										<div class="btn-box">
											<% if (hrefad.length != 0) { %>

											<% } %>
											<a class="btn-detail" href="/<%=hrefdetails%>">Store Details</a>
										</div>
									</section>
								</script>
								<?php $results = entity_load_by_type('node', 'store_location') ?>
								<div class="store-block"></div>
							</section>
					</section>
					<?php if ($page['sidebar_first']): ?>
					<aside id="sidebar">
						<?php print render($page['sidebar_first']); ?>
					</aside>
					<?php endif; ?>
				</div>
			</div>
		</div>
		<?php include path_to_theme().'/templates/includes/footer.tpl.php'; ?>
	</div>
