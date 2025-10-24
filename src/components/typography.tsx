import type { ReactElement, ReactPortal } from "react";
import { cn } from "@/lib/utils";

type ReactText = string | number;
type ReactChild = ReactElement | ReactText;

interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = ReactNodeArray;
type ReactNode =
	| ReactChild
	| ReactFragment
	| ReactPortal
	| boolean
	| null
	| undefined;

type Props = {
	className?: string;
	children: ReactNode;
};

export function TypographyH1({ children, className }: Props) {
	return (
		<h1
			className={cn(
				"scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
				className,
			)}
		>
			{children}
		</h1>
	);
}

export function TypographyH2({ children, className }: Props) {
	return (
		<h2
			className={cn(
				"scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
				className,
			)}
		>
			{children}
		</h2>
	);
}

export function TypographyH3({ children, className }: Props) {
	return (
		<h3
			className={cn(
				"scroll-m-20 text-2xl font-semibold tracking-tight",
				className,
			)}
		>
			{children}
		</h3>
	);
}

export function TypographyP({ children, className }: Props) {
	return (
		<p className={cn("leading-7 not-first:mt-6", className)}>{children}</p>
	);
}

export function TypographySmall({ children, className }: Props) {
	return (
		<small className={cn("text-sm leading-none font-medium", className)}>
			{children}
		</small>
	);
}

export function TypographyMuted({ children, className }: Props) {
	return (
		<p className={cn("text-muted-foreground text-sm", className)}>{children}</p>
	);
}
