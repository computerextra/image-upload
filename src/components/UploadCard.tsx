import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import { Separator } from "./ui/separator";

export default function UploadCard() {
  return (
    <Card>
      <CardTitle>Datei Hochladen</CardTitle>
      <CardDescription>
        <p className="leading-7 not-first:mt-6">
          Hier können Sie eine Datei bis maximal 20MB sicher Hochladen. Die
          Datei wird verschlüsselt und sicher auf unserem Server gespeichert.
        </p>
        <b>Wichtige Hinweise:</b>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            Sie erhalten nach dem erfolgreichen Hochladen den Fingerabdruck der
            Datei, ohne diesen Wert kann die Datei nicht heruntergeladen werden.
          </li>
          <li>
            Bitte bewahren Sie das gesetzte Passwort sicher auf, ohne das
            Passwort kann die Datei nicht heruntergeladen werden. Ein
            Zurücksetzen des Passworts ist nicht möglich.
          </li>
          <li>
            Die Datei wird automatisch nach 30 Tagen gelöscht. Sie können die
            Datei vorzeitig löschen, indem Sie den Fingerabdruck eingeben und
            den Löschen-Button drücken.
          </li>
        </ul>
      </CardDescription>
      <CardContent>
        <UploadForm />
      </CardContent>
    </Card>
  );
}

const fileSizeLimit = 20 * 1024 * 1024; // 20 MB

const formSchema = z.object({
  password: z
    .string("Ein Passwort muss eingegeben werden")
    .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein.")
    .refine(
      (password) => /[A-Z]/.test(password),
      "Das Passwort muss mindestens 1 Großbuchstaben enthalten",
    )
    .refine(
      (password) => /[a-z]/.test(password),
      "Das Passwort muss mindestens 1 Kleinbuchstaben enthalten",
    )
    .refine(
      (password) => /[0-9]/.test(password),
      "Das Passwort muss mindestens 1 Zahl enthalten",
    )
    .refine(
      (passord) => /[!@#$%&?*]/.test(passord),
      "Das Passwort muss mindestens 1 Sonderzeichen enthalten, zugelassene Sonderzeichen: '!@#$%&?*'",
    ),
  file: z
    .file()
    .refine(
      (file) => file.size <= fileSizeLimit,
      "Die Datei darf nicht größer als 20MB sein.",
    ),
});

function UploadForm() {
  const [hash, setHash] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      file: {} as File,
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const formData = new FormData();
      formData.set("file", value.file);
      formData.set("password", value.password);

      // TODO: API Endpoint
      const res = await axios.post<{ hash: string }>(
        "https://api.computer-extra.de/files/upload.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.status != 200) {
        toast.error("Fehler", {
          description: (
            <p className="text-red-400">
              Bei Hochladen der Datei ist ein Fehler aufgetreten, bitte
              versuchen Sie es später erneut.
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
              Die Datei wurde erfolgreich hochgeladen
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

        setHash(res.data.hash);
      }
      setLoading(false);
    },
  });

  return (
    <>
      <form
        id="upload-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field
            name="file"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Fingerabdruck</FieldLabel>
                  <Input
                    required
                    type="file"
                    id={field.name}
                    name={field.name}
                    value={field.state.value.name}
                    onBlur={field.handleBlur}
                    disabled={hash != null || loading}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.files ? e.target.files[0] : ({} as File),
                      )
                    }
                    aria-invalid={isInvalid}
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
                    disabled={hash != null || loading}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <Button
            type="submit"
            form="upload-form"
            disabled={hash != null || loading}
          >
            {loading ? (
              <>
                <Spinner data-icon="inline-start" /> Bitte warten...
              </>
            ) : (
              "Datei hochladen"
            )}
          </Button>
        </FieldGroup>
      </form>
      {hash != null && (
        <div className="grid w-full max-w-md items-start gap-4 mt-5">
          <Alert variant={"success"}>
            <CheckCircle2Icon />
            <AlertTitle>Datei erfolgreich Hochgeladen</AlertTitle>
            <AlertDescription>
              Bitte Speichern Sie sich den Fingerabdruck ab, ohne diesen ist ein
              Download der Datei nicht möglich.
              <Separator className="my-2 bg-emerald-900" />
              <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {hash}
              </code>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
