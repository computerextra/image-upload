import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function DownloadCard() {
  return (
    <Card>
      <CardTitle>Datei Herunterladen</CardTitle>
      <CardDescription>
        <p className="leading-7 not-first:mt-6">
          Hier können Sie eine bereits Hochgeladene Datei herunterladen. <br />
          Geben Sie hierfür den Fingerabdruck der Datei und das dazugehörige
          Passwort ein. Der Download startet nach dem Drücken des Buttons.
        </p>
      </CardDescription>
      <CardContent>
        <DownloadForm />
      </CardContent>
    </Card>
  );
}

const formSchema = z.object({
  hash: z
    .string("Der Fingerabdruck ist ein Pflichtfeld")
    .min(32, "Der Fingerabdruck muss 32 Stellen haben")
    .max(32, "Der Fingerabdruck muss 32 Stellen haben"),
  password: z.string("Das Passwort ist ein Pflichtfeld"),
});

function DownloadForm() {
  const form = useForm({
    defaultValues: {
      hash: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
  });

  return (
    <form
      id="download-form"
      action={"https://api.computer-extra.de/files/download.php"}
      method="POST"
    >
      <FieldGroup>
        <form.Field
          name="hash"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Fingerabdruck</FieldLabel>
                <Input
                  required
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Dateien Fingerabdruck"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Passwort</FieldLabel>
                <Input
                  required
                  type="password"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Passwort"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <Button type="submit" form="download-form">
          Download
        </Button>
      </FieldGroup>
    </form>
  );
}
