define(["ModernizrProto","cssomPrefixes","is","testProps","domPrefixes","testDOMProps"],function(A,e,t,n,i,r){function o(A,o,d,a,s){var c=A.charAt(0).toUpperCase()+A.slice(1),l=(A+" "+e.join(c+" ")+c).split(" ");return t(o,"string")||t(o,"undefined")?n(l,o,a,s):(l=(A+" "+i.join(c+" ")+c).split(" "),r(l,o,d))}return A.testAllProps=o,o});