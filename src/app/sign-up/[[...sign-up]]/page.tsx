import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp appearance={{ variables: { colorPrimary: "#0F172A" } }} />
    </div>
  );
};

export const metadata: Metadata = {
  title: "SmartNotes - Sign Up",
};

export default SignUpPage;
