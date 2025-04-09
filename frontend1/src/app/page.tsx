"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[#181818] text-white min-h-screen font-sans">
      <header className="bg-[#212121] py-4 px-8 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          LOGO
        </Link>
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <div className="relative group">
                <button className="flex items-center text-sm">
                  Explore More
                  <svg
                    className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {/* You can implement a dropdown menu here */}
              </div>
            </li>
            <li>
              <Link
                href="/login"
                className="bg-white text-black font-semibold py-2 px-4 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                Join Now
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="py-20 px-8 flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto">
        <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
          <div className="bg-[#333333] text-white py-1 px-3 rounded-full inline-block text-sm mb-4">
            New <span className="ml-1 text-[#FFD700]">Welcome to Your Learning Journey</span>
            <svg
              className="w-4 h-4 inline-block ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Discover <br className="hidden lg:block" />
            Endless <br className="hidden lg:block" />
            Learning <br className="hidden lg:block" />
            Opportunities
          </h1>
        </div>
        <div className="lg:w-1/2 text-center lg:text-left">
          <p className="text-lg text-gray-400 mb-8">
            At LearnHub, we strive to provide a unique and enriching educational
            experience. Browse various courses created by industry professionals
            and engage with a vibrant community. Your journey towards mastery
            starts now.
          </p>
          <div className="flex items-center justify-center lg:justify-start space-x-4">
            <Link
              href="/login"
              className="bg-white text-black font-semibold py-3 px-6 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/learn-more"
              className="border border-[#555555] text-gray-400 font-semibold py-3 px-6 rounded-full text-sm hover:border-[#888888] hover:text-white transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}