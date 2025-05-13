import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Create a public URL for the phone image
const phoneImageUrl = '/redPhone.png';

const PhoneBanner = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneImageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a scroll-linked animation for the phone
      const phoneTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "center center",
          scrub: 1,
          onEnter: () => {
            gsap.to(phoneImageRef.current, { opacity: 1, duration: 0.5 });
          },
          onLeave: () => {
            gsap.to(phoneImageRef.current, { opacity: 0, duration: 0.5 });
          },
          onEnterBack: () => {
            gsap.to(phoneImageRef.current, { opacity: 1, duration: 0.5 });
          },
          onLeaveBack: () => {
            gsap.to(phoneImageRef.current, { opacity: 0, duration: 0.5 });
          }
        }
      });
      
      // Animate the phone based on scroll position
      phoneTimeline.fromTo(
        phoneImageRef.current,
        { 
          y: '100%', 
          rotate: -15,
          scale: 0.7,
        },
        { 
          y: '0%', 
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
            start: "top bottom+=100",
            end: "top center",
            scrub: 1
          }
        }
      );
    });
    
    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="section-phone py-64 mt-24 relative overflow-hidden"
      style={{ backgroundColor: '#8B0000' }} // Dark red background
    >
      <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center z-10 pointer-events-none">
        {/* Red phone image that appears on scroll */}
        <img
          ref={phoneImageRef}
          src={phoneImageUrl}
          alt="Red telephone handset"
          className="h-[800px] opacity-0 max-w-none -mt-32"
          style={{ 
            filter: 'drop-shadow(0 0 30px rgba(255,0,0,0.5))',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <h2 
          ref={titleRef}
          className="text-8xl font-bold text-white mb-24 text-center"
        >
          CONTACT ME
        </h2>
         
        <p 
          ref={textRef}
          className="text-center text-white mt-64 text-3xl" 
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Leave your number and I'll call you back.
        </p>
      </div>
    </div>
  );
};

export default PhoneBanner; 