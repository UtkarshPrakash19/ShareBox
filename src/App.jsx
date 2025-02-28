// Importing necessary components from Mantine for UI and styling
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
// Hooks from Mantine to manage color scheme and store preferences
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
// React Router for navigating between different pages in the app
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import the pages (Upload and Download) that handle file uploads and downloads
import Download from "./pages/Download"; // Page for downloading files
import Upload from "./pages/Upload"; // Page for uploading files

// Main app component
export default function App() {
  // Get the user's preferred color scheme (light or dark) from their system
  const preferredColorScheme = useColorScheme();

  // Use localStorage to remember the user's selected color scheme across sessions
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "color-scheme", // Key used to store the preference in localStorage
    defaultValue: preferredColorScheme, // Default value based on user's system preference
    getInitialValueInEffect: true, // Ensures the color scheme is correctly set on initial render
  });

  // Function to toggle between light and dark color schemes
  function toggleColorScheme(value) {
    // If a value is provided, use it, otherwise toggle based on current color scheme
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  }

  return (
    // ColorSchemeProvider manages the current color scheme and provides a toggle function
    <ColorSchemeProvider
      colorScheme={colorScheme} // Set the current color scheme
      toggleColorScheme={toggleColorScheme} // Function to toggle between light and dark mode
    >
      {/* MantineProvider applies the chosen color scheme globally and normalizes CSS for consistent styling */}
      <MantineProvider
        theme={{ colorScheme }} // Apply the color scheme to Mantine's theme
        withGlobalStyles // Include global CSS styles
        withNormalizeCSS // Normalize CSS for consistent rendering across browsers
      >
        {/* BrowserRouter is the wrapper for managing routes (pages) in the app */}
        <BrowserRouter>
          <Routes>
            {/* Define the routes for the app */}
            <Route index element={<Upload />} /> {/* Default route, shows Upload page */}
            <Route path=":id" element={<Download />} /> {/* Route with dynamic 'id', shows Download page */}
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
