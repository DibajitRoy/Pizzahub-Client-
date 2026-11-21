import { EmptyState } from "@/components/states";
import { PageTitle } from "./page-title";
export default function ListPage({ title, description }: { title: string; description: string }) { return <><PageTitle title={title} subtitle={description} /><EmptyState title="No records to show" text="This view will populate when records are available." /></>; }
