import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BannerProps {
  finalWord?: string;
  interval?: number;
}

const Banner = ({ finalWord = "DIRECTORY", interval = 700 }: BannerProps) => {
  // Directory words in different languages
  const directoryWords = ['λεξικόν', 'دفتر', 'सूची', '資料', 'سِجل', '일기'];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(directoryWords[0]);
  const [completed, setCompleted] = useState(false);
  const [inView, setInView] = useState(true);
  const [animationInitialized, setAnimationInitialized] = useState(false);
  
  const bannerRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get font for current word
  const getFontForWord = (word: string, isCompleted: boolean) => {
    if (isCompleted) {
      return "'Oswald', sans-serif";
    }
    
    // Special font for each language
    if (word === 'λεξικόν') return "'Playfair Display', serif"; // Greek
    if (word === 'دفتر' || word === 'سِجل') return "'Poppins', sans-serif"; // Arabic/Persian
    if (word === 'सूची') return "'Montserrat', sans-serif"; // Hindi
    if (word === '資料') return "'Oswald', sans-serif"; // Chinese
    if (word === '일기') return "'Montserrat', sans-serif"; // Korean
    
    // Default for English
    return "'Oswald', sans-serif";
  };
  
  // Reset animation function
  const resetAnimation = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Reset state
    setCurrentIndex(0);
    setDisplayText(directoryWords[0]);
    setCompleted(false);
    setAnimationInitialized(false);
    
    // Trigger initial animation
    if (bannerRef.current) {
      gsap.set(bannerRef.current, { clearProps: "all" });
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, y: 50, rotationX: 0 },
        { opacity: 1, y: 0, duration: 1, onComplete: () => setAnimationInitialized(true) }
      );
    }
  };
  
  // Set up scroll trigger to detect when banner is in view
  useEffect(() => {
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        setInView(true);
        if (!animationInitialized) {
          resetAnimation();
        }
      },
      onLeave: () => setInView(false),
      onEnterBack: () => {
        setInView(true);
        resetAnimation(); // Reset animation when scrolling back up
      },
      onLeaveBack: () => setInView(false)
    });
    
    return () => {
      if (scrollTrigger) scrollTrigger.kill();
    };
  }, [animationInitialized]);
  
  // Clear the interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Set up the flip animation
  useEffect(() => {
    if (completed || !inView || !animationInitialized) {
      // If we're already completed or not in view, don't set up new intervals
      return;
    }
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (currentIndex >= directoryWords.length - 1) {
        // We're at the last word, clear interval and show final word
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        // Final flip animation
        gsap.to(bannerRef.current, {
          duration: 0.25,
          opacity: 0,
          y: -50,
          rotationX: 90,
          onComplete: () => {
            setDisplayText(finalWord);
            setCompleted(true);
            
            // Special animations for the final word
            gsap.fromTo(
              bannerRef.current, 
              { 
                opacity: 0, 
                y: 50, 
                rotationX: -90,
                letterSpacing: "0.1em",
              },
              { 
                duration: 0.5, 
                opacity: 1, 
                y: 0, 
                rotationX: 0,
                letterSpacing: "0.3em",
                scale: 1.1,
                ease: "power2.out",
                textShadow: "0 0 10px rgba(255,255,255,0.5)",
              }
            );
          }
        });
      } else {
        // Normal flip animation for intermediate words
        gsap.to(bannerRef.current, {
          duration: 0.25,
          opacity: 0,
          y: -50,
          rotationX: 90,
          onComplete: () => {
            setDisplayText(directoryWords[currentIndex + 1]);
            
            // Flip in animation for intermediate words
            gsap.fromTo(
              bannerRef.current, 
              { opacity: 0, y: 50, rotationX: -90 },
              { 
                duration: 0.25, 
                opacity: 1, 
                y: 0, 
                rotationX: 0,
                onComplete: () => {
                  setCurrentIndex(prev => prev + 1);
                } 
              }
            );
          }
        });
      }
    }, interval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, directoryWords, finalWord, interval, completed, inView, animationInitialized]);
  
  return (
    <div ref={containerRef} className="overflow-hidden">
      <h1
        ref={bannerRef}
        className={`text-9xl font-bold text-center mb-12 perspective-500 tracking-wider ${
          completed ? 'text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 uppercase' : 'text-white'
        }`}
        style={{ 
          transformStyle: 'preserve-3d',
          fontFamily: getFontForWord(displayText, completed),
          fontWeight: completed ? 900 : 700,
        }}
      >
        {displayText}
      </h1>
    </div>
  );
};

export default Banner; 