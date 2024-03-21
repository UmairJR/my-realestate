"use client";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./utils/firebaseConfig";
import Link from "next/link";
import ButtonLoader from "./components/ButtonLoader";
import { useToast } from "@chakra-ui/react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast()
  // const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        
        setLoading(false)
        const user = userCredential.user;
        localStorage.setItem("user", true);
        router.push("/");
        // ...
      })
      .catch((error) => {
        setLoading(false)
        const errorCode = error.code;
        toast({
          title: 'Error',
          description: 'Invalid Credentials!',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        const errorMessage = error.message;
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5 font-bold text-center">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-10 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button
          onClick={handleSignIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          {loading ? <ButtonLoader /> : `Sign In` }
        </button>
        <span className="text-sm text-white mt-5 text-center block">Not a member? <Link className="text-indigo-600" href={'/signup'}>Sign Up</Link> </span>
      </div>
    </div>
  );
};

export default SignIn;
