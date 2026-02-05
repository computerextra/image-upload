import { NavLink, useParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import { CopyButton } from "./components/CopyButton";
import { Button } from "./components/ui/button";

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
        Ihr Fingerabdruck: <br />
        <code className="relative font-mono text-sm font-semibold bg-muted rouded px-[0.3rem] py-[0.2rem]">
          {hash}
        </code>
        <br />
        <CopyButton text={hash} />
        <br />
        <br />
        <span className="font-bold">Bitte beachten Sie:</span> Wir erhalten
        keine Rückmeldung vom System, dass Sie eine Datei Hochgeladen haben.
        Falls Sie diese Datei für Ihren Ansprechpartner bei uns im Haus
        hochgeladen haben, senden Sie diesem bitte den Fingerabdruck per E-Mail
        und teilen ihm das Passwort telefonisch mit.
      </CardContent>
      <CardFooter>
        <Button asChild variant={"outline"}>
          <NavLink to="/">Eine weitere Datei Hochladen</NavLink>
        </Button>
      </CardFooter>
    </Card>
  );
}
