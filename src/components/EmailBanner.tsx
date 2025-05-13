import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Create a public URL for the email image
const emailImageUrl = '/email.png';

const EmailBanner = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const emailImageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    // Create scroll triggers for the section
    const ctx = gsap.context(() => {
      // Create a scroll-linked animation for the email
      const emailTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "center center",
          scrub: 1,
          onEnter: () => {
            gsap.to(emailImageRef.current, { opacity: 1, duration: 0.5 });
          },
          onEnterBack: () => {
            gsap.to(emailImageRef.current, { opacity: 1, duration: 0.5 });
          }
        }
      });
      
      // Animate the email based on scroll position - from left to right
      emailTimeline.fromTo(
        emailImageRef.current,
        { 
          x: '-100%', 
          rotate: -15,
          scale: 0.7,
        },
        { 
          x: '0%', 
          rotate: 0,
          scale: 1,
          ease: "power2.out",
        }
      );
      
      // Animate the title
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top center",
            scrub: 1
          }
        }
      );
      
      // Animate the text
      gsap.fromTo(
        textRef.current,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom+=200",
            end: "top center",
            scrub: 1
          }
        }
      );
    });
    
    return () => {
      // Clean up all ScrollTrigger instances when component unmounts
      ctx.revert();
    };
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="section-email py-64 mt-24 relative overflow-hidden"
      style={{ backgroundColor: '#3A0CA3' }} // Purple background
    >
      <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center z-10 pointer-events-none">
        {/* Email image that appears on scroll */}
        <img
          ref={emailImageRef}
          src={emailImageUrl}
          alt="Email envelope"
          className="h-[700px] opacity-0 max-w-none"
          style={{ 
            filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3))',
            transform: 'translateX(-100%) scale(0.7) rotate(-15deg)'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <h2 
          ref={titleRef}
          className="text-8xl font-bold text-white mb-24 text-center"
        >
          STAY CONNECTED
        </h2>
         
        <p 
          ref={textRef}
          className="text-center text-white mt-80 text-3xl" 
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Subscribe to my newsletter for updates.
        </p>
      </div>
    </div>
  );
};

export default EmailBanner; 