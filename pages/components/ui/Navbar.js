import React from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/pages/utils/firebaseConfig";

const NavbarUI = ({ logo, title, web3Handler, account, isInspector }) => {
  return isInspector ? (
    <div className="navbar bg-base-500 shadow-lg ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/">Discover </Link>
            </li>
            <li>
              <Link href="/verify-property" >Verify Property</Link>
            </li>
          </ul>
        </div>
        <a className="btn btn-square btn-ghost">
          <img src={logo} width="35" height="35" className="" alt="logo" />
        </a>
        <a className="btn btn-ghost text-xl">{title}</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Discover </Link>
          </li>
          <li>
            <Link href="/verify-property" >Verify Property</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <button
          className="btn btn-primary btn-outline sm:btn-sm md:btn-md lg:btn-md mr-10"
          onClick={() => {
            signOut(auth);
            localStorage.removeItem("user");
          }}
        >
          Log out
        </button>
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn m-1">
            Theme
            <svg width="12px" height="12px" className="h-2 w-2 fill-current opacity-60 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-30">
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Default" value="default" /></li>
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Retro" value="retro" /></li>
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Cyberpunk" value="cyberpunk" /></li>
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Valentine" value="valentine" /></li>
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Aqua" value="aqua" /></li>
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Cupcake" value="cupcake" /></li>
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Dark" value="dark" /></li>
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Luxury" value="luxury" /></li>
          </ul>
        </div>
        {account ? (
          <button className="btn btn-primary btn-outline sm:btn-sm md:btn-md lg:btn-md">
            {account.slice(0, 5) + "..." + account.slice(38, 42)}
          </button>
        ) : (
          <>
            <button
              onClick={web3Handler}
              className="btn btn-primary btn-outline sm:btn-sm md:btn-md lg:btn-md"
            >
              Connect Wallet
            </button>
          </>
        )}

      </div>
    </div>
  ) : (
    <div className="navbar bg-base-500 shadow-lg ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/">Discover </Link>
            </li>
            <li>
              <Link href="/add">Add Property</Link>
            </li>
            <li>
              <Link href="/verify-property" >Verify Property</Link>
            </li>
            <li>
              <Link href="/owned-property">Owned Property</Link>
            </li>
            <li>
              <Link href="/listed-property">Listed Property</Link>
            </li>
            {/* <li>
              <Link href="/sold-property">Sold Property</Link>
            </li>
            <li>
              <Link href="/my-purchases">Purchased Property</Link>
            </li> */}
          </ul>
        </div>
        <a className="btn btn-square btn-ghost">
          <img src={logo} width="35" height="35" className="" alt="logo" />
        </a>
        <a className="btn btn-ghost text-xl">{title}</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Discover </Link>
          </li>
          <li>
            <Link href="/add">Add Property</Link>
          </li>
          <li>
            <Link href="/verify-property" >Verify Property</Link>
          </li>
          <li>
            <Link href="/owned-property">Owned Property</Link>
          </li>
          <li>
            <Link href="/listed-property">Listed Property</Link>
          </li>
          {/* <li>
            <Link href="/sold-property">Sold Property</Link>
          </li>
          <li>
            <Link href="/my-purchases">Purchased Property</Link>
          </li> */}
        </ul>
      </div>
      <div className="navbar-end">
        <button
          className="btn btn-primary btn-outline sm:btn-sm md:btn-md lg:btn-md mr-10"
          onClick={() => {
            signOut(auth);
            localStorage.removeItem("user");
          }}
        >
          Log out
        </button>
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn m-1">
            Theme
            <svg width="12px" height="12px" className="h-2 w-2 fill-current opacity-60 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-30">
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Default" value="default" /></li>
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Retro" value="retro" /></li>
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Cyberpunk" value="cyberpunk" /></li>
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Valentine" value="valentine" /></li>
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Aqua" value="aqua" /></li>
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Cupcake" value="cupcake" /></li>
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Dark" value="dark" /></li>
            <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Luxury" value="luxury" /></li>
          </ul>
        </div>
        {account ? (
          <button className="btn btn-primary btn-outline sm:btn-sm md:btn-md lg:btn-md">
            {account.slice(0, 5) + "..." + account.slice(38, 42)}
          </button>
        ) : (
          <>
            <button
              onClick={web3Handler}
              className="btn btn-primary btn-outline sm:btn-sm md:btn-md lg:btn-md"
            >
              Connect Wallet
            </button>
          </>
        )}
        
        
        {/* DARK AND LIGHT MODE TOGGLE */}
        {/* <label className="swap swap-rotate">
          <input type="checkbox" className="theme-controller" value="dark" />
          <svg className="swap-off fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
          <svg className="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>
        </label> */}
      </div>
    </div>
  );
};

export default NavbarUI;
