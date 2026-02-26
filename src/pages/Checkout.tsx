import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { FormField } from "@/components/ui/FormField";
import { checkoutSchema, CheckoutInput } from "@/lib/validators";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE } from "@/constants";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<CheckoutInput>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const subtotal = totalPrice();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  const updateField = (field: keyof CheckoutInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <SEO title="Checkout" />
        <h1 className="text-2xl font-display font-bold mb-4">No items to checkout</h1>
        <Link to="/shop" className="text-sm font-body text-primary hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setErrors({});
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    setPlacing(true);
    setTimeout(() => {
      clearCart();
      toast.success("Order placed successfully! 🎉");
      setPlacing(false);
    }, 2000);
  };

  return (
    <div className="container py-8 md:py-12 max-w-4xl">
      <SEO title="Checkout" description="Complete your Al-ucaaz purchase securely." />
      <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

      {!isAuthenticated && (
        <div className="bg-muted rounded-sm p-4 mb-8 flex items-center justify-between">
          <p className="text-sm font-body text-muted-foreground">Already have an account?</p>
          <Link to="/auth" className="text-sm font-body font-medium text-primary hover:underline">Sign In</Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Form */}
        <div className="lg:col-span-3 space-y-8">
          <div>
            <h2 className="font-body font-semibold text-sm tracking-wider uppercase mb-4">Contact Information</h2>
            <FormField
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={updateField("email")}
              error={errors.email}
              autoComplete="email"
            />
          </div>

          <div>
            <h2 className="font-body font-semibold text-sm tracking-wider uppercase mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-3">
              <FormField placeholder="First name" value={form.firstName} onChange={updateField("firstName")} error={errors.firstName} autoComplete="given-name" />
              <FormField placeholder="Last name" value={form.lastName} onChange={updateField("lastName")} error={errors.lastName} autoComplete="family-name" />
              <div className="col-span-2">
                <FormField placeholder="Address" value={form.address} onChange={updateField("address")} error={errors.address} autoComplete="street-address" />
              </div>
              <FormField placeholder="City" value={form.city} onChange={updateField("city")} error={errors.city} autoComplete="address-level2" />
              <FormField placeholder="Postal code" value={form.postalCode} onChange={updateField("postalCode")} error={errors.postalCode} autoComplete="postal-code" />
              <div className="col-span-2">
                <FormField placeholder="Country" value={form.country} onChange={updateField("country")} error={errors.country} autoComplete="country-name" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-body font-semibold text-sm tracking-wider uppercase mb-4">Payment</h2>
            <div className="border border-border rounded-sm p-6 text-center">
              <p className="text-sm font-body text-muted-foreground">
                Payment gateway integration ready (Stripe, PayPal, JazzCash, EasyPaisa)
              </p>
              <p className="text-xs font-body text-muted-foreground mt-2">
                Demo mode — click "Place Order" to simulate
              </p>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-muted/50 rounded-sm p-6 sticky top-28">
            <h2 className="font-body font-semibold text-sm tracking-wider uppercase mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.variant.id} className="flex gap-3">
                  <div className="w-14 h-18 flex-shrink-0 overflow-hidden rounded-sm bg-muted relative">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-body font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 flex justify-between items-start">
                    <div>
                      <p className="text-xs font-body font-medium">{item.product.name}</p>
                      <p className="text-[10px] text-muted-foreground font-body">
                        {item.variant.size} {item.variant.color}
                      </p>
                    </div>
                    <p className="text-xs font-body font-medium">{formatPrice(item.variant.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm font-body">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(tax)}</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold">
                <span>Total</span><span className="text-lg">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full bg-foreground text-background py-3.5 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity mt-6 disabled:opacity-50"
            >
              {placing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
