// Importing necessary components and functions from different libraries
import {
  Alert, // Used to show alert messages (like error warnings)
  AppShell, // Helps set up the layout with header and footer
  Button, // Creates clickable buttons
  Card, // Displays content inside a card-like box
  Center, // Centers content on the page
  Loader, // Shows a loading spinner while waiting for data
  Stack, // Stacks elements on top of each other
  Text, // Displays text
  Box, // Used for creating simple boxes to hold content
} from "@mantine/core";

// Firebase functions to work with files stored in Firebase
import { getMetadata, getStorage, ref } from "firebase/storage";
// prettyBytes converts file sizes into easy-to-read formats like KB, MB
import prettyBytes from "pretty-bytes";
// React and hooks to manage component state and effects
import React, { useEffect, useMemo, useState } from "react";
// Firebase hook to get the file's download link
import { useDownloadURL } from "react-firebase-hooks/storage";
// To get the file ID from the URL
import { useParams } from "react-router-dom";
// Firebase app configuration
import { fbApp } from "@/db";
// Custom components for header and footer
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
// Icons for alerts and download buttons
import { IconAlertTriangle, IconDownload } from "@tabler/icons";

// Initialize Firebase storage to manage files
const storage = getStorage(fbApp);

// Main Download page component
export default function Download() {
  return (
    // AppShell is a layout wrapper that includes header and footer
    <AppShell header={<Header />} footer={<Footer />}>
      {/* Content component handles the display and logic */}
      <Content />
    </AppShell>
  );
}

// This part handles fetching and displaying the file's information
function Content() {
  // Get the file ID from the URL
  const { id } = useParams();

  // Create a reference to the file in Firebase using the file ID
  const fileRef = useMemo(() => ref(storage, id), [id]);

  // Hook to get the download URL of the file
  const [downloadUrl, loading, error] = useDownloadURL(fileRef);
  
  // State to store the file's metadata (info like size, type, etc.)
  const [meta, setMeta] = useState(null);

  // When the component loads, fetch the file's metadata (info about the file)
  useEffect(() => {
    getMetadata(fileRef).then((metadata) => {
      // If we're in development, log metadata for debugging
      if (import.meta.env.DEV) console.log(metadata);
      // Set the file's metadata to be displayed later
      setMeta(metadata);
    });
  }, [fileRef]); // Re-run if the file reference changes

  // If there was an error (file doesn't exist or something went wrong)
  if (error) {
    return (
      // Center the alert on the screen with a full-page layout
      <Center style={{ height: "100vh", backgroundColor: "#f0f0f0" }}>
        {/* Show an error message with an alert icon */}
        <Alert
          title="File doesn't exist"
          color="red"
          radius="md"
          icon={<IconAlertTriangle size={32} />}
        >
          {/* Inform the user that the file wasn't found */}
          The code is invalid... Make sure you have the correct link.
        </Alert>
      </Center>
    );
  }

  // While the file is loading or if metadata isn't available yet, show a loading spinner
  if (loading || !meta) {
    return (
      // Center the loading spinner on the screen
      <Center style={{ height: "100vh", backgroundColor: "#f0f0f0" }}>
        {/* Show a loading spinner with a dots animation */}
        <Loader size="xl" variant="dots" />
      </Center>
    );
  }

  // Once the file's metadata is loaded, show the file's details
  return (
    // Center the content with padding and a light background
    <Center
      style={{
        padding: "3rem", // Space around the content
        backgroundColor: "#e0f7fa", // Light blue background
        minHeight: "100vh", // Make sure the content fills the full screen
      }}
    >
      {/* Card component that displays the file details */}
      <Card
        shadow="lg" // Card has a large shadow to make it stand out
        radius="md" // Medium rounded corners
        p="lg" // Padding inside the card
        withBorder // Add a border around the card
        style={{ width: "100%", maxWidth: "500px", backgroundColor: "#ffffff" }} // Card's max size and background color
      >
        {/* Stack the file details vertically */}
        <Stack spacing="lg">
          {/* Display the file's name */}
          <Text align="center" weight={600} size="xl" color="#00796b">
            {meta.customMetadata.realFileName} {/* Show the custom file name */}
          </Text>
          
          {/* Display the file size */}
          <Box>
            <Text size="sm" color="dimmed">Size</Text>
            <Text weight={500} size="md">{prettyBytes(meta.size)}</Text> {/* Show the file size in a readable format */}
          </Box>
          
          {/* Display the file type (MIME type) */}
          <Box>
            <Text size="sm" color="dimmed">Type</Text>
            <Text weight={500} size="md">{meta.contentType}</Text> {/* Show the MIME type (like 'image/png', 'video/mp4', etc.) */}
          </Box>
          
          {/* Display the upload time */}
          <Box>
            <Text size="sm" color="dimmed">Uploaded</Text>
            <Text weight={500} size="md">{new Date(meta.timeCreated).toLocaleString()}</Text> {/* Show when the file was uploaded */}
          </Box>
        </Stack>

        {/* Button to download the file */}
        <Button
          variant="filled" // Filled button style
          color="teal" // Button color is teal
          radius="md" // Medium rounded corners
          size="lg" // Large button size
          fullWidth // Make the button span the entire width of the card
          leftIcon={<IconDownload size={18} />} // Add a download icon to the button
          style={{ marginTop: "2rem" }} // Add some space above the button
          component="a" // Make the button behave like a link
          href={downloadUrl} // Direct the user to the file's download URL
        >
          Download
        </Button>
      </Card>
    </Center>
  );
}
