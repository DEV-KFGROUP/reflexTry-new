"use client";

export default function PrivacyPolicyClient() {

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 sm:p-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-teal to-electric-purple bg-clip-text text-transparent mb-4">
                    Privacy Policy
                </h1>
                <p className="text-gray-400 mb-8">Last Updated: February 2024</p>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <p className="text-lg">Your privacy is critically important to us. This policy outlines how we collect, use, and protect your information.</p>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">1. Information We Collect</h2>
                        <p className="mb-3">We do not collect personal data such as names or emails unless you voluntarily contact us. We may collect non-personal data like browser type and usage statistics to improve our services.</p>
                        <p>When you use our website, we may automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">2. Cookies and Tracking Technologies</h2>
                        <p className="mb-3">We use cookies to enhance your experience, analyze site traffic, and serve personalized ads via Google AdSense. Cookies are small data files stored on your device.</p>
                        <p className="mb-3">We use the following types of cookies:</p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                            <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements and track ad performance</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">3. Google AdSense and Third-Party Advertising</h2>
                        <p className="mb-3">We use Google AdSense to display advertisements on our website. Google AdSense is a program run by Google that allows publishers to display ads on their websites.</p>
                        <p className="mb-3"><strong>Third-Party Vendors:</strong> Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites.</p>
                        <p className="mb-3"><strong>Google's Use of Advertising Cookies:</strong> Google uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.</p>
                        <p className="mb-3"><strong>Opt-Out:</strong> You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-neon-teal hover:underline" target="_blank" rel="noopener noreferrer">Google's Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" className="text-neon-teal hover:underline" target="_blank" rel="noopener noreferrer">www.aboutads.info/choices</a>.</p>
                        <p className="mb-3"><strong>AdSense Publisher ID:</strong> Our Google AdSense publisher ID is ca-pub-3064655546051154.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">4. Third-Party Services</h2>
                        <p className="mb-3">We use third-party services including:</p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
                            <li><strong>Google AdSense:</strong> To display advertisements on our website</li>
                        </ul>
                        <p className="mt-3">These services may collect information sent by your browser, including your IP address, browser type, pages visited, and time spent on pages. This information is used to provide and improve our services.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">5. Data Sharing</h2>
                        <p>We do not sell, trade, or rent your personal information to third parties. However, we may share non-personal, aggregated information with third-party service providers to help us operate our website and conduct our business.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">6. Your Rights</h2>
                        <p className="mb-3">You have the right to:</p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>Access and receive a copy of your personal data</li>
                            <li>Request correction of inaccurate personal data</li>
                            <li>Request deletion of your personal data</li>
                            <li>Opt out of personalized advertising</li>
                            <li>Disable cookies through your browser settings</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">7. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@reflextry.com" className="text-neon-teal hover:underline">support@reflextry.com</a>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}

