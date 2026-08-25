import { EmptyState } from "@/components/shared/EmptyState";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StubPageProps {
  title: string;
  description: string;
  icon: string;
}

export function StubPage({ title, description, icon }: StubPageProps) {
  const IconComp = ((Icons as unknown) as Record<string, LucideIcon>)[icon] || Icons.Inbox;
  return <EmptyState icon={IconComp} title={title} description={description} />;
}
