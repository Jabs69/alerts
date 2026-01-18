import { Avatar, Group, Text } from "@mantine/core";

type Props = {

  data: {

    thumb: string;
    name: string;


  }

}

function CoinPreview({ data }: Props) {

  return (

    <Group gap="sm" style={{cursor: 'pointer'}}>
      <Avatar src={data.thumb} size={36} radius="xl" />
      <div>
        <Text size="sm">{data.name}</Text>
      </div>
    </Group>

  )

}

export default CoinPreview;