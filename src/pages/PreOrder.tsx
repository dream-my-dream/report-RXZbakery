import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingCart, User, Calendar, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { PRODUCTS } from '@/data/products';
import { formatPrice, calculateTotal, getMinPickupDate, formatDate, type OrderItem } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const orderSchema = z.object({
  customerName: z.string().min(2, '姓名至少需要2個字'),
  customerPhone: z.string().regex(/^09\d{8}$/, '請輸入有效的手機號碼'),
  customerEmail: z.string().email('請輸入有效的電子郵件'),
  pickupDate: z.string().min(1, '請選擇取貨日期'),
  pickupTime: z.enum(['上午11-13點', '下午1-4點', '下午4-7點'], {
    errorMap: () => ({ message: '請選擇取貨時段' }),
  }),
  specialNotes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

const steps = [
  { number: 1, title: '選擇商品', icon: ShoppingCart },
  { number: 2, title: '顧客資訊', icon: User },
  { number: 3, title: '取貨資訊', icon: Calendar },
  { number: 4, title: '確認訂單', icon: CheckCircle2 },
];

const timeSlots = ['上午11-13點', '下午1-4點', '下午4-7點'];

export default function PreOrder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderItems, setOrderItems] = useState<Record<string, number>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<OrderFormData | null>(null);

  const minPickupDate = getMinPickupDate();
  const minDateString = minPickupDate.toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      pickupDate: minDateString,
      pickupTime: '上午11-13點',
    },
  });

  const selectedPickupTime = watch('pickupTime');
  const selectedPickupDate = watch('pickupDate');

  const updateQuantity = (productId: string, delta: number) => {
    setOrderItems((prev) => {
      const current = prev[productId] || 0;
      const newQuantity = Math.max(0, current + delta);
      if (newQuantity === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQuantity };
    });
  };

  const getOrderItemsList = (): OrderItem[] => {
    return Object.entries(orderItems).map(([productId, quantity]) => {
      const product = PRODUCTS.find((p) => p.id === productId);
      return {
        productId,
        quantity,
        price: product?.price || 0,
      };
    });
  };

  const totalAmount = calculateTotal(getOrderItemsList());
  const hasItems = Object.keys(orderItems).length > 0;

  const onSubmit = async (data: OrderFormData) => {
    try {
      const { supabase } = await import('@/lib/supabase');

      const itemsWithName = getOrderItemsList().map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        return {
          productId: item.productId,
          productName: product?.name || '未知商品',
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        };
      });

      const newOrder = {
        order_id: `B-${Date.now()}`,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail,
        pickup_date: data.pickupDate,
        pickup_time: data.pickupTime,
        special_notes: data.specialNotes || '',
        status: 'unconfirmed',
        items: itemsWithName,
        total_amount: calculateTotal(getOrderItemsList()),
      };

      const { error } = await supabase.from('bakery-orders').insert([newOrder]);

      if (error) {
        console.error('Supabase 存檔失敗：', error);
      } else {
        console.log('✅ 訂單已存到 Supabase！');
      }
    } catch (error) {
      console.error('存檔過程出錯：', error);
    }

    setSubmittedOrder(data);
    setShowSuccessModal(true);
  };

  const canProceedToStep2 = hasItems;
  const canProceedToStep3 = true;
  const canProceedToStep4 = true;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-primary mb-4" style={{ fontFamily: 'Caveat, cursive' }}>
              預購專區 ♡
            </h1>
            <p className="text-muted-foreground text-lg">兩天後可店取，新鮮出爐等你來 ★</p>
          </motion.div>

          <div className="mb-12">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-border -z-10" />
              {steps.map((step, index) => {
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                          : isCompleted
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-primary' : isCompleted ? 'text-accent-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary">選擇您喜愛的麵包</CardTitle>
                    <CardDescription>點選 + 或 - 調整數量</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {PRODUCTS.map((product) => {
                        const quantity = orderItems[product.id] || 0;
                        return (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-xl"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                              <p className="text-primary font-bold mt-1">{formatPrice(product.price)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(product.id, -1)}
                                disabled={quantity === 0}
                                className="rounded-full w-10 h-10"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(product.id, 1)}
                                className="rounded-full w-10 h-10 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            {quantity > 0 && (
                              <div className="text-right min-w-[100px]">
                                <p className="text-sm text-muted-foreground">小計</p>
                                <p className="font-bold text-primary">{formatPrice(product.price * quantity)}</p>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span>總計</span>
                        <span className="text-primary">{formatPrice(totalAmount)}</span>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={() => setCurrentStep(2)}
                        disabled={!canProceedToStep2}
                        size="lg"
                        className="rounded-full px-8"
                      >
                        下一步
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary">顧客資訊</CardTitle>
                    <CardDescription>請填寫您的聯絡資訊</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="customerName" className="text-base">
                          姓名 *
                        </Label>
                        <Input
                          id="customerName"
                          {...register('customerName')}
                          placeholder="請輸入您的姓名"
                          className="mt-2 rounded-xl"
                        />
                        {errors.customerName && (
                          <p className="text-destructive text-sm mt-1">{errors.customerName.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="customerPhone" className="text-base">
                          電話 *
                        </Label>
                        <Input
                          id="customerPhone"
                          {...register('customerPhone')}
                          placeholder="0912345678"
                          className="mt-2 rounded-xl"
                        />
                        {errors.customerPhone && (
                          <p className="text-destructive text-sm mt-1">{errors.customerPhone.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="customerEmail" className="text-base">
                          電子郵件 *
                        </Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          {...register('customerEmail')}
                          placeholder="example@email.com"
                          className="mt-2 rounded-xl"
                        />
                        {errors.customerEmail && (
                          <p className="text-destructive text-sm mt-1">{errors.customerEmail.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(1)} size="lg" className="rounded-full px-8">
                        上一步
                      </Button>
                      <Button
                        onClick={() => canProceedToStep3 && setCurrentStep(3)}
                        disabled={!canProceedToStep3}
                        size="lg"
                        className="rounded-full px-8"
                      >
                        下一步
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary">取貨資訊</CardTitle>
                    <CardDescription>請選擇取貨日期與時段</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="pickupDate" className="text-base">
                          取貨日期 *
                        </Label>
                        <div className="mt-2 p-4 bg-accent/30 rounded-xl border border-accent">
                          <p className="text-sm text-muted-foreground mb-2">
                            ⏰ 預購需要兩天準備時間，最早可取貨日期：
                          </p>
                          <p className="font-semibold text-primary text-lg">{formatDate(minPickupDate)}</p>
                        </div>
                        <Input
                          id="pickupDate"
                          type="date"
                          {...register('pickupDate')}
                          min={minDateString}
                          className="mt-4 rounded-xl"
                        />
                        {errors.pickupDate && (
                          <p className="text-destructive text-sm mt-1">{errors.pickupDate.message}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-base">取貨時段 *</Label>
                        <RadioGroup
                          value={selectedPickupTime}
                          onValueChange={(value) => setValue('pickupTime', value as any)}
                          className="mt-3 space-y-3"
                        >
                          {timeSlots.map((slot) => (
                            <div
                              key={slot}
                              className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:border-primary/40 transition-all cursor-pointer"
                            >
                              <RadioGroupItem value={slot} id={slot} />
                              <Label htmlFor={slot} className="flex-1 cursor-pointer flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>{slot}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {errors.pickupTime && (
                          <p className="text-destructive text-sm mt-1">{errors.pickupTime.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="specialNotes" className="text-base">
                          特殊備註
                        </Label>
                        <Textarea
                          id="specialNotes"
                          {...register('specialNotes')}
                          placeholder="如有特殊需求請在此註明"
                          className="mt-2 rounded-xl min-h-[100px]"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(2)} size="lg" className="rounded-full px-8">
                        上一步
                      </Button>
                      <Button
                        onClick={() => canProceedToStep4 && setCurrentStep(4)}
                        disabled={!canProceedToStep4}
                        size="lg"
                        className="rounded-full px-8"
                      >
                        下一步
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary">確認訂單</CardTitle>
                    <CardDescription>請確認您的訂單資訊</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3">訂購商品</h3>
                        <div className="space-y-2">
                          {getOrderItemsList().map((item) => {
                            const product = PRODUCTS.find((p) => p.id === item.productId);
                            if (!product) return null;
                            return (
                              <div
                                key={item.productId}
                                className="flex justify-between items-center p-3 rounded-xl bg-muted/50"
                              >
                                <div className="flex items-center gap-3">
                                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                                  <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">x {item.quantity}</p>
                                  </div>
                                </div>
                                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                          <span className="text-lg font-semibold">總計</span>
                          <span className="text-2xl font-bold text-primary">{formatPrice(totalAmount)}</span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-secondary/30 border border-secondary">
                          <h3 className="font-semibold mb-2">顧客資訊</h3>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-muted-foreground">姓名：</span>
                              {watch('customerName')}
                            </p>
                            <p>
                              <span className="text-muted-foreground">電話：</span>
                              {watch('customerPhone')}
                            </p>
                            <p>
                              <span className="text-muted-foreground">信箱：</span>
                              {watch('customerEmail')}
                            </p>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-accent/30 border border-accent">
                          <h3 className="font-semibold mb-2">取貨資訊</h3>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-muted-foreground">日期：</span>
                              {selectedPickupDate && formatDate(new Date(selectedPickupDate))}
                            </p>
                            <p>
                              <span className="text-muted-foreground">時段：</span>
                              {selectedPickupTime}
                            </p>
                            {watch('specialNotes') && (
                              <p>
                                <span className="text-muted-foreground">備註：</span>
                                {watch('specialNotes')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {Object.keys(errors).length > 0 && (
                      <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in fade-in slide-in-from-top-1">
                        <p className="font-bold mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                          資料驗證未通過，請檢查以下欄位：
                        </p>
                        <ul className="grid grid-cols-1 gap-1 ml-3.5">
                          {errors.customerName && <li>• 姓名：{errors.customerName.message}</li>}
                          {errors.customerPhone && <li>• 電話：{errors.customerPhone.message}</li>}
                          {errors.customerEmail && <li>• Email：{errors.customerEmail.message}</li>}
                          {errors.pickupDate && <li>• 取貨日期：請選擇日期</li>}
                          {errors.pickupTime && <li>• 取貨時間：請選擇時間</li>}
                        </ul>
                      </div>
                    )}
                    <div className="mt-6 flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(3)} size="lg" className="rounded-full px-8">
                        上一步
                      </Button>
                      <Button onClick={handleSubmit(onSubmit)} size="lg" className="rounded-full px-8">
                        確認送出
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-4"
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
            </motion.div>
            <DialogTitle className="text-center text-2xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                預購成功！ ♡
              </motion.div>
            </DialogTitle>
            <DialogDescription className="text-center">
              您的訂單已成功送出！訂單明細將寄至您留下的信箱。
            </DialogDescription>
          </DialogHeader>

          <div className="text-center text-sm text-muted-foreground"> 
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 mt-4"
            >
              <div className="flex items-center justify-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">感謝您的訂購</span>
                <Sparkles className="w-5 h-5" />
              </div>
              {submittedOrder && (
                <div className="text-left space-y-2 p-4 rounded-xl bg-muted/50">
                  <p className="text-sm">
                    <span className="font-medium">取貨日期：</span>
                    {formatDate(new Date(submittedOrder.pickupDate))}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">取貨時段：</span>
                    {submittedOrder.pickupTime}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">訂單金額：</span>
                    <span className="text-primary font-bold">{formatPrice(totalAmount)}</span>
                  </p>
                </div>
              )}

              <p className="text-sm text-muted-foreground">我們會盡快與您聯繫確認訂單</p>
              <p className="text-sm text-muted-foreground">期待您的光臨 ★</p>
            </motion.div>
          </div>
          <div className="mt-4">
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                setCurrentStep(1);
                setOrderItems({});
              }}
              className="w-full rounded-full"
            >
              繼續預購
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
