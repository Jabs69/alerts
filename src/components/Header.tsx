import { Box } from "@mantine/core";
import TrashIcon from '../icons/Trash';

type Props = {

  selection: boolean
  color: string
  deleteIconAction: () => void

}

function Header({ selection, color, deleteIconAction }: Props) {

  return (

    <Box component="header" style={{

      display: 'flex',
      justifyContent: selection ? 'space-between' : 'flex-start',
      alignItems: 'center'

    }} px={16}>
      <h3>Crypto Price Alert</h3>
      {selection &&

        <Box onClick={deleteIconAction}>
          <TrashIcon color={color} />
        </Box>
      }
    </Box>

  )

}

export default Header;