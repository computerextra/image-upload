import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";

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
      <CardContent>HIER WIRD DAS DELETE FORM HINKOMMEN!</CardContent>
    </Card>
  );
}
