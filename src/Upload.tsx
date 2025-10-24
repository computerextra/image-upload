import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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

const formSchema = z.object({
	file: z
		.any()
		.refine(
			(files) => files?.[0]?.size <= MAX_FILE_SIZE,
			"Die Datei darf Maximal 20 MB groß sein!",
		),
	password: z
		.string("Ein Passwort muss angegeben werden")
		.min(8, "Das Passwort muss mindestens 8 Zeichen lang sein")
		.max(99, "Das Passwort darf maximal 99 Zeichen enthalten")
		.regex(/[A-Z]/, "Das Passwort muss mindestens 1 Großbuchstaben enthalten")
		.regex(/[a-z]/, "Das Passwort muss mindestens 1 Kleinbuchstaben enthalten")
		.regex(/[0-9]/, "Das Passwort muss mindestens 1 Zahl enthalten")
		.regex(
			/[!@#$%&*]/,
			"Dass Passwort muss mindestens ein Sonderzeiten enthalten.",
		),
	maxDownload: z.number().min(0).max(99),
});

export default function Upload() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			maxDownload: 1,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		// TODO: implement upload
		// TODO: Umschreiben auf komplett neu mit vanilla html!
		console.log(values);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Upload</CardTitle>
				<CardDescription>
					Hier können Sie eine Datei sicher auf den Server von Computer Extra
					hochladen.
				</CardDescription>
			</CardHeader>

			<form onSubmit={form.handleSubmit(onSubmit)} id="uploadForm">
				<CardContent className="grid gap-6 space-y-4">
					<FieldGroup>
						<Controller
							name="file"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="file">Datei zum hochladen</FieldLabel>
									<Input
										{...field}
										id="file"
										aria-invalid={fieldState.invalid}
										type="file"
									/>
									<FieldDescription>
										Die Datei darf maximmal 20MB groß sein.
									</FieldDescription>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
					<FieldGroup>
						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="password">Passwort</FieldLabel>
									<Input
										{...field}
										id="password"
										aria-invalid={fieldState.invalid}
										type="password"
									/>
									<FieldDescription>
										Passwort muss zwischen 8 und 99 Zeichen lang sein. Das
										Passwort muss 1 Klein-, 1 Großbuchstaben, 1 Zahl und 1
										Sonderzeichen enthalten. <br />
										Erlaubte Sonderzeichen: !, @, #, $, %, &, *
									</FieldDescription>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
					<FieldGroup>
						<Controller
							name="maxDownload"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="downloads">Downloads</FieldLabel>
									<Input
										{...field}
										id="downloads"
										aria-invalid={fieldState.invalid}
										type="number"
									/>
									<FieldDescription>
										Hier kann die maximale Download Anzahl eingetragen werden.
										(0 steht für unendlich). <br />
										Nach Ablauf der eingetragenen Downloads wird die Datei
										automatisch vom Server gelöscht.
									</FieldDescription>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
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
