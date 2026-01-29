import { useParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "./components/ui/card";
import { Separator } from "./components/ui/separator";

export default function Success() {
  const { hash } = useParams();

  return (
    <Card className="w-100 mx-auto p-6 bg-emerald-100 border border-emerald-900">
      <CardTitle>Erfolg</CardTitle>
      <CardDescription>
        <p className="leading-7 not-first:mt-6">
          Ihre Datei wurde erfolgreich Hochgeladen.
        </p>
      </CardDescription>
      <CardContent>
        Bitte Speichern Sie sich den Fingerabdruck ab, ohne diesen ist ein
        Download der Datei nicht möglich.
        <Separator className="my-2 bg-emerald-900" />
        Ihr Fingerabdruck:{" "}
        <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {hash}
        </code>
      </CardContent>
    </Card>
  );
}
