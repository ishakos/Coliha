"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Our Platform
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
          Discover a seamless experience designed to make your life easier. Join
          us today and explore amazing features.
        </p>
        <div className="mt-6 flex space-x-4">
          <Link
            href="/login"
            className="bg-teal-500 hover:bg-teal-700 px-6 py-3 rounded-lg text-lg font-medium transition duration-300"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="border border-gray-400 px-6 py-3 rounded-lg text-lg font-medium transition duration-300 hover:bg-gray-800"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Why Choose Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Fast & Secure",
              description:
                "Our platform ensures speed and security for a smooth experience.",
            },
            {
              title: "User-Friendly",
              description:
                "Designed with simplicity in mind, making navigation easy.",
            },
            {
              title: "24/7 Support",
              description:
                "Our team is always here to help you with any issues or questions.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg text-center"
            >
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-300 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
