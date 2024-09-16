import {
  Alert,
  AppShell,
  Button,
  Card,
  Center,
  Loader,
  Stack,
  Text,
  Box,
} from "@mantine/core";
import { getMetadata, getStorage, ref } from "firebase/storage";
import prettyBytes from "pretty-bytes";
import React, { useEffect, useMemo, useState } from "react";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { useParams } from "react-router-dom";
import { fbApp } from "@/db";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { IconAlertTriangle, IconDownload } from "@tabler/icons";

const storage = getStorage(fbApp);

export default function Download() {
  return (
    <AppShell header={<Header />} footer={<Footer />}>
      <Content />
    </AppShell>
  );
}

function Content() {
  const { id } = useParams();
  const fileRef = useMemo(() => ref(storage, id), [id]);
  const [downloadUrl, loading, error] = useDownloadURL(fileRef);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    getMetadata(fileRef).then((metadata) => {
      if (import.meta.env.DEV) console.log(metadata);
      setMeta(metadata);
    });
  }, [fileRef]);

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

  if (loading || !meta) {
    return (
      <Center style={{ height: "100vh", backgroundColor: "#f0f0f0" }}>
        <Loader size="xl" variant="dots" />
      </Center>
    );
  }

  return (
    <Center
      style={{
        padding: "3rem",
        backgroundColor: "#e0f7fa",
        minHeight: "100vh",
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
          <Text align="center" weight={600} size="xl" color="#00796b">
            {meta.customMetadata.realFileName}
          </Text>
          <Box>
            <Text size="sm" color="dimmed">
              Size
            </Text>
            <Text weight={500} size="md">
              {prettyBytes(meta.size)}
            </Text>
          </Box>
          <Box>
            <Text size="sm" color="dimmed">
              Type
            </Text>
            <Text weight={500} size="md">
              {meta.contentType}
            </Text>
          </Box>
          <Box>
            <Text size="sm" color="dimmed">
              Uploaded
            </Text>
            <Text weight={500} size="md">
              {new Date(meta.timeCreated).toLocaleString()}
            </Text>
          </Box>
        </Stack>
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
