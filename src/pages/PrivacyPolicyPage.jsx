"use client"

import { ArrowLeft, Heart, Shield, Lock, Eye, Database, Phone } from "lucide-react"


export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Header */}
            <header className="bg-black/80 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            <ArrowLeft className="h-5 w-5 text-cyan-400" />
                            <span className="text-cyan-400 font-medium">Back to Home</span>
                        </a>

                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center">
                                <Heart className="h-4 w-4 md:h-5 md:w-5 text-black" />
                            </div>
                            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                                LoveConnect
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-8 md:mb-12">
                        <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-8 w-8 text-black" />
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
                        <p className="text-lg text-gray-300">Your privacy is important to us. Learn how we protect your data.</p>
                        <p className="text-sm text-gray-400 mt-2">Last updated: December 2024</p>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-8">
                        {/* Information We Collect */}
                        <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
                            <div className="flex items-center mb-4">
                                <Database className="h-6 w-6 text-cyan-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
                            </div>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    We collect information you provide directly to us, such as when you create an account, update your
                                    profile, or communicate with other users. This may include:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Personal information (name, email address, phone number)</li>
                                    <li>Profile information (photos, bio, preferences)</li>
                                    <li>Communication data (messages, video calls)</li>
                                    <li>Usage information (app interactions, game results)</li>
                                    <li>Device information (device type, operating system)</li>
                                    <li>Location data (with your permission)</li>
                                </ul>
                            </div>
                        </section>

                        {/* How We Use Your Information */}
                        <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
                            <div className="flex items-center mb-4">
                                <Eye className="h-6 w-6 text-green-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
                            </div>
                            <div className="space-y-4 text-gray-300">
                                <p>We use the information we collect to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Provide, maintain, and improve our services</li>
                                    <li>Match you with compatible users based on preferences</li>
                                    <li>Facilitate communication between users</li>
                                    <li>Personalize your experience and recommendations</li>
                                    <li>Ensure safety and security of our platform</li>
                                    <li>Send you updates and promotional materials (with consent)</li>
                                    <li>Analyze usage patterns to improve our algorithms</li>
                                </ul>
                            </div>
                        </section>

                        {/* Information Sharing */}
                        <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
                            <div className="flex items-center mb-4">
                                <Lock className="h-6 w-6 text-purple-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">Information Sharing</h2>
                            </div>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    We do not sell, trade, or otherwise transfer your personal information to third parties without your
                                    consent, except in the following circumstances:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>With other users as part of the matching and communication features</li>
                                    <li>With service providers who assist us in operating our platform</li>
                                    <li>When required by law or to protect our rights and safety</li>
                                    <li>In connection with a business transfer or acquisition</li>
                                    <li>With your explicit consent for specific purposes</li>
                                </ul>
                            </div>
                        </section>

                        {/* Data Security */}
                        <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
                            <div className="flex items-center mb-4">
                                <Shield className="h-6 w-6 text-cyan-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">Data Security</h2>
                            </div>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    We implement appropriate security measures to protect your personal information against unauthorized
                                    access, alteration, disclosure, or destruction, including:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>End-to-end encryption for video calls and messages</li>
                                    <li>Secure data storage with industry-standard encryption</li>
                                    <li>Regular security audits and updates</li>
                                    <li>Access controls and authentication measures</li>
                                    <li>Monitoring for suspicious activities</li>
                                </ul>
                            </div>
                        </section>

                        {/* Your Rights */}
                        <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
                            <div className="flex items-center mb-4">
                                <Eye className="h-6 w-6 text-green-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">Your Rights</h2>
                            </div>
                            <div className="space-y-4 text-gray-300">
                                <p>You have the right to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Access and review your personal information</li>
                                    <li>Update or correct your information</li>
                                    <li>Delete your account and associated data</li>
                                    <li>Opt-out of promotional communications</li>
                                    <li>Request data portability</li>
                                    <li>Withdraw consent for data processing</li>
                                </ul>
                            </div>
                        </section>

                        {/* Contact Us */}
                        <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
                            <div className="flex items-center mb-4">
                                <Phone className="h-6 w-6 text-purple-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">Contact Us</h2>
                            </div>
                            <div className="space-y-4 text-gray-300">
                                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                                    <p>
                                        <strong>Email:</strong> privacy@loveconnect.app
                                    </p>
                                    <p>
                                        <strong>Address:</strong> 123 Dating Street, Love City, LC 12345
                                    </p>
                                    <p>
                                        <strong>Phone:</strong> +1 (555) 123-4567
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Back to Home Button */}
                    <div className="text-center mt-12">
                        <a
                            href="/"
                            className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-green-500 text-black px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Home
                        </a>
                    </div>
                </div>
            </main>
        </div>
    )
}
