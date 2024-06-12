import LeftSidebar from "@/components/left-sidebar";
import MobileNav from "@/components/mobile-nav";
import RightSidebar from "@/components/right-sidebar";
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";
import PodcastPlayer from "@/components/podcast-player";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="realtive flex flex-col">
      <main className="relative flex bg-black-3">
        {/* <p className="text-white-1">LEFT SIDEBAR</p> */}
        <LeftSidebar />

        <section className="flex min-h-screen flex-1 flex-col px-4 sm:px-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
            <div className="flex h-16 items-center justify-between text-white-1 md:hidden">
              <Image
                src="/icons/logo.svg"
                width={30}
                height={30}
                alt="logo icon"
              />
              <MobileNav />
            </div>

            <div className="flex flex-col md:pb-14">
              <Toaster />
              {children}
            </div>
          </div>
        </section>
        <RightSidebar />
      </main>

      <PodcastPlayer />
    </div>
  );
}
