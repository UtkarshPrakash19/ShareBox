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

import { Dropzone } from "@mantine/dropzone"; // Dropzone component to handle file drag and drop

import { useClipboard } from "@mantine/hooks"; // Hook for handling clipboard operations like copying text

import { getStorage, ref } from "firebase/storage"; // Firebase functions for file storage management

import React, { useEffect, useMemo, useState } from "react"; // React and hooks to manage component state and side effects

import { useUploadFile } from "react-firebase-hooks/storage"; // Firebase hook for uploading files to storage

import QRCode from "react-qr-code"; // QRCode component to generate and display QR codes

import { Footer } from "@/components/Footer"; // Custom Footer component
import { Header } from "@/components/Header"; // Custom Header component

import { fbApp } from "@/db"; // Firebase app configuration

import { IconUpload, IconCheck } from "@tabler/icons"; // Importing icons for upload and check actions

import randomWords from "random-words"; // Random word generator for creating unique IDs for file uploads

const storage = getStorage(fbApp); // Initialize Firebase storage
const storageRef = ref(storage); // Reference to Firebase storage

// Main Upload page component
export default function Upload() {
  const id = useMemo(() => randomWords({ exactly: 3, join: "-" }), []); // Generate a unique ID using random words

  useEffect(() => console.log(id), [id]); // Log the generated ID (for debugging)

  const [uploaded, setUploaded] = useState(false); // State to track if a file has been uploaded

  return (
    <AppShell header={<Header />} footer={<Footer />}>
      <Center
        style={{
          padding: "2rem",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {uploaded ? <Receive id={id} /> : <Send id={id} setUploaded={setUploaded} />}
      </Center>
    </AppShell>
  );
}

// Component for sending/uploading the file
function Send({ id, setUploaded }) {
  const [uploadFile, uploading, snapshot, error] = useUploadFile(); // Firebase hook for uploading files

  async function onDrop(files) {
    const file = files[0]; // Get the first file dropped by the user

    const result = await uploadFile(ref(storageRef, id), file, {
      contentDisposition: `attachment; filename="${file.name}"`,
      customMetadata: { realFileName: file.name }, // Store the real file name
    });

    setUploaded(true); // Set the uploaded state to true
  }

  return (
    <Dropzone
      maxFiles={1} // Limit to one file
      maxSize={50 * 1024 * 1024} // Maximum file size: 50MB
      padding="xl"
      onDrop={onDrop}
      loading={uploading}
      styles={(theme) => ({
        root: {
          backgroundColor: "#ffffff",
          border: `2px dashed ${theme.colors.teal[6]}`,
          borderRadius: theme.radius.md,
          padding: "2rem",
          minHeight: "220px",
        },
      })}
    >
      <Stack align="center" justify="center" spacing="lg" style={{ pointerEvents: "none" }}>
        {import.meta.env.DEV && <Text color="dimmed">{id}</Text>}
        <IconUpload size={48} color="#00796b" />
        <Text size="xl" inline style={{ color: "#00796b" }}>
          Drop a file here or click to select file
        </Text>
        <Text size="sm" color="dimmed" inline mt={7}>
          File size should not exceed 50MB
        </Text>
      </Stack>
    </Dropzone>
  );
}

// Component for receiving the uploaded file details
function Receive({ id }) {
  const url = window.location.origin + "/" + id; // Generate download URL
  const { copied, copy } = useClipboard({ timeout: 1000 }); // Hook for copying URL to clipboard

  const copyButton = (
    <Button
      onClick={() => copy(url)}
      color={copied ? "green" : "teal"}
      variant="light"
      styles={(theme) => ({
        root: {
          transition: "background-color 0.3s ease",
          "&:hover": {
            backgroundColor: copied ? theme.colors.green[6] : theme.colors.teal[6],
            color: theme.white,
          },
        },
      })}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );

  return (
    <Stack spacing="lg" style={{ width: "100%", maxWidth: "400px" }}>
      <Title order={2} align="center" style={{ color: "#00796b" }}>
        File uploaded&nbsp;
        <ThemeIcon radius="xl" size="xl" color="green">
          <IconCheck />
        </ThemeIcon>
      </Title>
      <TextInput
        label="Download Link"
        value={url}
        readOnly
        rightSection={copyButton}
        styles={{ input: { backgroundColor: "#f5f5f5" } }}
      />
      <Center>
        <QRCode value={url} size={128} />
      </Center>
      <Center>
        <Text color="dimmed">
          <Anchor onClick={() => window.location.reload()}>Refresh</Anchor> this page to upload a new file.
        </Text>
      </Center>
    </Stack>
  );
}
