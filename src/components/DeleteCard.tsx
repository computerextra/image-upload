import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { toast } from "sonner";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

export default function DeleteCard() {
  return (
    <Card>
      <CardTitle>Datei Löschen</CardTitle>
      <CardDescription>
        <p className="leading-7 not-first:mt-6">
          Hier können Sie eine bereits Hochgeladene Datei vorzeitig löschen.{" "}
          <br />
          Geben Sie hierfür den Fingerabdruck der Datei und das dazugehörige
          Passwort ein. Die Datei wird dann sofort gelöscht und kann nicht
          wiederhergestellt werden.
        </p>
      </CardDescription>
      <CardContent>
        <DeleteForm />
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

function DeleteForm() {
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

      const res = await axios.post(
        "https://api.computer-extra.de/files/delete.php",
        formData,
      );

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
      } else {
        toast.success("Erfolg", {
          description: (
            <p className="text-green-400">
              Der eingegebene Fingerabdruck oder das eingegebene Passwort sind
              falsch.
            </p>
          ),
          classNames: {
            content: "text-green-400",
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
      id="delete-form"
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
        <Button type="submit" form="delete-form" disabled={loading}>
          {loading ? (
            <>
              <Spinner data-icon="inline-start" /> Bitte warten...
            </>
          ) : (
            "Datei löschen"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
