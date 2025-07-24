import React, { useState } from "react";
import { ArrowLeft, Trash, Phone, Mail, Heart, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const DeleteAccountRequest = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate phone
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Simulate API loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Delete account request submitted!");
      setEmail("");
      setPhone("");
    }, 2000); // simulate 2s delay
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/80 border-b border-gray-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a
              href="/"
              className="flex items-center space-x-2 text-cyan-400 hover:opacity-80 transition"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </a>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-green-500 bg-clip-text text-transparent">
                HEART2GET
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-black/20 border border-gray-800 rounded-xl p-6 md:p-10 backdrop-blur-md shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
              <Trash className="h-8 w-8 text-black" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-4">
              Request Account Deletion
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Submit your email and phone number to request account deletion.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <div className="flex items-center bg-gray-800/50 rounded px-3 py-2">
                <Mail className="h-4 w-4 text-cyan-400 mr-2" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-500 p-2"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="flex items-center bg-gray-800/50 rounded px-3 py-2">
                <Phone className="h-4 w-4 text-cyan-400 mr-2" />
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-500 p-2"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2 flex items-center justify-center ${
                loading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              } text-white font-medium rounded transition`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </form>

          <div className="text-xs text-gray-500 mt-6 text-center">
            We will contact you before processing the deletion.
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeleteAccountRequest;
