import { ArrowLeft, Heart, FileText, Users, Shield, AlertTriangle, Scale, Phone } from "lucide-react"


export default function TermsConditionsPage() {
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
                            <FileText className="h-8 w-8 text-black" />
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
                        <p className="text-lg text-gray-300">Please read these terms carefully before using our service.</p>
                        <p className="text-sm text-gray-400 mt-2">Last updated: December 2024</p>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-8">
                        {/* Acceptance of Terms */}
                        <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
                            <div className="flex items-center mb-4">
                                <FileText className="h-6 w-6 text-cyan-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">Acceptance of Terms</h2>
                            </div>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    By accessing and using LoveConnect ("the Service"), you accept and agree to be bound by the terms and
                                    provisions of this agreement. If you do not agree to abide by the above, please do not use this
                                    service.
                                </p>
                                <p>
                                    These Terms of Service constitute a legally binding agreement between you and LoveConnect regarding
                                    your use of the Service.
                                </p>
                            </div>
                        </section>

                        {/* User Conduct */}
                        <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
                            <div className="flex items-center mb-4">
                                <Users className="h-6 w-6 text-green-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">User Conduct</h2>
                            </div>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    You agree to use the service in a respectful manner and not to engage in any activity that could harm
                                    other users or the platform. Prohibited activities include:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Harassment, bullying, or threatening other users</li>
                                    <li>Sending spam or unsolicited promotional content</li>
                                    <li>Sharing inappropriate, offensive, or explicit content</li>
                                    <li>Impersonating another person or creating fake profiles</li>
                                    <li>Attempting to hack or compromise the platform's security</li>
                                    <li>Using the service for commercial purposes without permission</li>
                                    <li>Violating any applicable laws or regulations</li>
                                </ul>
                            </div>
                        </section>

                        {/* Account Responsibility */}
                        <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
                            <div className="flex items-center mb-4">
                                <Shield className="h-6 w-6 text-purple-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">Account Responsibility</h2>
                            </div>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    You are responsible for maintaining the confidentiality of your account and password and for
                                    restricting access to your device. You agree to accept responsibility for all activities that occur
                                    under your account.
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Provide accurate and truthful information in your profile</li>
                                    <li>Keep your login credentials secure and confidential</li>
                                    <li>Notify us immediately of any unauthorized use of your account</li>
                                    <li>Use only one account per person</li>
                                    <li>Be at least 18 years old to use the service</li>
                                </ul>
                            </div>
                        </section>

                        {/* Service Availability */}
                        <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
                            <div className="flex items-center mb-4">
                                <AlertTriangle className="h-6 w-6 text-yellow-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">Service Availability</h2>
                            </div>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    We strive to keep the service available at all times, but we cannot guarantee uninterrupted access. We
                                    reserve the right to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Modify or discontinue the service at any time</li>
                                    <li>Perform maintenance that may temporarily affect availability</li>
                                    <li>Suspend or terminate accounts that violate these terms</li>
                                    <li>Update features and functionality as needed</li>
                                    <li>Change pricing or subscription plans with notice</li>
                                </ul>
                            </div>
                        </section>

                        {/* Privacy and Data */}
                        <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
                            <div className="flex items-center mb-4">
                                <Shield className="h-6 w-6 text-cyan-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">Privacy and Data</h2>
                            </div>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use,
                                    and protect your information.
                                </p>
                                <p>
                                    By using the service, you consent to the collection and use of your information as described in our
                                    Privacy Policy.
                                </p>
                                <a
                                    href="/privacy-policy"
                                    className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                    Read our Privacy Policy →
                                </a>
                            </div>
                        </section>

                        {/* Limitation of Liability */}
                        <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
                            <div className="flex items-center mb-4">
                                <Scale className="h-6 w-6 text-purple-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">Limitation of Liability</h2>
                            </div>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    LoveConnect shall not be liable for any indirect, incidental, special, consequential, or punitive
                                    damages resulting from your use of the service, including but not limited to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Loss of data or information</li>
                                    <li>Loss of profits or business opportunities</li>
                                    <li>Personal injury or emotional distress</li>
                                    <li>Interactions with other users</li>
                                    <li>Service interruptions or technical issues</li>
                                </ul>
                                <p>
                                    Our total liability to you for any claims arising from your use of the service shall not exceed the
                                    amount you paid for the service in the 12 months preceding the claim.
                                </p>
                            </div>
                        </section>

                        {/* Termination */}
                        <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
                            <div className="flex items-center mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">Termination</h2>
                            </div>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    Either party may terminate this agreement at any time. You may delete your account through the app
                                    settings. We may suspend or terminate your account if you violate these terms.
                                </p>
                                <p>
                                    Upon termination, your right to use the service will cease immediately, and we may delete your account
                                    and associated data in accordance with our Privacy Policy.
                                </p>
                            </div>
                        </section>

                        {/* Contact Information */}
                        <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
                            <div className="flex items-center mb-4">
                                <Phone className="h-6 w-6 text-green-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                            </div>
                            <div className="space-y-4 text-gray-300">
                                <p>For questions regarding these terms or any other legal matters, please contact us:</p>
                                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                                    <p>
                                        <strong>Email:</strong> legal@loveconnect.app
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
