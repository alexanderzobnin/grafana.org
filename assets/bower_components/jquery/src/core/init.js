define(["../core","./var/rsingleTag","../traversing/findFilter"],function(t,e){var n,r=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,i=t.fn.init=function(i,o){var a,s;if(!i)return this;if("string"==typeof i){if(a="<"===i[0]&&">"===i[i.length-1]&&i.length>=3?[null,i,null]:r.exec(i),!a||!a[1]&&o)return!o||o.jquery?(o||n).find(i):this.constructor(o).find(i);if(a[1]){if(o=o instanceof t?o[0]:o,t.merge(this,t.parseHTML(a[1],o&&o.nodeType?o.ownerDocument||o:document,!0)),e.test(a[1])&&t.isPlainObject(o))for(a in o)t.isFunction(this[a])?this[a](o[a]):this.attr(a,o[a]);return this}return s=document.getElementById(a[2]),s&&s.parentNode&&(this.length=1,this[0]=s),this.context=document,this.selector=i,this}return i.nodeType?(this.context=this[0]=i,this.length=1,this):t.isFunction(i)?"undefined"!=typeof n.ready?n.ready(i):i(t):(void 0!==i.selector&&(this.selector=i.selector,this.context=i.context),t.makeArray(i,this))};return i.prototype=t.fn,n=t(document),i});