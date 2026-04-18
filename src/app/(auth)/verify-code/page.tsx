import { Suspense } from "react";
import VerifyGoogleCode from "@/components/auth/VerifyGoogleCode";

export default function VerifyGoogleCodePage() {
	return (
		<Suspense fallback={<div className="min-h-dvh bg-chinese-black" />}>
			<VerifyGoogleCode />
		</Suspense>
	);
}