const socket=io(),editor=document.getElementById("editor"),gutters=document.getElementsByClassName("gutter"),output=document.getElementById("output"),updateRows=(t,e)=>{let o=t.value.match(/\n/gi);for(gutter of(o=o?o.length+1:1,t.rows=o,e)){gutter.innerHTML="";for(let e=0;e<t.rows;e++)console.log(`Line number inserted for ${gutter}`),gutter.insertAdjacentHTML("beforeend",`<span>${e+1}</span>`)}};socket.on("connect",()=>{editor.addEventListener("input",()=>{updateRows(editor,gutters),socket.emit("update",{text:editor.value}),socket.on("updated",t=>{output.value=t.output})})});