/*! Copyright (c) 2011, Lloyd Hilaiel, ISC License */
!function(t){function e(t){try{return JSON&&JSON.parse?JSON.parse(t):new Function("return "+t)()}catch(e){n("ijs")}}function n(t){throw new Error(l[t])}function r(t){return Array.isArray?Array.isArray(t):"[object Array]"===c.call(t)}function i(t){if(null===t)return"null";var e=typeof t;return"object"===e&&r(t)&&(e="array"),e}function o(t,e,n,r,o){var a,s=[],u=">"===e[0]?e[1]:e[0],c=!0;return u.type&&(c=c&&u.type===i(t)),u.id&&(c=c&&u.id===n),c&&u.pf&&(":nth-last-child"===u.pf?r=o-r:r++,0===u.a?c=u.b===r:(a=(r-u.b)%u.a,c=!a&&r*u.a+u.b>=0)),">"!==e[0]&&":root"!==e[0].pc&&s.push(e),c&&(">"===e[0]?e.length>2&&(c=!1,s.push(e.slice(2))):e.length>1&&(c=!1,s.push(e.slice(1)))),[c,s]}function a(t,e,n,i,s,u){var c,l,f=","===t[0]?t.slice(1):[t],d=[],p=!1,h=0,g=0,m=0;for(h=0;h<f.length;h++)for(l=o(e,f[h],i,s,u),l[0]&&(p=!0),g=0;g<l[1].length;g++)d.push(l[1][g]);if(d.length&&"object"==typeof e)if(d.length>=1&&d.unshift(","),r(e))for(h=0;h<e.length;h++)a(d,e[h],n,void 0,h,e.length);else{m=0;for(c in e)e.hasOwnProperty(c)&&m++;h=0;for(c in e)e.hasOwnProperty(c)&&a(d,e[c],n,c,h++,m)}p&&n&&n(e)}function s(t,e){var n=[];return a(t,e,function(t){n.push(t)}),n}function u(t){return{sel:g(t),match:function(t){return s(this.sel,t)},forEach:function(t,e){return a(this.sel,t,e)}}}var c=Object.prototype.toString,l={ijs:"invalid json string",mpc:"multiple pseudo classes (:xxx) not allowed",mepf:"malformed expression in pseudo-function",nmi:"multiple ids not allowed",se:"selector expected",sra:"string required after '.'",uc:"unrecognized char",ujs:"unclosed json string",upc:"unrecognized pseudo class"},f={psc:1,psf:2,typ:3,str:4},d=/^(?:([\r\n\t\ ]+)|([*.,>])|(string|boolean|null|array|object|number)|(:(?:root|first-child|last-child|only-child))|(:(?:nth-child|nth-last-child))|(:\w+)|(\"(?:[^\\]|\\[^\"])*\")|(\")|((?:[_a-zA-Z]|[^\0-\0177]|\\[^\r\n\f0-9a-fA-F])(?:[_a-zA-Z0-9\-]|[^\u0000-\u0177]|(?:\\[^\r\n\f0-9a-fA-F]))*))/,p=/^\s*\(\s*(?:([+\-]?)([0-9]*)n\s*(?:([+\-])\s*([0-9]))?|(odd|even)|([+\-]?[0-9]+))\s*\)/,h=function(t,r){r||(r=0);var i=d.exec(t.substr(r));if(!i)return void 0;r+=i[0].length;var o;return i[1]?o=[r," "]:i[2]?o=[r,i[0]]:i[3]?o=[r,f.typ,i[0]]:i[4]?o=[r,f.psc,i[0]]:i[5]?o=[r,f.psf,i[0]]:i[6]?n("upc"):i[7]?o=[r,f.str,e(i[0])]:i[8]?n("ujs"):i[9]&&(o=[r,f.str,i[0].replace(/\\([^\r\n\f0-9a-fA-F])/g,"$1")]),o},g=function(t){for(var e,n=[],r=0;;){var i=m(t,r);if(n.push(i[1]),i=h(t,r=i[0]),i&&" "===i[1]&&(i=h(t,r=i[0])),!i)break;">"===i[1]?(n.push(">"),r=i[0]):","===i[1]&&(void 0===e?e=[",",n]:e.push(n),n=[],r=i[0])}return e&&e.push(n),e?e:n},m=function(t,e){var r=e,i={},o=h(t,e);for(o&&" "===o[1]&&(r=e=o[0],o=h(t,e)),o&&o[1]===f.typ?(i.type=o[2],o=h(t,e=o[0])):o&&"*"===o[1]&&(o=h(t,e=o[0]));;){if(void 0===o)break;if("."===o[1])o=h(t,e=o[0]),o&&o[1]===f.str||n("sra"),i.id&&n("nmi"),i.id=o[2];else if(o[1]===f.psc)(i.pc||i.pf)&&n("mpc"),":first-child"===o[2]?(i.pf=":nth-child",i.a=0,i.b=1):":last-child"===o[2]?(i.pf=":nth-last-child",i.a=0,i.b=1):i.pc=o[2];else{if(o[1]!==f.psf)break;(i.pc||i.pf)&&n("mpc"),i.pf=o[2];var a=p.exec(t.substr(o[0]));a||n("mepf"),a[5]?(i.a=2,i.b="odd"===a[5]?1:0):a[6]?(i.a=0,i.b=parseInt(a[6],10)):(i.a=parseInt((a[1]?a[1]:"+")+(a[2]?a[2]:"1"),10),i.b=a[3]?parseInt(a[3]+a[4],10):0),o[0]+=a[0].length}o=h(t,e=o[0])}return r===e&&n("se"),[e,i]};t._lex=h,t._parse=g,t.match=function(t,e){return u(t).match(e)},t.forEach=function(t,e,n){return u(t).forEach(e,n)},t.compile=u}("undefined"==typeof exports?window.JSONSelect={}:exports);