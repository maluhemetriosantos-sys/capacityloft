// nav
const nav=document.getElementById('nav');addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>20),{passive:true});
const setMenu=o=>{const b=document.getElementById('burger');document.getElementById('links').classList.toggle('open',o);
  b.setAttribute('aria-expanded',String(o));b.setAttribute('aria-label',o?'Fechar menu':'Abrir menu');document.body.classList.toggle('no-scroll',o)};
document.getElementById('burger').onclick=()=>setMenu(!document.getElementById('links').classList.contains('open'));
document.querySelectorAll('#links a').forEach(a=>a.onclick=()=>setMenu(false));

// reveal + counters
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');
  e.target.querySelectorAll('[data-n]').forEach(c=>{const t=+c.dataset.n;let i=0;const s=()=>{i+=Math.max(1,t/40);c.textContent=Math.min(t,Math.round(i));if(i<t)requestAnimationFrame(s)};s()});
  io.unobserve(e.target)}),{threshold:.15});
document.querySelectorAll('.rv').forEach((el,i)=>{el.style.setProperty('--d',(i%3)*.08+'s');io.observe(el)});

// tabs filter + carousel
const track=document.getElementById('track');if(track){
  const bar=track.parentElement.querySelector('.tabs');
  const ar=document.createElement('div');ar.className='arrows';
  ar.innerHTML='<button id="prev" aria-label="Anterior">←</button><button id="next" aria-label="Seguinte">→</button>';bar.appendChild(ar);
  const step=()=>track.querySelector('.pc').offsetWidth+18;
  ar.querySelector('#next').onclick=()=>track.scrollBy({left:step()});
  ar.querySelector('#prev').onclick=()=>track.scrollBy({left:-step()});
}
// guide steps highlight on scroll
const steps=[...document.querySelectorAll('.step')],sb=document.getElementById('steps');if(sb){
function upd(){const r=sb.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.5-r.top)/r.height));
  // a bolinha parte do topo da barra e desce até ao último passo; cada passo acende quando a bolinha o alcança
  const ys=steps.map(s=>s.getBoundingClientRect().bottom-r.top),pos=p*ys[ys.length-1];
  sb.style.setProperty('--p',pos+'px');steps.forEach((s,i)=>s.classList.toggle('on',ys[i]<=pos+1))}
addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();}

// services hover -> single active
const sv=[...document.querySelectorAll('.s')];sv.forEach(s=>s.addEventListener('mouseenter',()=>sv.forEach(x=>x.classList.toggle('act',x===s))));



// hero network canvas
(function(){const c=document.getElementById('net');if(!c)return;const x=c.getContext('2d');let w,h,P=[],m={x:-999,y:-999};
  const rs=()=>{w=c.width=c.offsetWidth;h=c.height=c.offsetHeight;P=Array.from({length:Math.min(70,w/16)},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}))};
  rs();addEventListener('resize',rs);
  c.parentElement.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top});
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  (function f(){x.clearRect(0,0,w,h);P.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
    const dm=Math.hypot(p.x-m.x,p.y-m.y);if(dm<140){p.x+=(p.x-m.x)*.01;p.y+=(p.y-m.y)*.01}
    x.fillStyle='rgba(176,178,181,.8)';x.beginPath();x.arc(p.x,p.y,1.8,0,7);x.fill();
    for(let j=i+1;j<P.length;j++){const q=P[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<120){x.strokeStyle=`rgba(125,140,255,${.28*(1-d/120)})`;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}});
    requestAnimationFrame(f)})()})();

