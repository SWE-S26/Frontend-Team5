"use client";
import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import AuthModal from "@/components/auth/AuthModal";

export default function CallingAllCreators() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirect, setAuthRedirect] = useState("/home");

  const openAuth = (redirectTo: string) => {
    setAuthRedirect(redirectTo);
    setIsAuthModalOpen(true);
  };

  return (
    <section className="w-full bg-black">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between py-14 sm:h-87 gap-8 sm:gap-0">
        {/* Left: copy */}
        <div className="flex flex-col gap-3 max-w-md text-center sm:text-left">
          <h2 className="text-white text-3xl sm:text-4xl leading-tight">Calling all creators</h2>

          <p className="text-white font-bold text-[15px] leading-relaxed">
            Get on Beatza to connect with fans, share your sounds, and grow your audience. What are
            you waiting for?
          </p>

          <div className="pt-4 sm:pt-8 mx-auto sm:mx-0 w-fit">
            <Button className="bg-white text-black" onClick={() => openAuth("/upload")}>
              Find out more
            </Button>
          </div>
        </div>

        {/* Right: image — hidden on mobile */}
        <div className="hidden sm:block relative shrink-0 w-[55%] h-100">
          <Image
            src="/landing-page/CallingAllCreators.png"
            alt="Calling all creators"
            fill
            className="object-contain object-right"
          />
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectTo={authRedirect}
      />
    </section>
  );
}
