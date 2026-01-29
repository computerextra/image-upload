import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { toast } from "sonner";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useState } from "react";

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
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      hash: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const formData = new FormData();

      formData.set("hash", value.hash);
      formData.set("password", value.password);

      // TODO: API Endpoint
      const res = await axios.post(
        "https://api.computer-extra.de/files/download.php",
        formData,
      );
      console.log(res);

      if (res.status != 200) {
        toast.error("Fehlerhafte Eingabe", {
          description: (
            <p className="text-red-400">
              Der eingegebene Fingerabdruck oder das eingegebene Passwort sind
              falsch.
            </p>
          ),
          classNames: {
            content: "text-red-400",
          },
          position: "bottom-right",
          style: {
            "--border-radius": "calc(var(--radius)  + 4px)",
          } as React.CSSProperties,
        });
      }
      setLoading(false);
    },
  });

  return (
    <form
      id="download-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
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
                  disabled={loading}
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
                  disabled={loading}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <Button type="submit" form="download-form" disabled={loading}>
          {loading ? (
            <>
              <Spinner data-icon="inline-start" /> Bitte warten...
            </>
          ) : (
            "Download"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
