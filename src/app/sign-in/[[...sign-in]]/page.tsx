import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";

const SignInPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn appearance={{ variables: { colorPrimary: "#0F172A" } }} />
    </div>
  );
};

export const metadata: Metadata = {
  title: "SmartNotes - Sign In",
};

export default SignInPage;