// esfera: bloqueia o scroll na home até rodar 180°, depois gira com o scroll (movimento suavizado)
(function(){const v=document.querySelector('.visual');if(!v)return;
  const root=document.documentElement,MAX=180;let target=0,cur=0,raf=0,ready=false,base0=0,lock=!matchMedia('(prefers-reduced-motion:reduce)').matches;
  const draw=()=>{cur+=(target-cur)*.07;if(Math.abs(target-cur)<.05)cur=target;v.style.setProperty('--rot',cur.toFixed(2));raf=cur===target?0:requestAnimationFrame(draw)};
  const go=()=>{if(!raf)raf=requestAnimationFrame(draw)};
  if(lock){history.scrollRestoration='manual';root.classList.add('locked');
    const hero=document.querySelector('.hero');base0=Math.max(0,hero.offsetTop-20);scrollTo({top:base0,behavior:'smooth'});
    const chk=setInterval(()=>{if(Math.abs(scrollY-base0)<2){clearInterval(chk);ready=true}},50);setTimeout(()=>{clearInterval(chk);scrollTo(0,base0);ready=true},1500);
    const add=d=>{target=Math.max(0,Math.min(MAX,target+d*.18));if(target>=MAX){lock=false;root.classList.remove('locked')}go()};
    const relock=d=>{if(!lock&&ready&&d<0&&scrollY<=base0+2){lock=true;root.classList.add('locked');return true}return false};
    addEventListener('wheel',e=>{if(!lock&&!relock(e.deltaY))return;e.preventDefault();if(ready)add(e.deltaY)},{passive:false});
    let y0=0;addEventListener('touchstart',e=>{y0=e.touches[0].clientY},{passive:true});
    addEventListener('touchmove',e=>{const y=e.touches[0].clientY;if(!lock&&!relock(y0-y)){y0=y;return}e.preventDefault();if(!ready)return;add((y0-y)*1.2);y0=y},{passive:false});
    addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('input,textarea,select,button,a'))return;const k={ArrowDown:40,PageDown:120,' ':120,End:240,ArrowUp:-40,PageUp:-120,Home:-240}[e.key];if(k===undefined||!ready)return;if(!lock&&!relock(k))return;e.preventDefault();add(k)});
  }else{target=cur=MAX;v.style.setProperty('--rot',MAX)}
  addEventListener('scroll',()=>{if(lock)return;target=MAX+Math.max(0,scrollY-base0)*.35;go()},{passive:true});
})();

// menu sai do ecrã ao descer e volta assim que o utilizador sobe (ou chega ao topo)
(function(){const h=document.querySelector('header');if(!h)return;
  let last=scrollY;
  const f=()=>{const y=scrollY,d=y-last;
    if(y<=40)h.classList.remove('away');
    else if(d>6){h.classList.add('away');document.getElementById('links')?.classList.remove('open')}
    else if(d<-6)h.classList.remove('away');
    if(Math.abs(d)>6)last=y};
  addEventListener('scroll',f,{passive:true});f()})();

// botão voltar ao topo
(function(){const b=document.createElement('button');b.className='totop';b.setAttribute('aria-label','Voltar ao topo');b.textContent='↑';
  b.onclick=()=>scrollTo({top:0,behavior:'smooth'});document.body.appendChild(b);
  const f=()=>b.classList.toggle('show',scrollY>400);addEventListener('scroll',f,{passive:true});f()})();

