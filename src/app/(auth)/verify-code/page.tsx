import { Suspense } from "react";
import VerifyGoogleCode from "@/components/auth/VerifyGoogleCode";

export default function VerifyGoogleCodePage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<VerifyGoogleCode />
		</Suspense>
	);
}