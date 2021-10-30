import{h as P,M as Q,b as U,B as W,i as X,c as k,S as G,j as H,k as J,C as R,D as Y,g as Z}from"./ant-design-vue.f3cea403.js";import{d as ee,j as h,K as i,L as _,A as y,f as t,Q as e,F as B,O as C,S as F,M as m,N as u,t as te,m as oe,v as se,X as ne,P as x,q as d}from"./@vue.f0dd5f4e.js";import{t as D,T as w}from"./task.26aecec3.js";import{_ as ae}from"./Card.0f515d6a.js";import{v as ie,l as ue,_ as le,L as re}from"./@ant-design.7151a3c8.js";import"./@babel.75b79d9b.js";import"./regenerator-runtime.83f8288d.js";import"./array-tree-filter.28ee0a5d.js";import"./omit.js.0925d6dc.js";import"./lodash-es.ba98d3f1.js";import"./moment.08a7f518.js";import"./warning.ca82f8e0.js";import"./resize-observer-polyfill.8deb1e21.js";import"./async-validator.1fa0d626.js";import"./scroll-into-view-if-needed.c68eec67.js";import"./compute-scroll-into-view.6058b3be.js";import"./dom-align.f1b5d360.js";import"./vue-types.6e6d84ba.js";import"./index.76eb39cb.js";import"./mark-ui.80cd89aa.js";import"./vue-router.51efbbda.js";import"./@ctrl.2e36ce53.js";const ce={id:"task-layout"},_e={key:0,style:{width:"100%",height:"100%"},class:"flex jc-center ac-center ai-center"},de=d(" \u8BF7\u5728\u8D26\u53F7\u7BA1\u7406\u754C\u9762\u9009\u62E9\u8D26\u53F7\u542F\u52A8 "),pe={class:"flex jc-flex-start ai-baseline space-10"},me={class:"flex jc-flex-end ai-center ac-center space-10"},fe=["textContent"],Ie=ee({setup(ve){const f=h(""),v=h(!1),l=h(void 0);function E(n){const r=w(n.target).filter(o=>o.status==="process");if(r&&r.length!==0){const o=r[r.length-1];return`[${o==null?void 0:o.name}] : `+((o==null?void 0:o.msg)||b(o)||"")}}function T(n){l.value=n,v.value=!0}function b(n){return n.msg?n.msg:n.status==="wait"?"\u7B49\u5F85\u4E2D":n.status==="process"?"\u6B63\u5728\u8FD0\u884C":n.status==="finish"?"\u5DF2\u5B8C\u6210":"\u9519\u8BEF"}return(n,c)=>{const r=P,o=U,S=ie,g=W,j=X,$=ue,A=le,L=k,M=re,O=G,z=H,N=J,V=R,p=Y,I=Z,q=Q;return i(),_("div",ce,[y(D).length===0?(i(),_("div",_e,[t(r,{description:""},{default:e(()=>[de]),_:1})])):(i(!0),_(B,{key:1},C(y(D),s=>(i(),_("div",null,[s.target&&s.course&&s.user?(i(),F(ae,{key:0,color:"blue",onMousemove:a=>f.value=s.course.id,onMouseleave:c[0]||(c[0]=a=>f.value="")},{title:e(()=>[t(L,{class:"flex"},{default:e(()=>[t(o,{span:8},{default:e(()=>[m("span",pe,[m("span",null,u(s.user.name)+" - "+u(s.course.name),1)])]),_:2},1024),t(o,{span:16},{default:e(()=>[t(te,{name:"fade"},{default:e(()=>[oe(m("span",me,[t(j,{content:"\u4EFB\u52A1\u7F6E\u9876"},{default:e(()=>[t(g,{type:"primary",shape:"circle",size:"small"},{icon:e(()=>[t(S)]),_:1})]),_:1}),t(j,{content:"\u8BE6\u60C5"},{default:e(()=>[t(g,{type:"primary",shape:"circle",size:"small",onClick:a=>T(s.target)},{icon:e(()=>[t($)]),_:2},1032,["onClick"])]),_:2},1024),t(j,{content:"\u5173\u95ED\u4EFB\u52A1"},{default:e(()=>[t(g,{type:"primary",shape:"circle",danger:"",size:"small"},{icon:e(()=>[t(A)]),_:1})]),_:1})],512),[[se,f.value===s.course.id]])]),_:2},1024)]),_:2},1024)]),_:2},1024)]),body:e(()=>[t(V,{bordered:!1,style:{"text-align":"left"}},{default:e(()=>[t(N,{style:{background:"#f7f7f7","border-radius":"4px",border:"0",overflow:"hidden"},header:E(s)||"\u4EFB\u52A1\u5168\u90E8\u5B8C\u6210\uFF01"},{default:e(()=>[t(z,{direction:"vertical",size:"small"},{default:e(()=>[(i(!0),_(B,null,C(y(w)(s.target),(a,K)=>(i(),F(O,{key:K,title:a.name,status:a.status,"sub-title":a.createTime?new Date(a.createTime).toLocaleString():""},ne({description:e(()=>[m("div",{textContent:u(a.msg||b(a))},null,8,fe)]),_:2},[a.status==="process"?{name:"icon",fn:e(()=>[t(M)])}:void 0]),1032,["title","status","sub-title"]))),128))]),_:2},1024)]),_:2},1032,["header"])]),_:2},1024)]),_:2},1032,["onMousemove"])):x("",!0)]))),256)),t(q,{visible:v.value,"onUpdate:visible":c[1]||(c[1]=s=>v.value=s),footer:!1},{default:e(()=>[l.value?(i(),F(I,{key:0,column:1,labelStyle:{fontWeight:"bold"}},{default:e(()=>[t(p,{label:"\u5F53\u524D\u4EFB\u52A1\u540D"},{default:e(()=>[d(u(l.value.name),1)]),_:1}),t(p,{label:"\u8FD0\u884C\u72B6\u6001"},{default:e(()=>[d(u(b(l.value)),1)]),_:1}),t(p,{label:"\u5F00\u59CB\u65F6\u95F4"},{default:e(()=>[d(u(new Date(l.value.createTime).toLocaleString()),1)]),_:1}),t(p,{label:"\u4EFB\u52A1\u7F16\u53F7"},{default:e(()=>[d(u(l.value.id),1)]),_:1})]),_:1})):x("",!0)]),_:1},8,["visible"])])}}});export{Ie as default};
