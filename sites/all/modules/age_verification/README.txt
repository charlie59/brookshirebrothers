The age gate verification module that forces the user to select a date
before passing the user back to the selected URL.

Admin Display options can be edited from 
/admin/config/development/age-verification

1. You can select an different age from the drop down, the default is 21.

2. Relative URL paths can be used for the age verification to ignore pages.
As an example you may have a cookie policy page you do not want 
to act on, this could use the alias path of 
www.yoursite.com/cookie-policy 
simply add the relative URL "cookie-policy" or "node/id"

Other pages you may want to use are "user" so you can login without having to
pass through the age gate.

3. The form description field is used to output any text on the bottom of the 
form.
In example you may have added a URL to ignore for your cookie policy page

You could add in here HTML 

<p>This site uses cookies.</p>
<a href="/cookie-policy" target="_blank">Cookie Policy</a></p>

With both of these added you can have pages that are accessible with out 
the age gate.
