import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';


export default function TermsOfServicePage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using Best Deals, you accept and agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, you should not use our services.',
        'We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.'
      ]
    },
    {
      title: 'Use of Our Services',
      content: [
        'You must be at least 18 years old to use our services.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree to use our services only for lawful purposes and in accordance with these terms.',
        'You may not use our services in any way that could damage, disable, or impair our platform.'
      ]
    },
    {
      title: 'Affiliate Relationships',
      content: [
        'Best Deals participates in various affiliate marketing programs.',
        'We may earn commissions from purchases made through affiliate links on our website.',
        'These affiliate relationships do not influence our product recommendations or reviews.',
        'All opinions and recommendations are our own and based on thorough research.'
      ]
    },
    {
      title: 'Product Information and Pricing',
      content: [
        'We strive to provide accurate product information, but we cannot guarantee its completeness or accuracy.',
        'Prices and availability are subject to change without notice.',
        'We are not responsible for pricing errors or product availability on third-party websites.',
        'All purchases are made directly with the retailer, not with Best Deals.'
      ]
    },
    {
      title: 'Third-Party Links',
      content: [
        'Our website contains links to third-party websites and services.',
        'We are not responsible for the content, privacy policies, or practices of third-party sites.',
        'Your interactions with third-party websites are solely between you and the third party.',
        'We recommend reviewing the terms and privacy policies of any third-party sites you visit.'
      ]
    },
    {
      title: 'Intellectual Property',
      content: [
        'All content on Best Deals, including text, graphics, logos, and images, is our property or licensed to us.',
        'You may not reproduce, distribute, or create derivative works without our express written permission.',
        'Product names, logos, and brands are property of their respective owners.',
        'We respect intellectual property rights and expect users to do the same.'
      ]
    },
    {
      title: 'User Content',
      content: [
        'You may be able to submit reviews, comments, or other content on our platform.',
        'By submitting content, you grant us a non-exclusive, royalty-free license to use, modify, and display that content.',
        'You represent that you own or have the right to submit any content you provide.',
        'We reserve the right to remove any content that violates these terms or is otherwise objectionable.'
      ]
    },
    {
      title: 'Disclaimers and Limitations of Liability',
      content: [
        'Our services are provided "as is" without warranties of any kind, either express or implied.',
        'We do not warrant that our services will be uninterrupted, timely, secure, or error-free.',
        'We are not liable for any indirect, incidental, special, or consequential damages.',
        'Our total liability to you for any claims related to our services shall not exceed the amount you paid us, if any.'
      ]
    },
    {
      title: 'Indemnification',
      content: [
        'You agree to indemnify and hold Best Deals harmless from any claims, losses, or damages arising from your use of our services.',
        'This includes any violation of these terms or infringement of third-party rights.',
        'We reserve the right to assume exclusive defense and control of any matter subject to indemnification.'
      ]
    },
    {
      title: 'Termination',
      content: [
        'We may terminate or suspend your access to our services at any time, with or without cause.',
        'You may discontinue using our services at any time.',
        'Upon termination, your right to use our services will immediately cease.',
        'All provisions that should survive termination will continue to be in effect.'
      ]
    },
    {
      title: 'Governing Law',
      content: [
        'These terms are governed by and construed in accordance with applicable laws.',
        'Any disputes arising from these terms or our services shall be resolved through binding arbitration.',
        'You waive any right to participate in class actions or class arbitrations.'
      ]
    },
    {
      title: 'Contact Information',
      content: [
        'If you have any questions about these Terms of Service, please contact us at:',
        'Email: legal@bestdeals.com',
        'We will respond to inquiries within a reasonable timeframe.'
      ]
    }
  ];

  return (
    
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-slate-600 mb-2">Last Updated: October 30, 2025</p>
            <p className="text-lg text-slate-600 mb-8">
              Please read these Terms of Service carefully before using Best Deals. 
              These terms govern your use of our website and services.
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
            transition={{ duration: 0.5, delay: 1 }}
          >
            <p className="text-slate-700 font-medium">
              By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </motion.div>
        </div>

        <Footer />
      </div>
  );
}
