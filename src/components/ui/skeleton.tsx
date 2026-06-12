import { cn } from "@/lib/utils";

/**
 * Renders a skeleton placeholder div with pulse animation and muted background.
 *
 * @param className - Optional additional CSS classes to merge with the default skeleton classes
 * @param props - Any other div attributes forwarded to the root element
 * @returns A `<div>` element styled as a pulsing skeleton placeholder
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };
