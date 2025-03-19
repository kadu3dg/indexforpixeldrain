(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[880],{669:(e,t,s)=>{"use strict";s.d(t,{K:()=>r});class r{async fetchWithAuth(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},s=new URL(this.workerUrl);s.searchParams.set("endpoint",e);let r=new Headers(t.headers);r.set("Accept","application/json"),r.set("Content-Type","application/json");let a={...t,headers:r,mode:"cors",credentials:"omit"};try{let e=await fetch(s.toString(),a);if(!e.ok){let t=await e.text();throw console.error("Erro na resposta:",{status:e.status,statusText:e.statusText,data:t}),Error("Erro na API do Pixeldrain: ".concat(e.status," ").concat(e.statusText,"\n").concat(t))}return e.json()}catch(e){throw console.error("Erro na requisi\xe7\xe3o:",e),e}}async getFiles(){try{return(await this.fetchWithAuth("/user/files")).files||[]}catch(e){return console.error("Erro ao buscar arquivos:",e),[]}}async getUserLists(){try{let e=(await this.fetchWithAuth("/user/lists")).lists||[];return await Promise.all(e.map(async e=>{try{let t=await this.getListDetails(e.id);return{...e,file_count:t.files.length}}catch(t){return console.error("Erro ao buscar detalhes do \xe1lbum ".concat(e.id,":"),t),{...e,file_count:0}}}))}catch(e){return console.error("Erro ao buscar \xe1lbuns:",e),[]}}async getListDetails(e){try{var t;let s=await this.fetchWithAuth("/list/".concat(e));return s.files&&Array.isArray(s.files)&&(s.files=s.files.map(e=>({id:e.id||"",name:e.name||"Sem nome",size:e.size||0,views:e.views||0,downloads:e.downloads||0,date_upload:e.date_upload||new Date().toISOString(),date_last_view:e.date_last_view||new Date().toISOString(),mime_type:e.mime_type||"application/octet-stream",hash_sha256:e.hash_sha256||"",can_edit:e.can_edit||!1,description:e.description||""}))),{id:s.id,title:s.title||"Sem t\xedtulo",description:s.description||"",date_created:s.date_created||new Date().toISOString(),files:s.files||[],can_edit:s.can_edit||!1,file_count:(null===(t=s.files)||void 0===t?void 0:t.length)||0}}catch(t){return console.error("Erro ao buscar detalhes do \xe1lbum ".concat(e,":"),t),{id:e,title:"Erro ao carregar",description:"",date_created:new Date().toISOString(),files:[],can_edit:!1,file_count:0}}}getFileViewUrl(e){return"https://pixeldrain.com/v/".concat(e)}getFileThumbnailUrl(e){return"https://pixeldrain.com/api/file/".concat(e,"/thumbnail")}async createAlbum(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return this.fetchWithAuth("/list",{method:"POST",body:JSON.stringify({title:e,description:t,files:[]})})}async addFileToAlbum(e,t){await this.fetchWithAuth("/list/".concat(e,"/file/").concat(t),{method:"POST"})}async removeFileFromAlbum(e,t){await this.fetchWithAuth("/list/".concat(e,"/file/").concat(t),{method:"DELETE"})}async deleteAlbum(e){await this.fetchWithAuth("/list/".concat(e),{method:"DELETE"})}constructor(){this.workerUrl="https://pixeldrain-proxy.kadulavinia.workers.dev"}}},3387:(e,t,s)=>{Promise.resolve().then(s.bind(s,4423))},4423:(e,t,s)=>{"use strict";s.d(t,{default:()=>v});var r=s(5155),a=s(2115),i=s(669);let l=e=>{var t,s,i;let{file:l}=e,[o,n]=(0,a.useState)(!0),[c,d]=(0,a.useState)(null),u=null===(t=l.mime_type)||void 0===t?void 0:t.startsWith("image/"),h=null===(s=l.mime_type)||void 0===s?void 0:s.startsWith("video/"),m=null===(i=l.mime_type)||void 0===i?void 0:i.startsWith("audio/"),f="application/pdf"===l.mime_type,x="https://pixeldrain.com/api/file/".concat(l.id),p="".concat(x,"?download"),v="https://pixeldrain.com/api/file/".concat(l.id,"/thumbnail");return((0,a.useEffect)(()=>{n(!0),d(null);let e=setTimeout(()=>{n(!1)},1e3);return()=>clearTimeout(e)},[l.id]),o)?(0,r.jsx)("div",{className:"flex justify-center items-center p-8 bg-gray-100 rounded-lg",children:(0,r.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"})}):c?(0,r.jsxs)("div",{className:"p-4 bg-red-100 text-red-700 rounded-lg",children:[(0,r.jsxs)("p",{children:["Erro ao carregar o arquivo: ",c]}),(0,r.jsx)("button",{className:"mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",onClick:()=>window.open(p,"_blank"),children:"Tentar Baixar Diretamente"})]}):(0,r.jsxs)("div",{className:"bg-white rounded-lg shadow-lg overflow-hidden",children:[(0,r.jsxs)("div",{className:"p-4 bg-gray-50 border-b",children:[(0,r.jsx)("h2",{className:"text-xl font-bold truncate",children:l.name}),(0,r.jsxs)("div",{className:"flex justify-between text-sm text-gray-500 mt-1",children:[(0,r.jsx)("span",{children:function(e){if(0===e)return"0 Bytes";let t=Math.floor(Math.log(e)/Math.log(1024));return parseFloat((e/Math.pow(1024,t)).toFixed(2))+" "+["Bytes","KB","MB","GB","TB"][t]}(l.size)}),(0,r.jsxs)("span",{children:[l.views||0," visualiza\xe7\xf5es"]})]})]}),(0,r.jsxs)("div",{className:"p-4",children:[u&&(0,r.jsx)("div",{className:"aspect-w-16 aspect-h-9 bg-black flex justify-center",children:(0,r.jsx)("img",{src:x,alt:l.name,className:"max-h-[600px] object-contain mx-auto",onError:()=>d("N\xe3o foi poss\xedvel carregar a imagem.")})}),h&&(0,r.jsx)("div",{className:"aspect-w-16 aspect-h-9 bg-black",children:(0,r.jsx)("video",{src:x,controls:!0,autoPlay:!0,className:"w-full h-full",onError:()=>d("N\xe3o foi poss\xedvel reproduzir o v\xeddeo."),children:"Seu navegador n\xe3o suporta a reprodu\xe7\xe3o de v\xeddeos."})}),m&&(0,r.jsx)("div",{className:"p-4 bg-gray-100 rounded-lg",children:(0,r.jsx)("audio",{src:x,controls:!0,className:"w-full",onError:()=>d("N\xe3o foi poss\xedvel reproduzir o \xe1udio."),children:"Seu navegador n\xe3o suporta a reprodu\xe7\xe3o de \xe1udios."})}),f&&(0,r.jsx)("div",{className:"aspect-w-16 aspect-h-9 bg-gray-100 flex justify-center items-center",children:(0,r.jsx)("iframe",{src:"".concat(x,"#toolbar=0"),className:"w-full h-[600px]",title:l.name,onError:()=>d("N\xe3o foi poss\xedvel carregar o PDF.")})}),!u&&!h&&!m&&!f&&(0,r.jsxs)("div",{className:"p-8 flex flex-col items-center justify-center bg-gray-100 rounded-lg",children:[(0,r.jsx)("img",{src:v,alt:"Thumbnail",className:"w-32 h-32 object-contain mb-4",onError:e=>e.currentTarget.style.display="none"}),(0,r.jsx)("p",{className:"text-center mb-4",children:"Este tipo de arquivo n\xe3o pode ser visualizado diretamente no navegador."}),(0,r.jsx)("button",{className:"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",onClick:()=>window.open(p,"_blank"),children:"Baixar Arquivo"})]})]}),(0,r.jsxs)("div",{className:"p-4 bg-gray-50 border-t flex justify-between",children:[(0,r.jsx)("button",{className:"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",onClick:()=>window.open(p,"_blank"),children:"Baixar"}),(0,r.jsxs)("div",{className:"text-sm text-gray-500",children:["Compartilhar:",(0,r.jsx)("button",{className:"ml-2 text-blue-500 hover:underline",onClick:()=>navigator.clipboard.writeText("https://pixeldrain.com/u/".concat(l.id)),children:"Copiar Link"})]})]})]})};var o=s(3100),n=s(3951),c=s(4256),d=s(3339);function u(e){if(e.startsWith("image/"))return"/icons/image.svg";if(e.startsWith("video/"))return"/icons/video.svg";if(e.startsWith("audio/"))return"/icons/audio.svg";if("application/pdf"===e)return"/icons/pdf.svg";if(e.includes("document")||e.includes("word"))return"/icons/document.svg";else if(e.includes("spreadsheet")||e.includes("excel"))return"/icons/spreadsheet.svg";else if(e.includes("presentation")||e.includes("powerpoint"))return"/icons/presentation.svg";else if(e.includes("archive")||e.includes("zip")||e.includes("rar"))return"/icons/archive.svg";else return"/icons/file.svg"}let h=e=>{let{album:t,viewMode:s="grid"}=e,[i,h]=(0,a.useState)(0);if(!t.files||0===t.files.length)return(0,r.jsx)("div",{className:"p-4 bg-yellow-100 text-yellow-700 rounded-lg mb-4",children:"Este \xe1lbum est\xe1 vazio."});let m=t.files[i];return(0,r.jsxs)("div",{className:"bg-gray-900 rounded-lg shadow-lg overflow-hidden",children:[(0,r.jsxs)("div",{className:"p-4",children:[m&&(0,r.jsx)("div",{className:"mb-4"}),(0,r.jsx)(l,{file:m})]}),t.files.length>0&&(0,r.jsxs)("div",{className:"p-4 bg-gray-800",children:[(0,r.jsxs)(o.A,{variant:"h6",className:"text-white mb-4",children:["Arquivos no \xc1lbum (",t.files.length,")"]}),(0,r.jsx)(n.Ay,{container:!0,spacing:2,className:"list"===s?"flex-col":"",children:t.files.map((e,t)=>{var a;return(0,r.jsx)(n.Ay,{item:!0,xs:12,sm:"list"===s?12:6,md:"list"===s?12:4,lg:"list"===s?12:3,children:(0,r.jsxs)(c.A,{className:"cursor-pointer transition-all duration-200 ".concat(i===t?"ring-2 ring-blue-500":"hover:ring-2 hover:ring-blue-300"," ").concat("list"===s?"flex items-center":""),onClick:()=>h(t),sx:{backgroundColor:"#1a1a1a",height:"100%",flexDirection:"list"===s?"row":"column"},children:[(0,r.jsx)("div",{className:"relative ".concat("list"===s?"w-32 h-24 mr-4 flex-shrink-0":"aspect-w-16 aspect-h-9"),children:(null===(a=e.mime_type)||void 0===a?void 0:a.startsWith("video/"))?(0,r.jsxs)("div",{className:"w-full h-full bg-black flex items-center justify-center",children:[(0,r.jsx)("img",{src:"https://pixeldrain.com/api/file/".concat(e.id,"/thumbnail"),alt:e.name,className:"w-full h-full object-cover",onError:t=>{t.currentTarget.src=u(e.mime_type||"")}}),(0,r.jsx)("div",{className:"absolute inset-0 flex items-center justify-center",children:(0,r.jsx)("svg",{className:"w-12 h-12 text-white opacity-80",fill:"currentColor",viewBox:"0 0 20 20",children:(0,r.jsx)("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z",clipRule:"evenodd"})})})]}):(0,r.jsx)("img",{src:"https://pixeldrain.com/api/file/".concat(e.id,"/thumbnail"),alt:e.name,className:"w-full h-full object-cover",onError:t=>{t.currentTarget.src=u(e.mime_type||"")}})}),(0,r.jsxs)(d.A,{sx:{color:"#fff",flex:1,display:"flex",flexDirection:"column",justifyContent:"center"},children:[(0,r.jsx)(o.A,{variant:"subtitle1",component:"h3",className:"font-medium ".concat("list"===s?"text-base":"truncate"),children:e.name}),(0,r.jsx)(o.A,{variant:"body2",className:"text-gray-400 ".concat("list"===s?"text-sm":""),children:function(e){if(0===e)return"0 Bytes";let t=Math.floor(Math.log(e)/Math.log(1024));return parseFloat((e/Math.pow(1024,t)).toFixed(2))+" "+["Bytes","KB","MB","GB","TB"][t]}(e.size)}),(0,r.jsxs)(o.A,{variant:"caption",className:"text-gray-500 ".concat("list"===s?"text-xs":""),children:[e.views," visualiza\xe7\xf5es"]})]})]})},e.id)})})]})]})};var m=s(3088),f=s(5857),x=s(9915),p=s(5695);function v(e){let{params:t}=e,[s,l]=(0,a.useState)(null),[o,n]=(0,a.useState)(!0),[c,d]=(0,a.useState)(null),[u,v]=(0,a.useState)("grid"),[g,b]=(0,a.useState)("asc"),j=(0,p.useRouter)(),w=new i.K;(0,a.useEffect)(()=>{(async()=>{try{let e=await w.getListDetails(t.id);l(e)}catch(e){console.error("Erro ao carregar \xe1lbum:",e),d(e instanceof Error?e.message:"Erro ao carregar \xe1lbum")}finally{n(!1)}})()},[t.id]);let y=(null==s?void 0:s.files)?[...s.files].sort((e,t)=>{let s=e.name.localeCompare(t.name);return"asc"===g?s:-s}):[];return"default-album"===t.id?(0,r.jsx)("main",{className:"min-h-screen p-4",style:{backgroundColor:"#121212",color:"#ffffff"},children:(0,r.jsx)("div",{className:"max-w-6xl mx-auto",children:(0,r.jsx)(m.A,{severity:"warning",sx:{mb:2,backgroundColor:"#ffa50033",color:"#ffffff"},children:"Este \xe1lbum n\xe3o est\xe1 dispon\xedvel no modo offline. Por favor, acesse online para ver o conte\xfado."})})}):(0,r.jsx)("main",{className:"min-h-screen p-4",style:{backgroundColor:"#121212",color:"#ffffff"},children:(0,r.jsxs)("div",{className:"max-w-6xl mx-auto",children:[(0,r.jsxs)("div",{className:"mb-4 flex items-center justify-between",children:[(0,r.jsxs)("div",{className:"flex items-center",children:[(0,r.jsx)(f.A,{onClick:()=>{j.push("/")},variant:"contained",startIcon:(0,r.jsx)("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,r.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10 19l-7-7m0 0l7-7m-7 7h18"})}),sx:{backgroundColor:"#333",color:"#fff","&:hover":{backgroundColor:"#444"}},children:"Voltar"}),s&&(0,r.jsxs)("div",{className:"ml-4",children:[(0,r.jsx)("h1",{className:"text-2xl font-bold",children:s.title}),(0,r.jsxs)("p",{className:"text-gray-400",children:[s.files.length," arquivo",1!==s.files.length?"s":""]})]})]}),(0,r.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,r.jsx)(f.A,{onClick:()=>{v(e=>"grid"===e?"list":"grid")},variant:"outlined",color:"primary",startIcon:"grid"===u?(0,r.jsx)("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,r.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 6h16M4 10h16M4 14h16M4 18h16"})}):(0,r.jsx)("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,r.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"})}),children:"grid"===u?"Lista":"Grade"}),(0,r.jsx)(f.A,{onClick:()=>{b(e=>"asc"===e?"desc":"asc")},variant:"outlined",color:"secondary",startIcon:"asc"===g?(0,r.jsx)("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,r.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 4h13M3 8h9M3 12h5m0 0v8m0-8h2"})}):(0,r.jsx)("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,r.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 4h13M3 8h9M3 12h5m0 0v-8m0 8h2"})}),children:"asc"===g?"Z-A":"A-Z"})]})]}),c&&(0,r.jsx)(m.A,{severity:"error",sx:{mb:2,backgroundColor:"#ff000033",color:"#ffffff"},children:c}),o?(0,r.jsx)("div",{className:"flex justify-center items-center h-64",children:(0,r.jsx)(x.A,{sx:{color:"#ffffff"}})}):s?(0,r.jsx)(h,{album:{...s,files:y},viewMode:u}):(0,r.jsxs)("div",{className:"text-center text-white",children:[(0,r.jsx)("h1",{className:"text-2xl font-bold",children:"\xc1lbum n\xe3o encontrado"}),(0,r.jsx)("p",{className:"mt-2",children:"O \xe1lbum que voc\xea est\xe1 procurando n\xe3o existe ou foi removido."})]})]})})}}},e=>{var t=t=>e(e.s=t);e.O(0,[857,310,553,441,684,358],()=>t(3387)),_N_E=e.O()}]);