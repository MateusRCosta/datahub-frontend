interface MainProps {
  children: React.ReactNode;
}
export function Main({ children }: MainProps) {
  return (
    <main className='flex-1 min-h-0 w-full overflow-hidden flex flex-col gap-2'>
      {children}
    </main>
  );
}
