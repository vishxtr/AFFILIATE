import { motion } from 'framer-motion';
import { Target, Users, Award, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';


export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To connect customers with the best products and deals from trusted retailers, making online shopping easier and more rewarding.'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'We prioritize our customers by curating high-quality products and providing honest, transparent recommendations.'
    },
    {
      icon: Award,
      title: 'Quality Standards',
      description: 'Every product we feature is carefully selected based on quality, value, and customer satisfaction ratings.'
    },
    {
      icon: TrendingUp,
      title: 'Continuous Growth',
      description: 'We constantly evolve our platform to bring you the latest trends and best deals across all categories.'
    }
  ];

  return (
    
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={[{ label: 'About Us' }]} />

          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              About Best Deals
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Your trusted destination for discovering amazing products and unbeatable deals
            </p>
          </motion.div>

          {/* Story Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
              <p>
                Best Deals was founded with a simple mission: to help people discover amazing products 
                without the hassle of endless searching and comparison shopping.
              </p>
              <p>
                We understand that online shopping can be overwhelming with countless options and varying 
                prices. That's why we've created a curated platform that brings together the best products 
                from trusted retailers, all in one place.
              </p>
              <p>
                Our team of experts carefully reviews and selects each product featured on our platform, 
                ensuring that you get access to quality items that offer genuine value. Whether you're 
                looking for electronics, fashion, home goods, or anything in between, we've got you covered.
              </p>
            </div>
          </motion.div>

          {/* Values Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What We Stand For</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <value.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{value.title}</h3>
                      <p className="text-slate-600">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 md:p-12 text-white text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto opacity-90">
              We're constantly growing and improving to serve you better. Thank you for being part of our community.
            </p>
            <motion.a
              href="/"
              className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-slate-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Shopping
            </motion.a>
          </motion.div>
        </div>

        <Footer />
      </div>
  );
}
