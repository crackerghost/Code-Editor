import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Typewriter from "typewriter-effect/dist/core";

function Hero() {
  const titleRef = useRef();
 const useNav = useNavigate()
  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -60 },
      {
        opacity: 1,
        duration: 0.8,

        y: 0,
      }
    );

    new Typewriter(titleRef.current, {
      strings: ["Share your code with developers","Share your code with friends","Share your code with the world"],

      autoStart: true,
      delay: 50,
      loop: true,
    });
  }, []);

  const handleProgress = () => {
    // if (hover) {
    //   setHover(false);
    //   gsap.fromTo(
    //     ".progress",
    //     {
    //       width: 200,
    //     },
    //     {
    //       width: 0,
    //       duration: 1,
    //       onComplete: () => setHover(true),
    //     }
    //   );
    // } else {
    //   setHover(true);
    //   gsap.fromTo(
    //     ".progress",
    //     {
    //       width: 0,
    //     },
    //     {
    //       width: 200,
    //       duration: 1,
    //       onComplete: () => setHover(false),
    //     }
    //   );
    // }
  };

  const handleNew = async ()=>{
     const id = Math.random().toString(36).substring(2, 16)
     useNav(`/editor/${id}`)
  }

  return (
    <div className="w-full h-[60vh] my-10 flex flex-col justify-start gap-4 items-center p-4">
      <h1
        ref={titleRef}
        className="text-5xl z-0 font-semibold text-center"
      ></h1>
      <h1 className="text-3xl my-10 text-blue-500 font-semibold text-center">
        from anywhere
      </h1>
      <div className="w-full flex justify-center">
        <div className="w-auto flex justify-center">
           
            <button onClick={handleNew}
            onMouseOver={handleProgress}
            className={`overflow-hidden  flex flex-col justify-center  items-center w-[200px] bg-blue-500 text-white border-b-4  border-gray-400  hover:border-white hover:scale-90 transition-all duration-200 text-lg h-[60px] border-2 rounded-full  `}
          >
            + New File
           
          </button>
           
      
        </div>
      </div>
      <p className="text-gray-300">No sign up. Free. Forever ❤️</p>
    </div>
  );
}

export default Hero;
