import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "./components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "./components/ui/field";
import { Input } from "./components/ui/input";

export const MAX_FILE_SIZE = 1024 * 1024 * 20; // Max 5 MB

const password = z
	.string("Ein Passwort muss angegeben werden")
	.min(8, "Das Passwort muss mindestens 8 Zeichen lang sein")
	.max(99, "Das Passwort darf maximal 99 Zeichen enthalten")
	.regex(/[A-Z]/, "Das Passwort muss mindestens 1 Großbuchstaben enthalten")
	.regex(/[a-z]/, "Das Passwort muss mindestens 1 Kleinbuchstaben enthalten")
	.regex(/[0-9]/, "Das Passwort muss mindestens 1 Zahl enthalten")
	.regex(
		/[!@#$%&*]/,
		"Dass Passwort muss mindestens ein Sonderzeiten enthalten.",
	);

export default function Upload() {
	const [pass, setPass] = useState<string | undefined>(undefined);
	const [err, setErr] = useState<{ message: string }[] | undefined>(undefined);

	useEffect(() => {
		if (pass == null) {
			setErr(undefined);
			return;
		}
		if (pass.length == 0) {
			setErr(undefined);
			return;
		}

		const res = password.safeParse(pass);
		if (res.success) setErr(undefined);
		else {
			const err: {
				origin: string;
				code: string;
				format: string;
				pattern: string;
				path: unknown[];
				message: string;
			}[] = JSON.parse(res.error.message);
			const msg: { message: string }[] = [];
			err.map((x) => {
				msg.push({ message: x.message });
			});
			setErr(msg);
		}
	}, [pass]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Upload</CardTitle>
				<CardDescription>
					Hier können Sie eine Datei sicher auf den Server von Computer Extra
					hochladen.
				</CardDescription>
			</CardHeader>

			<form
				action={"/upload.php"}
				method="post"
				encType="multipart/form-data"
				id="uploadForm"
			>
				<CardContent className="grid gap-6 space-y-4">
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="file">Datei zum hochladen</FieldLabel>
							<Input id="file" name="file" type="file" />
							<FieldDescription>
								Die Datei darf maximmal 20MB groß sein.
							</FieldDescription>
						</Field>
					</FieldGroup>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="password">Passwort</FieldLabel>
							<Input
								name="password"
								id="password"
								type="password"
								value={pass}
								onChange={(e) => setPass(e.target.value)}
							/>
							<FieldDescription>
								Passwort muss zwischen 8 und 99 Zeichen lang sein. Das Passwort
								muss 1 Klein-, 1 Großbuchstaben, 1 Zahl und 1 Sonderzeichen
								enthalten. <br />
								Erlaubte Sonderzeichen: !, @, #, $, %, &, *
							</FieldDescription>
							{err && <FieldError errors={err} />}
						</Field>
					</FieldGroup>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="maxDownload">Downloads</FieldLabel>
							<Input name="maxDownload" id="maxDownload" type="number" />
							<FieldDescription>
								Hier kann die maximale Download Anzahl eingetragen werden. (0
								steht für unendlich). <br />
								Nach Ablauf der eingetragenen Downloads wird die Datei
								automatisch vom Server gelöscht.
							</FieldDescription>
						</Field>
					</FieldGroup>
				</CardContent>
				<CardFooter>
					<Button type="submit" form="uploadForm" className="mt-4">
						Hochladen
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
