import { useState } from "react";
import { UseLongPressReturnValue } from "@mantine/hooks";
import { Avatar, Group, useMantineTheme, Text, Box } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { Coin, AlertItem, AlertNames } from "../types/globals";
import { Checkbox } from "@mantine/core";
import Chevron from '../icons/Chevron'

type Props = {
  data: Coin | AlertItem;
  selectItem: (data: Coin | AlertItem) => void;
  selection?: boolean
  handlers: UseLongPressReturnValue
  onChecked: (el: any) => void;
}

function ListElement({ data, selectItem, selection, handlers, onChecked }: Props) {

  const [checked, setChecked] = useState<boolean>(false);

  const theme = useMantineTheme();
  const colorScheme = useColorScheme();

  const backgroundColor =
    colorScheme === 'dark'
      ? theme.colors.dark[6]
      : theme.colors.gray[1];

  const hoverColor =
    colorScheme === 'dark'
      ? theme.colors.dark[5]
      : theme.colors.gray[2];

  function handleChecked (event: any) {

    setChecked(event.currentTarget.checked)
    onChecked(data);

  }

  return (
    <Group
      justify="space-between"
      align="center"
      styles={{
        root: {
          backgroundColor: backgroundColor,
          padding: theme.spacing.sm,
          borderRadius: theme.radius.md,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: hoverColor,
          }
        },
      }}
      onClick={() => selection ? () => {} : selectItem(data)}
      {...handlers}
    >
      <Group gap="md">
        <Avatar src={data.large} size={40} radius="xl" />
        <Box>
          <Text fz='lg' fw={'bolder'} c={'white'}>{data.name}</Text>
          <Text fz={'xs'} c='gray.6'>
            {'alert_type' in data ? `${AlertNames[data.alert_type as keyof typeof AlertNames]} ${data.price}` : data.price}
          </Text>
        </Box>
      </Group>
      {selection ? <Checkbox checked={checked} onChange={handleChecked} /> :

        'alert_type' in data ? <Chevron color="white" /> : <Text c={data.priceChangePercent > 0 ? 'green.7' : 'red.9'}>{Number(data.priceChangePercent).toFixed(2) + '%'}</Text>

      }
    </Group>
  );
}

export default ListElement;