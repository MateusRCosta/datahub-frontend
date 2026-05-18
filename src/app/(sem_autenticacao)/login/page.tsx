import { Main } from '@/components/layout/main';
import Login from '@/features/auth/componentes/login';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hotdata | Login',
  description: 'Hotdata login',
};

export default function page() {
  return (
    <Main>
      <Login />
    </Main>
  );
}
