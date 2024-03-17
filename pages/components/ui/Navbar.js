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
            <li>
              <Link href="/sold-property">Sold Property</Link>
            </li>
            <li>
              <Link href="/my-purchases">Purchased Property</Link>
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
          <li>
            <Link href="/sold-property">Sold Property</Link>
          </li>
          <li>
            <Link href="/my-purchases">Purchased Property</Link>
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
  );
};

export default NavbarUI;
