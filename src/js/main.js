  const texts = document.querySelectorAll('.welcome-text');
  let current = 0;
  texts[current].classList.add('active');
  setInterval(() => {
    const prev = current;
    current = (current + 1) % texts.length;
    texts[prev].classList.remove('active');
    texts[prev].classList.add('exit');
    setTimeout(() => texts[prev].classList.remove('exit'), 400);
    texts[current].classList.add('active');
  }, 2800);

  const reveals = document.querySelectorAll(
    '.project-card, .stat, .stack-group, .social-card, .social-grid, .about-content, .about-stats, .da-card'
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(el => observer.observe(el));

  const navbar = document.querySelector('.navbar-top');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  function isMobile() { return window.innerWidth <= 900; }

  document.querySelectorAll('.stack-group').forEach(group => {
    group.addEventListener('click', () => {
      if (!isMobile()) return;
      group.classList.toggle('open');
    });
  });

  window.addEventListener('resize', () => {
    if (!isMobile()) {
      document.querySelectorAll('.stack-group').forEach(g => g.classList.remove('open'));
    }
  });



const dialogBox = document.getElementById('dialogBox');
const dialogText = document.getElementById('dialogText');

const messages = {
    1: {
        text: "Sobre",
        right: "calc(6% + 166px)"
    },
    2: {
        text: "Projetos",
        right: "calc(6% + 106px)"
    },
    3: {
        text: "Stack",
        right: "calc(6% + 46px)"
    },
    4: {
        text: "Social",
        right: "calc(6% - 14px)"
    }
};

let dialogTimer;

document.querySelectorAll("a[data-nav-btn]").forEach(link => {

    link.addEventListener("mouseenter", () => {
        const id = link.dataset.navBtn;
        const data = messages[id];

        if (!data) return;

        dialogText.textContent = data.text;
        dialogBox.style.right = data.right;

        dialogTimer = setTimeout(() => {
            dialogBox.classList.add("active");
        }, 1000);
    });

    link.addEventListener("mouseleave", () => {
        clearTimeout(dialogTimer);
        dialogBox.classList.remove("active");
    });

});

  document.addEventListener('dragstart', (e) => e.preventDefault());

  /* photo rail: the snapping comes from CSS; this adds arrows and page dots */
  const rail = document.getElementById('albumRail');
  if (rail) {
    const albums = [...rail.querySelectorAll('.area-card')];
    const dots = document.getElementById('albumDots');
    const smooth = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    const goTo = (card) => rail.scrollTo({
      left: card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2,
      behavior: smooth
    });
    const currentAlbum = () => {
      const mid = rail.scrollLeft + rail.clientWidth / 2;
      let best = 0;
      albums.forEach((c, i) => {
        const dist = (el) => Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        if (dist(c) < dist(albums[best])) best = i;
      });
      return best;
    };
    albums.forEach((card, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Foto ' + (i + 1));
      dot.onclick = () => goTo(card);
      dots.append(dot);
    });
    const paint = () => {
      const now = currentAlbum();
      [...dots.children].forEach((d, i) => d.classList.toggle('on', i === now));
    };
    rail.addEventListener('scroll', paint, { passive: true });
    paint();
    const step = (d) => goTo(albums[Math.min(albums.length - 1, Math.max(0, currentAlbum() + d))]);
    document.querySelector('.album-prev').onclick = () => step(-1);
    document.querySelector('.album-next').onclick = () => step(1);
    rail.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    });
  }

  /* wallet: the first tap pulls a pass out, a tap on the open pass follows its link */
  const wallet = document.getElementById('wallet');
  if (wallet) {
    const passes = [...wallet.querySelectorAll('.pass')];
    passes.forEach(pass => {
      pass.setAttribute('aria-expanded', 'false');
      pass.insertAdjacentHTML('beforeend',
        '<div class="pass-body" aria-hidden="true"><div class="pass-code"></div>' +
        '<div class="pass-cta">Abrir perfil <i class="fas fa-chevron-right"></i></div></div>');
    });
    const openPass = (target) => passes.forEach(p => {
      const on = p === target;
      p.classList.toggle('open', on);
      p.setAttribute('aria-expanded', on);
    });
    const stack = wallet.querySelector('.wallet-stack');
    const twoCols = matchMedia('(min-width: 901px)');
    const layout = () => {
      const count = twoCols.matches ? 2 : 1;
      const cols = Array.from({ length: count }, () => {
        const col = document.createElement('div');
        col.className = 'wallet-col';
        return col;
      });
      passes.forEach((pass, i) => cols[i % count].append(pass));
      stack.replaceChildren(...cols);
    };
    layout();
    twoCols.addEventListener('change', layout);

    const more = document.getElementById('walletMore');
    document.getElementById('walletDots').addEventListener('click', () => more.click());
    more.addEventListener('click', () => {
      const showAll = wallet.classList.toggle('more');
      more.setAttribute('aria-expanded', showAll);
      more.innerHTML = showAll
        ? '<i class="fas fa-chevron-up"></i> Ver menos'
        : '<i class="fas fa-chevron-down"></i> Ver mais redes';
      if (!showAll) openPass(null);
    });

    wallet.addEventListener('click', (e) => {
      if (e.target.closest('#walletMore, #walletDots')) return;
      const pass = e.target.closest('.pass');
      if (!pass) { openPass(null); return; }
      if (!pass.classList.contains('open')) {
        e.preventDefault();
        openPass(pass);
      } else if (pass.getAttribute('href') === '#') {
        e.preventDefault();
      }
    });
  }

