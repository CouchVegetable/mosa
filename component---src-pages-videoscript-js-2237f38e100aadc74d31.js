(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{UhlP:function(e,t,a){"use strict";var n=a("k1TG"),r=a("aXB2"),o=a("q1tI"),c=a("iuhU"),l=a("H2TA"),i=a("ye/S"),s=a("NqtD"),u=a("8j0Q"),d=a("yCxk"),m=a("EHdT"),f=a("PsDL"),p=o.forwardRef((function(e,t){var a=e.autoFocus,l=e.checked,i=e.checkedIcon,s=e.classes,p=e.className,b=e.defaultChecked,v=e.disabled,h=e.icon,g=e.id,E=e.inputProps,y=e.inputRef,k=e.name,j=e.onBlur,O=e.onChange,w=e.onFocus,x=e.readOnly,C=e.required,S=e.tabIndex,R=e.type,I=e.value,T=Object(r.a)(e,["autoFocus","checked","checkedIcon","classes","className","defaultChecked","disabled","icon","id","inputProps","inputRef","name","onBlur","onChange","onFocus","readOnly","required","tabIndex","type","value"]),L=Object(d.a)({controlled:l,default:Boolean(b),name:"SwitchBase",state:"checked"}),A=Object(u.a)(L,2),B=A[0],$=A[1],M=Object(m.a)(),N=v;M&&void 0===N&&(N=M.disabled);var P="checkbox"===R||"radio"===R;return o.createElement(f.a,Object(n.a)({component:"span",className:Object(c.a)(s.root,p,B&&s.checked,N&&s.disabled),disabled:N,tabIndex:null,role:void 0,onFocus:function(e){w&&w(e),M&&M.onFocus&&M.onFocus(e)},onBlur:function(e){j&&j(e),M&&M.onBlur&&M.onBlur(e)},ref:t},T),o.createElement("input",Object(n.a)({autoFocus:a,checked:l,defaultChecked:b,className:s.input,disabled:N,id:P&&g,name:k,onChange:function(e){var t=e.target.checked;$(t),O&&O(e,t)},readOnly:x,ref:y,required:C,tabIndex:S,type:R,value:I},E)),B?i:h)})),b=Object(l.a)({root:{padding:9},checked:{},disabled:{},input:{cursor:"inherit",position:"absolute",opacity:0,width:"100%",height:"100%",top:0,left:0,margin:0,padding:0,zIndex:1}},{name:"PrivateSwitchBase"})(p),v=o.forwardRef((function(e,t){var a=e.classes,l=e.className,i=e.color,u=void 0===i?"secondary":i,d=e.edge,m=void 0!==d&&d,f=e.size,p=void 0===f?"medium":f,v=Object(r.a)(e,["classes","className","color","edge","size"]),h=o.createElement("span",{className:a.thumb});return o.createElement("span",{className:Object(c.a)(a.root,l,{start:a.edgeStart,end:a.edgeEnd}[m],"small"===p&&a["size".concat(Object(s.a)(p))])},o.createElement(b,Object(n.a)({type:"checkbox",icon:h,checkedIcon:h,classes:{root:Object(c.a)(a.switchBase,a["color".concat(Object(s.a)(u))]),input:a.input,checked:a.checked,disabled:a.disabled},ref:t},v)),o.createElement("span",{className:a.track}))}));t.a=Object(l.a)((function(e){return{root:{display:"inline-flex",width:58,height:38,overflow:"hidden",padding:12,boxSizing:"border-box",position:"relative",flexShrink:0,zIndex:0,verticalAlign:"middle","@media print":{colorAdjust:"exact"}},edgeStart:{marginLeft:-8},edgeEnd:{marginRight:-8},switchBase:{position:"absolute",top:0,left:0,zIndex:1,color:"light"===e.palette.type?e.palette.grey[50]:e.palette.grey[400],transition:e.transitions.create(["left","transform"],{duration:e.transitions.duration.shortest}),"&$checked":{transform:"translateX(20px)"},"&$disabled":{color:"light"===e.palette.type?e.palette.grey[400]:e.palette.grey[800]},"&$checked + $track":{opacity:.5},"&$disabled + $track":{opacity:"light"===e.palette.type?.12:.1}},colorPrimary:{"&$checked":{color:e.palette.primary.main,"&:hover":{backgroundColor:Object(i.b)(e.palette.primary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"&$disabled":{color:"light"===e.palette.type?e.palette.grey[400]:e.palette.grey[800]},"&$checked + $track":{backgroundColor:e.palette.primary.main},"&$disabled + $track":{backgroundColor:"light"===e.palette.type?e.palette.common.black:e.palette.common.white}},colorSecondary:{"&$checked":{color:e.palette.secondary.main,"&:hover":{backgroundColor:Object(i.b)(e.palette.secondary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"&$disabled":{color:"light"===e.palette.type?e.palette.grey[400]:e.palette.grey[800]},"&$checked + $track":{backgroundColor:e.palette.secondary.main},"&$disabled + $track":{backgroundColor:"light"===e.palette.type?e.palette.common.black:e.palette.common.white}},sizeSmall:{width:40,height:24,padding:7,"& $thumb":{width:16,height:16},"& $switchBase":{padding:4,"&$checked":{transform:"translateX(16px)"}}},checked:{},disabled:{},input:{left:"-100%",width:"300%"},thumb:{boxShadow:e.shadows[1],backgroundColor:"currentColor",width:20,height:20,borderRadius:"50%"},track:{height:"100%",width:"100%",borderRadius:7,zIndex:-1,transition:e.transitions.create(["opacity","background-color"],{duration:e.transitions.duration.shortest}),backgroundColor:"light"===e.palette.type?e.palette.common.black:e.palette.common.white,opacity:"light"===e.palette.type?.38:.3}}}),{name:"MuiSwitch"})(v)},WyLx:function(e,t,a){"use strict";a.r(t);var n=a("q1tI"),r=a.n(n),o=a("Bl7J"),c=a("vrFN"),l=a("tRbT"),i=a("30+C"),s=a("oa/T"),u=a("ofer"),d=a("wb2y"),m=a("zkWZ"),f=a("MBC9"),p=a("toT+"),b=a("r/f7"),v=a("sYGQ"),h=a("ysvj"),g=a("Yjo7"),E=a("hkVh");t.default=function(){return r.a.createElement(p.a.Consumer,null,(function(e){var t=e.isSerialAvailable,a=e.connected,n=e.commandRobot,p=e.target,y=e.inputMethod,k=e.handleInputMethodChange,j=e.outputMethod,O=e.handleOutputMethodChange,w=e.settings,x=e.updateSettings;return r.a.createElement(o.a,null,r.a.createElement(c.a,{title:"Videoscript"}),r.a.createElement(l.a,{container:!0,spacing:2,justify:"center"},r.a.createElement(l.a,{item:!0,xs:4,md:4,lg:3},r.a.createElement(i.a,null,r.a.createElement(s.a,null,r.a.createElement(u.a,null,"Input: ",!y&&"none selected"),r.a.createElement(m.a,{value:y,exclusive:!0,onChange:k},r.a.createElement(f.a,{value:"web"},"WEB"),r.a.createElement(f.a,{value:"remote",disabled:!0},"REMOTE")),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(u.a,null,"Output: ",!j&&"none selected"),r.a.createElement(m.a,{value:j,exclusive:!0,onChange:O},t&&r.a.createElement(f.a,{value:"serial"},"SERIAL"),r.a.createElement(f.a,{value:"visualizer"},"SR-VIS")),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(u.a,{variant:"caption"},"(more I/O coming soon)"),!t&&r.a.createElement(r.a.Fragment,null,r.a.createElement("br",null),r.a.createElement(u.a,null,"Could not detect serial capabilities. Please use the latest version of Chrome, open"," ",r.a.createElement("code",null,"chrome://flags"),", and set",r.a.createElement("code",null,"#enable-experimental-web-platform-features")," ","(note that these are experimental features, use at your own risk, etc etc)"))))),r.a.createElement(l.a,{item:!0,xs:8},r.a.createElement(h.a,{connected:a,commandRobot:n})),r.a.createElement(l.a,{item:!0,xs:4,md:4,lg:3},r.a.createElement(b.a,{settings:w,updateSettings:x})),r.a.createElement(l.a,{item:!0,xs:4,md:4,lg:5},r.a.createElement(E.a,{target:p}),r.a.createElement("hr",null),r.a.createElement(v.a,{connected:a,target:p,commandRobot:n})),r.a.createElement(l.a,{item:!0,xs:4,md:4,lg:4},r.a.createElement(g.a,{connected:a,target:p,commandRobot:n})))," ",r.a.createElement(d.a,null))}))}},ZGBi:function(e,t,a){"use strict";var n=a("k1TG"),r=a("aXB2"),o=a("q1tI"),c=a("iuhU"),l=a("EHdT"),i=a("H2TA"),s=a("ofer"),u=a("NqtD"),d=o.forwardRef((function(e,t){e.checked;var a=e.classes,i=e.className,d=e.control,m=e.disabled,f=(e.inputRef,e.label),p=e.labelPlacement,b=void 0===p?"end":p,v=(e.name,e.onChange,e.value,Object(r.a)(e,["checked","classes","className","control","disabled","inputRef","label","labelPlacement","name","onChange","value"])),h=Object(l.a)(),g=m;void 0===g&&void 0!==d.props.disabled&&(g=d.props.disabled),void 0===g&&h&&(g=h.disabled);var E={disabled:g};return["checked","name","onChange","value","inputRef"].forEach((function(t){void 0===d.props[t]&&void 0!==e[t]&&(E[t]=e[t])})),o.createElement("label",Object(n.a)({className:Object(c.a)(a.root,i,"end"!==b&&a["labelPlacement".concat(Object(u.a)(b))],g&&a.disabled),ref:t},v),o.cloneElement(d,E),o.createElement(s.a,{component:"span",className:Object(c.a)(a.label,g&&a.disabled)},f))}));t.a=Object(i.a)((function(e){return{root:{display:"inline-flex",alignItems:"center",cursor:"pointer",verticalAlign:"middle",WebkitTapHighlightColor:"transparent",marginLeft:-11,marginRight:16,"&$disabled":{cursor:"default"}},labelPlacementStart:{flexDirection:"row-reverse",marginLeft:16,marginRight:-11},labelPlacementTop:{flexDirection:"column-reverse",marginLeft:16},labelPlacementBottom:{flexDirection:"column",marginLeft:16},disabled:{},label:{"&$disabled":{color:e.palette.text.disabled}}}}),{name:"MuiFormControlLabel"})(d)},xzpi:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var n=a("q1tI"),r=function(e,t){var a=Object(n.useRef)();Object(n.useEffect)((function(){a.current=e}),[e]),Object(n.useEffect)((function(){if(null!==t){var e=setInterval((function(){a.current()}),t);return function(){return clearInterval(e)}}}),[t])}},ysvj:function(e,t,a){"use strict";var n=a("8o2o"),r=a("q1tI"),o=a.n(r),c=a("30+C"),l=a("oa/T"),i=a("ofer"),s=a("cVXz"),u=a("jjAL"),d=a("Z3vd"),m=a("6Obz"),f=a("ZGBi"),p=a("UhlP"),b=a("o4QW"),v=a("xzpi"),h=a("rqAN");function g(e,t){var a;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(a=function(e,t){if(!e)return;if("string"==typeof e)return E(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);"Object"===a&&e.constructor&&(a=e.constructor.name);if("Map"===a||"Set"===a)return Array.from(e);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return E(e,t)}(e))||t&&e&&"number"==typeof e.length){a&&(e=a);var n=0;return function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(a=e[Symbol.iterator]()).next.bind(a)}function E(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}var y=function(e){var t=e.funscripts,a=e.axis,c=e.totalTime,l=e.vpos,i=Object(n.a)(e,["funscripts","axis","totalTime","vpos"]),s=Object(r.useRef)(null);Object(r.useEffect)((function(){!function(e){e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillStyle="#000000",e.beginPath(),e.moveTo(0,50);for(var n,r=g(t[a].actions);!(n=r()).done;){var o=n.value,l=o.at/c*2e4,i=100-o.pos;e.lineTo(l,i)}e.stroke()}(s.current.getContext("2d"))}),[t,a,c]),Object(r.useEffect)((function(){var e=Math.max(Math.floor(l/c*2e4)-400,0);document.getElementById("fiudfzdifu").scrollLeft=e}),[l,c]);var u={maxHeight:"120px",maxWidth:"800px",overflow:"scroll"};return o.a.createElement("div",{id:"fiudfzdifu",style:u},o.a.createElement("canvas",Object.assign({width:"20000px",height:"100px",ref:s},i)))};t.a=function(e){var t=e.connected,a=(e.target,e.commandRobot),n=Object(r.useState)(""),E=n[0],k=n[1],j=Object(r.useState)([]),O=j[0],w=j[1],x=Object(r.useState)(!1),C=x[0],S=x[1],R=Object(r.useState)(!0),I=R[0],T=R[1],L=Object(r.useState)(0),A=L[0],B=L[1],$=Object(r.useState)(0),M=$[0],N=$[1],P=Object(r.useState)(0),z=P[0],F=P[1],q=Object(r.useState)("100"),V=q[0],D=q[1],H=Object(r.useState)(0),U=H[0],W=H[1],G=Object(r.useState)({}),X=G[0],J=G[1],Z=Object(r.useState)({}),Q=Z[0],Y=Z[1],_=Object(r.useState)({}),K=_[0],ee=_[1],te=Object(r.useState)("none"),ae=te[0],ne=te[1],re=[["L0",".funscript"],["R2",".pitch.funscript"],["R1",".roll.funscript"],["R0",".twist.funscript"],["L1",".forward.funscript"]];Object(v.a)((function(){if(C){var e=document.getElementById("idvideo");if(e.paused)return;for(var n,r=1e3*e.currentTime-U,o=Object.assign({},X),c=Object.assign({},K),l=g(re.map((function(e){return e[0]})));!(n=l()).done;){var i=n.value;try{if(void 0===Q[i])continue;if(void 0===Q[i].actions)continue;var s=!!Q[i].inverted,u=Q[i].actions,d=K[i];u[d].at>r&&(d=0);for(var m=d+1;m<u.length&&u[m].at<r;)m++;if(m>=u.length||m<1)continue;if(u[d=m-1].at>r)continue;var f=u[d],p=u[m],b=10*Object(h.b)(f.pos,0,100),v=10*Object(h.b)(p.pos,0,100);s&&(b=1e3-b,v=1e3-v);var E=1*(r-f.at)/(p.at-f.at)*1,y=(1-E)*b+E*v;if("L0"===i&&I)if(y>850)A<=0?B(r):r-A>2e3&&(y=.8*Math.abs(1e3-(r-A-2e3)/4%2e3));else if(A<0){var k=Object(h.a)((r-Math.abs(A))/600,0,1);console.log("recovering "+k),y=k*y+(1-k)*o.L0,k>.95&&B(0)}else A>0&&(r-A>2e3?(B(-r),y=o.L0):B(0));o[i]=y,c[i]=d}catch(j){console.log(j)}}J(o),ee(c),t&&a(o,0)}}),50);var oe=function(e){var t=e.key;e.target;if(!e.repeat){if(t>="1"&&t<="9"){var a=(t-"1")/8*100,n=Object.assign({},Q),r=1e3*document.getElementById("idvideo").currentTime-U;n[ae].actions.push({at:Math.floor(r),pos:Math.floor(a)}),n[ae].actions.sort((function(e,t){return e.at-t.at})),Y(n),console.log("Axis "+ae+" has "+n[ae].actions.length+" actions")}if("0"===t){var o=Object.assign({},Q),c=document.getElementById("idvideo"),l=1e3*c.currentTime-U;o[ae].actions=o[ae].actions.filter((function(e){return e.at<l-1e3||e.at>l+500})),Y(o),c.currentTime=l/1e3-3}}};Object(r.useEffect)((function(){return window.addEventListener("keydown",oe,!0),function(){return window.removeEventListener("keydown",oe,!0)}}));return Object(r.useEffect)((function(){O.length>0||fetch("video/videos.txt",{}).then((function(e){return e.text()})).then((function(e){w(e.split("\n"))}),(function(e){alert("Could not load list of video files")}))})),o.a.createElement(c.a,null,o.a.createElement(l.a,null,o.a.createElement(i.a,{variant:"h5"},"Video ",Math.floor(X.L0)," ",Math.floor(X.R2)," ",Math.floor(X.R1)),o.a.createElement("hr",null),o.a.createElement("video",{id:"idvideo",width:"100%",controls:!0}),"none"!==ae?o.a.createElement(y,{vpos:z,funscripts:Q,axis:ae,totalTime:M}):""),o.a.createElement(i.a,null,"File"),o.a.createElement(s.a,{id:"idselect",value:E,onChange:function(e,t){return function(e){var t={};document.getElementById("idvideo").src="video/"+e;for(var a,n="video/"+e.replaceAll(".mp4",""),r=[],o=function(){var e=a.value;r.push(fetch(n+e[1],{headers:{"Content-Type":"application/json",Accept:"application/json"}}).then((function(a){return a.json().then((function(a){return t[e[0]]=a})).catch((function(a){console.log(a),t[e[0]]=void 0}))})).catch((function(a){console.warn(a),t[e[0]]=void 0})))},c=g(re);!(a=c()).done;)o();Promise.allSettled(r).then((function(){ne("none"),k(e),Y(t);var a={};for(var n in t)a[n]=0;for(var r in ee(a),a={},t)void 0!==t[r]&&(a[r]=500);J(Object.assign({},a));var o=document.getElementById("idvideo");o.play(),o.ondurationchange=function(e){return N(1e3*e.srcElement.duration)},o.ontimeupdate=function(e){return F(1e3*e.srcElement.currentTime)}}))}(t.props.value)}},O.map((function(e){return o.a.createElement(u.a,{value:e,key:e},e)}))),o.a.createElement(s.a,{value:V,onChange:function(e,t){return a=t.props.value,document.getElementById("idvideo").playbackRate=parseFloat(a)/100,void D(a);var a}},o.a.createElement(u.a,{value:"10",key:"10"},"10%"),o.a.createElement(u.a,{value:"25",key:"25"},"25%"),o.a.createElement(u.a,{value:"50",key:"50"},"50%"),o.a.createElement(u.a,{value:"100",key:"100"},"100%")),o.a.createElement(s.a,{value:ae,onChange:function(e,t){return function(e){var t=Object.assign({},Q);if(void 0===t[e]){t[e]={actions:[{at:0,pos:50}]},Y(t),console.log("created funscript file "+e);var a=Object.assign({},K);a[e]=0,ee(a)}ne(e)}(t.props.value)}},o.a.createElement(u.a,{value:"none",key:"none"},"none"),o.a.createElement(u.a,{value:"L0",key:"main"},"Main/L0"),o.a.createElement(u.a,{value:"R2",key:"pitch"},"Pitch/R2"),o.a.createElement(u.a,{value:"R1",key:"roll"},"Roll/R1"),o.a.createElement(u.a,{value:"R0",key:"twist"},"Twist/R0"),o.a.createElement(u.a,{value:"L1",key:"forward"},"Forward/L1"),o.a.createElement(u.a,{value:"L2",key:"left"},"Left/L2"),o.a.createElement(u.a,{value:"V0",key:"vibe1"},"Vibe1/V0"),o.a.createElement(u.a,{value:"A0",key:"valve"},"Valve/A0"),o.a.createElement(u.a,{value:"A1",key:"suck"},"Suck/A1")),o.a.createElement(d.a,{onClick:function(){return function(){var e=document.createElement("a");e.setAttribute("href","data:application/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(Q[ae])));for(var t,a=".json",n=g(re);!(t=n()).done;){var r=t.value;r[0]===ae&&(a=r[1])}e.setAttribute("download",E.replaceAll(".mp4",a)),e.style.display="none",document.body.appendChild(e),e.click(),document.body.removeChild(e)}()},variant:"contained",color:"default",disabled:"none"===ae},"Download script"),o.a.createElement(i.a,null,"Latency"),o.a.createElement(m.a,{value:U,min:-2e3,max:2e3,step:10,track:!1,valueLabelDisplay:"auto",onChange:function(e,t){return W(t)},marks:[{value:-1e3,label:"Video 1s early"},{value:1e3,label:"Video 1s late"}]}),o.a.createElement(f.a,{key:"moving_pauses",label:"Moving pauses",control:o.a.createElement(p.a,{checked:I,onChange:function(e){return T(!I)},name:"Moving pauses",value:"moving_pauses",color:"primary"})}),o.a.createElement(b.a,null,o.a.createElement(d.a,{onClick:function(){return function(e){S(!e)}(C)},variant:"contained",color:"default"},C?"STOP":"START")))}}}]);
//# sourceMappingURL=component---src-pages-videoscript-js-2237f38e100aadc74d31.js.map