import {
  Download,
  Heart,
  MessageCircle,
  Video,
  Gamepad2,
  Users,
  Smartphone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Star,
  Plus,
  Minus,
  Shield,
  Zap,
  Award,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";

import { useState, useEffect } from "react";

export const LandingPage = () => {
  const [isVisible, setIsVisible] = useState({});
  const [openFaq, setOpenFaq] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Infinite scroll animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollY((prev) => prev + 1);
    }, 50); // Smooth scrolling speed
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const elements = document.querySelectorAll("[id]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // App screenshots for infinite scroll
  const appScreenshots = [
    {
      id: 1,
      title: "Chat Interface",
      image: "/placeholder-01.jpg?height=480&width=240",
      theme: "dark",
      size: "tall",
    },
    {
      id: 2,
      title: "Profile Setup",
      image: "/placeholder-02.jpg?height=400&width=240",
      theme: "light",
      size: "medium",
    },
    {
      id: 3,
      title: "Video Call",
      image: "/placeholder-03.jpg?height=520&width=240",
      theme: "dark",
      size: "tall",
    },
    {
      id: 4,
      title: "Game Selection",
      image: "/placeholder-08.jpg?height=380&width=240",
      theme: "yellow",
      size: "medium",
    },
    {
      id: 5,
      title: "Match Dashboard",
      image: "/placeholder-05.jpg?height=500&width=240",
      theme: "dark",
      size: "tall",
    },
    {
      id: 6,
      title: "Settings",
      image: "/placeholder-06.jpg?height=420&width=240",
      theme: "light",
      size: "medium",
    },
    {
      id: 7,
      title: "Notifications",
      image: "/placeholder-07.jpg?height=360&width=240",
      theme: "gray",
      size: "short",
    },
    {
      id: 8,
      title: "Live Games",
      image: "/placeholder-08.jpg?height=480&width=240",
      theme: "purple",
      size: "tall",
    },
    {
      id: 9,
      title: "Messages",
      image: "/placeholder-09.jpg?height=440&width=240",
      theme: "light",
      size: "medium",
    },
    {
      id: 10,
      title: "Discover",
      image: "/placeholder-04.jpg?height=500&width=240",
      theme: "gradient",
      size: "tall",
    },
    {
      id: 11,
      title: "Payment",
      image: "/placeholder-06.jpg?height=380&width=240",
      theme: "yellow",
      size: "medium",
    },
    {
      id: 12,
      title: "Premium",
      image: "/placeholder-04.jpg?height=460&width=240",
      theme: "dark",
      size: "tall",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      age: 28,
      text: "I found my soulmate through this app! The video calling feature helped us connect on a deeper level.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Mike Chen",
      age: 32,
      text: "The live games feature is amazing! It's such a fun way to break the ice and get to know someone.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Emma Davis",
      age: 26,
      text: "Best dating app I've ever used. The matching algorithm is spot on and I love the post-game dashboard.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
  ];

  const faqs = [
    {
      question: "Is the app free to use?",
      answer:
        "Yes! You can download and use basic features for free. Premium features are available with our subscription plans.",
    },
    {
      question: "How does the matching algorithm work?",
      answer:
        "Our smart algorithm considers your preferences, interests, location, and compatibility scores from games to suggest the best matches.",
    },
    {
      question: "Are video calls secure?",
      answer:
        "All video calls are end-to-end encrypted and we never store or record your conversations.",
    },
    {
      question: "What types of games can I play?",
      answer:
        "We offer various interactive games including trivia, word games, personality quizzes, and fun icebreaker challenges.",
    },
  ];

  const getPhoneTheme = (theme) => {
    switch (theme) {
      case "light":
        return "bg-gradient-to-b from-gray-100 to-white";
      case "dark":
        return "bg-gradient-to-b from-gray-800 to-gray-900";
      case "yellow":
        return "bg-gradient-to-b from-yellow-400 to-orange-400";
      case "purple":
        return "bg-gradient-to-b from-purple-500 to-pink-500";
      case "gray":
        return "bg-gradient-to-b from-gray-500 to-gray-600";
      case "gradient":
        return "bg-gradient-to-b from-cyan-400 to-purple-500";
      default:
        return "bg-gradient-to-b from-gray-700 to-gray-800";
    }
  };

  const getPhoneHeight = (size) => {
    switch (size) {
      case "short":
        return "h-64 sm:h-72";
      case "medium":
        return "h-72 sm:h-80";
      case "tall":
        return "h-80 sm:h-96";
      default:
        return "h-72 sm:h-80";
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 md:h-5 md:w-5 text-black" />
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                LoveConnect
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className={`text-sm font-medium transition-colors ${
                  activeSection === "home"
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className={`text-sm font-medium transition-colors ${
                  activeSection === "features"
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className={`text-sm font-medium transition-colors ${
                  activeSection === "how-it-works"
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("preview")}
                className={`text-sm font-medium transition-colors ${
                  activeSection === "preview"
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className={`text-sm font-medium transition-colors ${
                  activeSection === "testimonials"
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className={`text-sm font-medium transition-colors ${
                  activeSection === "faq"
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                FAQ
              </button>
              <a
                href="/privacy-policy"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-conditions"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Terms & Conditions
              </a>
              <a
                href="/terms-of-use"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Terms Of Use
              </a>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="/login"
                target="_blank"
                className="bg-gradient-to-r from-cyan-500 to-green-500 text-black px-4 py-2 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Admin login
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800/50">
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-left text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-left text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-left text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection("preview")}
                  className="text-left text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Preview
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="text-left text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Reviews
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-left text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  FAQ
                </button>
                <a
                  href="/privacy-policy"
                  className="text-left text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms-conditions"
                  className="text-left text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Terms & Conditions
                </a>
                <a
                  href="/login"
                  target="_blank"
                  className="bg-gradient-to-r from-cyan-500 to-green-500 text-black px-4 py-2 rounded-full font-semibold text-sm w-fit"
                >
                  Admin login
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Consistent Dark Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black/80 to-gray-900/50"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-400 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-green-400 rounded-full opacity-15 blur-lg"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-400 rounded-full opacity-10 blur-lg"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-pink-400 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-400 rounded-full opacity-5 blur-2xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden text-white min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-green-500/5"></div>

        <div className="relative container mx-auto px-4 py-12 md:py-20 lg:py-24 z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="animate-fade-in-up">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                  Find Love, Fun &
                  <span className="bg-gradient-to-r from-cyan-400 via-green-400 to-purple-400 bg-clip-text text-transparent">
                    {" "}
                    Real Connections
                  </span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-gray-300 animate-fade-in-up delay-300">
                  Chat, video call, match & play live games with your perfect
                  match.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center animate-fade-in-up delay-500">
                <button className="group relative bg-gradient-to-r from-cyan-500 to-green-500 text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:shadow-2xl transform hover:scale-105 w-full sm:w-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    <Download className="inline-block mr-2 h-4 w-4 md:h-5 md:w-5 group-hover:animate-bounce" />
                    Download APK Now
                  </div>
                </button>
                <div className="flex items-center justify-center">
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 px-3 md:px-4 py-2 rounded-lg hover:border-cyan-500/60 transition-all duration-300">
                      <span className="text-sm text-cyan-400">
                        Available on Android
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex-1 flex justify-center mt-8 lg:mt-0">
              <div className="relative animate-float">
                <div className="w-48 h-80 sm:w-56 sm:h-96 md:w-64 md:h-[500px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2rem] md:rounded-[2.5rem] p-1.5 md:p-2 shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-500 transform hover:scale-105 border border-cyan-500/30">
                  <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-800 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-green-500/20">
                    <video
                      src="/intro.mp4" // Replace with your video file path
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Floating Hearts */}
                <div className="absolute -top-2 md:-top-4 -right-2 md:-right-4 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/50 animate-bounce">
                  <Heart className="h-4 w-4 md:h-6 md:w-6 text-white" />
                </div>
                <div className="absolute top-1/2 -left-4 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-bounce delay-500">
                  <Heart className="h-3 w-3 text-white" />
                </div>
                <div className="absolute bottom-1/4 -right-6 w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 animate-bounce delay-1000">
                  <Heart className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Features Section */}
      <section id="features" className="py-12 md:py-16 lg:py-24 relative">
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
              isVisible.features
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
              Amazing{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              Everything you need to find your perfect match
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Real-Time Chat Feature */}
            <div
              className={`group bg-gray-800/30 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 border border-gray-700/50 hover:border-cyan-500/50 transform hover:-translate-y-2 ${
                isVisible.features
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
                <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 group-hover:text-cyan-400 transition-colors">
                Real-Time Chat
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                Instantly message and connect with your matches in real-time
                conversations.
              </p>
            </div>

            {/* Video Calling Feature */}
            <div
              className={`group bg-gray-800/30 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 border border-gray-700/50 hover:border-green-500/50 transform hover:-translate-y-2 ${
                isVisible.features
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/30">
                <Video className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 group-hover:text-green-400 transition-colors">
                Video Calling
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                Make secure video calls with matches to get to know each other
                better.
              </p>
            </div>

            {/* Live Games Feature */}
            <div
              className={`group bg-gray-800/30 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border border-gray-700/50 hover:border-purple-500/50 transform hover:-translate-y-2 ${
                isVisible.features
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                <Gamepad2 className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 group-hover:text-purple-400 transition-colors">
                Live Games
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                Play interactive games with other users to break the ice and
                have fun.
              </p>
            </div>

            {/* Match Suggestions Feature */}
            <div
              className={`group bg-gray-800/30 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 border border-gray-700/50 hover:border-pink-500/50 transform hover:-translate-y-2 ${
                isVisible.features
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/30">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 group-hover:text-pink-400 transition-colors">
                Match Suggestions
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                Smart user matching based on your preferences and compatibility.
              </p>
            </div>

            {/* Post-Game Dashboard Feature */}
            <div
              className={`group bg-gray-800/30 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 border border-gray-700/50 hover:border-cyan-500/50 transform hover:-translate-y-2 sm:col-span-2 lg:col-span-1 ${
                isVisible.features
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
                <Smartphone className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 group-hover:text-cyan-400 transition-colors">
                Post-Game Dashboard
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                See compatibility results and feedback after gaming sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - No Pulse Animation */}
      <section
        id="how-it-works"
        className="py-12 md:py-16 lg:py-24 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
              isVisible["how-it-works"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
              How It{" "}
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 - No Pulse Animation */}
            <div
              className={`text-center group transition-all duration-700 ${
                isVisible["how-it-works"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto text-black text-xl md:text-2xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/50">
                  1
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 group-hover:text-cyan-400 transition-colors">
                Download & Create Profile
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                Download the app and create your personalized profile to get
                started.
              </p>
            </div>

            {/* Step 2 - No Pulse Animation */}
            <div
              className={`text-center group transition-all duration-700 ${
                isVisible["how-it-works"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto text-black text-xl md:text-2xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/50">
                  2
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 group-hover:text-green-400 transition-colors">
                Get Matched
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                Get matched with nearby users based on your preferences and
                interests.
              </p>
            </div>

            {/* Step 3 - No Pulse Animation */}
            <div
              className={`text-center group transition-all duration-700 ${
                isVisible["how-it-works"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto text-white text-xl md:text-2xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/50">
                  3
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 group-hover:text-purple-400 transition-colors">
                Connect & Play
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                Chat, video call, or start a live game with your matches.
              </p>
            </div>

            {/* Step 4 - No Pulse Animation */}
            <div
              className={`text-center group transition-all duration-700 ${
                isVisible["how-it-works"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto text-white text-xl md:text-2xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/50">
                  4
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 group-hover:text-pink-400 transition-colors">
                Enjoy Dashboard
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                Enjoy a personalized match dashboard after gaming sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section - Infinite Scroll Grid */}
      <section
        id="preview"
        className="py-12 md:py-16 lg:py-24 relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
              isVisible.preview
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
              App{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Preview
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              See what makes our app special
            </p>
          </div>

          {/* Infinite Scroll Grid */}
          <div className="relative h-[600px] md:h-[800px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900 z-10 pointer-events-none"></div>

            {/* Column 1 */}
            <div
              className="absolute left-0 w-1/4 flex flex-col gap-4"
              style={{
                transform: `translateY(-${scrollY * 0.5}px)`,
                animation: "infiniteScrollUp 20s linear infinite",
              }}
            >
              {[...appScreenshots, ...appScreenshots].map(
                (screenshot, index) => (
                  <div key={`col1-${index}`} className="relative group">
                    <div
                      className={`w-full ${getPhoneHeight(
                        screenshot.size
                      )} bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-2 shadow-xl border border-gray-700/50 group-hover:border-cyan-500/50 transition-all duration-300 transform group-hover:scale-105`}
                    >
                      <div
                        className={`w-full h-full ${getPhoneTheme(
                          screenshot.theme
                        )} rounded-xl overflow-hidden border border-gray-600/30`}
                      >
                        <img
                          src={screenshot.image || "/placeholder.svg"}
                          alt={screenshot.title}
                          width={200}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm border border-cyan-500/30 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-semibold text-cyan-400">
                        {screenshot.title}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Column 2 */}
            <div
              className="absolute left-1/4 w-1/4 flex flex-col gap-4 pl-2"
              style={{
                transform: `translateY(-${scrollY * 0.7}px)`,
                animation: "infiniteScrollDown 25s linear infinite",
              }}
            >
              {[...appScreenshots.slice(3), ...appScreenshots.slice(3)].map(
                (screenshot, index) => (
                  <div key={`col2-${index}`} className="relative group">
                    <div
                      className={`w-full ${getPhoneHeight(
                        screenshot.size
                      )} bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-2 shadow-xl border border-gray-700/50 group-hover:border-green-500/50 transition-all duration-300 transform group-hover:scale-105`}
                    >
                      <div
                        className={`w-full h-full ${getPhoneTheme(
                          screenshot.theme
                        )} rounded-xl overflow-hidden border border-gray-600/30`}
                      >
                        <img
                          src={screenshot.image || "/placeholder.svg"}
                          alt={screenshot.title}
                          width={200}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm border border-green-500/30 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-semibold text-green-400">
                        {screenshot.title}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Column 3 */}
            <div
              className="absolute left-2/4 w-1/4 flex flex-col gap-4 pl-2"
              style={{
                transform: `translateY(-${scrollY * 0.6}px)`,
                animation: "infiniteScrollUp 22s linear infinite",
              }}
            >
              {[...appScreenshots.slice(6), ...appScreenshots.slice(6)].map(
                (screenshot, index) => (
                  <div key={`col3-${index}`} className="relative group">
                    <div
                      className={`w-full ${getPhoneHeight(
                        screenshot.size
                      )} bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-2 shadow-xl border border-gray-700/50 group-hover:border-purple-500/50 transition-all duration-300 transform group-hover:scale-105`}
                    >
                      <div
                        className={`w-full h-full ${getPhoneTheme(
                          screenshot.theme
                        )} rounded-xl overflow-hidden border border-gray-600/30`}
                      >
                        <img
                          src={screenshot.image || "/placeholder.svg"}
                          alt={screenshot.title}
                          width={200}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm border border-purple-500/30 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-semibold text-purple-400">
                        {screenshot.title}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Column 4 */}
            <div
              className="absolute left-3/4 w-1/4 flex flex-col gap-4 pl-2"
              style={{
                transform: `translateY(-${scrollY * 0.8}px)`,
                animation: "infiniteScrollDown 18s linear infinite",
              }}
            >
              {[...appScreenshots.slice(9), ...appScreenshots.slice(9)].map(
                (screenshot, index) => (
                  <div key={`col4-${index}`} className="relative group">
                    <div
                      className={`w-full ${getPhoneHeight(
                        screenshot.size
                      )} bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-2 shadow-xl border border-gray-700/50 group-hover:border-pink-500/50 transition-all duration-300 transform group-hover:scale-105`}
                    >
                      <div
                        className={`w-full h-full ${getPhoneTheme(
                          screenshot.theme
                        )} rounded-xl overflow-hidden border border-gray-600/30`}
                      >
                        <img
                          src={screenshot.image || "/placeholder.svg"}
                          alt={screenshot.title}
                          width={200}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm border border-pink-500/30 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-semibold text-pink-400">
                        {screenshot.title}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
              isVisible.testimonials
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
              Success{" "}
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Stories
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              What our users are saying
            </p>
          </div>

          <div
            className={`max-w-4xl mx-auto transition-all duration-1000 ${
              isVisible.testimonials
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    )
                  )}
                </div>
                <p className="text-lg md:text-xl text-gray-300 mb-6 italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 md:w-15 md:h-15 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center">
                    <img
                      src={
                        testimonials[currentTestimonial].image ||
                        "/placeholder.svg"
                      }
                      alt={testimonials[currentTestimonial].name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-gray-400">
                      Age {testimonials[currentTestimonial].age}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 scale-125 shadow-lg shadow-purple-500/50"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
              isVisible.faq
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              Everything you need to know
            </p>
          </div>

          <div
            className={`max-w-3xl mx-auto space-y-4 transition-all duration-1000 ${
              isVisible.faq
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <span className="font-semibold text-white">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <Minus className="h-5 w-5 text-cyan-400 transform transition-transform duration-200" />
                  ) : (
                    <Plus className="h-5 w-5 text-cyan-400 transform transition-transform duration-200" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-4">
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA Section */}
      <section
        id="download"
        className="py-12 md:py-16 lg:py-24 text-white relative overflow-hidden"
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <div
            className={`transition-all duration-1000 ${
              isVisible.download
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Ready to find your{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                perfect match?
              </span>
            </h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 text-gray-300">
              Join thousands of users who have found love through our app
            </p>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8">
              <button className="group relative bg-gradient-to-r from-cyan-500 to-green-500 text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:shadow-2xl transform hover:scale-105 w-full sm:w-auto overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  <Download className="inline-block mr-2 h-4 w-4 md:h-5 md:w-5 group-hover:animate-bounce" />
                  Click here to download the APK
                </div>
              </button>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 p-3 md:p-4 rounded-xl md:rounded-2xl hover:border-cyan-500/60 transition-all duration-300 transform hover:scale-105">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-700/50 rounded-lg flex items-center justify-center mb-2 border border-green-500/20">
                  <span className="text-cyan-400 text-xs md:text-sm">
                    QR Code
                  </span>
                </div>
                <p className="text-cyan-400 text-xs md:text-sm">
                  Scan to download
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-gray-400">
              <div className="flex items-center space-x-2 hover:text-cyan-400 transition-colors">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                <Zap className="h-5 w-5" />
                <span className="text-sm">Fast & Reliable</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-purple-400 transition-colors">
                <Award className="h-5 w-5" />
                <span className="text-sm">Award Winning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="text-white py-8 md:py-12 relative border-t border-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center mr-3">
                  <Heart className="h-4 w-4 md:h-5 md:w-5 text-black" />
                </div>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                  LoveConnect
                </span>
              </div>
              <p className="text-gray-400 text-sm md:text-base mb-4">
                The ultimate dating app for finding love, fun, and real
                connections through chat, video calls, and interactive games.
              </p>
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Trusted by users worldwide</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-cyan-400">
                Quick Links
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => scrollToSection("features")}
                  className="block text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="block text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  How It Works
                </button>
                <a
                  href="/privacy-policy"
                  className="block text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms-conditions"
                  className="block text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Terms & Conditions
                </a>
                <a
                  href="/terms-of-use"
                  className="block text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Terms Of Use
                </a>
              </div>
            </div>

            {/* Contact & Social */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-green-400">
                Connect
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center hover:text-cyan-400 transition-colors cursor-pointer">
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-cyan-500 mr-2" />
                  <span className="text-gray-400 text-sm md:text-base">
                    support@loveconnect.app
                  </span>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-full hover:bg-cyan-600 hover:border-cyan-500 transition-all duration-300 cursor-pointer transform hover:scale-110">
                  <Facebook className="h-5 w-5" />
                </div>
                <div className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-full hover:bg-green-600 hover:border-green-500 transition-all duration-300 cursor-pointer transform hover:scale-110">
                  <Twitter className="h-5 w-5" />
                </div>
                <div className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-full hover:bg-purple-600 hover:border-purple-500 transition-all duration-300 cursor-pointer transform hover:scale-110">
                  <Instagram className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800/50 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
            <p className="text-gray-400 text-sm md:text-base">
              © 2024 Techizebuilder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes infiniteScrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes infiniteScrollDown {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-400 {
          animation-delay: 400ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};
