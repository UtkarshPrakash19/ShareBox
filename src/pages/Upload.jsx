// Importing components and functions from various libraries
import {
  Anchor, // For clickable links
  AppShell, // Layout container with header and footer
  Button, // For creating buttons
  Center, // For centering content on the screen
  Stack, // To stack elements vertically
  Text, // For displaying text
  TextInput, // Input field to display text (like a read-only URL)
  Title, // For displaying titles with different sizes
  ThemeIcon, // For adding styled icons with colors
} from "@mantine/core";

// Dropzone component to handle file drag and drop
import { Dropzone } from "@mantine/dropzone";

// Hook for handling clipboard operations like copying text
import { useClipboard } from "@mantine/hooks";

// Firebase functions for file storage management
import { getStorage, ref } from "firebase/storage";

// React and hooks to manage component state and side effects
import React, { useEffect, useMemo, useState } from "react";

// Firebase hook for uploading files to storage
import { useUploadFile } from "react-firebase-hooks/storage";

// QRCode component to generate and display QR codes
import QRCode from "react-qr-code";

// Custom components for header and footer
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

// Firebase app configuration
import { fbApp } from "@/db";

// Importing icons for upload and check actions
import { IconUpload, IconCheck } from "@tabler/icons";

// Random word generator for creating unique IDs for file uploads
import randomWords from "random-words";

// Firebase storage setup
const storage = getStorage(fbApp);
const storageRef = ref(storage);

// Main Upload page component
export default function Upload() {
  // Generate a unique ID using random words (like "red-apple-moon")
  const id = useMemo(() => randomWords({ exactly: 3, join: "-" }), []);
  
  // Log the generated ID to the console (for debugging purposes)
  useEffect(() => console.log(id), [id]);

  // State to check if the file has been uploaded
  const [uploaded, setUploaded] = useState(false);

  return (
    // AppShell provides the layout with header and footer
    <AppShell header={<Header />} footer={<Footer />}>
      {/* Center the content on the page */}
      <Center
        style={{
          padding: "2rem", // Add padding around the content
          backgroundColor: "#f5f5f5", // Light gray background color
          minHeight: "100vh", // Make sure the content takes the full screen height
        }}
      >
        {/* Conditional rendering: If file is uploaded, show the received page, else show send page */}
        {uploaded ? (
          <Receive id={id} />
        ) : (
          <Send id={id} setUploaded={setUploaded} />
        )}
      </Center>
    </AppShell>
  );
}

// Component for sending/uploading the file
function Send({ id, setUploaded }) {
  // Firebase hook for uploading files
  const [uploadFile, uploading, snapshot, error] = useUploadFile();

  // Function to handle file drop/upload
  async function onDrop(files) {
    const file = files[0]; // Get the first file dropped by the user
    // Upload the file to Firebase storage with metadata
    const result = await uploadFile(ref(storageRef, id), file, {
      contentDisposition: `attachment; filename="${file.name}"`,
      customMetadata: {
        realFileName: file.name, // Store the real name of the file
      },
    });
    // Mark the file as uploaded
    setUploaded(true);
  }

  return (
    // Dropzone allows users to drag and drop files here
    <Dropzone
      maxFiles={1} // Limit to only one file upload
      maxSize={50 * 1024 * 1024} // Limit file size to 50MB
      padding="xl" // Extra padding around the drop zone
      onDrop={onDrop} // Trigger the onDrop function when a file is dropped
      loading={uploading} // Show loading state when uploading
      styles={(theme) => ({
        root: {
          backgroundColor: "#ffffff", // White background
          border: `2px dashed ${theme.colors.teal[6]}`, // Dashed border in teal color
          borderRadius: theme.radius.md, // Rounded corners for the border
          padding: "2rem", // Padding inside the dropzone
          minHeight: "220px", // Minimum height for the dropzone
        },
      })}
    >
      {/* Stack the content vertically in the dropzone */}
      <Stack
        align="center"
        justify="center"
        spacing="lg"
        style={{ pointerEvents: "none" }} // Disable interactions (since it's for display only)
      >
        {import.meta.env.DEV && <Text color="dimmed">{id}</Text>} {/* Show the generated ID in dev mode */}
        <IconUpload size={48} color="#00796b" /> {/* Upload icon */}
        <Text size="xl" inline style={{ color: "#00796b" }}>
          Drop a file here or click to select file {/* Instructions to user */}
        </Text>
        <Text size="sm" color="dimmed" inline mt={7}>
          File size should not exceed 50MB {/* File size limitation */}
        </Text>
      </Stack>
    </Dropzone>
  );
}

// Component for receiving the uploaded file details
function Receive({ id }) {
  // Create the download URL based on the generated ID
  const url = window.location.origin + "/" + id;
  
  // Hook to handle copying the URL to the clipboard
  const { copied, copy } = useClipboard({ timeout: 1000 });

  // Button for copying the URL to the clipboard
  const copyButton = (
    <Button
      onClick={() => copy(url)} // Copy the URL when the button is clicked
      color={copied ? "green" : "teal"} // Change button color when URL is copied
      variant="light" // Light button variant
      styles={(theme) => ({
        root: {
          transition: "background-color 0.3s ease", // Smooth color transition
          "&:hover": {
            backgroundColor: copied
              ? theme.colors.green[6] // Green when copied
              : theme.colors.teal[6], // Teal otherwise
            color: theme.white, // White text on hover
          },
        },
      })}
    >
      {copied ? "Copied" : "Copy"} {/* Button text changes when URL is copied */}
    </Button>
  );

  return (
    <Stack spacing="lg" style={{ width: "100%", maxWidth: "400px" }}>
      {/* Title indicating the file was successfully uploaded */}
      <Title order={2} align="center" style={{ color: "#00796b" }}>
        File uploaded&nbsp;
        <ThemeIcon radius="xl" size="xl" color="green">
          <IconCheck /> {/* Checkmark icon indicating success */}
        </ThemeIcon>
      </Title>
      {/* Read-only text input to display the download link */}
      <TextInput
        label="Download Link"
        value={url} // Set the value to the generated URL
        readOnly // Make it read-only so the user can't edit it
        rightSection={copyButton} // Show the copy button on the right
        styles={{ input: { backgroundColor: "#f5f5f5" } }} // Light background color for the input
      />
      {/* Display the QR code for the download link */}
      <Center>
        <QRCode value={url} size={128} /> {/* Generate a QR code for the link */}
      </Center>
      <Center>
        <Text color="dimmed">
          <Anchor onClick={() => window.location.reload()}>Refresh</Anchor> this
          page to upload a new file.
        </Text>
      </Center>
    </Stack>
  );
}
