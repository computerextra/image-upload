import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";

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
      <CardContent>HIER WIRD DAS UPLOAD FORM HINKOMMEN!</CardContent>
    </Card>
  );
}
