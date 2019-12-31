# mrwf-mobile-on-the-day
This site is a mobile-first design using several tabs in one load, it means the
users load the site once and clicking through to other "pages" (actually tabs)
is much quicker.

Any tabs with hand-written copy in them will be in index.html. Any tabs which generate
their contents based on online data sources (typically google spreadsheets) will
load their information via the corresponding .js files in the background once the
core HTML has loaded.

The navigation is in two parts: a main navigation bar, which is the same everywhere
 and a tab-specific sub-navigation bar underneath. Any tabs that need to use
 sub-navigation build their own using javascript when their tab is shown and this
 navigation is kept at the top of the page using "sticky" javascript (not an
 industry-wide term, we just call it that here).

Since this is a mobile-first design it's important to consider phone screen space
when adding new elements (e.g. to navigation bars) and since this is all in one
page, css styles and div ids used for javascript should use tab-specific namin.

[![Gitter](https://badges.gitter.im/mill-road-winter-fair/community.svg)](https://gitter.im/mill-road-winter-fair/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
<a name="disclaimer" />
<span class="disclaimer">
  <h4>Disclaimer</h4>
  <p>The Mill Road Winter Fair is run by volunteers, led by a Committee, without public funding.</p>
  <p>MRWF shall make every reasonable effort to ensure that their activities, and those that they manage, are organised in a safe manner and to ensure the safety of those participating in and attending the event. However, all attendees, participants, traders, workers and volunteers have a responsibility for their own safety and those around them and remain responsible for their own actions.</p>
  <p>Some activities, including those at indoor venues, Perowne St, Hope St Yard and many of the stalls directly outside local shops, are not organised or managed by MRWF. Official MRWF stalls can be identified by official trader certificates issued by MRWF. The organisers of these individual activities remain responsible for the safety of their own activities at all times and MRWF and their contractors accept no liability for any accident or loss, whether direct or indirect.</p>
</span>