/* 

<!--

----------- created by ------------------------------------

                            __           _            
                           ╱ _│         │ │           
 _ __ ___   __ ___  ____ _│ │_ ___  _ __│ │_ ___  ___ 
│ '_ ` _ ╲ ╱ _` ╲ ╲╱ ╱ _` │  _╱ _ ╲│ '__│ __╱ _ ╲╱ __│
│ │ │ │ │ │ (_│ │>  < (_│ │ ││ (_) │ │  │ ││  __╱╲__ ╲
│_│ │_│ │_│╲__,_╱_╱╲_╲__, │_│ ╲___╱│_│   ╲__╲___││___╱
                      __╱ │                           
                     │___╱                            





                     

                         ..sSs$$$$$$b.                                       
                       .$$$$$$$$$$$$$$$.                                     
                    .$$$$$$$$$$$$$$$$$$$$$b.                                 
                  .$$$$$$$$$$$$$$$$$$$$$$$$$                                 
                 $$$$$$$$$$$$$$$$$S'   `$$$$                                 
                 $$$$$$$$$$$$$$S'        $$$                                 
                 $$$$$$$$$$$$$'          `$$.                                
                 `$$$$$$$$$$$$$           `$$$.                              
                   `$$$$$$$$$'       .s$$$ $$ $                              
                     $$$$$$$$$.sSs .s$$s"   s s                               
                      $$$$$$$$$$$$           $P                              
                      `$$$$$$$$$$$s          $                               
                        $$$$$$$$$$$.    ",                                   
                        `$$$$$$$$$$sS$                                       
        s$$$.            `$$$$$$$$$$$$.s"'   .$.                              
        $$$$$.              `$$$$$$$$$$.    .$$$Ss.s$s.                      
         $$$$$.              `$$$$$$$$$P   .$$$$$$$$$$$$.                    
         $$$$$$.               `$$$$$$$' .$$$$$$$$$$$$$$$$.                  
         `$$$$$$.                 $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$s.         
           $$$$$$.                `$$$$$$$$$ $$$$$$$$$$$$$$$$$$$$$$$$s.      
         .s$$$$$$$.                 `$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$.    
         s  $$$$$$$.                .$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$.   
         `$$$$$$$$$$.             .$$$' $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$. 
          `$$$$$$$$$$.           s$'   $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$. 
          $$$$$$$$$$$$e         $$$     `$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ 
        .' $$$$$$$$$$7         $$$$       `$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
       "   `$$$$$$$$7         $$$$$       .$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
      $$Ss..$$$$$$$7        $$$$$$$    .s$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
       $$$$$$$$$$$$        $$$$$$$$ .s$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        $$$$$$$$$$$     .$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
      .$$$$$$$$$$$$$   .$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
      $$$$$$$$$$$$$$  .$$$$$$$$$$$ $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
      $$$$$$$$$$$$$$ .$$$$$$$$$$$' `$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
      $$$$$$$$$$$$$$ $$$$$$$$$$$$   `$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
      $$$$$$$$$$$$$$$$$$$$$$$$$$$    `$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
      `$$$$$$$$$$$$$$$$$$$$$$$$$$     `$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
       $$$$$$$$$$$$$$$$$$$$$$$$$$.     $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
       `$$$$$$$$$$$$$$$$$$$$$$$$$$     `$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
         $$$$$$$$$$$$$$$$$$$$$$$$$      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
          $$$$$$$$$$$$$$$$$$$$$$$$      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
           $$$$$$$$$$ $$$$$$$$$$$$      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
            $$$$$$$$$$$$$$$$$$$$$$      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
             $$$$$$$$$$$$$$$$$$$$'      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
             `$$$$$$$$$$$$$$$$$$$       $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
              `$$$$$$$$$$$$$$$$$$.      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
               `$$$$$$$$$$$$$$$$$$      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
                 $$$$$$$$$$$$$$$$$.     $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
                  `$$$$$$$$$$$$$$$$     $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
                    $$$$$$$$$$$$$$$     `$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
                    $$$$$$$$$$$$$$$      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$           
$    q$P    $$$'  `$$$   $$   $$$$$      `$$$$'  `$$$   $   $$   q$   $     $
$     $     $$'    `$$   qp   $$$$$   $b  `$$'    `$$.  $  .$$    q   $   $$$
$     '     $'  db  `$.      .$$$$$   $P  .$'  db  `$$     $$$        $   $$$
$           $   $$   $$s    s$$$$$$      .$$   $$   $$.   .$$$        $     $
$   b   d   $   $$   $'      `$$$$$   $$$$$$   $$   $$$   $$$$        $   $$$
$   $   $   $        $   db   $$$$$   $$$$$$        $$$   $$$$   b    $   $$$ 
$   $. .$   $   $$   $   $$   $$$$$   $$$$$$   $$   $$$   $$$$   $b   $     $ 
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ dp $




*/