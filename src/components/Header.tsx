import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Header() {
  return (
    <div className="w-full border-b">
      <div className="container mx-auto flex justify-between">
        <div className="max-w-xs py-3">
          <h1 className="text-3xl text-end">Sicherer Datei Upload</h1>
          <h2 className="text-sm text-end">von Computer Extra GmbH</h2>
        </div>
        <Navigation />
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a
              href="https://computer-extra.de/Impressum"
              target="_blank"
              rel="noopener noreferrer"
            >
              Impressum
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a
              href="https://computer-extra.de/Datenschutz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datenschutz
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a
              href="https://computer-extra.de/AGB"
              target="_blank"
              rel="noopener noreferrer"
            >
              AGB
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
