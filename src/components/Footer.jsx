import {
  Group,
  Button,
  Footer as MantineFooter,
  Text,
  Anchor,
} from "@mantine/core";

export function Footer() {
  return (
    <MantineFooter height={60}>
      <Group position="apart" py={8} px="lg">
        <Button
          variant="subtle"
          component={Anchor}
          href="https://github.com/VaibhavKT20/ShareBox"
          target="_blank"
        >
          Github
        </Button>
      </Group>
    </MantineFooter>
  );
}
