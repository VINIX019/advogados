(function(){
  /* ---------- UI sem animação ---------- */
  const nav=document.getElementById('nav'),burger=document.getElementById('burger'),menu=document.getElementById('menu');
  const onScroll=()=>nav.classList.toggle('solid',window.scrollY>40);
  onScroll();addEventListener('scroll',onScroll,{passive:true});
  burger.onclick=()=>{burger.classList.toggle('open');menu.classList.toggle('open')};
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{burger.classList.remove('open');menu.classList.remove('open')}));

  document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x===t));
    document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('on',p.id===t.dataset.tab));
    if(window.gsap&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
      gsap.fromTo('#'+t.dataset.tab+' .card',{y:30,opacity:0},{y:0,opacity:1,duration:.7,stagger:.07,ease:'power3.out'});
    }
    window.ScrollTrigger&&ScrollTrigger.refresh();
  }));

  document.querySelectorAll('.card').forEach(c=>c.addEventListener('pointermove',e=>{
    const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');
  }));

  document.getElementById('form').addEventListener('submit',e=>{
    e.preventDefault();
    const n=document.getElementById('f-nome').value.trim(),a=document.getElementById('f-area').value,m=document.getElementById('f-msg').value.trim();
    const txt=`Olá, meu nome é ${n}. Assunto: ${a}.${m?'\n'+m:''}`;
    window.open('https://wa.me/5519992355314?text='+encodeURIComponent(txt),'_blank','noopener');
  });

  if(!window.gsap){return;}
  gsap.registerPlugin(ScrollTrigger);
  const mm=gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)',()=>{
    /* hero */
    const tl=gsap.timeline({defaults:{ease:'power4.out'}});
    tl.from('.scales .dr',{strokeDasharray:1200,strokeDashoffset:1200,duration:2.4,stagger:.12,ease:'power2.inOut'},0)
      .from('[data-hero].tag',{y:20,opacity:0,duration:.9},.2)
      .from('h1 .line>span',{yPercent:115,duration:1.3,stagger:.18},.35)
      .from('.lead,.hero-cta',{y:28,opacity:0,duration:1,stagger:.15},.9)
      ;
    // balança oscilando
    gsap.set('#beam',{transformOrigin:'200px 110px'});
    gsap.fromTo('#beam',{rotation:-4},{rotation:4,duration:3.2,ease:'sine.inOut',repeat:-1,yoyo:true});
    gsap.to('.hero .glow',{yPercent:25,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.hero .arc',{yPercent:-12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.scales',{yPercent:-10,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});

    // brilho dourado no título
    gsap.to('.gold-text',{backgroundPosition:'200% center',duration:5,ease:'none',repeat:-1});

    /* marquee */
    const track=document.getElementById('track');
    const mq=gsap.to(track,{x:()=>-track.scrollWidth/2,duration:45,ease:'none',repeat:-1});
    ScrollTrigger.create({trigger:'.marquee',onUpdate:s=>{mq.timeScale(1+Math.min(Math.abs(s.getVelocity())/400,6))}});
    track.parentElement.addEventListener('mouseenter',()=>gsap.to(mq,{timeScale:.2,duration:.5}));
    track.parentElement.addEventListener('mouseleave',()=>gsap.to(mq,{timeScale:1,duration:.5}));

    /* contadores */
    document.querySelectorAll('[data-count]').forEach(el=>{
      const end=parseFloat(el.dataset.count),dec=+el.dataset.dec||0,o={v:0};
      const fmt=v=>el.dataset.nosep?String(Math.round(v)):v.toFixed(dec).replace('.',',');
      gsap.to(o,{v:end,duration:2.2,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%',once:true},onUpdate:()=>el.textContent=fmt(o.v)});
    });

    /* títulos por linha */
    gsap.utils.toArray('h2').forEach(h=>{
      gsap.from(h.querySelectorAll('.line>span'),{yPercent:115,duration:1.1,stagger:.12,ease:'power4.out',scrollTrigger:{trigger:h,start:'top 85%',once:true}});
    });
    /* reveals gerais */
    ScrollTrigger.batch('[data-reveal]',{
      start:'top 90%',once:true,
      onEnter:b=>gsap.fromTo(b,{y:36,opacity:0},{y:0,opacity:1,duration:1,stagger:.12,ease:'power3.out'})
    });
    gsap.set('[data-reveal]',{opacity:0});
    ScrollTrigger.batch('#trab .card',{start:'top 92%',once:true,onEnter:b=>gsap.fromTo(b,{y:40,opacity:0},{y:0,opacity:1,duration:.9,stagger:.1,ease:'power3.out'})});
    gsap.set('#trab .card',{opacity:0});
    gsap.from('.stat',{y:30,opacity:0,duration:.9,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.stat-grid',start:'top 88%',once:true}});

    /* botões magnéticos */
    document.querySelectorAll('.magnetic').forEach(b=>{
      const xt=gsap.quickTo(b,'x',{duration:.5,ease:'power3'}),yt=gsap.quickTo(b,'y',{duration:.5,ease:'power3'});
      b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();xt((e.clientX-r.left-r.width/2)*.25);yt((e.clientY-r.top-r.height/2)*.35)});
      b.addEventListener('pointerleave',()=>{xt(0);yt(0)});
    });

    /* âncoras suaves */
    document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
      const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();
      t.scrollIntoView({behavior:'smooth'});
    }));
  });
})();