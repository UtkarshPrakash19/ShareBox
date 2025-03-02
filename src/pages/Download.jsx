// Importing necessary components from Mantine for UI elements  
import {  
  Alert, // Used to display alert messages  
  AppShell, // Layout wrapper with header and footer  
  Button, // Clickable button component  
  Card, // Box-like container for displaying content  
  Center, // Centers content on the page  
  Loader, // Shows a loading spinner while waiting for data  
  Stack, // Stacks elements vertically  
  Text, // Displays text content  
  Box // Simple container for holding content  
} from "@mantine/core";  

// Import Firebase functions to manage file storage  
import { getMetadata, getStorage, ref } from "firebase/storage";  

// Converts file size to a readable format (KB, MB, GB)  
import prettyBytes from "pretty-bytes";  

// Import React and hooks to manage state and effects  
import React, { useEffect, useMemo, useState } from "react";  

// Firebase hook to get the file's download URL  
import { useDownloadURL } from "react-firebase-hooks/storage";  

// React Router hook to extract file ID from the URL  
import { useParams } from "react-router-dom";  

// Firebase app configuration  
import { fbApp } from "@/db";  

// Custom header and footer components  
import { Footer } from "@/components/Footer";  
import { Header } from "@/components/Header";  

// Icons for alerts and download button  
import { IconAlertTriangle, IconDownload } from "@tabler/icons";  

// Initialize Firebase storage  
const storage = getStorage(fbApp);  

// Main Download component  
export default function Download() {  
  return (  
    // Layout wrapper with a header and footer  
    <AppShell header={<Header />} footer={<Footer />}>  
      <Content />  
    </AppShell>  
  );  
}  

// Component to handle file fetching and display  
function Content() {  
  // Extract file ID from the URL  
  const { id } = useParams();  

  // Create a reference to the file in Firebase storage  
  const fileRef = useMemo(() => ref(storage, id), [id]);  

  // Hook to fetch the download URL of the file  
  const [downloadUrl, loading, error] = useDownloadURL(fileRef);  

  // State to store file metadata like size, type, and upload time  
  const [meta, setMeta] = useState(null);  

  // Fetch file metadata when the component loads  
  useEffect(() => {  
    getMetadata(fileRef).then((metadata) => {  
      // Log metadata in development mode for debugging  
      if (import.meta.env.DEV) console.log(metadata);  

      // Store metadata for display  
      setMeta(metadata);  
    });  
  }, [fileRef]); // Runs again if fileRef changes  

  // Show error message if file doesn't exist  
  if (error) {  
    return (  
      <Center style={{ height: "100vh", backgroundColor: "#f0f0f0" }}>  
        <Alert  
          title="File doesn't exist"  
          color="red"  
          radius="md"  
          icon={<IconAlertTriangle size={32} />}  
        >  
          The code is invalid... Make sure you have the correct link.  
        </Alert>  
      </Center>  
    );  
  }  

  // Show loading spinner while fetching file data  
  if (loading || !meta) {  
    return (  
      <Center style={{ height: "100vh", backgroundColor: "#f0f0f0" }}>  
        <Loader size="xl" variant="dots" />  
      </Center>  
    );  
  }  

  // Display file details and download button when data is available  
  return (  
    <Center  
      style={{  
        padding: "3rem",  
        backgroundColor: "#e0f7fa",  
        minHeight: "100vh"  
      }}  
    >  
      <Card  
        shadow="lg"  
        radius="md"  
        p="lg"  
        withBorder  
        style={{ width: "100%", maxWidth: "500px", backgroundColor: "#ffffff" }}  
      >  
        <Stack spacing="lg">  
          {/* Display file name from metadata */}  
          <Text align="center" weight={600} size="xl" color="#00796b">  
            {meta.customMetadata.realFileName}  
          </Text>  

          {/* Display file size */}  
          <Box>  
            <Text size="sm" color="dimmed">Size</Text>  
            <Text weight={500} size="md">{prettyBytes(meta.size)}</Text>  
          </Box>  

          {/* Display file type (MIME type) */}  
          <Box>  
            <Text size="sm" color="dimmed">Type</Text>  
            <Text weight={500} size="md">{meta.contentType}</Text>  
          </Box>  

          {/* Display upload time */}  
          <Box>  
            <Text size="sm" color="dimmed">Uploaded</Text>  
            <Text weight={500} size="md">{new Date(meta.timeCreated).toLocaleString()}</Text>  
          </Box>  
        </Stack>  

        {/* Button to download the file */}  
        <Button  
          variant="filled"  
          color="teal"  
          radius="md"  
          size="lg"  
          fullWidth  
          leftIcon={<IconDownload size={18} />}  
          style={{ marginTop: "2rem" }}  
          component="a"  
          href={downloadUrl}  
        >  
          Download  
        </Button>  
      </Card>  
    </Center>  
  );  
}  