// ligação ao Strapi (backend). Se estiver offline, o site mostra o conteúdo estático.
(function(){
  const API=(window.CL_API||'http://localhost:1337')+'/api',BASE=API.slice(0,-4);
  const fm=document.getElementById('form');
  if(fm)fm.onsubmit=async e=>{e.preventDefault();
    const ok=document.getElementById('ok'),btn=fm.querySelector('button'),d=Object.fromEntries(new FormData(fm));
    btn.disabled=true;
    try{const r=await fetch(API+'/mensagens',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:d})});
      if(!r.ok)throw 0;ok.textContent='Obrigado! Entraremos em contacto brevemente.';ok.style.display='block';fm.reset()}
    catch(_){ok.textContent='Não foi possível enviar agora. Escreva-nos para geral@capacityloft.pt.';ok.style.display='block'}
    btn.disabled=false};
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const url=m=>{if(!m||!m.url)return null;const u=(m.formats&&(m.formats.large||m.formats.medium)||m).url;return /^https?:/.test(u)?u:BASE+u};
  const inline=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\[([^\]]+)\]\((https?:[^)\s]+|[a-z-]+\.html|mailto:[^)\s]+)\)/g,(m,t,u)=>'<a href="'+u+'"'+(/^https?:/.test(u)?' target="_blank" rel="noopener"':'')+'>'+t+'</a>');
  const md=src=>{let out='',list=false;const close=()=>{if(list){out+='</ul>';list=false}};
    String(src).split(/\r?\n/).forEach(l=>{l=l.trim();
      if(!l){close();return}
      let m;if(m=l.match(/^(#{1,3})\s+(.*)$/)){close();out+='<h'+(m[1].length+1)+'>'+inline(m[2])+'</h'+(m[1].length+1)+'>'}
      else if(m=l.match(/^[-*]\s+(.*)$/)){if(!list){out+='<ul>';list=true}out+='<li>'+inline(m[1])+'</li>'}
      else{close();out+='<p>'+inline(l)+'</p>'}});close();return out};
  const get=async p=>{try{const r=await fetch(API+p);if(!r.ok)return null;return (await r.json()).data}catch(_){return null}};
  // página (single type): textos e imagens
  const page=document.body.dataset.page;
  if(page)get('/'+page+'?populate=*').then(d=>{if(!d)return;
    document.querySelectorAll('[data-cms]').forEach(el=>{const v=d[el.dataset.cms];if(v)el.textContent=v});
    document.querySelectorAll('[data-cms-em]').forEach(el=>{const v=d[el.dataset.cmsEm];if(v)el.innerHTML=esc(v).replace(/\*(.+?)\*/g,'<em>$1</em>')});
    document.querySelectorAll('[data-cms-br]').forEach(el=>{const v=d[el.dataset.cmsBr];if(v)el.innerHTML=esc(v).replace(/\r?\n/g,'<br>')});
    document.querySelectorAll('[data-cms-mail]').forEach(el=>{const v=d[el.dataset.cmsMail];if(v){el.textContent=v;el.href='mailto:'+v}});
    document.querySelectorAll('[data-cms-tel]').forEach(el=>{const v=d[el.dataset.cmsTel];if(v){el.textContent=v;el.href='tel:+351'+v.replace(/\D/g,'')}});
    document.querySelectorAll('[data-cms-img]').forEach(el=>{const u=url(d[el.dataset.cmsImg]);if(u)el.src=u});
    document.querySelectorAll('[data-cms-md]').forEach(el=>{const v=d[el.dataset.cmsMd];if(!v)return;
      const u=d[el.dataset.cmsUpd];el.innerHTML=(u?'<p class="upd">Última atualização: '+esc(u)+'</p>':'')+md(v)});
    const t=d.titulo&&document.body.dataset.page.match(/^(politica|termos)/);if(t)document.title=d.titulo+' | Capacity Loft'});
  // soluções e serviços (coleções): textos e imagens
  const set=(el,sel,v)=>{const n=el.querySelector(sel);if(n&&v)n.textContent=v};
  const sync=async(path,apply)=>{const data=await get(path);if(!data)return;
    data.forEach(x=>document.querySelectorAll('[data-slug="'+x.slug+'"]').forEach(el=>apply(el,x)))};
  if(document.querySelector('[data-slug]')){
    sync('/solucoes?pagination[pageSize]=50&populate=imagem',(el,x)=>{set(el,'h3',x.titulo);set(el,'p',x.descricao);set(el,'.row b, .tg',x.categoria);
      const u=url(x.imagem);if(u){const im=el.querySelector('.img img');if(im){im.src=u;im.classList.replace('ct','ph')}}});
    sync('/servicos?pagination[pageSize]=50&populate=imagem',(el,x)=>{set(el,'h3, h2',x.titulo);set(el,'p',x.descricao);
      const ul=el.querySelector('.zt ul');if(ul&&x.pontos)ul.innerHTML=x.pontos.split(/\r?\n/).filter(Boolean).map(p=>'<li>'+esc(p)+'</li>').join('');
      const u=url(x.imagem);if(u){const im=el.querySelector('.zim');if(im){im.src=u;im.classList.replace('ct','ph')}}});
  }
})();

// aviso de cookies: guarda a preferencia (recusado | aceite | personalizado)
(function(){let v=null;try{v=localStorage.getItem('cl-cookies')}catch(_){}
  if(v)return;
  const save=x=>{try{localStorage.setItem('cl-cookies',x)}catch(_){}b.remove()};
  const b=document.createElement('div');b.className='cookiebar';b.setAttribute('role','dialog');b.setAttribute('aria-label','Aviso de cookies');
  b.innerHTML='<div class="cb-t"><p>Só com a sua autorização usamos cookies de estatística e de marketing. Se recusar, o site funciona igual.</p>'
   +'<div class="cb-l"><button type="button" class="cb-pers">Personalizar</button><a href="privacidade.html">Política de Privacidade</a></div>'
   +'<div class="cb-opts" hidden><label><input type="checkbox" id="cbe"> Estatística</label><label><input type="checkbox" id="cbm"> Marketing</label><button type="button" class="cb-save">Guardar escolha</button></div></div>'
   +'<div class="cb-b"><button type="button" class="cb-no">Recusar</button><button type="button" class="cb-yes">Aceitar todos</button></div>';
  b.querySelector('.cb-no').onclick=()=>save('recusado');
  b.querySelector('.cb-yes').onclick=()=>save('aceite');
  b.querySelector('.cb-pers').onclick=()=>{const o=b.querySelector('.cb-opts');o.hidden=!o.hidden};
  b.querySelector('.cb-save').onclick=()=>save('personalizado:'+(b.querySelector('#cbe').checked?'estatistica,':'')+(b.querySelector('#cbm').checked?'marketing':''));
  document.body.appendChild(b)})();

// «Guia para começar»: ao chegar à secção o scroll da página fica bloqueado e a roda/toque/teclas fazem
// surgir os passos 1→4, um a um; só depois do passo 4 completo o scroll volta a descer a página.
// Ecrãs pequenos (sem espaço para a secção inteira) não bloqueiam: os passos surgem com o scroll normal.
(function(){const g=document.querySelector('.hubg'),sec=document.querySelector('.hub');if(!g||!sec||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const hi=[...g.querySelectorAll('.hi')],N=hi.length,clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),TOP=72,root=document.documentElement,
    lockable=matchMedia('(min-width:901px) and (min-height:680px)');
  let prog=0,cur=0,locked=false,done=false,raf=0,last=scrollY;
  const paint=()=>hi.forEach((el,i)=>el.style.setProperty('--s',clamp(cur-i).toFixed(3)));
  const draw=()=>{cur+=(prog-cur)*.12;if(Math.abs(prog-cur)<.002)cur=prog;paint();raf=cur===prog?0:requestAnimationFrame(draw)};
  const go=()=>{if(!raf)raf=requestAnimationFrame(draw)};
  const lock=()=>{const r=sec.getBoundingClientRect();scrollTo({top:scrollY+r.top-TOP,behavior:'instant'});locked=true;root.classList.add('locked')};
  const unlock=()=>{locked=false;root.classList.remove('locked')};
  const add=d=>{prog=clamp(prog+d*.0035,0,N);go();
    if(prog>=N){done=true;unlock()}else if(prog<=0&&d<0){unlock()}};
  const free=()=>!lockable.matches;
  const soft=()=>{const r=g.getBoundingClientRect();prog=cur=clamp((innerHeight*.85-r.top)/(innerHeight*.75))*N;paint()};
  addEventListener('scroll',()=>{
    if(free()){soft();return}
    if(locked)return;
    const r=sec.getBoundingClientRect(),down=scrollY>last;last=scrollY;
    if(r.top>innerHeight*.9&&done){done=false;prog=cur=0;paint()}
    else if(!done&&down&&r.top<=TOP+4&&r.bottom>innerHeight*.5)lock()
  },{passive:true});
  addEventListener('wheel',e=>{if(!locked)return;e.preventDefault();add(e.deltaY)},{passive:false});
  let y0=0;addEventListener('touchstart',e=>{y0=e.touches[0].clientY},{passive:true});
  addEventListener('touchmove',e=>{if(!locked)return;e.preventDefault();const y=e.touches[0].clientY;add((y0-y)*1.4);y0=y},{passive:false});
  addEventListener('keydown',e=>{if(!locked||(e.target.closest&&e.target.closest('input,textarea,select,button,a')))return;
    const k={ArrowDown:50,PageDown:140,' ':140,End:400,ArrowUp:-50,PageUp:-140,Home:-400}[e.key];if(k===undefined)return;e.preventDefault();add(k)});
  addEventListener('resize',()=>{if(free()&&locked)unlock();free()?soft():paint()});
  if(free())soft();else paint()})();


// transição entre páginas (painel de vidro, ver style.css). Mesma página → só recarrega, sem transição.
(function(){const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const file=u=>(u.pathname.split('/').pop()||'index.html').toLowerCase();
  let busy=false;
  // volta pelo histórico (bfcache): tira o painel que ficou a cobrir a página
  addEventListener('pageshow',e=>{if(e.persisted){busy=false;root.classList.remove('pt-out','pt-in')}});
  // acabada a revelação, solta as camadas (nada fica por cima da página)
  document.addEventListener('animationend',ev=>{if(ev.animationName==='ptOut')root.classList.remove('pt-in')});
  document.addEventListener('click',e=>{
    const a=e.target.closest&&e.target.closest('a[href]');
    if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target&&a.target!=='_self'||a.hasAttribute('download'))return;
    let u;try{u=new URL(a.href,location.href)}catch(_){return}
    if(u.origin!==location.origin||!/\.html?$|\/$/.test(u.pathname))return;
    if(file(u)===file(location)){e.preventDefault();if(u.hash&&u.hash!==location.hash){location.href=u.href;return}location.reload();return}
    if(reduce)return;
    e.preventDefault();
    if(busy)return; // segundo clique durante a transição: ignora (não navega para outro lado)
    busy=true;
    try{sessionStorage.setItem('cl-pt','1')}catch(_){}
    root.classList.add('pt-out');
    // navega quando o painel acaba de cobrir (animationend); o temporizador é só salvaguarda
    let go=false;const nav=()=>{if(go)return;go=true;location.href=u.href};
    document.addEventListener('animationend',ev=>{if(ev.animationName==='ptIn')nav()});
    setTimeout(nav,1100);
  });
})();
