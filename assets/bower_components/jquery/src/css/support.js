define(["../core","../var/support"],function(e,t){return function(){function n(){a.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",a.innerHTML="",o.appendChild(s);var e=window.getComputedStyle(a,null);i="1%"!==e.top,r="4px"===e.width,o.removeChild(s)}var i,r,o=document.documentElement,s=document.createElement("div"),a=document.createElement("div");a.style&&(a.style.backgroundClip="content-box",a.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===a.style.backgroundClip,s.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",s.appendChild(a),window.getComputedStyle&&e.extend(t,{pixelPosition:function(){return n(),i},boxSizingReliable:function(){return null==r&&n(),r},reliableMarginRight:function(){var e,t=a.appendChild(document.createElement("div"));return t.style.cssText=a.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",t.style.marginRight=t.style.width="0",a.style.width="1px",o.appendChild(s),e=!parseFloat(window.getComputedStyle(t,null).marginRight),o.removeChild(s),a.removeChild(t),e}}))}(),t});