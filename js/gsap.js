document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    const lenis = new Lenis({
        duration: 3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        smooth: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    function textReveal() {
       
    var clutter = "";
    document
      .querySelector(".testimo")
      .textContent.split("")
      .forEach(function (e) {
        if (e === "") clutter += `<span>&nbsp;</span>`;
        clutter += `<span>${e}</span>`;
      });
    document.querySelector(".testimo").innerHTML = clutter;
    gsap.set(".testimo span", {
      opacity: 0.1,
    });
    gsap.to(".testimo span", {
        opacity: 1,
        stagger: 0.03,
        ease: "power4.out",
      scrollTrigger: {
        trigger: ".about-section",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 3,
         toggleActions: "play none none reverse"
         
      },
    });
  }
    textReveal();
    
});

gsap.timeline({
      scrollTrigger: {
        trigger: ".wrapper",
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: true,
      }
    })
    .to(".upper-layer", {
      scale: 2,
      z: 350,
      transformOrigin: "center center",
      ease: "power1.inOut"
    })
    .to(
      ".section.hero",
      {
        scale: 1.1,
        transformOrigin: "center center",
        ease: "power1.inOut"
      },
      "<"
    );
    function handleSlides() {
      gsap.to(".slides", {
          xPercent: -200,
          ease: "power1.inOut",
          scrollTrigger: {
              trigger: ".third-section",
              start: "top top",
              end: "bottom bottom",
              scrub: 5,
              pin: true
          }
      });
  }
  
  handleSlides();