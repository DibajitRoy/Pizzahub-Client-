import { PageTitle } from "@/components/dashboard/page-title";
import { ItemForm } from "@/components/item-form";

export default function AddItemPage() {
  return (
    <>
      <PageTitle title="Add Menu Item" subtitle="New items are reviewed by an admin before going live" />
      <ItemForm />
    </>
  );
}