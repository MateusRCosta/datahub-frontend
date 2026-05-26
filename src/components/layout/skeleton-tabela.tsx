import { Skeleton } from '../ui/skeleton';

export function SkeletonTabela() {
  const widths = ['90%', '70%', '82%', '55%'];

  return (
    <div className='flex h-full w-full min-h-0 flex-col gap-2'>
      <div className='flex shrink-0 flex-col gap-2 md:flex-row md:self-end'>
        <Skeleton className='h-9 w-full md:w-32' />
        <Skeleton className='h-9 w-full md:w-80' />
      </div>

      <div className='flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border'>
        <div className='grid grid-cols-2 gap-4 border-b p-2'>
          <Skeleton className='h-6 w-6/12' />
          <Skeleton className='justify-self-end' />
        </div>

        <div className='flex flex-1 flex-col gap-3'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className='grid grid-cols-2 gap-4 py-2 px-4 border-b'
            >
              <Skeleton
                className='h-6'
                style={{ width: widths[index % widths.length] }}
              />
              <Skeleton className='h-6 w-2/12 justify-self-end' />
            </div>
          ))}
        </div>

        <div className='flex shrink-0 flex-col gap-3 border-t p-4 md:flex-row md:items-center md:justify-between'>
          <Skeleton className='h-5 w-28' />
          <div className='flex items-center gap-2'>
            <Skeleton className='h-7 w-7' />
            <Skeleton className='h-5 w-12' />
            <Skeleton className='h-7 w-7' />
          </div>
        </div>
      </div>
    </div>
  );
}
