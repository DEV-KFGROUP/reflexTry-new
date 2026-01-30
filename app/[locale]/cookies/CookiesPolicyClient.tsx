"use client";

import { useTranslations } from "next-intl";

export default function CookiesPolicyClient() {
    const t = useTranslations('Legal.Cookies');

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 sm:p-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-teal to-electric-purple bg-clip-text text-transparent mb-4">
                    {t('title')}
                </h1>
                <p className="text-gray-400 mb-8">{t('lastUpdated')}</p>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <p className="text-lg">{t('intro')}</p>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">What are Cookies?</h2>
                        <p className="mb-3">Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.</p>
                        <p>Cookies allow a website to recognize your device and store some information about your preferences or past actions.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">Types of Cookies We Use</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">1. Essential Cookies</h3>
                                <p>These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">2. Analytics Cookies</h3>
                                <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. We use Google Analytics for this purpose.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">3. Advertising Cookies</h3>
                                <p className="mb-3">These cookies are used to deliver advertisements that are relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.</p>
                                <p className="mb-3"><strong>Google AdSense Cookies:</strong> We use Google AdSense to display ads on our website. Google AdSense uses cookies to:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Serve ads based on your prior visits to our website or other websites</li>
                                    <li>Measure the effectiveness of ads</li>
                                    <li>Prevent showing the same ad multiple times</li>
                                    <li>Provide personalized advertising</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">Third-Party Cookies</h2>
                        <p className="mb-3">In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website and deliver advertisements on and through the website.</p>
                        <p className="mb-3"><strong>Google AdSense:</strong> Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet.</p>
                        <p className="mb-3"><strong>Google Analytics:</strong> We use Google Analytics to analyze the use of our website. Google Analytics gathers information about website use by means of cookies.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">Managing Cookies</h2>
                        <p className="mb-3">You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
                        <p className="mb-3"><strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience on our website.</p>
                        <p className="mb-3"><strong>Opt-Out of Personalized Advertising:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>Visit <a href="https://www.google.com/settings/ads" className="text-neon-teal hover:underline" target="_blank" rel="noopener noreferrer">Google's Ads Settings</a> to opt out of Google's use of cookies for personalized advertising</li>
                            <li>Visit <a href="https://www.aboutads.info/choices/" className="text-neon-teal hover:underline" target="_blank" rel="noopener noreferrer">www.aboutads.info/choices</a> to opt out of a third-party vendor's use of cookies for personalized advertising</li>
                            <li>Use the <a href="https://tools.google.com/dlpage/gaoptout" className="text-neon-teal hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a> to prevent Google Analytics from collecting information about your visits</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">Cookie Consent</h2>
                        <p>By continuing to use our website, you consent to our use of cookies as described in this policy. If you do not agree to our use of cookies, you should set your browser settings accordingly or not use our website.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">Contact Us</h2>
                        <p>If you have any questions about our use of cookies, please contact us at <a href="mailto:support@reflextry.com" className="text-neon-teal hover:underline">support@reflextry.com</a>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}






