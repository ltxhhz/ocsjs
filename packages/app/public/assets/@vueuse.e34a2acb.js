import{g as _,o as j,C as P,w as v,$ as W,a0 as x,a1 as p,a2 as C,r as J}from"./@vue.673b5b32.js";function L(e){return W()?(x(e),!0):!1}const $=typeof window!="undefined",A=e=>typeof e=="string",y=()=>{};function N(e,n){function r(...t){e(()=>n.apply(this,t),{fn:n,thisArg:this,args:t})}return r}const D=e=>e();function M(e,n={}){let r,t;return o=>{const l=p(e),a=p(n.maxWait);if(r&&clearTimeout(r),l<=0||a!==void 0&&a<=0)return t&&(clearTimeout(t),t=null),o();a&&!t&&(t=setTimeout(()=>{r&&clearTimeout(r),t=null,o()},a)),r=setTimeout(()=>{t&&clearTimeout(t),t=null,o()},l)}}function K(e,n=200,r={}){return N(M(n,r),e)}var b=Object.getOwnPropertySymbols,R=Object.prototype.hasOwnProperty,z=Object.prototype.propertyIsEnumerable,G=(e,n)=>{var r={};for(var t in e)R.call(e,t)&&n.indexOf(t)<0&&(r[t]=e[t]);if(e!=null&&b)for(var t of b(e))n.indexOf(t)<0&&z.call(e,t)&&(r[t]=e[t]);return r};function H(e,n,r={}){const t=r,{eventFilter:i=D}=t,o=G(t,["eventFilter"]);return v(e,N(i,n),o)}function Q(e,n=!0){_()?j(e):n?e():P(e)}function X(e,n,r){return v(e,(t,i,o)=>{t&&n(t,i,o)},r)}function U(e){var n;const r=p(e);return(n=r==null?void 0:r.$el)!=null?n:r}const d=$?window:void 0;function T(...e){let n,r,t,i;if(A(e[0])?([r,t,i]=e,n=d):[n,r,t,i]=e,!n)return y;let o=y;const l=v(()=>p(n),f=>{o(),f&&(f.addEventListener(r,t,i),o=()=>{f.removeEventListener(r,t,i),o=y})},{immediate:!0,flush:"post"}),a=()=>{l(),o()};return L(a),a}function Y(e,n,r={}){const{window:t=d,event:i="pointerdown"}=r;return t?T(t,i,l=>{const a=U(e);!a||a===l.target||l.composedPath().includes(a)||n(l)},{passive:!0}):void 0}const V={boolean:{read:e=>e==="true",write:e=>String(e)},object:{read:e=>JSON.parse(e),write:e=>JSON.stringify(e)},number:{read:e=>Number.parseFloat(e),write:e=>String(e)},any:{read:e=>e,write:e=>String(e)},string:{read:e=>e,write:e=>String(e)},map:{read:e=>new Map(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e.entries()))},set:{read:e=>new Set(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e.entries()))}};function q(e,n,r=(i=>(i=d)==null?void 0:i.localStorage)(),t={}){var i;const{flush:o="pre",deep:l=!0,listenToStorageChanges:a=!0,writeDefaults:f=!0,shallow:E,window:O=d,eventFilter:F,onError:g=u=>{console.error(u)}}=t,s=p(n),I=s==null?"any":s instanceof Set?"set":s instanceof Map?"map":typeof s=="boolean"?"boolean":typeof s=="string"?"string":typeof s=="object"||Array.isArray(s)?"object":Number.isNaN(s)?"any":"number",c=(E?C:J)(n),m=(i=t.serializer)!=null?i:V[I];function S(u){if(!(!r||u&&u.key!==e))try{const w=u?u.newValue:r.getItem(e);w==null?(c.value=s,f&&s!==null&&r.setItem(e,m.write(s))):c.value=m.read(w)}catch(w){g(w)}}return S(),O&&a&&T(O,"storage",u=>setTimeout(()=>S(u),0)),r&&H(c,()=>{try{c.value==null?r.removeItem(e):r.setItem(e,m.write(c.value))}catch(u){g(u)}},{flush:o,deep:l,eventFilter:F}),c}function Z(e,n,r={}){const{window:t=d}=r;return q(e,n,t==null?void 0:t.localStorage,r)}var h;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(h||(h={}));export{K as a,Y as o,Q as t,Z as u,X as w};