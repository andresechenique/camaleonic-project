import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="skeleton"
			className={cn('bg-gray-700 animate-pulse rounded-m', className)}
			{...props}
		/>
	);
}

export { Skeleton };
