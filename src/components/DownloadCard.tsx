import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";

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
      <CardContent>HIER WIRD DAS DOWNLOAD FORM HINKOMMEN!</CardContent>
    </Card>
  );
}
