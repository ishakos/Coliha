"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <section className="flex flex-col items-center justify-center text-center py-15 px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 ">
          Welcome to <span className="font-extrabold">Coliha</span>!
        </h1>
        <p className="text-2xl md:text-3xl font-bold text-teal-400 mb-4">
          Manage Your Store Effortlessly
        </p>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
          The all-in-one dashboard for sellers. Easily manage your products and
          send packages directly to shipping companies like ZR Express—no
          hassle, just growth.
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

      <section className="py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Why Use Our Platform?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Centralized Product Management",
              description:
                "Easily add, edit, and organize your Foorweb store products from one place.",
            },
            {
              title: "Seamless Shipping Integration",
              description:
                "Send packages directly to shipping companies like ZR Express with just a few clicks.",
            },
            {
              title: "Time-Saving & Reliable",
              description:
                "Automate repetitive tasks and focus on growing your business with our secure and user-friendly tools.",
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
