import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import Download from "./Download";
import Upload from "./Upload";

function App() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-6 mx-auto mt-12">
			<Tabs defaultValue="upload">
				<TabsList>
					<TabsTrigger value="upload">Upload</TabsTrigger>
					<TabsTrigger value="download">Download</TabsTrigger>
				</TabsList>
				<TabsContent value="upload">
					<Upload />
				</TabsContent>
				<TabsContent value="download">
					<Download />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default App;
