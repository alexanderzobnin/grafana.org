/*!
{
  "name": "CSS wrap-flow",
  "property": "wrapflow",
  "tags": ["css"],
  "notes": [
    {
      "name": "W3C Exclusions spec",
      "href": "https://www.w3.org/TR/css3-exclusions"
    },
    {
      "name": "Example by Adobe",
      "href": "http://html.adobe.com/webstandards/cssexclusions"
    }
  ]
}
!*/
define(["Modernizr","prefixed","docElement","createElement","isSVG"],function(A,e,w,n,t){A.addTest("wrapflow",function(){var A=e("wrapFlow");if(!A||t)return!1;var d=A.replace(/([A-Z])/g,function(A,e){return"-"+e.toLowerCase()}).replace(/^ms-/,"-ms-"),i=n("div"),D=n("div"),a=n("span");D.style.cssText="position: absolute; left: 50px; width: 100px; height: 20px;"+d+":end;",a.innerText="X",i.appendChild(D),i.appendChild(a),w.appendChild(i);var o=a.offsetLeft;return w.removeChild(i),D=a=i=void 0,150==o})});