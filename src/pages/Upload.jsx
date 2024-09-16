import {
  Anchor,
  AppShell,
  Button,
  Center,
  Stack,
  Text,
  TextInput,
  Title,
  ThemeIcon,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useClipboard } from "@mantine/hooks";
import { getStorage, ref } from "firebase/storage";
import React, { useEffect, useMemo, useState } from "react";
import { useUploadFile } from "react-firebase-hooks/storage";
import QRCode from "react-qr-code";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { fbApp } from "@/db";
import { IconUpload, IconCheck } from "@tabler/icons";
import randomWords from "random-words";

const storage = getStorage(fbApp);
const storageRef = ref(storage);

export default function Upload() {
  const id = useMemo(() => randomWords({ exactly: 3, join: "-" }), []);
  useEffect(() => console.log(id), [id]);

  const [uploaded, setUploaded] = useState(false);

  return (
    <AppShell header={<Header />} footer={<Footer />}>
      <Center
        style={{
          padding: "2rem",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {uploaded ? (
          <Receive id={id} />
        ) : (
          <Send id={id} setUploaded={setUploaded} />
        )}
      </Center>
    </AppShell>
  );
}

function Send({ id, setUploaded }) {
  const [uploadFile, uploading, snapshot, error] = useUploadFile();

  async function onDrop(files) {
    const file = files[0];
    const result = await uploadFile(ref(storageRef, id), file, {
      contentDisposition: `attachment; filename="${file.name}"`,
      customMetadata: {
        realFileName: file.name,
      },
    });
    setUploaded(true);
  }

  return (
    <Dropzone
      maxFiles={1}
      maxSize={50 * 1024 * 1024}
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
      <Stack
        align="center"
        justify="center"
        spacing="lg"
        style={{ pointerEvents: "none" }}
      >
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

function Receive({ id }) {
  const url = window.location.origin + "/" + id;
  const { copied, copy } = useClipboard({ timeout: 1000 });

  const copyButton = (
    <Button
      onClick={() => copy(url)}
      color={copied ? "green" : "teal"}
      variant="light"
      styles={(theme) => ({
        root: {
          transition: "background-color 0.3s ease",
          "&:hover": {
            backgroundColor: copied
              ? theme.colors.green[6]
              : theme.colors.teal[6],
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
          <Anchor onClick={() => window.location.reload()}>Refresh</Anchor> this
          page to upload a new file.
        </Text>
      </Center>
    </Stack>
  );
}
