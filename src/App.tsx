import { CloudAlert, DownloadCloud, UploadCloud } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadCard from "@/components/UploadCard";
import DownloadCard from "@/components/DownloadCard";
import DeleteCard from "@/components/DeleteCard";

export function App() {
  return (
    <div className="container mx-auto">
      <Tabs defaultValue="upload" className="w-100 mx-auto">
        <TabsList>
          <TabsTrigger value="upload">
            <UploadCloud />
            Hochladen
          </TabsTrigger>
          <TabsTrigger value="download">
            <DownloadCloud />
            Herunterladen
          </TabsTrigger>
          <TabsTrigger value="delete">
            <CloudAlert />
            Datei Löschen
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <UploadCard />
        </TabsContent>
        <TabsContent value="download">
          <DownloadCard />
        </TabsContent>
        <TabsContent value="delete">
          <DeleteCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
