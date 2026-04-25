import Link from "next/link";

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeSlug: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { storeSlug } = await params;
  const { order } = await searchParams;
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Order received</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
        Thank you. We saved your order.
      </h1>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
        {order ? (
          <>
            Reference: <span className="font-medium text-zinc-900 dark:text-white">{order}</span>
            <br />
          </>
        ) : null}
        We've also opened WhatsApp so the artist can confirm details, take payment, and arrange delivery.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href={`/s/${storeSlug}`}
          className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
        >
          Browse more prints
        </Link>
      </div>
    </section>
  );
}
