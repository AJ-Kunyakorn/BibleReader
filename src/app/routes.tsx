import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { BibleReading } from "./components/BibleReading";
import { Highlights } from "./components/Highlights";
import { Notes } from "./components/Notes";
import { Search } from "./components/Search";
import { Profile } from "./components/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/read",
    Component: BibleReading,
  },
  {
    path: "/highlights",
    Component: Highlights,
  },
  {
    path: "/notes",
    Component: Notes,
  },
  {
    path: "/search",
    Component: Search,
  },
  {
    path: "/profile",
    Component: Profile,
  },
]);