import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/index';
import { ROUTE_PATHS, formatPrice } from '@/lib/index';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={ROUTE_PATHS.PRODUCT_DETAIL.replace(':id', product.id)}>
      <motion.div
        className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-card p-4 transition-all duration-200 hover:border-primary/40"
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        style={{
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-accent/10" />

        <div className="relative z-10">
          <div className="mb-4 overflow-hidden rounded-2xl">
            <motion.img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-foreground">
                {product.name}
              </h3>
              <span className="text-xs font-medium text-primary">
                ♡
              </span>
            </div>

            <p className="line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {product.category}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="text-xs text-primary">查看詳情 →</span>
        </div>
      </motion.div>
    </Link>
  );
}
