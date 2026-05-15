import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Star } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCTS } from '@/data/products';
import { ROUTE_PATHS } from '@/lib/index';
import { IMAGES } from '@/assets/images';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const featuredProducts = PRODUCTS.slice(0, 3);
  const [announcements, setAnnouncements] = useState<{id: number, content: string}[]>([]);
  const [showPoster, setShowPoster] = useState(true);

    useEffect(() => {
      const fetchAnnouncements = async () => {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        setAnnouncements(data || []);
      };
      fetchAnnouncements();
    }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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

  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: '嚴選食材',
      description: '使用法國AOP奶油、日本北海道麵粉等頂級原料，每一口都是品質保證',
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: '每日手作',
      description: '堅持每日新鮮現做，不添加防腐劑，讓您品嚐最純粹的麵包香氣',
    },
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: '預購服務',
      description: '提供便利線上預購，兩天即可到店取貨。團體、大量預購者另請電洽，本店另有外送服務。',
    },
  ];

  return (
    <Layout>
      {showPoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative max-w-md w-full">
            <button
              onClick={() => setShowPoster(false)}
              className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-lg text-lg font-bold z-10"
            >
              ✕
            </button>
            <img
              src="/report-RXZbakery/images/postGemini.png"
              alt="活動海報"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
      
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.BAKERY_HERO_20260508_013154_41}
            alt="RXZ Bakery"
            className="w-full h-full object-cover object-[center_43%] opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/30" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 35, delay: 0.2 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          {/* <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <h1 className="text-7xl md:text-8xl font-bold text-primary" style={{ fontFamily: 'Caveat, cursive' }}>
              R.X.Z
            </h1>
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div> */}

          <p className="text-2xl md:text-3xl text-foreground mb-8 font-medium">
            每一口，都是幸福的味道
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Link to={ROUTE_PATHS.PRODUCTS}>探索麵包</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Link to={ROUTE_PATHS.PREORDER}>立即預購</Link>
            </Button>
          </div>

          {announcements.length > 0 && (
            <div className="mt-6 flex flex-col gap-2">
              {announcements.map((a) => (
                <p key={a.id} className="text-base text-center text-primary font-medium">
                  🎉 {a.content}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      <section className="py-24 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground font-medium">品牌故事</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground" style={{ fontFamily: 'Caveat, cursive' }}>
                手作溫度 ♡ 日式美學
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                R.X.Z 麵包坊秉持著對烘焙的熱愛與堅持，將日式職人精神融入每一個麵包中。我們相信，最好的麵包來自於最純粹的食材與最用心的製作。
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                從清晨的第一縷陽光開始，我們的烘焙師傅就開始揉麵團、發酵、烘烤，只為了讓您品嚐到最新鮮、最美味的麵包。每一個麵包都承載著我們的用心與溫度。
              </p>
            </div>
            <div className="order-1 md:order-2">
            <div className="w-full h-[400px] rounded-3xl shadow-2xl overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/64LJ5cgcnMg"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground font-medium">精緻甜點</span>
              <Star className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'Caveat, cursive' }}>
              ★ 超人氣點心 ★
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              嚴選三款最受歡迎的點心，每一款都是我們的驕傲！
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 35, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Link to={ROUTE_PATHS.PRODUCTS}>查看更多麵包</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'Caveat, cursive' }}>
              為什麼選擇 R.X.Z？
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              三大堅持，只為給您最好的麵包體驗
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-primary/20"
              >
                <div className="flex justify-center mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="bg-gradient-to-r from-primary/80 to-accent/80 rounded-3xl p-12 text-center shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Caveat, cursive' }}>
              立即預購，兩天後取貨 ♡
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              線上預購您喜愛的麵包，兩天後即可到店取貨，新鮮出爐的美味等您來品嚐
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 px-10 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Link to={ROUTE_PATHS.PREORDER}>開始預購</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}