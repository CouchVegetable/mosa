(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{RXBc:function(e,t,n){"use strict";n.r(t);var a=n("q1tI"),r=n.n(a),o=n("Bl7J"),c=n("vrFN"),l=n("tRbT"),i=n("30+C"),u=n("oa/T"),s=n("ofer"),m=n("wb2y"),d=n("zkWZ"),f=n("MBC9"),v=n("toT+"),p=n("r/f7"),b=n("sYGQ"),h=n("1KIu"),E=n("Yjo7"),y=n("oz/O"),g=n("hkVh"),k=n("6LHu"),x=n("ysvj");t.default=function(){return r.a.createElement(v.a.Consumer,null,(function(e){var t=e.isSerialAvailable,n=e.connected,a=e.commandRobot,v=e.target,j=e.inputMethod,w=e.handleInputMethodChange,O=e.outputMethod,S=e.handleOutputMethodChange,R=e.settings,C=e.updateSettings;return r.a.createElement(o.a,null,r.a.createElement(c.a,{title:"Home"}),r.a.createElement(l.a,{container:!0,spacing:2,justify:"center"},r.a.createElement(l.a,{item:!0,xs:12,md:4,lg:3},r.a.createElement(i.a,null,r.a.createElement(u.a,null,r.a.createElement(s.a,null,"Input: ",!j&&"none selected"),r.a.createElement(d.a,{value:j,exclusive:!0,onChange:w},r.a.createElement(f.a,{value:"web"},"WEB"),r.a.createElement(f.a,{value:"remote",disabled:!0},"REMOTE")),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(s.a,null,"Output: ",!O&&"none selected"),r.a.createElement(d.a,{value:O,exclusive:!0,onChange:S},t&&r.a.createElement(f.a,{value:"serial"},"SERIAL"),r.a.createElement(f.a,{value:"visualizer"},"SR-VIS")),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(s.a,{variant:"caption"},"(more I/O coming soon)"),!t&&r.a.createElement(r.a.Fragment,null,r.a.createElement("br",null),r.a.createElement(s.a,null,"Could not detect serial capabilities. Please use the latest version of Chrome, open"," ",r.a.createElement("code",null,"chrome://flags"),", and set",r.a.createElement("code",null,"#enable-experimental-web-platform-features")," ","(note that these are experimental features, use at your own risk, etc etc)")))),r.a.createElement("hr",null),r.a.createElement(g.a,{target:v}),r.a.createElement("hr",null),r.a.createElement(p.a,{settings:R,updateSettings:C})),r.a.createElement(l.a,{item:!0,xs:12,md:4,lg:5},r.a.createElement(b.a,{connected:n,target:v,commandRobot:a}),r.a.createElement("hr",null),r.a.createElement(E.a,{connected:n,target:v,commandRobot:a})),r.a.createElement(l.a,{item:!0,xs:12,md:4,lg:4},r.a.createElement(h.a,{connected:n,commandRobot:a}),r.a.createElement("hr",null),r.a.createElement(k.a,{connected:n,target:v,commandRobot:a}),r.a.createElement("hr",null),r.a.createElement(x.a,{connected:n,target:v,commandRobot:a}),r.a.createElement("hr",null),r.a.createElement(y.a,{connected:n,target:v,commandRobot:a})))," ",r.a.createElement(m.a,null))}))}},ysvj:function(e,t,n){"use strict";var a=n("kD0k"),r=n.n(a),o=(n("ls82"),n("/S4K")),c=n("8o2o");function l(e){var t;if("undefined"!=typeof Symbol){if(Symbol.asyncIterator&&null!=(t=e[Symbol.asyncIterator]))return t.call(e);if(Symbol.iterator&&null!=(t=e[Symbol.iterator]))return t.call(e)}throw new TypeError("Object is not async iterable")}var i=n("q1tI"),u=n.n(i),s=n("30+C"),m=n("oa/T"),d=n("ofer"),f=n("Z3vd"),v=n("cVXz"),p=n("jjAL"),b=n("6Obz"),h=n("ZGBi"),E=n("UhlP"),y=n("o4QW"),g=n("xzpi"),k=n("rqAN");function x(e,t){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return j(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return j(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var a=0;return function(){return a>=e.length?{done:!0}:{done:!1,value:e[a++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=e[Symbol.iterator]()).next.bind(n)}function j(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}var w=function(e){var t=e.funscripts,n=e.axis,a=e.totalTime,r=e.vpos,o=Object(c.a)(e,["funscripts","axis","totalTime","vpos"]),l=Object(i.useRef)(null);Object(i.useEffect)((function(){!function(e){e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillStyle="#000000",e.beginPath(),e.moveTo(400,50);for(var r,o=x(t[n].actions);!(r=o()).done;){var c=r.value,l=c.at/a*2e4+400,i=100-c.pos;e.lineTo(l,i)}e.stroke()}(l.current.getContext("2d"))}),[t,n,a]),Object(i.useEffect)((function(){var e=Math.max(Math.floor(r/a*2e4),0);document.getElementById("fiudfzdifu").scrollLeft=e}),[r,a]);var s={maxHeight:"120px",maxWidth:"800px",overflow:"hidden"};return u.a.createElement("div",{id:"fiudfzdifu",style:s},u.a.createElement("canvas",Object.assign({width:"20800px",height:"100px",ref:l},o)))};t.a=function(e){e.connected,e.target;var t=e.commandRobot,n=Object(i.useState)("none"),a=n[0],c=n[1],j=Object(i.useState)([]),O=j[0],S=j[1],R=Object(i.useState)({}),C=R[0],A=R[1],L=Object(i.useState)(!1),I=L[0],T=L[1],M=Object(i.useState)(!0),B=M[0],V=M[1],P=Object(i.useState)(0),F=P[0],z=P[1],W=Object(i.useState)(0),D=W[0],J=W[1],U=Object(i.useState)(0),q=U[0],N=U[1],H=Object(i.useState)("100"),Y=H[0],Z=H[1],G=Object(i.useState)(0),K=G[0],Q=G[1],X=Object(i.useState)({}),_=X[0],$=X[1],ee=Object(i.useState)({}),te=ee[0],ne=ee[1],ae=Object(i.useState)({}),re=ae[0],oe=ae[1],ce=Object(i.useState)("none"),le=ce[0],ie=ce[1],ue=[["R2",".pitch.funscript"],["R1",".roll.funscript"],["R0",".twist.funscript"],["L1",".forward.funscript"],["A1",".suck.funscript"],["L0",".funscript"]];function se(){return(se=Object(o.a)(r.a.mark((function e(t){var n,a,o,l,i,u,s,m,d,f,v,p,b,h;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=function(e,t){ie("none"),c(e),ne(t);var n={};for(var a in t)n[a]=0;for(var r in oe(n),n={},t)void 0!==t[r]&&(n[r]=500);$(Object.assign({},n));var o=document.getElementById("idvideo");o.play(),o.ondurationchange=function(e){return J(1e3*e.srcElement.duration)},o.ontimeupdate=function(e){return N(1e3*e.srcElement.currentTime)}},!(t in C)){e.next=24;break}return a=C[t],e.t0=URL,e.next=6,a.entry.getFile();case 6:e.t1=e.sent,document.getElementById("idvideo").src=e.t0.createObjectURL.call(e.t0,e.t1),o={},l=x(ue);case 10:if((i=l()).done){e.next=22;break}if(!((u=i.value)[0]in a)){e.next=20;break}return e.next=15,a[u[0]].getFile();case 15:return s=e.sent,e.next=18,s.text();case 18:m=e.sent,o[u[0]]=JSON.parse(m);case 20:e.next=10;break;case 22:return n(t,o),e.abrupt("return");case 24:for(d={},document.getElementById("idvideo").src="video/"+t,f="video/"+t.replaceAll(".mp4",""),v=[],p=function(){var e=h.value;v.push(fetch(f+e[1],{headers:{"Content-Type":"application/json",Accept:"application/json"}}).then((function(t){return t.json().then((function(t){return d[e[0]]=t})).catch((function(t){console.log(t),d[e[0]]=void 0}))})).catch((function(t){console.warn(t),d[e[0]]=void 0})))},b=x(ue);!(h=b()).done;)p();Promise.allSettled(v).then((function(){n(t,d)}));case 31:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function me(){return(me=Object(o.a)(r.a.mark((function e(){var t,n,a,o,c,i,u,s,m,d,f,v,p,b,h,E,y,g;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(window.hasOwnProperty("showDirectoryPicker")){e.next=3;break}return window.alert("Your browser does not support the File Syste API"),e.abrupt("return");case 3:return e.next=5,window.showDirectoryPicker();case 5:t=e.sent,n={},a=!0,o=!1,e.prev=9,i=l(t.values());case 11:return e.next=13,i.next();case 13:return u=e.sent,a=u.done,e.next=17,u.value;case 17:if(s=e.sent,a){e.next=37;break}if("file"!==(m=s).kind){e.next=34;break}if(!m.name.endsWith(".mp4")){e.next=24;break}return m.name in n?n[m.name].entry=m:n[m.name]={name:m.name,entry:m},e.abrupt("continue",34);case 24:if(!m.name.endsWith(".funscript")){e.next=34;break}d=x(ue);case 26:if((f=d()).done){e.next=34;break}if(v=f.value,!m.name.endsWith(v[1])){e.next=32;break}return(p=m.name.replaceAll(v[1],".mp4"))in n?n[p][v[0]]=m:n[p]=((b={name:p})[v[0]]=m,b),e.abrupt("break",34);case 32:e.next=26;break;case 34:a=!0,e.next=11;break;case 37:e.next=43;break;case 39:e.prev=39,e.t0=e.catch(9),o=!0,c=e.t0;case 43:if(e.prev=43,e.prev=44,a||null==i.return){e.next=48;break}return e.next=48,i.return();case 48:if(e.prev=48,!o){e.next=51;break}throw c;case 51:return e.finish(48);case 52:return e.finish(43);case 53:for(h=[],E=0,y=Object.keys(n);E<y.length;E++)g=y[E],h.push(g);h.sort(),S(h),A(n);case 58:case"end":return e.stop()}}),e,null,[[9,39,43,53],[44,,48,52]])})))).apply(this,arguments)}Object(g.a)((function(){if(I){var e=document.getElementById("idvideo");if(e.paused)return;for(var n,a=1e3*e.currentTime-K,r=Object.assign({},_),o=Object.assign({},re),c=x(ue.map((function(e){return e[0]})));!(n=c()).done;){var l=n.value;try{if(void 0===te[l])continue;if(void 0===te[l].actions)continue;var i=!!te[l].inverted,u=te[l].actions,s=re[l];u[s].at>a&&(s=0);for(var m=s+1;m<u.length&&u[m].at<a;)m++;if(m<1)continue;s=m-1,m>=u.length&&(m=s),u[s].at>a&&(m=s);var d=u[s],f=u[m],v=10*Object(k.b)(d.pos,0,100),p=10*Object(k.b)(f.pos,0,100);i&&(v=1e3-v,p=1e3-p);var b=s!==m?1*(a-d.at)/(f.at-d.at)*1:.5,h=(1-b)*v+b*p;if("L0"===l&&B)if(h>850)F<=0?z(a):a-F>2e3&&(h=.8*Math.abs(1e3-(a-F-2e3)/4%2e3));else if(F<0){var E=Object(k.a)((a-Math.abs(F))/600,0,1);console.log("recovering "+E),h=E*h+(1-E)*r.L0,E>.95&&z(0)}else F>0&&(a-F>2e3?(z(-a),h=r.L0):z(0));r[l]=h,o[l]=s}catch(y){console.log(y)}}$(r),oe(o),t(r,0)}}),50);var de=function(e){document.getElementById("idvideo").playbackRate=parseFloat(e)/100,Z(e)},fe=function(e){var t=e.key;e.target;if(!e.repeat){if(t>="1"&&t<="9"){var n=(t-"1")/8*100,a=Object.assign({},te),r=1e3*document.getElementById("idvideo").currentTime-K;a[le].actions.push({at:Math.floor(r),pos:Math.floor(n)}),a[le].actions.sort((function(e,t){return e.at-t.at})),ne(a),console.log("Axis "+le+" has "+a[le].actions.length+" actions")}if("0"===t){var o=Object.assign({},te),c=document.getElementById("idvideo"),l=1e3*c.currentTime-K;o[le].actions=o[le].actions.filter((function(e){return e.at<l-1500||e.at>l+1500})),ne(o),c.currentTime=(l-3e3+K)/1e3}var i={q:10,w:25,e:50,r:100,t:200};t in i&&de(i[t])}};Object(i.useEffect)((function(){return window.addEventListener("keydown",fe,!0),function(){return window.removeEventListener("keydown",fe,!0)}}));Object(i.useEffect)((function(){O.length>0||fetch("video/videos.txt",{}).then((function(e){return e.text()})).then((function(e){S(e.split("\n"))}),(function(e){alert("Could not load list of video files")}))}));return u.a.createElement(s.a,null,u.a.createElement(m.a,null,u.a.createElement(d.a,{variant:"h5"},"Video ",Math.floor(_.L0)," ",Math.floor(_.R2)," ",Math.floor(_.R1)),u.a.createElement("hr",null),u.a.createElement("video",{id:"idvideo",width:"100%",controls:!0}),"none"!==le?u.a.createElement("div",{style:{position:"absolute",marginLeft:"399px",width:"2px",height:"100px",backgroundColor:"grey"}}):"","none"!==le?u.a.createElement(w,{vpos:q,funscripts:te,axis:le,totalTime:D}):""),u.a.createElement(d.a,null,"File"),u.a.createElement(f.a,{onClick:function(){return function(){return me.apply(this,arguments)}()},variant:"contained",color:"default"},"Open Client Video Folder"),u.a.createElement(v.a,{id:"idselect",value:a,onChange:function(e,t){return function(e){return se.apply(this,arguments)}(t.props.value)}},u.a.createElement(p.a,{value:"none",key:"none"},"no video"),O.map((function(e){return u.a.createElement(p.a,{value:e,key:e},e)}))),u.a.createElement(v.a,{value:Y,onChange:function(e,t){return de(t.props.value)}},u.a.createElement(p.a,{value:"10",key:"10"},"10%"),u.a.createElement(p.a,{value:"25",key:"25"},"25%"),u.a.createElement(p.a,{value:"50",key:"50"},"50%"),u.a.createElement(p.a,{value:"100",key:"100"},"100%"),u.a.createElement(p.a,{value:"200",key:"200"},"200%")),u.a.createElement(v.a,{value:le,onChange:function(e,t){return function(e){var t=Object.assign({},te);if(void 0===t[e]){t[e]={actions:[{at:0,pos:50}]},ne(t),console.log("created funscript file "+e);var n=Object.assign({},re);n[e]=0,oe(n)}ie(e)}(t.props.value)}},u.a.createElement(p.a,{value:"none",key:"none"},"none"),u.a.createElement(p.a,{value:"L0",key:"main"},"Main/L0"),u.a.createElement(p.a,{value:"R2",key:"pitch"},"Pitch/R2"),u.a.createElement(p.a,{value:"R1",key:"roll"},"Roll/R1"),u.a.createElement(p.a,{value:"R0",key:"twist"},"Twist/R0"),u.a.createElement(p.a,{value:"L1",key:"forward"},"Forward/L1"),u.a.createElement(p.a,{value:"L2",key:"left"},"Left/L2"),u.a.createElement(p.a,{value:"V0",key:"vibe1"},"Vibe1/V0"),u.a.createElement(p.a,{value:"A0",key:"valve"},"Valve/A0"),u.a.createElement(p.a,{value:"A1",key:"suck"},"Suck/A1")),u.a.createElement(f.a,{onClick:function(){return function(){var e=document.createElement("a");e.setAttribute("href","data:application/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(te[le])));for(var t,n=".json",r=x(ue);!(t=r()).done;){var o=t.value;o[0]===le&&(n=o[1])}e.setAttribute("download",a.replaceAll(".mp4",n)),e.style.display="none",document.body.appendChild(e),e.click(),document.body.removeChild(e)}()},variant:"contained",color:"default",disabled:"none"===le},"Download script"),u.a.createElement(d.a,null,"Latency"),u.a.createElement(b.a,{value:K,min:-2e3,max:2e3,step:10,track:!1,valueLabelDisplay:"auto",onChange:function(e,t){return Q(t)},marks:[{value:-1e3,label:"Video 1s early"},{value:1e3,label:"Video 1s late"}]}),u.a.createElement(h.a,{key:"moving_pauses",label:"Moving pauses",control:u.a.createElement(E.a,{checked:B,onChange:function(e){return V(!B)},name:"Moving pauses",value:"moving_pauses",color:"primary"})}),u.a.createElement(y.a,null,u.a.createElement(f.a,{onClick:function(){return function(e){T(!e)}(I)},variant:"contained",color:"default"},I?"STOP":"START")))}}}]);
//# sourceMappingURL=component---src-pages-index-js-ad6d391972f64d18b114.js.map