define(["../core","../var/document","../manipulation"],function(e,t){function n(t,n){var r=e(n.createElement(t)).appendTo(n.body),i=e.css(r[0],"display");return r.detach(),i}function r(r){var a=t,s=o[r];return s||(s=n(r,a),"none"!==s&&s||(i=(i||e("<iframe frameborder='0' width='0' height='0'/>")).appendTo(a.documentElement),a=i[0].contentDocument,a.write(),a.close(),s=n(r,a),i.detach()),o[r]=s),s}var i,o={HTML:"block",BODY:"block"};return r});