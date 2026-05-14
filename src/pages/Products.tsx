import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import type { BreadCategory } from '@/lib/index';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 35,
    },
  },
};

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<BreadCategory | '全部'>('全部');

  const filteredProducts =
    selectedCategory === '全部'
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === selectedCategory);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4 font-[Caveat]">
              麵包介紹 ♡
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              每一款麵包都是用心手作，選用最優質的原料，
              <br />
              為您帶來最純粹的美味體驗 ★
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 35, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <button
              onClick={() => setSelectedCategory('全部')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === '全部'
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105'
              }`}
            >
              全部
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2 text-primary">
              <span className="text-2xl">✿</span>
              <span className="text-2xl">♡</span>
              <span className="text-2xl">★</span>
              <span className="text-2xl">♡</span>
              <span className="text-2xl">✿</span>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={staggerItem}>
                  <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-2xl text-muted-foreground">目前沒有此類別的麵包 ♡</p>
            </motion.div>
          )}

          <div className="flex items-center justify-center mt-12">
            <div className="flex items-center gap-2 text-primary">
              <span className="text-2xl">✿</span>
              <span className="text-2xl">♡</span>
              <span className="text-2xl">★</span>
              <span className="text-2xl">♡</span>
              <span className="text-2xl">✿</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
