import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TypographyH1, TypographyH2 } from "./components/typography.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<div className="container mx-auto">
			<TypographyH1 className="text-center font-envision mt-8">
				Computer Extra
			</TypographyH1>
			<TypographyH2 className="text-center">Sicherer Datei Upload</TypographyH2>
			<App />
		</div>
	</StrictMode>,
);
