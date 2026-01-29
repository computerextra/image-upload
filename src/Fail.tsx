import { NavLink } from "react-router";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "./components/ui/card";

export default function Fail() {
  return (
    <Card className="w-100 mx-auto p-6 bg-emerald-100 border border-emerald-900">
      <CardTitle>Fehler</CardTitle>
      <CardDescription>
        <p className="leading-7 not-first:mt-6">
          Ihre Datei konnte nicht heruntergeladen werden.
        </p>
      </CardDescription>
      <CardContent>
        Es gab ein Problem beim Herunterladen der Datei. <br />
        Vergewissern Sie sich, dass Sie den richtigen Fingerabdruck und das
        korrekte Passwort eingegeben haben. <br />
        <Button asChild>
          <NavLink to="/">Erneut versuchen</NavLink>
        </Button>
      </CardContent>
    </Card>
  );
}
