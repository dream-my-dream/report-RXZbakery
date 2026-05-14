import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { NutritionTable } from '@/components/NutritionTable';
import { PRODUCTS } from '@/data/products';
import { ROUTE_PATHS, formatPrice } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">找不到商品</h1>
            <p className="text-muted-foreground mb-8">抱歉，您要找的麵包不存在</p>
            <Link to={ROUTE_PATHS.PRODUCTS}>
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回商品列表
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const getCountryFlag = (origin: string): string => {
    const flagMap: Record<string, string> = {
      '日本': '🇯🇵',
      '日本北海道': '🇯🇵',
      '日本京都': '🇯🇵',
      '日本北海道十勝': '🇯🇵',
      '法國': '🇫🇷',
      '法國諾曼第': '🇫🇷',
      '法國蓋朗德': '🇫🇷',
      '台灣': '🇹🇼',
      '台灣瑞穗': '🇹🇼',
      '紐西蘭': '🇳🇿',
      '比利時': '🇧🇪',
    };
    return flagMap[origin] || '🌍';
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to={ROUTE_PATHS.PRODUCTS}
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回商品列表
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">
                      {product.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <span className="text-2xl">✿</span>
                <span>每日新鮮手作</span>
                <span className="text-2xl">♡</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="font-display text-5xl font-semibold text-foreground mb-3" style={{ fontFamily: 'Caveat, cursive' }}>
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {product.category}
                </Badge>
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Card className="bg-secondary/30 border-secondary">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌾</span>
                  原料產地
                </h3>
                <div className="space-y-3">
                  {product.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                    >
                      <span className="text-foreground font-medium">
                        {ingredient.name}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-2">
                        <span className="text-2xl">{getCountryFlag(ingredient.origin)}</span>
                        <span>{ingredient.origin}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="intro" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted">
                <TabsTrigger value="intro">介紹</TabsTrigger>
                <TabsTrigger value="origin">原料產地</TabsTrigger>
                <TabsTrigger value="nutrition">營養標示</TabsTrigger>
              </TabsList>
              <TabsContent value="intro" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-foreground leading-relaxed">
                      {product.description}
                    </p>
                    <div className="mt-6 pt-6 border-t border-border">
                      <h4 className="font-semibold text-foreground mb-3">商品特色</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">★</span>
                          <span>每日新鮮手作，當天現烤</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">★</span>
                          <span>嚴選優質原料，產地直送</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">★</span>
                          <span>無添加人工香料與防腐劑</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="origin" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {product.ingredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                        >
                          <span className="text-foreground font-medium text-lg">
                            {ingredient.name}
                          </span>
                          <span className="text-muted-foreground flex items-center gap-3">
                            <span className="text-3xl">{getCountryFlag(ingredient.origin)}</span>
                            <span className="text-lg">{ingredient.origin}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="nutrition" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <NutritionTable
                      nutrition={product.nutrition}
                      allergens={product.allergens}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to={ROUTE_PATHS.PREORDER}>
                <Button
                  size="lg"
                  className="w-full text-lg py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  立即預購
                </Button>
              </Link>
              <p className="text-center text-sm text-muted-foreground mt-3">
                ♡ 預購後兩天可至門市取貨 ♡
              </p>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 text-muted-foreground">
            <span className="text-2xl">✿</span>
            <span>每一口，都是幸福的味道</span>
            <span className="text-2xl">★</span>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
