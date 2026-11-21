"use client";
import { useParams } from "next/navigation";
import { PageTitle } from "@/components/dashboard/page-title";
import { ItemForm } from "@/components/item-form";
import { ErrorState, InlineLoader } from "@/components/states";
import { useApi } from "@/hooks/use-api";
import type { MenuItem } from "@/lib/types";

export default function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, reload } = useApi<MenuItem>(`/api/vendor/menu/${id}`);
  return (
    <>
      <PageTitle title="Edit Menu Item" subtitle="Edited approved items are sent back for review" />
      {loading ? <InlineLoader /> : error || !data ? <ErrorState message={error || "Item not found"} onRetry={reload} /> : <ItemForm initial={data} />}
    </>
  );
}