<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="format-detection" content="telephone=no">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title><?php print $head_title; ?></title>
  <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,600,700,900,400italic|Roboto+Condensed:400,300,700' rel='stylesheet' type='text/css'>
  <?php print $styles; ?>
  <?php print $scripts; ?>
	<style>
	.w2 { margin:33px auto 0 auto; }
	#container { -webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box; padding:35px; }
	</style>
</head>
<body class="<?php print $classes; ?>" <?php print $attributes;?>>
	<div id="wrapper" class="inner">
		<div class="w2">
			<div class="w1">
				<header id="header">
					<div class="header-holder">
						<strong class="logo">Brookshire Brothers - A Celebration of Family and Community</strong>
						<div class="our-company">
							&nbsp;
						</div>
					</div>
					<nav id="nav">
						&nbsp;
					</nav>
				</header>
				<div id="container">
	        <?php if ($title): ?><h1 class="title" id="page-title"><?php print $title; ?></h1><?php endif; ?>
	        <?php print $content; ?>
	        <?php if ($messages): ?>
	          <div id="messages"><div class="section clearfix">
	            <?php print $messages; ?>
	          </div></div>
	        <?php endif; ?>
				</div>
			</div>
			<footer id="footer">
				<div class="footer-holder">
					<div class="list-holder">
						&nbsp;
					</div>
					<ul class="socialnetworks">
						<li class="instagram"><a href="http://instagram.com/brookshirebrothers" target="_blank">Instagram</a></li>
						<li class="facebook"><a href="https://www.facebook.com/BrookshireBros" target="_blank">Facebook</a></li>
						<li class="twitter"><a href="https://twitter.com/BrookshireBros" target="_blank">Twitter</a></li>
						<li class="youtube"><a href="https://www.youtube.com/user/bbros1921" target="_blank">YouTube</a></li>
					</ul>
				</div>
				<div class="footer-legal">
					<strong>&copy; 2016 Copyright Brookshire Brothers, Inc. All rights reserved.</strong><br>
					Certain activities provided via the website may be covered by U.S. Patent 5,930,474.
				</div>
			</footer>
		</div>
	</div>
</body>
</html>
