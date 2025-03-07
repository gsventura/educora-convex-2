import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PricingCard } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/clerk-react";
import {
  Authenticated,
  Unauthenticated,
  useAction,
  useMutation,
  useQuery,
} from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../convex/_generated/api";
import {
  BookOpen,
  Brain,
  FileQuestion,
  Lightbulb,
  PenTool,
  Calendar,
} from "lucide-react";

const FEATURES = [
  {
    icon: <FileQuestion className="h-8 w-8 text-indigo-600" />,
    title: "Question Generator",
    description:
      "Create custom exam questions by specifying subject, difficulty level, and prompt",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-indigo-600" />,
    title: "Answer Assistant",
    description:
      "Upload question text or images to receive AI-generated explanations and corrections",
  },
  {
    icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
    title: "Saved Questions",
    description:
      "Tag, search, and export generated questions in markdown or docx formats",
  },
  {
    icon: <Calendar className="h-8 w-8 text-indigo-600" />,
    title: "Study Plans",
    description:
      "Chat with AI to create personalized study guidance that can be saved for future reference",
  },
] as const;

function App() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const storeUser = useMutation(api.users.store);
  const subscriptionStatus = useQuery(
    api.subscriptions.getUserSubscriptionStatus,
  );
  const getProducts = useAction(api.subscriptions.getProducts);
  const [products, setProducts] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const result = async () => {
      const products = await getProducts();

      setProducts(products?.data);
      return products;
    };
    result();
  }, []);

  useEffect(() => {
    if (user) {
      storeUser();
    }
  }, [user, storeUser]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
            <h1 className="text-6xl font-bold text-indigo-900 mb-4">Educora</h1>
            <p className="text-xl text-gray-600 max-w-3xl mb-8">
              AI-powered educational platform that helps students prepare for
              exams with custom questions, detailed answers, organized study
              materials, and personalized study plans.
            </p>

            {!isUserLoaded ? (
              <div className="flex gap-4">
                <div className="px-8 py-3 w-[145px] h-[38px] rounded-lg bg-gray-200 animate-pulse"></div>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-4">
                <Unauthenticated>
                  <SignInButton mode="modal" signUpFallbackRedirectUrl="/">
                    <Button className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200">
                      Start Learning
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Go to Dashboard
                  </Button>
                </Authenticated>
              </div>
            )}
          </div>

          {/* How It Works Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How Educora Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform makes exam preparation efficient and
                effective
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center p-6">
                <div className="bg-indigo-100 p-4 rounded-full mb-4">
                  <PenTool className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  1. Generate Questions
                </h3>
                <p className="text-gray-600">
                  Specify your subject, difficulty level, and any specific
                  topics to create custom exam questions
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6">
                <div className="bg-indigo-100 p-4 rounded-full mb-4">
                  <Brain className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  2. Get AI Assistance
                </h3>
                <p className="text-gray-600">
                  Upload questions or use our answer assistant to receive
                  detailed explanations
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6">
                <div className="bg-indigo-100 p-4 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  3. Create Study Plans
                </h3>
                <p className="text-gray-600">
                  Get personalized study guidance based on your goals and
                  learning style
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Key Features
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to excel in your exams
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="mr-4">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <section id="pricing" className="mb-20">
            <div className="flex flex-col items-center justify-center">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-lg text-gray-600">
                  Choose the plan that's right for your learning journey
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Free Plan */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
                  <h3 className="text-xl font-semibold mb-2">Free</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Perfect for trying out Educora
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>10 credits per month</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>Save generated questions</span>
                    </li>
                    <li className="flex items-center text-gray-400">
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                      <span>Limited exports</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200">
                    Get Started Free
                  </Button>
                </div>

                {/* Basic Plan */}
                <div className="bg-white border-2 border-indigo-600 rounded-xl shadow-md p-8 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Basic</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold">$9.99</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">For serious students</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>Unlimited question generations</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>Export to markdown & docx</span>
                    </li>
                    <li className="flex items-center text-gray-400">
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                      <span>Limited study plans</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                    Subscribe Now
                  </Button>
                </div>

                {/* Pro Plan */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
                  <h3 className="text-xl font-semibold mb-2">Pro</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold">$19.99</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">For maximum productivity</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>Everything in Basic</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>Unlimited study plans</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                    Go Pro
                  </Button>
                </div>

                {/* Dynamic Stripe Plans */}
                {products?.map((plan) => (
                  <PricingCard
                    key={plan.id}
                    price={{
                      id: plan.id,
                      amount: plan.amount,
                      interval: plan.interval,
                      currency: plan.currency,
                    }}
                    product={{
                      id: plan.product,
                      name:
                        plan.interval === "month"
                          ? "Monthly Plan"
                          : "Yearly Plan",
                      description: `${plan.currency.toUpperCase()} ${(plan.amount / 100).toFixed(2)}/${plan.interval}`,
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What Students Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join thousands of students who have improved their exam results
                with Educora
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-semibold">JD</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">John Doe</h4>
                    <p className="text-sm text-gray-500">Medical Student</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Educora helped me prepare for my medical board exams with
                  custom questions that were spot-on for the actual test. The
                  study plans feature was a game-changer for my preparation."
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-semibold">SJ</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500">Law Student</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The answer assistant feature helped me understand complex
                  legal concepts that I was struggling with. I was able to save
                  all my questions and review them before my bar exam."
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-semibold">MT</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Michael Thompson</h4>
                    <p className="text-sm text-gray-500">
                      Computer Science Student
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "I used Educora to generate practice questions for my
                  programming exams. The AI was able to create challenging
                  questions that really tested my knowledge and prepared me
                  well."
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-indigo-50 rounded-2xl p-12 text-center max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Ace Your Exams?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are using Educora to study smarter,
              not harder.
            </p>
            <div className="flex justify-center gap-4">
              <Unauthenticated>
                <SignInButton mode="modal" signUpFallbackRedirectUrl="/">
                  <Button className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200">
                    Get Started Free
                  </Button>
                </SignInButton>
              </Unauthenticated>
              <Authenticated>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                  Go to Dashboard
                </Button>
              </Authenticated>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
