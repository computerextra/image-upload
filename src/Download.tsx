import { useState } from "react";
import { Button } from "./components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./components/ui/card";
import { Field, FieldGroup, FieldLabel } from "./components/ui/field";
import { Input } from "./components/ui/input";

export default function Download() {
	const [pass, setPass] = useState<string | undefined>(undefined);
	const [hash, setHash] = useState<string | undefined>(undefined);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Download</CardTitle>
				<CardDescription>
					Hier können Sie eine Datei herunterladen. Geben Sie hierfür den Hash
					der Datei ein und geben Sie das Passwort ein.
				</CardDescription>
			</CardHeader>
			<form
				action={"/download.php"}
				method="post"
				encType="multipart/form-data"
				id="downloadForm"
			>
				<CardContent className="grid gap-6 space-y-4">
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="hash">Datei Hash</FieldLabel>
							<Input
								name="hash"
								required
								id="hash"
								type="text"
								value={hash}
								onChange={(e) => setHash(e.target.value)}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Passwort</FieldLabel>
							<Input
								name="password"
								id="password"
								required
								type="password"
								value={pass}
								onChange={(e) => setPass(e.target.value)}
							/>
						</Field>
					</FieldGroup>
				</CardContent>
				<CardFooter>
					<Button type="submit" form="downloadForm" className="mt-4">
						Download
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
