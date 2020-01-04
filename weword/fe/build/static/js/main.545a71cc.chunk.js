(window.webpackJsonpfe=window.webpackJsonpfe||[]).push([[0],{119:function(e,t){},122:function(e,t,n){},123:function(e,t,n){},128:function(e,t,n){},129:function(e,t,n){},157:function(e,t,n){},158:function(e,t,n){},159:function(e,t,n){},160:function(e,t,n){},161:function(e,t,n){},170:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),s=n(21),o=n.n(s),i=(n(90),n(4)),l=n(5),c=n(7),u=n(6),m=n(8),h=n(23),p=n(14),d=n(11),b=n.n(d),g=n(17),v=n(79),y=n.n(v),E=(n(122),n(10)),f=(n(123),n(22)),w=n(16),j=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={word:"",error:""},n.handleChange=n.handleChange.bind(Object(E.a)(n)),n.handleSubmit=n.handleSubmit.bind(Object(E.a)(n)),n}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this.props.storyId;w.a.pageview("/stories/"+e)}},{key:"handleChange",value:function(e){this.setState({word:e.target.value,error:""})}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault();var n=this.props.storyId;this.props.socket.emit("addWord",{word:this.state.word.trim(),room:n,username:this.props.name},(function(e){e?(w.a.event({category:"Users",action:"Failed write"}),t.setState({error:e})):(w.a.event({category:"Users",action:"Successful write"}),t.setState({word:""}))}))}},{key:"render",value:function(){return r.a.createElement("div",{className:"footer "+(this.props.inactive?"inactive":"")},r.a.createElement("form",{onSubmit:this.handleSubmit},r.a.createElement("h1",null,"Add a word:"),r.a.createElement("input",{type:"text",onChange:this.handleChange,value:this.state.word,className:"add-word-input "+(this.state.error?"error":"")}),r.a.createElement("input",{type:"submit",value:"submit",className:"button"})),r.a.createElement("p",{id:"error-msg"},this.state.error))}}]),t}(a.Component),k=Object(f.b)((function(e){return{name:e.name,loggedIn:e.loggedIn}}))(j),O=(n(128),n(129),function(e){function t(){return Object(i.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement(h.b,{to:"/"},r.a.createElement("div",{className:"logo-box",style:{borderWidth:this.props.size/15,width:this.props.size+"px",height:this.props.size+"px"}},r.a.createElement("p",{className:"logo-line-1",style:{fontSize:this.props.size/3.5+"px"}},"We"),r.a.createElement("p",{className:"logo-line-2",style:{fontSize:this.props.size/3.5+"px"}},"Word")))}}]),t}(r.a.Component)),C=n(28),S=n(29),N=function(e){function t(){return Object(i.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e,t,n,a,s=this.props.story.rules,o=!1;return this.props.story.customRules&&(e=1!==s.minLength||16!==s.maxLength&&50!==s.maxLength,t=1!==s.minWords||1!==s.maxWords,n=s.bannedWords.length>0,a=s.bannedCharacters.length>0,o=e||t||a||n),r.a.createElement("div",{className:"left-navbar"},r.a.createElement(O,{size:"80"}),r.a.createElement("h1",null,this.props.story.name),r.a.createElement("p",null,this.props.story.description),this.props.story.customRules&&r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"divider"}),r.a.createElement("div",{className:"rules"},o&&r.a.createElement("h3",null,r.a.createElement(C.a,{icon:S.b,className:"icon"}),"Custom Rules"),e&&r.a.createElement("p",null,r.a.createElement("span",null,"Word length:")," ",s.minLength,"-",s.maxLength," letters"),t&&r.a.createElement("p",null,r.a.createElement("span",null,"Sentence length:")," ",s.minWords,"-",s.maxWords," words"),n&&r.a.createElement("p",null,r.a.createElement("span",null,"Banned words:")," ",s.bannedWords.join(", ")),a&&r.a.createElement("p",null,r.a.createElement("span",null,"Banned letters:")," ",s.bannedCharacters.join(", ")))),r.a.createElement("div",{className:"divider"}),r.a.createElement("h3",null,"Currently online"),this.props.users.map((function(e,t){return r.a.createElement("div",{className:"user",key:"user"+t},r.a.createElement("div",{className:"online"}),r.a.createElement("p",null,e))})))}}]),t}(a.Component),x=n(26),W=n.n(x),I=n(172),L=n(171),R=n(82),D=n.n(R),z=n(47),M=function(e){function t(){var e;return Object(i.a)(this,t),(e=Object(c.a)(this,Object(u.a)(t).call(this))).state={story:{},words:[],endpoint:"https://weword.co",socket:null,users:[],disabled:!1},e}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentWillUnmount",value:function(){this.state.socket.close()}},{key:"componentDidMount",value:function(){var e=Object(g.a)(b.a.mark((function e(){var t,n,a,r,s,o,i=this;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.props.match.params.storyId,n=!1,a=this.state.endpoint,e.prev=3,e.next=6,W.a.get(a+"/stories/"+t);case 6:r=e.sent,s=r.data.story,this.setState({story:s}),o=y()(a),this.setState({socket:o}),o.emit("join",{room:t,username:this.props.name},(function(e){e&&(alert(e),i.props.history.push("/"))})),o.on("sendWords",(function(e){i.setState({words:e}),n||(n=!0,setTimeout(Object(g.a)(b.a.mark((function e(){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:z.animateScroll.scrollToBottom();case 1:case"end":return e.stop()}}),e)}))),750))})),o.on("disable",(function(e){i.setState({disabled:!0})})),o.on("enable",(function(e){i.setState({disabled:!1})})),o.on("sendUsers",(function(e){i.setState({users:e})})),e.next=21;break;case 18:e.prev=18,e.t0=e.catch(3),console.error(e.t0);case 21:case"end":return e.stop()}}),e,this,[[3,18]])})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.state.words;return r.a.createElement("div",null,r.a.createElement(N,{story:this.state.story,users:this.state.users}),r.a.createElement("div",{className:"content-outer"},r.a.createElement("div",{className:"content"},r.a.createElement(I.a,null,e.map((function(e,t){var n=D()(e.createdAt).format("MM-DD-YYYY h:mm A");return r.a.createElement(L.a,{key:"transition"+t,timeout:500,classNames:"word"},r.a.createElement(r.a.Fragment,null,r.a.createElement("p",{key:t,className:"word"},e.word),r.a.createElement("span",{className:"user-view"},"by ",r.a.createElement("span",{className:"bold"},e.author)," on ",n)))})),r.a.createElement("div",{className:"next-word"})))),r.a.createElement(k,{inactive:this.state.disabled,socket:this.state.socket,storyId:this.state.story._id}))}}]),t}(a.Component),F=Object(f.b)((function(e){return{name:e.name,loggedIn:e.loggedIn}}))(M),U=(n(157),"LOGIN"),_="LOGOUT";var B=function(e){function t(){var e;return Object(i.a)(this,t),(e=Object(c.a)(this,Object(u.a)(t).call(this))).state={typedName:"",error:null,endpoint:"https://weword.co"},e.handleInputChange=e.handleInputChange.bind(Object(E.a)(e)),e.handleSubmit=e.handleSubmit.bind(Object(E.a)(e)),e}return Object(m.a)(t,e),Object(l.a)(t,[{key:"handleInputChange",value:function(e){var t=e.target.value;this.setState({typedName:t,error:null})}},{key:"handleSubmit",value:function(){var e=Object(g.a)(b.a.mark((function e(t){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t.preventDefault();try{this.props.loggedIn?this.props.logout():this.props.login(this.state.typedName),this.setState({typedName:""})}catch(n){this.setState({error:n.message})}case 2:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){return r.a.createElement("form",{id:"login",onSubmit:this.handleSubmit},this.props.loggedIn?r.a.createElement(r.a.Fragment,null,r.a.createElement("h2",null,"Writing as ",this.props.name),r.a.createElement("input",{type:"submit",value:"Log out"})):r.a.createElement(r.a.Fragment,null,r.a.createElement("input",{type:"text",name:"name",placeholder:"what's your name?",value:this.state.typedName,onChange:this.handleInputChange}),r.a.createElement("input",{type:"submit",value:"Log in"}),r.a.createElement("p",{className:"error",style:{display:this.state.error?"block":"none"}},this.state.error||"Couldn't log in")))}}]),t}(a.Component),A=Object(f.b)((function(e){return{name:e.name,loggedIn:e.loggedIn}}),(function(e){return{login:function(t){return e({type:U,payload:t})},logout:function(){return e({type:_})}}}))(B),T=(n(158),function(e){function t(){return Object(i.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"book-outer "+(this.props.create?"create":"")},this.props.create?r.a.createElement("div",{className:"book-single"},r.a.createElement("h1",null,"create a new story"),r.a.createElement(C.a,{icon:S.a,className:"create-book"})):r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"book-header"},r.a.createElement("h1",null,this.props.story.name),r.a.createElement("p",null,this.props.story.description)),r.a.createElement("div",{className:"book-footer"},r.a.createElement("p",null,this.props.story.length," words"),this.props.story.customRules?r.a.createElement("div",{className:"custom-outer"},r.a.createElement(C.a,{icon:S.b,className:"custom-icon"}),r.a.createElement("p",null,"Custom rules")):r.a.createElement(r.a.Fragment,null),this.props.story.onlineCount?r.a.createElement("div",{className:"online-outer"},r.a.createElement("div",{className:"online"}),r.a.createElement("p",{className:"online-text"},this.props.story.onlineCount," writers online")):r.a.createElement(r.a.Fragment,null))))}}]),t}(a.Component)),Y=(n(159),function(e){function t(){var e;return Object(i.a)(this,t),(e=Object(c.a)(this,Object(u.a)(t).call(this))).state={stories:[],endpoint:"https://weword.co"},e}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=Object(g.a)(b.a.mark((function e(){var t,n,a;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.state.endpoint,e.prev=1,e.next=4,W.a.get(t+"/stories");case 4:n=e.sent,a=n.data.stories,this.setState({stories:a}),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(1),console.error(e.t0);case 12:case"end":return e.stop()}}),e,this,[[1,9]])})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.state.stories;return r.a.createElement("div",{className:"everything-outer"},r.a.createElement(O,{size:"150"}),r.a.createElement("h1",null,"Write a story with a bunch of random people online"),r.a.createElement("p",null,"(and follow us at ",r.a.createElement("a",{href:"https://twitter.com/weword_co",className:"link",target:"_blank"},"@weword_co")," or give ",r.a.createElement("a",{className:"link",target:"_blank",href:"https://docs.google.com/forms/d/e/1FAIpQLSdTaoCoy686evMyAnDO5djYzo3JxUpRk2UFRQIM7rZ8iR49sw/viewform?usp=sf_link"},"anonymous feedback")," while you're at it)"),r.a.createElement(A,null),r.a.createElement(I.a,{className:"books-outer"},e.sort((function(e,t){return e.onlineCount===t.onlineCount?e.length<t.length?1:-1:e.onlineCount<t.onlineCount?1:-1})).map((function(e,t){return r.a.createElement(L.a,{key:e._id,timeout:500,style:{transitionDelay:50*t+"ms"},classNames:"story"},r.a.createElement(h.b,{to:"/stories/"+e._id},r.a.createElement(T,{story:e})))})),r.a.createElement(L.a,{key:"create",timeout:50*e.length+"ms",style:{transitionDelay:50*e.length+"ms"},appear:!0,classNames:"story"},r.a.createElement(h.b,{to:"/create"},r.a.createElement(T,{create:!0})))))}}]),t}(a.Component)),J=Object(p.f)(Y),G=n(52),H=(n(160),function(e){function t(){var e;return Object(i.a)(this,t),(e=Object(c.a)(this,Object(u.a)(t).call(this))).state={title:"",description:"",error:null,customRules:!1,rulesShown:!1,minLength:1,maxLength:16,minWords:1,maxWords:1,bannedCharacters:"",bannedWords:"",endpoint:"https://weword.co"},e.handleInputChange=e.handleInputChange.bind(Object(E.a)(e)),e.handleSubmit=e.handleSubmit.bind(Object(E.a)(e)),e.toggleRulesShown=e.toggleRulesShown.bind(Object(E.a)(e)),e}return Object(m.a)(t,e),Object(l.a)(t,[{key:"toggleRulesShown",value:function(e){e.preventDefault(),this.setState({rulesShown:!this.state.rulesShown})}},{key:"handleInputChange",value:function(e){var t,n=e.target,a=n.value,r=n.name;"description"!==r&&"title"!==r&&this.setState({customRules:!0}),console.log(r),console.log(this.state.customRules),this.setState((t={},Object(G.a)(t,r,a),Object(G.a)(t,"error",null),t))}},{key:"handleSubmit",value:function(){var e=Object(g.a)(b.a.mark((function e(t){var n,a,r;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),n={name:this.state.title,description:this.state.description,customRules:this.state.customRules,rules:{minLength:this.state.minLength,maxLength:this.state.maxLength,minWords:this.state.minWords,maxWords:this.state.maxWords,bannedWords:this.state.bannedWords,bannedCharacters:this.state.bannedCharacters}},e.prev=2,e.next=5,W.a.post(this.state.endpoint+"/create",null,{params:n});case 5:a=e.sent,r=a.data,w.a.pageview("/stories/create"),w.a.event({category:"Users",action:"Book creation"}),this.props.history.push("/stories/"+r.story._id),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(2),e.t0.response?this.setState({error:e.t0.response.data.message}):this.setState({error:"Error in creating your story"});case 15:case"end":return e.stop()}}),e,this,[[2,12]])})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){return r.a.createElement("div",{className:"everything-outer"},r.a.createElement(O,{size:"150"}),r.a.createElement("h1",null,"Let's start something great"),r.a.createElement("form",{onSubmit:this.handleSubmit},r.a.createElement("label",null,"Title",r.a.createElement("span",null,"Think of something short and sweet")),r.a.createElement("input",{type:"text",name:"title",value:this.state.title,onChange:this.handleInputChange}),r.a.createElement("label",null,"Description",r.a.createElement("span",null,"What's this thing even about?")),r.a.createElement("input",{type:"text",name:"description",value:this.state.description,onChange:this.handleInputChange}),r.a.createElement("div",{className:"input-button",onClick:this.toggleRulesShown},"Add custom rules"),r.a.createElement("div",{className:"rules-outer",style:{display:this.state.rulesShown?"block":"none"}},r.a.createElement("label",null,"Word length",r.a.createElement("span",null,"How long can each word be?")),"Minimum characters: ",r.a.createElement("input",{min:"1",max:"16",type:"number",name:"minLength",value:this.state.minLength,onChange:this.handleInputChange}),"Maximum characters: ",r.a.createElement("input",{min:"1",max:"16",type:"number",name:"maxLength",value:this.state.maxLength,onChange:this.handleInputChange}),r.a.createElement("label",null,"Sentence length",r.a.createElement("span",null,"How many words can each submission have?")),"Minimum words: ",r.a.createElement("input",{min:"1",max:"16",type:"number",name:"minWords",value:this.state.minWords,onChange:this.handleInputChange}),"Maximum words: ",r.a.createElement("input",{min:"1",max:"16",type:"number",name:"maxWords",value:this.state.maxWords,onChange:this.handleInputChange}),r.a.createElement("label",null,"Banned words",r.a.createElement("span",null,"Separate any banned words with spaces or commas")),r.a.createElement("input",{type:"text",name:"bannedWords",value:this.state.bannedWords,onChange:this.handleInputChange}),r.a.createElement("label",null,"Banned characters",r.a.createElement("span",null,"Separate any banned characters with spaces or commas")),r.a.createElement("input",{type:"text",name:"bannedCharacters",value:this.state.bannedCharacters,onChange:this.handleInputChange})),r.a.createElement("input",{type:"submit",value:"Submit"}),r.a.createElement("p",{className:"error",style:{display:this.state.error?"block":"none"}},this.state.error&&this.state.error.split(":")[this.state.error.split(":").length-1])))}}]),t}(a.Component)),Q=Object(p.f)(H),P=(n(161),function(e){function t(){return Object(i.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentWillMount",value:function(){document.title="WeWord"}},{key:"render",value:function(){return r.a.createElement("div",{className:"outer"},r.a.createElement(h.a,null,r.a.createElement(p.c,null,r.a.createElement(p.a,{path:"/create",component:Q}),r.a.createElement(p.a,{path:"/stories/:storyId",component:F}),r.a.createElement(p.a,{path:"/",component:J}))))}}]),t}(a.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var Z=n(36),$=new(n(162)),q={loggedIn:!1,name:""};var K=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:q,t=arguments.length>1?arguments[1]:void 0;if(t.type===U){if($.isProfane(t.payload))throw new Error("Error in logging in, try another name");var n=t.payload.toLowerCase();if(["nig","niig","niiig","niiiig","niiiiig","niiiiiig","niiiiiiig","niiiiiiiiig","fcuk","fuk","fuck","siht","shit","cunt","cnut","kkk"].some((function(e){return n.includes(e)})))throw new Error("Error in logging in, try another name");if(t.payload.length>=16)throw new Error("Name is too long");e={loggedIn:!0,name:t.payload}}else t.type===_&&(e=q);return e},V=Object(Z.b)(K);w.a.initialize("UA-59921773-10"),w.a.pageview(window.location.pathname+window.location.search),o.a.render(r.a.createElement(f.a,{store:V},r.a.createElement(P,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},85:function(e,t,n){e.exports=n(170)},90:function(e,t,n){}},[[85,1,2]]]);
//# sourceMappingURL=main.545a71cc.chunk.js.map