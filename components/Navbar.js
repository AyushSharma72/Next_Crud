"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { TbBrandNextjs } from "react-icons/tb";
import { FaPlusCircle } from "react-icons/fa";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex w-[90%] sm:w-3/4 lg:w-1/2  justify-between m-auto p-3 navbar  rounded">
      <TbBrandNextjs className="text-3xl" />

      {
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className={
              pathname === "/"
                ? "text-black font-bold"
                : "font-bold hover:text-black"
            }
          >
            Home
          </Link>
          
          <Link href="/create">
            {" "}
            <div
              className={`flex items-center gap-2 rounded-md p-2 transition-colors duration-300 ${
                pathname === "/create"
                  ? "bg-black text-white hover:bg-white hover:text-black"
                  : "bg-white text-black hover:bg-black hover:text-white"
              }`}
            >
              Create task
              <FaPlusCircle />
            </div>
          </Link>
        </div>
      }
    </div>
  );
};

export default Navbar;
