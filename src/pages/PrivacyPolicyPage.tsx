import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';


export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.',
        'We automatically collect certain information about your device when you use our services, including IP address, browser type, and usage data.',
        'We may collect information from third-party services when you choose to connect your account.'
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        'To provide, maintain, and improve our services',
        'To process transactions and send related information',
        'To send you technical notices, updates, and support messages',
        'To respond to your comments, questions, and customer service requests',
        'To communicate with you about products, services, offers, and promotions',
        'To monitor and analyze trends, usage, and activities in connection with our services'
      ]
    },
    {
      title: 'Information Sharing and Disclosure',
      content: [
        'We may share your information with third-party vendors and service providers who perform services on our behalf.',
        'We may share information in response to a request for information if we believe disclosure is required by law.',
        'We may share information with your consent or at your direction.',
        'We do not sell your personal information to third parties.'
      ]
    },
    {
      title: 'Data Security',
      content: [
        'We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.',
        'However, no internet or electronic storage system is 100% secure, and we cannot guarantee absolute security.',
        'We recommend using strong passwords and keeping your account credentials confidential.'
      ]
    },
    {
      title: 'Your Rights and Choices',
      content: [
        'You may update, correct, or delete your account information at any time by logging into your account.',
        'You may opt-out of receiving promotional emails by following the unsubscribe instructions in those emails.',
        'You may request access to or deletion of your personal information by contacting us.',
        'Certain jurisdictions provide additional rights regarding your personal data.'
      ]
    },
    {
      title: 'Cookies and Tracking Technologies',
      content: [
        'We use cookies and similar tracking technologies to collect and track information about your browsing activities.',
        'You can control cookies through your browser settings and other tools.',
        'Some features of our services may not function properly if you disable cookies.'
      ]
    },
    {
      title: 'Children\'s Privacy',
      content: [
        'Our services are not directed to children under 13, and we do not knowingly collect personal information from children.',
        'If we learn we have collected personal information from a child under 13, we will delete that information.',
        'If you believe we might have information from a child under 13, please contact us.'
      ]
    },
    {
      title: 'Changes to This Policy',
      content: [
        'We may update this privacy policy from time to time to reflect changes in our practices or for legal reasons.',
        'We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.',
        'Your continued use of our services after changes constitutes acceptance of the updated policy.'
      ]
    },
    {
      title: 'Contact Us',
      content: [
        'If you have any questions about this Privacy Policy, please contact us at:',
        'Email: privacy@bestdeals.com',
        'Address: Best Deals Privacy Team'
      ]
    }
  ];

  return (
    
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-600 mb-2">Last Updated: October 30, 2025</p>
            <p className="text-lg text-slate-600 mb-8">
              At Best Deals, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our website and services.
            </p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{section.title}</h2>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-slate-600 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p className="text-slate-700">
              By using our services, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </motion.div>
        </div>

        <Footer />
      </div>
  );
}
