import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Navbar() {
  const [share, setShare] = useState(false); // Default state is false
  const parms = useParams();

  useEffect(() => {
    // Dynamically update `share` based on `parms.id`
    setShare(!parms.id);
  }, [parms.id]);

  const handleCopyUrl = () => {
    const currentUrl = window.location.href; // Get the current URL
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("Link copied to clipboard!"); // Notify the user
      })
      .catch((err) => {
        console.error("Failed to copy Link: ", err);
      });
  };

  return (
    <div className="w-screen h-[8%] z-50 flex justify-between p-4 ">
      <Link to={"/"}>
        <div className="w-[100px] flex text-sm flex-col justify-center items-center">
          <img
            src="https://cdn.dribbble.com/users/1551609/screenshots/6681276/snakedev-dribbble_4x.png?resize=400x300&vertical=center"
            className="w-[50px] h-[50px] rounded-full"
            alt="logo"
          />
          <p>CodeShare</p>
        </div>
      </Link>

      <div className="w-auto flex justify-between items-center gap-4">
        <div>
          <button className="p-1 hover:border-blue-500 transition-all duration-150 text-lg h-[40px] border-2 rounded-full border-white">
            + New File
          </button>
        </div>
        {/* Share Button */}
        {!share && (
          <button
            onClick={handleCopyUrl}
            className="h-[30px] transition-all border-b-2 border-white duration-150 flex hover:border-blue-500 justify-center items-center gap-2"
          >
            Share
            <span>
              <img src="/arrow.svg" className="w-[20px] -rotate-45" alt="" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
