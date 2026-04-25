import { redirect } from "next/navigation";
import { DEMO_STORE } from "@/server/demo";

export default function DemoRedirect() {
  redirect(`/s/${DEMO_STORE.store_slug}`);
}
