import{S as t,i as e,s as n,J as s,j as a,m as o,o as i,x as l,u as r,v as c,e as f,c as h,a as $,d as p,b as g,f as m,K as u,L as d,M as v,N as y,I as x,r as w,w as b,O as P,A as I,P as k,Q as E,R as S,k as H,n as A,H as D,t as V,g as _}from"../chunks/vendor-e483c085.js";function j(t){let e,n,s,a;return{c(){e=f("img"),this.h()},l(t){e=h(t,"IMG",{width:!0,height:!0,src:!0,style:!0,class:!0,alt:!0}),this.h()},h(){g(e,"width","100%"),g(e,"height","100%"),y(e.src,n=t[5][t[0]].img)||g(e,"src",n),g(e,"style","opacity:1"),g(e,"class","cover-image svelte-100bbnt"),g(e,"alt","")},m(n,o){m(n,e,o),s||(a=u(t[14].call(null,e)),s=!0)},p(t,s){1&s&&!y(e.src,n=t[5][t[0]].img)&&g(e,"src",n)},d(t){t&&p(e),s=!1,a()}}}function X(t){let e,n,y,x,w,b=t[6]&&function(t){let e,n;return e=new s({props:{transition:{duration:2,delay:2},animate:{opacity:0},$$slots:{default:[j,({motion:t})=>({14:t}),({motion:t})=>t?16384:0]},$$scope:{ctx:t}}}),{c(){a(e.$$.fragment)},l(t){o(e.$$.fragment,t)},m(t,s){i(e,t,s),n=!0},p(t,n){const s={};32769&n&&(s.$$scope={dirty:n,ctx:t}),e.$set(s)},i(t){n||(l(e.$$.fragment,t),n=!0)},o(t){r(e.$$.fragment,t),n=!1},d(t){c(e,t)}}}(t);return{c(){e=f("div"),b&&b.c(),this.h()},l(t){e=h(t,"DIV",{style:!0,class:!0});var n=$(e);b&&b.l(n),n.forEach(p),this.h()},h(){g(e,"style",n=t[6]?`top:0;height:100%;left:${t[5][t[0]].defaultPos.left}; opacity:1; width:10%; height:100%`:"opacity:0"),g(e,"class",(t[6]?"large-bar":"small-bar")+" single-bar-container svelte-100bbnt")},m(n,s){m(n,e,s),b&&b.m(e,null),y=!0,x||(w=[u(t[14].call(null,e)),d(e,"click",t[9])],x=!0)},p(t,s){t[6]&&b.p(t,s),(!y||1&s&&n!==(n=t[6]?`top:0;height:100%;left:${t[5][t[0]].defaultPos.left}; opacity:1; width:10%; height:100%`:"opacity:0"))&&g(e,"style",n)},i(t){y||(l(b),y=!0)},o(t){r(b),y=!1},d(t){t&&p(e),b&&b.d(),x=!1,v(w)}}}function z(t){let e,n;return e=new s({props:{onAnimationComplete:t[10],animate:t[4],variants:t[6]?t[8]:t[7],onHoverStart:t[11],$$slots:{default:[X,({motion:t})=>({14:t}),({motion:t})=>t?16384:0]},$$scope:{ctx:t}}}),{c(){a(e.$$.fragment)},l(t){o(e.$$.fragment,t)},m(t,s){i(e,t,s),n=!0},p(t,[n]){const s={};6&n&&(s.onAnimationComplete=t[10]),16&n&&(s.animate=t[4]),8&n&&(s.onHoverStart=t[11]),32769&n&&(s.$$scope={dirty:n,ctx:t}),e.$set(s)},i(t){n||(l(e.$$.fragment,t),n=!0)},o(t){r(e.$$.fragment,t),n=!1},d(t){c(e,t)}}}function C(t,e,n){let{index:s}=e,a=!1,o=!0;const i={3:{defaultPos:{left:"0px"},imagePos:{0:"0%",1:"0%"},img:"/_app/assets/1-52e24dec.png",position:{left:"10.9%",top:"13.8%",width:"2.7%"}},17:{img:"/_app/assets/2-779b6b5c.png",imagePos:{0:"44%",1:"20%"},defaultPos:{left:"22.5%"},position:{left:"59.5%",top:"13.8%",width:"1.1%"}},23:{img:"/_app/assets/3-79f96e4f.jpg",imagePos:{0:"44%",1:"20%"},defaultPos:{left:"67.5%"},position:{left:"75.1%",top:"13.8%",width:"2.7%"}},28:{img:"/_app/assets/4-c6c03fae.png",imagePos:{0:"44%",1:"20%"},defaultPos:{left:"90%",right:"0"},position:{left:"94.4%",top:"13.8%",width:"2.9%"}}};let l=i[s],r=6,c="2",f={2:{rotateX:0,opacity:1,transition:{duration:r,delay:2}},fullScreen:{width:"100vw",height:"70vh",left:0,right:0,scale:1,rotateX:0,zIndex:2,position:"fixed"}},h={2:()=>({left:i[s].position.left,right:i[s].position.right,scale:1,top:i[s].position.top,width:i[s].position.width,height:"62%",transition:{duration:r,delay:.5}}),fullScreen:{width:"100vw",height:"70vh",left:0,right:0,scale:1,rotateX:0,zIndex:2,position:"fixed"}};return t.$$set=t=>{"index"in t&&n(0,s=t.index)},[s,a,o,r,c,i,l,f,h,t=>{n(4,c="fullScreen")},t=>{"2"===t&&(n(2,o=!1),n(1,a=!0))},()=>{n(3,r=.2)}]}class M extends t{constructor(t){super(),e(this,t,C,z,n,{index:0})}}function B(t,e,n){const s=t.slice();return s[2]=e[n],s[4]=n,s}function G(t){let e,n;return e=new M({props:{index:t[4],offset:t[1][t[4]]}}),{c(){a(e.$$.fragment)},l(t){o(e.$$.fragment,t)},m(t,s){i(e,t,s),n=!0},p:x,i(t){n||(l(e.$$.fragment,t),n=!0)},o(t){r(e.$$.fragment,t),n=!1},d(t){c(e,t)}}}function J(t){let e,n,s=t[0],a=[];for(let i=0;i<s.length;i+=1)a[i]=G(B(t,s,i));const o=t=>r(a[t],1,1,(()=>{a[t]=null}));return{c(){e=f("div");for(let t=0;t<a.length;t+=1)a[t].c();this.h()},l(t){e=h(t,"DIV",{class:!0});var n=$(e);for(let e=0;e<a.length;e+=1)a[e].l(n);n.forEach(p),this.h()},h(){g(e,"class","bar-container svelte-1lu1tnu")},m(t,s){m(t,e,s);for(let n=0;n<a.length;n+=1)a[n].m(e,null);n=!0},p(t,[n]){if(2&n){let i;for(s=t[0],i=0;i<s.length;i+=1){const o=B(t,s,i);a[i]?(a[i].p(o,n),l(a[i],1)):(a[i]=G(o),a[i].c(),l(a[i],1),a[i].m(e,null))}for(w(),i=s.length;i<a.length;i+=1)o(i);b()}},i(t){if(!n){for(let t=0;t<s.length;t+=1)l(a[t]);n=!0}},o(t){a=a.filter(Boolean);for(let e=0;e<a.length;e+=1)r(a[e]);n=!1},d(t){t&&p(e),P(a,t)}}}function K(t){I((()=>{})),k((()=>{}));const e=Array.from(" ".repeat(30)),n=[];for(let s=0;s<30;s++)n.push(E({rotate:80},{delay:100*s,duration:4e3,easing:S}));return console.log(n[0]),[e,n]}class L extends t{constructor(t){super(),e(this,t,K,J,n,{})}}function N(t){let e,n,s,a;return{c(){e=f("h5"),n=V("connecting people"),this.h()},l(t){e=h(t,"H5",{class:!0});var s=$(e);n=_(s,"connecting people"),s.forEach(p),this.h()},h(){g(e,"class","svelte-1hbfkvv")},m(o,i){m(o,e,i),D(e,n),s||(a=u(t[0].call(null,e)),s=!0)},d(t){t&&p(e),s=!1,a()}}}function O(t){let e,n,s,a;return{c(){e=f("h5"),n=V("to the art of living"),this.h()},l(t){e=h(t,"H5",{class:!0});var s=$(e);n=_(s,"to the art of living"),s.forEach(p),this.h()},h(){g(e,"class","svelte-1hbfkvv")},m(o,i){m(o,e,i),D(e,n),s||(a=u(t[0].call(null,e)),s=!0)},d(t){t&&p(e),s=!1,a()}}}function Q(t){let e,n,u,d,v,y,x;return n=new s({props:{transition:{duration:1,delay:3},animate:{opacity:1},$$slots:{default:[N,({motion:t})=>({0:t}),({motion:t})=>t?1:0]},$$scope:{ctx:t}}}),d=new L({}),y=new s({props:{transition:{duration:1,delay:3},animate:{opacity:1},$$slots:{default:[O,({motion:t})=>({0:t}),({motion:t})=>t?1:0]},$$scope:{ctx:t}}}),{c(){e=f("div"),a(n.$$.fragment),u=H(),a(d.$$.fragment),v=H(),a(y.$$.fragment),this.h()},l(t){e=h(t,"DIV",{class:!0});var s=$(e);o(n.$$.fragment,s),u=A(s),o(d.$$.fragment,s),v=A(s),o(y.$$.fragment,s),s.forEach(p),this.h()},h(){g(e,"class","container svelte-1hbfkvv")},m(t,s){m(t,e,s),i(n,e,null),D(e,u),i(d,e,null),D(e,v),i(y,e,null),x=!0},p(t,[e]){const s={};2&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s);const a={};2&e&&(a.$$scope={dirty:e,ctx:t}),y.$set(a)},i(t){x||(l(n.$$.fragment,t),l(d.$$.fragment,t),l(y.$$.fragment,t),x=!0)},o(t){r(n.$$.fragment,t),r(d.$$.fragment,t),r(y.$$.fragment,t),x=!1},d(t){t&&p(e),c(n),c(d),c(y)}}}class R extends t{constructor(t){super(),e(this,t,null,Q,n,{})}}function q(t){let e,n,s;return n=new R({}),{c(){e=f("div"),a(n.$$.fragment),this.h()},l(t){e=h(t,"DIV",{class:!0});var s=$(e);o(n.$$.fragment,s),s.forEach(p),this.h()},h(){g(e,"class","container")},m(t,a){m(t,e,a),i(n,e,null),s=!0},p:x,i(t){s||(l(n.$$.fragment,t),s=!0)},o(t){r(n.$$.fragment,t),s=!1},d(t){t&&p(e),c(n)}}}function F(t){return I((()=>{})),k((()=>{})),[]}class T extends t{constructor(t){super(),e(this,t,F,q,n,{})}}export{T as default};
