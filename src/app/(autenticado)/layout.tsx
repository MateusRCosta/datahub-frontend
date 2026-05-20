import { LayoutMain } from '@/components/layout/layout-main';

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <LayoutMain>{children}</LayoutMain>;
}
