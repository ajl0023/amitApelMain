var e=Object.defineProperty,t=Object.defineProperties,s=Object.getOwnPropertyDescriptors,a=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable,i=(t,s,a)=>s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[s]=a,l=(e,t)=>{for(var s in t||(t={}))n.call(t,s)&&i(e,s,t[s]);if(a)for(var s of a(t))r.call(t,s)&&i(e,s,t[s]);return e};import{S as o,i as c,s as u,e as m,j as d,k as p,t as h,c as f,a as g,m as v,n as $,g as b,d as y,b as x,f as w,o as _,H as q,J as E,r as I,u as P,v as k,w as j,x as C,K as D,A as V,L as S,M as A,N as L,I as M,O,h as N,C as Y,P as G,Q as H,R as z,T as B,U as X,V as W,W as T,X as Z,Y as F,Z as R,_ as U,$ as J}from"../chunks/vendor-659fe237.js";const K=[{delay:.1,defaultPos:{left:"0px"},imagePos:{0:"0%",1:"0%"},index:3,img:"/_app/assets/1-52e24dec.png",position:{left:"10.9%",top:"0%",width:"2.7%"}},{index:17,delay:.2,img:"/_app/assets/2-779b6b5c.png",imagePos:{0:"44%",1:"20%"},defaultPos:{left:"20vw"},position:{left:"34.6%",top:"0%",width:"2.5%"}},{index:23,delay:.3,img:"/_app/assets/3-79f96e4f.jpg",imagePos:{0:"44%",1:"20%"},defaultPos:{left:"67.5%",right:"20vw"},position:{left:"75.1%",top:"0%",width:"2.7%"}},{index:28,delay:.4,img:"/_app/assets/4-c6c03fae.png",imagePos:{0:"44%",1:"20%"},defaultPos:{left:"90%",right:"0"},position:{left:"94.4%",top:"0%",width:"2.9%"}}];function Q(e){let t,s,a,n,r,i,l,o,c,u,V,S,A,L,M;var O=e[0].component;return O&&(s=new O({})),{c(){t=m("div"),s&&d(s.$$.fragment),a=p(),n=m("div"),r=m("div"),i=m("h5"),l=h("Categories"),o=p(),c=m("div"),u=m("div"),V=p(),S=m("div"),this.h()},l(e){t=f(e,"DIV",{class:!0});var m=g(t);s&&v(s.$$.fragment,m),a=$(m),n=f(m,"DIV",{class:!0});var d=g(n);r=f(d,"DIV",{class:!0});var p=g(r);i=f(p,"H5",{});var h=g(i);l=b(h,"Categories"),h.forEach(y),o=$(p),c=f(p,"DIV",{class:!0});var x=g(c);u=f(x,"DIV",{class:!0}),g(u).forEach(y),V=$(x),S=f(x,"DIV",{class:!0}),g(S).forEach(y),x.forEach(y),p.forEach(y),d.forEach(y),m.forEach(y),this.h()},h(){x(u,"class","t1 svelte-17bk6he"),x(S,"class","t2 svelte-17bk6he"),x(c,"class","triangle-container svelte-17bk6he"),x(r,"class","categories-label svelte-17bk6he"),x(n,"class","categories-container svelte-17bk6he"),x(t,"class","main-page-container svelte-17bk6he")},m(m,d){w(m,t,d),s&&_(s,t,null),q(t,a),q(t,n),q(n,r),q(r,i),q(i,l),q(r,o),q(r,c),q(c,u),q(c,V),q(c,S),e[7](t),A=!0,L||(M=[E(r,"mouseenter",e[4]),E(r,"mouseleave",e[5]),E(r,"click",e[6])],L=!0)},p(e,[n]){if(O!==(O=e[0].component)){if(s){I();const e=s;P(e.$$.fragment,1,0,(()=>{k(e,1)})),j()}O?(s=new O({}),d(s.$$.fragment),C(s.$$.fragment,1),_(s,t,a)):s=null}},i(e){A||(s&&C(s.$$.fragment,e),A=!0)},o(e){s&&P(s.$$.fragment,e),A=!1},d(a){a&&y(t),s&&k(s),e[7](null),L=!1,D(M)}}}function ee(e,t,s){let a,{currNav:n}=t,{pagesArr:r}=t,i=!1;V((()=>{S.to(a,{translateY:-a.offsetTop})})),A();return e.$$set=e=>{"currNav"in e&&s(0,n=e.currNav),"pagesArr"in e&&s(3,r=e.pagesArr)},e.$$.update=()=>{2&e.$$.dirty&&(i?S.to(".list-item-container",{height:"auto",duration:.15}):S.to(".list-item-container",{height:"0",duration:.15}))},[n,i,a,r,e=>{S.to(".t1",{y:-3}),S.to(".t2",{y:3})},()=>{S.to(".t2",{y:0}),S.to(".t1",{y:0})},()=>{s(1,i=!i)},function(e){L[e?"unshift":"push"]((()=>{a=e,s(2,a)}))}]}class te extends o{constructor(e){super(),c(this,e,ee,Q,u,{currNav:0,pagesArr:3})}}function se(e){let t;return{c(){t=m("div"),this.h()},l(e){t=f(e,"DIV",{class:!0}),g(t).forEach(y),this.h()},h(){x(t,"class","bar-container svelte-f7n4zg")},m(s,a){w(s,t,a),e[4](t)},p:M,i:M,o:M,d(s){s&&y(t),e[4](null)}}}function ae(e,t,s){let a,{index:n}=t,{animations:r}=t,{shouldPulse:i}=t;return V((()=>{S.to(a,{opacity:1,delay:4.5,duration:5})})),e.$$set=e=>{"index"in e&&s(1,n=e.index),"animations"in e&&s(2,r=e.animations),"shouldPulse"in e&&s(3,i=e.shouldPulse)},[a,n,r,i,function(e){L[e?"unshift":"push"]((()=>{a=e,s(0,a)}))}]}class ne extends o{constructor(e){super(),c(this,e,ae,se,u,{index:1,animations:2,shouldPulse:3})}}function re(e){let t,s,a,n,r,i;return{c(){t=m("div"),s=m("img"),n=p(),r=m("h1"),i=h(e[0]),this.h()},l(a){t=f(a,"DIV",{class:!0});var l=g(t);s=f(l,"IMG",{src:!0,alt:!0,class:!0}),n=$(l),r=f(l,"H1",{class:!0});var o=g(r);i=b(o,e[0]),o.forEach(y),l.forEach(y),this.h()},h(){O(s.src,a="/_app/assets/Logo Sideways-5b2a92a6.png")||x(s,"src","/_app/assets/Logo Sideways-5b2a92a6.png"),x(s,"alt",""),x(s,"class","svelte-uhw1ju"),x(r,"class","logo-caption svelte-uhw1ju"),x(t,"class","logo-container svelte-uhw1ju")},m(e,a){w(e,t,a),q(t,s),q(t,n),q(t,r),q(r,i)},p(e,[t]){1&t&&N(i,e[0])},i:M,o:M,d(e){e&&y(t)}}}function ie(e,t,s){let{text:a}=t;return e.$$set=e=>{"text"in e&&s(0,a=e.text)},[a]}class le extends o{constructor(e){super(),c(this,e,ie,re,u,{text:0})}}const oe=(e,t,s,a)=>{const n=e-s,r=t-a;return n*n+r*r},ce=()=>{const{subscribe:e,set:t,update:s}=Y({ele:null,eleA:null,marquee:null,animationDefaults:{duration:.6,ease:"expo"}}),a={init(e,t,a,n){s((s=>(s.ele=e,s.eleA=t,s.marquee=a,s.marqueeInner=n,s)))},mouseEnter(e){s((t=>{const s=this.findClosestEdge(e,t.ele);return console.log(s),S.timeline({defaults:t.animationDefaults}).set(t.marquee,{y:"top"===s?"-101%":"101%"},0).to([t.marquee,t.marqueeInner],{y:"0%"},0),t}))},mouseLeave(e){s((t=>{const s=this.findClosestEdge(e,t.ele);return S.timeline({defaults:t.animationDefaults}).to(t.marquee,{y:"top"===s?"-101%":"101%"},0).to(t.marqueeInner,{y:"top"===s?"101%":"-101%"},0),t}))},findClosestEdge:(e,t)=>((e,t,s,a)=>{const n=oe(e,t,s/2,0),r=oe(e,t,s/2,a);return Math.min(n,r)===n?"top":"bottom"})(e.pageX-t.offsetLeft,e.pageY-t.offsetTop,t.clientWidth,t.clientHeight)};return l({subscribe:e,set:t,update:s},a)};function ue(e,t,s){const a=e.slice();return a[17]=t[s],a[19]=s,a}function me(e){let t,s,a,n,r=e[17]+"";return{c(){t=m("span"),s=h(r),a=p(),n=m("div"),this.h()},l(e){t=f(e,"SPAN",{class:!0});var i=g(t);s=b(i,r),i.forEach(y),a=$(e),n=f(e,"DIV",{class:!0}),g(n).forEach(y),this.h()},h(){x(t,"class","svelte-uwkdd3"),x(n,"class","marquee__img svelte-uwkdd3")},m(e,r){w(e,t,r),q(t,s),w(e,a,r),w(e,n,r)},p(e,t){1&t&&r!==(r=e[17]+"")&&N(s,r)},d(e){e&&y(t),e&&y(a),e&&y(n)}}}function de(e){let t,s,a,n,r,i,l,o,c,u=e[0],d=[];for(let m=0;m<u.length;m+=1)d[m]=me(ue(e,u,m));return{c(){t=m("div"),s=m("a"),a=h(e[1]),n=p(),r=m("div"),i=m("div"),l=m("div");for(let e=0;e<d.length;e+=1)d[e].c();this.h()},l(o){t=f(o,"DIV",{class:!0});var c=g(t);s=f(c,"A",{class:!0,href:!0});var u=g(s);a=b(u,e[1]),u.forEach(y),n=$(c),r=f(c,"DIV",{class:!0});var m=g(r);i=f(m,"DIV",{class:!0});var p=g(i);l=f(p,"DIV",{class:!0,"aria-hidden":!0});var h=g(l);for(let e=0;e<d.length;e+=1)d[e].l(h);h.forEach(y),p.forEach(y),m.forEach(y),c.forEach(y),this.h()},h(){x(s,"class","menu__item-link svelte-uwkdd3"),x(s,"href","#"),x(l,"class","marquee__inner svelte-uwkdd3"),x(l,"aria-hidden","true"),x(i,"class","marquee__inner-wrap svelte-uwkdd3"),x(r,"class","marquee svelte-uwkdd3"),x(t,"class","menu__item svelte-uwkdd3")},m(u,m){w(u,t,m),q(t,s),q(s,a),e[10](s),q(t,n),q(t,r),q(r,i),q(i,l);for(let e=0;e<d.length;e+=1)d[e].m(l,null);e[13](i),e[14](r),e[16](t),o||(c=[E(s,"mouseenter",e[11]),E(s,"mouseleave",e[12]),E(t,"click",e[15])],o=!0)},p(e,[t]){if(2&t&&N(a,e[1]),1&t){let s;for(u=e[0],s=0;s<u.length;s+=1){const a=ue(e,u,s);d[s]?d[s].p(a,t):(d[s]=me(a),d[s].c(),d[s].m(l,null))}for(;s<d.length;s+=1)d[s].d(1);d.length=u.length}},i:M,o:M,d(s){s&&y(t),e[10](null),G(d,s),e[13](null),e[14](null),e[16](null),o=!1,D(c)}}}function pe(e,t,s){let a,n,r,i,l,{labels:o}=t,{title:c}=t,{pageContent:u}=t,{currNav:m}=t;V((()=>{s(6,l=ce()),l.init(a,n,r,i)}));const d=A();return e.$$set=e=>{"labels"in e&&s(0,o=e.labels),"title"in e&&s(1,c=e.title),"pageContent"in e&&s(8,u=e.pageContent),"currNav"in e&&s(9,m=e.currNav)},e.$$.update=()=>{260&e.$$.dirty&&u&&S.to(a,{y:1e3})},[o,c,a,n,r,i,l,d,u,m,function(e){L[e?"unshift":"push"]((()=>{n=e,s(3,n)}))},e=>{l.mouseEnter(e)},e=>{l.mouseLeave(e)},function(e){L[e?"unshift":"push"]((()=>{i=e,s(5,i)}))},function(e){L[e?"unshift":"push"]((()=>{r=e,s(4,r)}))},e=>{e.stopPropagation(),d("navChange",c)},function(e){L[e?"unshift":"push"]((()=>{a=e,s(2,a)}))}]}class he extends o{constructor(e){super(),c(this,e,pe,de,u,{labels:0,title:1,pageContent:8,currNav:9})}}const fe=[{title:"meet amit apel",labels:["meet amit apel","meet amit apel","meet amit apel","meet amit apel","meet amit apel"]},{title:"meet the team",labels:["meet the team","meet the team","meet the team","meet the team","meet the team","meet the team","meet the team","meet the team"]},{title:"what we do",labels:["what we do","what we do","what we do","what we do","what we do","what we do","what we do"]},{title:"malibu rebuild",labels:["malibu rebuild","malibu rebuild","malibu rebuild","malibu rebuild","malibu rebuild","malibu rebuild"]},{title:"press",labels:["press","press","press","press","press","press","press","press"]}];function ge(e){let t,s,a,n,r,i,l,o,c,u,d,v,_,E;return{c(){t=m("div"),s=m("h5"),a=h("Meet Amit Apel"),n=p(),r=m("div"),i=m("img"),o=p(),c=m("div"),u=m("p"),d=h("Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia, nulla.\r\n      Earum beatae perspiciatis quisquam ut, ipsam cum dolorem pariatur\r\n      praesentium accusamus, eum aspernatur. Iusto neque doloremque, assumenda\r\n      quod iure quae."),v=p(),_=m("p"),E=h("Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia, nulla.\r\n      Earum beatae perspiciatis quisquam ut, ipsam cum dolorem pariatur\r\n      praesentium accusamus, eum aspernatur. Iusto neque doloremque, assumenda\r\n      quod iure quae."),this.h()},l(e){t=f(e,"DIV",{class:!0});var l=g(t);s=f(l,"H5",{class:!0});var m=g(s);a=b(m,"Meet Amit Apel"),m.forEach(y),n=$(l),r=f(l,"DIV",{class:!0});var p=g(r);i=f(p,"IMG",{src:!0,alt:!0,class:!0}),p.forEach(y),o=$(l),c=f(l,"DIV",{class:!0});var h=g(c);u=f(h,"P",{});var x=g(u);d=b(x,"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia, nulla.\r\n      Earum beatae perspiciatis quisquam ut, ipsam cum dolorem pariatur\r\n      praesentium accusamus, eum aspernatur. Iusto neque doloremque, assumenda\r\n      quod iure quae."),x.forEach(y),v=$(h),_=f(h,"P",{});var w=g(_);E=b(w,"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia, nulla.\r\n      Earum beatae perspiciatis quisquam ut, ipsam cum dolorem pariatur\r\n      praesentium accusamus, eum aspernatur. Iusto neque doloremque, assumenda\r\n      quod iure quae."),w.forEach(y),h.forEach(y),l.forEach(y),this.h()},h(){x(s,"class","main-text-header svelte-1ssh2u5"),O(i.src,l="/_app/assets/amitapel4 (1)-07a16dc1.webp")||x(i,"src","/_app/assets/amitapel4 (1)-07a16dc1.webp"),x(i,"alt",""),x(i,"class","svelte-1ssh2u5"),x(r,"class","content-image-container svelte-1ssh2u5"),x(c,"class","main-text-content svelte-1ssh2u5"),x(t,"class","container svelte-1ssh2u5")},m(e,l){w(e,t,l),q(t,s),q(s,a),q(t,n),q(t,r),q(r,i),q(t,o),q(t,c),q(c,u),q(u,d),q(c,v),q(c,_),q(_,E)},p:M,i:M,o:M,d(e){e&&y(t)}}}class ve extends o{constructor(e){super(),c(this,e,null,ge,u,{})}}function $e(e){let t,s,a,n,r,i,l;return{c(){t=m("div"),s=m("div"),a=m("h4"),n=h("Dear Friends and Neighbors,"),r=p(),i=m("p"),l=h("Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur cum\r\n      dignissimos officia atque deleniti beatae temporibus veritatis perferendis\r\n      eligendi mollitia autem pariatur veniam voluptate aut a quos,\r\n      reprehenderit accusantium nobis!Lorem ipsum dolor sit amet consectetur\r\n      adipisicing elit. Consequuntur cum dignissimos officia atque deleniti\r\n      beatae temporibus veritatis perferendis eligendi mollitia autem pariatur\r\n      veniam voluptate aut a quos, reprehenderit accusantium nobis!Lorem ipsum\r\n      dolor sit amet consectetur adipisicing elit. Consequuntur cum dignissimos\r\n      officia atque deleniti beatae temporibus veritatis perferendis eligendi\r\n      mollitia autem pariatur veniam voluptate aut a quos, reprehenderit\r\n      accusantium nobis!"),this.h()},l(e){t=f(e,"DIV",{class:!0});var o=g(t);s=f(o,"DIV",{class:!0});var c=g(s);a=f(c,"H4",{});var u=g(a);n=b(u,"Dear Friends and Neighbors,"),u.forEach(y),r=$(c),i=f(c,"P",{});var m=g(i);l=b(m,"Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur cum\r\n      dignissimos officia atque deleniti beatae temporibus veritatis perferendis\r\n      eligendi mollitia autem pariatur veniam voluptate aut a quos,\r\n      reprehenderit accusantium nobis!Lorem ipsum dolor sit amet consectetur\r\n      adipisicing elit. Consequuntur cum dignissimos officia atque deleniti\r\n      beatae temporibus veritatis perferendis eligendi mollitia autem pariatur\r\n      veniam voluptate aut a quos, reprehenderit accusantium nobis!Lorem ipsum\r\n      dolor sit amet consectetur adipisicing elit. Consequuntur cum dignissimos\r\n      officia atque deleniti beatae temporibus veritatis perferendis eligendi\r\n      mollitia autem pariatur veniam voluptate aut a quos, reprehenderit\r\n      accusantium nobis!"),m.forEach(y),c.forEach(y),o.forEach(y),this.h()},h(){x(s,"class","text-container svelte-1ui1e1i"),x(t,"class","container svelte-1ui1e1i")},m(e,o){w(e,t,o),q(t,s),q(s,a),q(a,n),q(s,r),q(s,i),q(i,l)},p:M,i:M,o:M,d(e){e&&y(t)}}}class be extends o{constructor(e){super(),c(this,e,null,$e,u,{})}}const ye=Y([]);function xe(e){let t,s,a,n,r,i,l,o,c,u,d;return{c(){t=m("div"),s=m("div"),a=m("img"),r=p(),i=m("div"),l=m("img"),this.h()},l(e){t=f(e,"DIV",{style:!0,class:!0});var n=g(t);s=f(n,"DIV",{draggable:!0,class:!0});var o=g(s);a=f(o,"IMG",{draggable:!0,src:!0,alt:!0,class:!0}),o.forEach(y),r=$(n),i=f(n,"DIV",{draggable:!0,class:!0});var c=g(i);l=f(c,"IMG",{draggable:!0,src:!0,alt:!0,class:!0}),c.forEach(y),n.forEach(y),this.h()},h(){x(a,"draggable","false"),O(a.src,n=e[2].front)||x(a,"src",n),x(a,"alt",""),x(a,"class","svelte-1654zsx"),x(s,"draggable","false"),x(s,"class","image-container svelte-1654zsx"),x(l,"draggable","false"),O(l.src,o=e[2].back)||x(l,"src",o),x(l,"alt",""),x(l,"class","svelte-1654zsx"),x(i,"draggable","false"),x(i,"class","image-container back-container svelte-1654zsx"),x(t,"style",c=`transform: scale(${e[7]}) translateX(${e[5]}px) rotateY(${e[6]}deg) rotateZ(${e[8]}deg)`),x(t,"class","card-container svelte-1654zsx")},m(n,o){w(n,t,o),q(t,s),q(s,a),q(t,r),q(t,i),q(i,l),e[17](t),u||(d=[E(t,"mousedown",e[15]),E(t,"mouseup",e[16]),E(t,"mouseenter",e[18]),E(t,"mouseleave",e[19])],u=!0)},p(e,[s]){4&s&&!O(a.src,n=e[2].front)&&x(a,"src",n),4&s&&!O(l.src,o=e[2].back)&&x(l,"src",o),480&s&&c!==(c=`transform: scale(${e[7]}) translateX(${e[5]}px) rotateY(${e[6]}deg) rotateZ(${e[8]}deg)`)&&x(t,"style",c)},i:M,o:M,d(s){s&&y(t),e[17](null),u=!1,D(d)}}}function we(e,t,s){let a,n,r,i,l;H(e,ye,(e=>s(9,l=e)));let o,c,{index:u}=t,{rotate:m}=t,{image:d}=t,p=!1,h=z(m,{duration:150});H(e,h,(e=>s(8,i=e)));const f=B(0,{duration:400,delay:3});H(e,f,(e=>s(5,a=e)));const g=z(1,{duration:200});H(e,g,(e=>s(7,r=e))),V((()=>{new X(o,(({down:e,direction:t,active:a,movement:[n,r],velocity:i})=>{e?f.set(n):(f.set(0),i[0]>.4&&(f.set(600*t[0]),s(4,p=!0),s(14,c=!0)))}))}));let v=z(180,{duration:400});H(e,v,(e=>s(6,n=e))),ye.subscribe((e=>{5===e.length&&setTimeout((()=>{f.set(0),s(14,c=!1),s(4,p=!1)}),1e3+100*u)}));return e.$$set=e=>{"index"in e&&s(0,u=e.index),"rotate"in e&&s(1,m=e.rotate),"image"in e&&s(2,d=e.image)},e.$$.update=()=>{16385&e.$$.dirty&&c&&(ye.update((e=>[...e,u])),s(14,c=!1))},[u,m,d,o,p,a,n,r,i,l,h,f,g,v,c,()=>{p&&Math.abs(a)>=150&&(ye.update((e=>(e.pop(),e))),s(4,p=!1))},()=>{0===a&&(180===n?v.set(0):v.set(180))},function(e){L[e?"unshift":"push"]((()=>{o=e,s(3,o)}))},e=>{4-l.length===u&&!1===p&&(g.set(1.3),h.set(0))},()=>{g.set(1),h.set(m)}]}class _e extends o{constructor(e){super(),c(this,e,we,xe,u,{index:0,rotate:1,image:2})}}function qe(e,t,s){const a=e.slice();return a[6]=t[s],a[8]=s,a}function Ee(e){let t,s;return t=new _e({props:{shouldReturn:!1,variants:e[2],index:e[8],exited:e[4],image:{front:e[0].front[e[8]],back:e[0].back[e[8]]},rotate:e[3].includes(e[8])?2*e[8]:0}}),{c(){d(t.$$.fragment)},l(e){v(t.$$.fragment,e)},m(e,a){_(t,e,a),s=!0},p:M,i(e){s||(C(t.$$.fragment,e),s=!0)},o(e){P(t.$$.fragment,e),s=!1},d(e){k(t,e)}}}function Ie(e){let t,s,a,n,r=e[0].front,i=[];for(let o=0;o<r.length;o+=1)i[o]=Ee(qe(e,r,o));const l=e=>P(i[e],1,1,(()=>{i[e]=null}));return{c(){t=m("ul");for(let e=0;e<i.length;e+=1)i[e].c();this.h()},l(e){t=f(e,"UL",{class:!0});var s=g(t);for(let t=0;t<i.length;t+=1)i[t].l(s);s.forEach(y),this.h()},h(){x(t,"class","card-container svelte-178zda3")},m(r,l){w(r,t,l);for(let e=0;e<i.length;e+=1)i[e].m(t,null);s=!0,a||(n=T(e[5].call(null,t)),a=!0)},p(e,s){if(29&s){let a;for(r=e[0].front,a=0;a<r.length;a+=1){const n=qe(e,r,a);i[a]?(i[a].p(n,s),C(i[a],1)):(i[a]=Ee(n),i[a].c(),C(i[a],1),i[a].m(t,null))}for(I(),a=r.length;a<i.length;a+=1)l(a);j()}},i(e){if(!s){for(let e=0;e<r.length;e+=1)C(i[e]);s=!0}},o(e){i=i.filter(Boolean);for(let t=0;t<i.length;t+=1)P(i[t]);s=!1},d(e){e&&y(t),G(i,e),a=!1,n()}}}function Pe(e){let t,s;return t=new W({props:{initial:"visible",animate:"visible",variants:e[1],$$slots:{default:[Ie,({motion:e})=>({5:e}),({motion:e})=>e?32:0]},$$scope:{ctx:e}}}),{c(){d(t.$$.fragment)},l(e){v(t.$$.fragment,e)},m(e,a){_(t,e,a),s=!0},p(e,[s]){const a={};512&s&&(a.$$scope={dirty:s,ctx:e}),t.$set(a)},i(e){s||(C(t.$$.fragment,e),s=!0)},o(e){P(t.$$.fragment,e),s=!1},d(e){k(t,e)}}}function ke(e){return ye.subscribe((e=>{5===e.length&&ye.set([])})),V((()=>{ye.set([])})),[{front:["https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Luke_Card_dgfcrg.jpg","https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Mike_Card_yyevct.jpg","https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Yak_Card_c55nzc.jpg","https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Elchin_Card_hhfjc2.jpg","https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Omar_Card_frdbxy.jpg"],back:["https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Luke_Card_Back_j5zphk.jpg","https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Mike_Card_Back_pwet2v.jpg","https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Yak_Card_Back_bsvk7b.jpg","https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Elchin_Card_Back_ii2vul.jpg","https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Omar_Card_Back_weik5s.jpg"]},{visible:{transition:{when:"afterChildren",staggerChildren:.3}},hidden:{border:"0px solid transparent",transition:{when:"beforeChildren"}}},{visible:{opacity:1,x:0}},[0,3,2,4],[]]}class je extends o{constructor(e){super(),c(this,e,ke,Pe,u,{})}}const Ce=(e,t,s,a,n)=>(e-t)*(n-a)/(s-t)+a,De=(e,t,s)=>(1-s)*e+s*t,Ve=(e,t)=>Math.floor(Math.random()*(t-e+1)+e),Se=Z({x:0,y:0},(e=>{function t(t){e({x:t.clientX,y:t.clientY})}return window.addEventListener("mousemove",t),()=>{window.removeEventListener("mousemove",t)}})),Ae=()=>{const{subscribe:e,set:t,update:s}=Y({xStart:0,yStart:0,mouseX:0,mouseY:0,tx:0,ty:0}),a={init(){s((e=>(e.xStart=Ve(10,30),e.yStart=Ve(10,25),e)))},getMousePos(e,t){s((s=>(s.mouseX=e,s.mouseY=t,s))),this.calcMap()},calcMap(){s((e=>(e.tx=De(e.tx,Ce(e.mouseX,0,window.innerWidth,e.xStart,-e.xStart),.07),e.ty=De(e.ty,Ce(e.mouseY,0,window.innerWidth,e.yStart,-e.yStart),.07),e)))}};return l({subscribe:e,set:t,update:s},a)};function Le(e){let t,s,a;return{c(){t=m("img"),this.h()},l(e){t=f(e,"IMG",{class:!0,style:!0,src:!0,alt:!0}),this.h()},h(){x(t,"class","image svelte-1b1h626"),x(t,"style",s=`transform:translateX(${e[2].tx}px) translateY(${e[2].ty}px)`),O(t.src,a=e[0])||x(t,"src",a),x(t,"alt","")},m(s,a){w(s,t,a),e[5](t)},p(e,[n]){4&n&&s!==(s=`transform:translateX(${e[2].tx}px) translateY(${e[2].ty}px)`)&&x(t,"style",s),1&n&&!O(t.src,a=e[0])&&x(t,"src",a)},i:M,o:M,d(s){s&&y(t),e[5](null)}}}function Me(e,t,s){let a,n;H(e,Se,(e=>s(4,a=e)));let r,{img:i}=t;const l=Ae();return H(e,l,(e=>s(2,n=e))),V((()=>{l.init()})),e.$$set=e=>{"img"in e&&s(0,i=e.img)},e.$$.update=()=>{16&e.$$.dirty&&l.getMousePos(a.x,a.y)},[i,r,n,l,a,function(e){L[e?"unshift":"push"]((()=>{r=e,s(1,r)}))}]}class Oe extends o{constructor(e){super(),c(this,e,Me,Le,u,{img:0})}}function Ne(e,t,s){const a=e.slice();return a[5]=t[s],a[7]=s,a}function Ye(e){let t,s,a,n,r;function i(t){e[4](t)}let l={windowHeight:e[0],windowWidth:e[1],img:e[3][e[7]],index:e[7]};return void 0!==e[2]&&(l.cards=e[2]),s=new Oe({props:l}),L.push((()=>R(s,"cards",i))),{c(){t=m("div"),d(s.$$.fragment),n=p(),this.h()},l(e){t=f(e,"DIV",{class:!0});var a=g(t);v(s.$$.fragment,a),n=$(a),a.forEach(y),this.h()},h(){x(t,"class","image-container svelte-11jg594")},m(e,a){w(e,t,a),_(s,t,null),q(t,n),r=!0},p(e,t){const n={};1&t&&(n.windowHeight=e[0]),2&t&&(n.windowWidth=e[1]),!a&&4&t&&(a=!0,n.cards=e[2],F((()=>a=!1))),s.$set(n)},i(e){r||(C(s.$$.fragment,e),r=!0)},o(e){P(s.$$.fragment,e),r=!1},d(e){e&&y(t),k(s)}}}function Ge(e){let t,s,a,n,r,i,l=e[3],o=[];for(let u=0;u<l.length;u+=1)o[u]=Ye(Ne(e,l,u));const c=e=>P(o[e],1,1,(()=>{o[e]=null}));return{c(){t=m("div"),s=m("div"),a=m("img"),r=p();for(let e=0;e<o.length;e+=1)o[e].c();this.h()},l(e){t=f(e,"DIV",{class:!0});var n=g(t);s=f(n,"DIV",{class:!0});var i=g(s);a=f(i,"IMG",{src:!0,alt:!0,class:!0}),i.forEach(y),r=$(n);for(let t=0;t<o.length;t+=1)o[t].l(n);n.forEach(y),this.h()},h(){O(a.src,n="https://res.cloudinary.com/dt4xntymn/image/upload/v1633392260/mainSite/press/Press_Words_PNG_lpqreu.png")||x(a,"src","https://res.cloudinary.com/dt4xntymn/image/upload/v1633392260/mainSite/press/Press_Words_PNG_lpqreu.png"),x(a,"alt",""),x(a,"class","svelte-11jg594"),x(s,"class","text-container svelte-11jg594"),x(t,"class","container svelte-11jg594")},m(e,n){w(e,t,n),q(t,s),q(s,a),q(t,r);for(let s=0;s<o.length;s+=1)o[s].m(t,null);i=!0},p(e,[s]){if(15&s){let a;for(l=e[3],a=0;a<l.length;a+=1){const n=Ne(e,l,a);o[a]?(o[a].p(n,s),C(o[a],1)):(o[a]=Ye(n),o[a].c(),C(o[a],1),o[a].m(t,null))}for(I(),a=l.length;a<o.length;a+=1)c(a);j()}},i(e){if(!i){for(let e=0;e<l.length;e+=1)C(o[e]);i=!0}},o(e){o=o.filter(Boolean);for(let t=0;t<o.length;t+=1)P(o[t]);i=!1},d(e){e&&y(t),G(o,e)}}}function He(e,t,s){let a=0,n=0;V((()=>{s(0,a=window.innerHeight),s(1,n=window.innerWidth)}));let r=[];return[a,n,r,["https://res.cloudinary.com/dt4xntymn/image/upload/v1633380455/mainSite/press/Press_2_uiz2po.jpg","https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_4_pl9uqy.jpg","https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_3_jrf0mt.jpg","https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_1_pt9bba.jpg","https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_6_idnrik.jpg","https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_5_e8oy37.jpg","https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_7_fqqhhs.jpg"],function(e){r=e,s(2,r)}]}class ze extends o{constructor(e){super(),c(this,e,He,Ge,u,{})}}function Be(e,t,s){const a=e.slice();return a[8]=t[s],a[10]=s,a}function Xe(e){let t,s;return t=new he({props:{currNav:e[1],pageContent:e[2],title:e[8].title,labels:e[8].labels}}),t.$on("navChange",e[5]),{c(){d(t.$$.fragment)},l(e){v(t.$$.fragment,e)},m(e,a){_(t,e,a),s=!0},p(e,s){const a={};2&s&&(a.currNav=e[1]),4&s&&(a.pageContent=e[2]),t.$set(a)},i(e){s||(C(t.$$.fragment,e),s=!0)},o(e){P(t.$$.fragment,e),s=!1},d(e){k(t,e)}}}function We(e){let t,s;return t=new te({props:{pagesArr:e[4],currNav:e[1]}}),t.$on("navChange",e[7]),{c(){d(t.$$.fragment)},l(e){v(t.$$.fragment,e)},m(e,a){_(t,e,a),s=!0},p(e,s){const a={};2&s&&(a.currNav=e[1]),t.$set(a)},i(e){s||(C(t.$$.fragment,e),s=!0)},o(e){P(t.$$.fragment,e),s=!1},d(e){k(t,e)}}}function Te(e){let t,s,a,n,r,i,l,o,c,u,h,b,E,D,V;a=new le({props:{text:"Apel Design"}});let S=fe,A=[];for(let m=0;m<S.length;m+=1)A[m]=Xe(Be(e,S,m));const L=e=>P(A[e],1,1,(()=>{A[e]=null}));let M=e[2]&&We(e);return{c(){t=m("div"),s=m("div"),d(a.$$.fragment),n=p(),r=m("div"),i=m("div"),l=m("img"),c=p(),u=m("div"),h=p(),b=m("div"),E=m("nav");for(let e=0;e<A.length;e+=1)A[e].c();D=p(),M&&M.c(),this.h()},l(e){t=f(e,"DIV",{class:!0});var o=g(t);s=f(o,"DIV",{class:!0});var m=g(s);v(a.$$.fragment,m),n=$(m),r=f(m,"DIV",{class:!0});var d=g(r);i=f(d,"DIV",{class:!0});var p=g(i);l=f(p,"IMG",{class:!0,src:!0,alt:!0}),p.forEach(y),c=$(d),u=f(d,"DIV",{class:!0}),g(u).forEach(y),d.forEach(y),m.forEach(y),h=$(o),b=f(o,"DIV",{class:!0});var x=g(b);E=f(x,"NAV",{class:!0});var w=g(E);for(let t=0;t<A.length;t+=1)A[t].l(w);w.forEach(y),x.forEach(y),D=$(o),M&&M.l(o),o.forEach(y),this.h()},h(){x(l,"class","logo svelte-ccahbc"),O(l.src,o="/_app/assets/AA-logo-black-mac (1)-2892f7ae.svg")||x(l,"src","/_app/assets/AA-logo-black-mac (1)-2892f7ae.svg"),x(l,"alt",""),x(i,"class","logo-container svelte-ccahbc"),x(u,"class","header-nav-container"),x(r,"class","top-nav-container"),x(s,"class","frame svelte-ccahbc"),x(E,"class","menu"),x(b,"class","menu-wrap svelte-ccahbc"),x(t,"class","container svelte-ccahbc")},m(o,m){w(o,t,m),q(t,s),_(a,s,null),q(s,n),q(s,r),q(r,i),q(i,l),q(r,c),q(r,u),q(t,h),q(t,b),q(b,E);for(let e=0;e<A.length;e+=1)A[e].m(E,null);e[6](E),q(t,D),M&&M.m(t,null),V=!0},p(e,[s]){if(14&s){let t;for(S=fe,t=0;t<S.length;t+=1){const a=Be(e,S,t);A[t]?(A[t].p(a,s),C(A[t],1)):(A[t]=Xe(a),A[t].c(),C(A[t],1),A[t].m(E,null))}for(I(),t=S.length;t<A.length;t+=1)L(t);j()}e[2]?M?(M.p(e,s),4&s&&C(M,1)):(M=We(e),M.c(),C(M,1),M.m(t,null)):M&&(I(),P(M,1,1,(()=>{M=null})),j())},i(e){if(!V){C(a.$$.fragment,e);for(let e=0;e<S.length;e+=1)C(A[e]);C(M),V=!0}},o(e){P(a.$$.fragment,e),A=A.filter(Boolean);for(let t=0;t<A.length;t+=1)P(A[t]);P(M),V=!1},d(s){s&&y(t),k(a),G(A,s),e[6](null),M&&M.d()}}}function Ze(e,t,s){let a,n="meet amit apel",r=!1;const i={"meet amit apel":{component:ve},"malibu rebuild":{component:be},"meet the team":{component:je},press:{component:ze}};return[a,n,r,i,[{title:"meet amit apel",component:ve},{title:"malibu rebuild",component:be},{title:"meet the team",component:je},{title:"press",component:ze}],e=>{console.log("test"),s(2,r=!0),i[e.detail]&&s(1,n=i[e.detail])},function(e){L[e?"unshift":"push"]((()=>{a=e,s(0,a)}))},e=>{s(2,r=!0),console.log(e),i[e.detail.title]&&s(1,n=i[e.detail.title])}]}class Fe extends o{constructor(e){super(),c(this,e,Ze,Te,u,{})}}function Re(e){let t,s,a,n,r,i;return t=new Fe({}),{c(){d(t.$$.fragment),s=p(),a=m("div"),this.h()},l(e){v(t.$$.fragment,e),s=$(e),a=f(e,"DIV",{class:!0}),g(a).forEach(y),this.h()},h(){x(a,"class","close-main")},m(l,o){_(t,l,o),w(l,s,o),w(l,a,o),n=!0,r||(i=E(a,"click",e[10]),r=!0)},p:M,i(e){n||(C(t.$$.fragment,e),n=!0)},o(e){P(t.$$.fragment,e),n=!1},d(e){k(t,e),e&&y(s),e&&y(a),r=!1,i()}}}function Ue(e){let t,s,a,n,r,i,l,o,c=e[2]&&Re(e);return{c(){t=m("div"),c&&c.c(),s=p(),a=m("img"),this.h()},l(e){t=f(e,"DIV",{style:!0,class:!0});var n=g(t);c&&c.l(n),s=$(n),a=f(n,"IMG",{src:!0,class:!0,alt:!0}),n.forEach(y),this.h()},h(){O(a.src,n=e[0].img)||x(a,"src",n),x(a,"class","cover-image svelte-rjl1is"),x(a,"alt",""),U(t,"transform","scale(0.8)"),x(t,"class",r=(e[2]?"opened":"")+" bar-container bar-"+e[0].index+" svelte-rjl1is")},m(n,r){w(n,t,r),c&&c.m(t,null),q(t,s),q(t,a),e[11](a),e[15](t),i=!0,l||(o=[E(t,"mouseenter",e[12]),E(t,"mouseleave",e[13]),E(t,"click",e[14])],l=!0)},p(e,[l]){e[2]?c?(c.p(e,l),4&l&&C(c,1)):(c=Re(e),c.c(),C(c,1),c.m(t,s)):c&&(I(),P(c,1,1,(()=>{c=null})),j()),(!i||1&l&&!O(a.src,n=e[0].img))&&x(a,"src",n),(!i||5&l&&r!==(r=(e[2]?"opened":"")+" bar-container bar-"+e[0].index+" svelte-rjl1is"))&&x(t,"class",r)},i(e){i||(C(c),i=!0)},o(e){P(c),i=!1},d(s){s&&y(t),c&&c.d(),e[11](null),e[15](null),l=!1,D(o)}}}function Je(e,a,n){let r,i,{index:o}=a,{animations:c}=a,{shouldPulse:u}=a,{barObj:m}=a,{completed:d}=a,p=!1;const h=A();let f,g;V((async()=>{var e,a;console.log(m.delay),g=S.timeline({delay:m.delay}),g.to(r,(e=l({scale:1,duration:5,opacity:1},m.position),a={ease:"power1.in"},t(e,s(a)))).to(i,{opacity:0},">-0.5").then((()=>{h("complete")})),n(9,f=S.timeline({repeat:-1,paused:!0}))}));return e.$$set=e=>{"index"in e&&n(5,o=e.index),"animations"in e&&n(6,c=e.animations),"shouldPulse"in e&&n(7,u=e.shouldPulse),"barObj"in e&&n(0,m=e.barObj),"completed"in e&&n(8,d=e.completed)},e.$$.update=()=>{128&e.$$.dirty&&u&&n(1,r.style.pointerEvents="auto",r),898&e.$$.dirty&&f&&d&&(u?(f.to(r,{opacity:0,duration:1}).to(r,{opacity:1,duration:1}),f.play()):(f.pause(),S.to(r,{opacity:1})))},[m,r,p,i,h,o,c,u,d,f,e=>{e.stopPropagation(),h("startPulse"),n(2,p=!1),S.to(r,{height:"40vh",left:m.position.left,top:0,width:m.position.width})},function(e){L[e?"unshift":"push"]((()=>{i=e,n(3,i)}))},e=>{p||S.to(r,{scale:1.2})},()=>{p||S.to(r,{scale:1})},()=>{n(2,p=!0),h("stopPulse"),S.to(r,{left:-r.offsetParent.offsetLeft,width:"100vw",height:"100vh",duration:.5,scale:1,top:-r.offsetParent.offsetTop})},function(e){L[e?"unshift":"push"]((()=>{r=e,n(1,r),n(7,u)}))}]}class Ke extends o{constructor(e){super(),c(this,e,Je,Ue,u,{index:5,animations:6,shouldPulse:7,barObj:0,completed:8})}}function Qe(e,t,s){const a=e.slice();return a[9]=t[s],a[11]=s,a}function et(e,t,s){const a=e.slice();return a[9]=t[s],a[11]=s,a}function tt(e){let t,s;return t=new ne({props:{index:e[11]}}),{c(){d(t.$$.fragment)},l(e){v(t.$$.fragment,e)},m(e,a){_(t,e,a),s=!0},p:M,i(e){s||(C(t.$$.fragment,e),s=!0)},o(e){P(t.$$.fragment,e),s=!1},d(e){k(t,e)}}}function st(e){let t,s;return t=new Ke({props:{shouldPulse:e[1],completed:e[2],custom:e[9].index,barObj:e[9]}}),t.$on("stopPulse",e[5]),t.$on("startPulse",e[6]),t.$on("complete",(function(){return e[7](e[11])})),{c(){d(t.$$.fragment)},l(e){v(t.$$.fragment,e)},m(e,a){_(t,e,a),s=!0},p(s,a){e=s;const n={};2&a&&(n.shouldPulse=e[1]),4&a&&(n.completed=e[2]),t.$set(n)},i(e){s||(C(t.$$.fragment,e),s=!0)},o(e){P(t.$$.fragment,e),s=!1},d(e){k(t,e)}}}function at(e){let t,s,a,n=e[3],r=[];for(let c=0;c<n.length;c+=1)r[c]=tt(et(e,n,c));let i=K,l=[];for(let c=0;c<i.length;c+=1)l[c]=st(Qe(e,i,c));const o=e=>P(l[e],1,1,(()=>{l[e]=null}));return{c(){t=m("div");for(let e=0;e<r.length;e+=1)r[e].c();s=p();for(let e=0;e<l.length;e+=1)l[e].c();this.h()},l(e){t=f(e,"DIV",{class:!0});var a=g(t);for(let t=0;t<r.length;t+=1)r[t].l(a);s=$(a);for(let t=0;t<l.length;t+=1)l[t].l(a);a.forEach(y),this.h()},h(){x(t,"class","bar-container svelte-mts0d2")},m(n,i){w(n,t,i);for(let e=0;e<r.length;e+=1)r[e].m(t,null);q(t,s);for(let e=0;e<l.length;e+=1)l[e].m(t,null);e[8](t),a=!0},p(e,[s]){if(22&s){let a;for(i=K,a=0;a<i.length;a+=1){const n=Qe(e,i,a);l[a]?(l[a].p(n,s),C(l[a],1)):(l[a]=st(n),l[a].c(),C(l[a],1),l[a].m(t,null))}for(I(),a=i.length;a<l.length;a+=1)o(a);j()}},i(e){if(!a){for(let e=0;e<n.length;e+=1)C(r[e]);for(let e=0;e<i.length;e+=1)C(l[e]);a=!0}},o(e){r=r.filter(Boolean);for(let t=0;t<r.length;t+=1)P(r[t]);l=l.filter(Boolean);for(let t=0;t<l.length;t+=1)P(l[t]);a=!1},d(s){s&&y(t),G(r,s),G(l,s),e[8](null)}}}function nt(e,t,s){J((()=>{}));const a=Array.from(" ".repeat(27)),n=[];let r,i=!1,l=!1;V((()=>{S.to(r,{height:"40vh",duration:5})}));return[r,i,l,a,n,()=>{console.log("stopppped"),s(1,i=!1)},()=>{console.log("stopppped"),s(1,i=!0)},e=>{n.push(e),4===n.length&&(s(2,l=!0),s(1,i=!0))},function(e){L[e?"unshift":"push"]((()=>{r=e,s(0,r)}))}]}class rt extends o{constructor(e){super(),c(this,e,nt,at,u,{})}}function it(e){let t,s,a,n,r,i,l,o,c,u,E,I,j;return r=new rt({}),{c(){t=m("div"),s=m("h5"),a=h("connecting people"),n=p(),d(r.$$.fragment),i=p(),l=m("div"),o=m("img"),u=p(),E=m("h5"),I=h("to the art of living"),this.h()},l(e){t=f(e,"DIV",{class:!0});var c=g(t);s=f(c,"H5",{class:!0});var m=g(s);a=b(m,"connecting people"),m.forEach(y),n=$(c),v(r.$$.fragment,c),i=$(c),l=f(c,"DIV",{class:!0});var d=g(l);o=f(d,"IMG",{class:!0,src:!0,alt:!0}),d.forEach(y),u=$(c),E=f(c,"H5",{class:!0});var p=g(E);I=b(p,"to the art of living"),p.forEach(y),c.forEach(y),this.h()},h(){x(s,"class","fade svelte-1u0iqmy"),x(o,"class","logo-text svelte-1u0iqmy"),O(o.src,c="/_app/assets/logo Text-6620b85f.png")||x(o,"src","/_app/assets/logo Text-6620b85f.png"),x(o,"alt",""),x(l,"class","logo-text-container fade svelte-1u0iqmy"),x(E,"class","fade svelte-1u0iqmy"),x(t,"class","container svelte-1u0iqmy")},m(e,c){w(e,t,c),q(t,s),q(s,a),q(t,n),_(r,t,null),q(t,i),q(t,l),q(l,o),q(t,u),q(t,E),q(E,I),j=!0},p:M,i(e){j||(C(r.$$.fragment,e),j=!0)},o(e){P(r.$$.fragment,e),j=!1},d(e){e&&y(t),k(r)}}}function lt(e){return V((()=>{const e=document.querySelectorAll(".fade");console.log(e),S.to(".fade",{opacity:1,delay:5})})),[]}class ot extends o{constructor(e){super(),c(this,e,lt,it,u,{})}}function ct(e){let t,s,a;return s=new ot({}),{c(){t=m("div"),d(s.$$.fragment),this.h()},l(e){t=f(e,"DIV",{class:!0});var a=g(t);v(s.$$.fragment,a),a.forEach(y),this.h()},h(){x(t,"class","container")},m(e,n){w(e,t,n),_(s,t,null),a=!0},p:M,i(e){a||(C(s.$$.fragment,e),a=!0)},o(e){P(s.$$.fragment,e),a=!1},d(e){e&&y(t),k(s)}}}function ut(e){return V((()=>{})),J((()=>{})),[]}class mt extends o{constructor(e){super(),c(this,e,ut,ct,u,{})}}export{mt as default};
