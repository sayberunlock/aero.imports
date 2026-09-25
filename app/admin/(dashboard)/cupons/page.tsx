import { db } from "@/lib/db";
import { CouponManager } from "@/components/admin/CouponManager";

export const dynamic = "force-dynamic";

export default async function AdminCuponsPage() {
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Cupons</h1>
      <p className="mt-1 text-sm text-steel">Crie e gerencie cupons de desconto para o checkout.</p>

      <div className="mt-8">
        <CouponManager
          coupons={coupons.map((c) => ({
            id: c.id,
            code: c.code,
            percentOff: c.percentOff,
            amountOffCents: c.amountOffCents,
            maxUses: c.maxUses,
            usedCount: c.usedCount,
            active: c.active,
            expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
          }))}
        />
      </div>
    </div>
  );
}
