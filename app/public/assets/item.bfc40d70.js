import{_ as y}from"./Card.0f515d6a.js";import{d as c,J as g,K as i,S as d,Q as p,M as s,Y as o,A as l,L as h,_ as q,N as f,q as v,f as S,P as x}from"./@vue.f0dd5f4e.js";import{i as B}from"./ant-design-vue.f3cea403.js";import{p as C}from"./@ant-design.7151a3c8.js";const A=c({props:{color:{type:null,required:!1},title:{type:String,required:!1},description:{type:String,required:!1},size:{type:String,required:!1},closeCollapse:{type:Boolean,required:!1}},setup(e){const t=e;let{color:r,title:a,size:n,closeCollapse:_,description:u}=g(t);return(m,j)=>(i(),d(y,{bordered:!1,color:l(r),title:l(a),size:l(n),description:l(u),"close-collapse":l(_)},{default:p(()=>[s("div",null,[o(m.$slots,"default")])]),_:3},8,["color","title","size","description","close-collapse"]))}}),b={style:{"text-align":"left"},class:"padding-top-6"},$={class:"space-10 ai-center flex"},w={class:"flex nowrap space-10",style:{width:"fit-content"}},z={class:"flex",style:{width:"fit-content","text-align":"left"}},N={class:"flex",style:{width:"fit-content"}},D=c({props:{label:{type:String,required:!1},description:{type:String,required:!1},text:{type:null,required:!1},fontBold:{type:Boolean,required:!1}},setup(e){return(t,r)=>{const a=C,n=B;return i(),h("div",b,[s("span",$,[o(t.$slots,"befor"),s("span",w,[o(t.$slots,"label",{},()=>[s("span",{style:q(e.fontBold?{fontWeight:"bold"}:{})},f(e.label?e.label+" :":""),5)]),s("span",z,[o(t.$slots,"default",{},()=>[v(f(e.text),1)])])]),s("span",N,[o(t.$slots,"after")]),e.description?(i(),d(n,{key:0,placement:"rightTop",content:e.description},{default:p(()=>[S(a)]),_:1},8,["content"])):x("",!0)])])}}});export{A as _,D as a};
