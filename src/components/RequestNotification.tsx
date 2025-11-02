import { FunctionComponent } from "react";
import { Button, Group } from "@mantine/core"

interface RequestNotificationProps {

  onAccept: () => void;
  onDecline: () => void;

}

const RequestNotification: FunctionComponent<RequestNotificationProps> = ({ onAccept, onDecline }) => {
  return (

    <Group>

      <Button onClick={onAccept}>Aceptar</Button>
      <Button onClick={onDecline}>Rechazar</Button>

    </Group>

  );
}

export default RequestNotification;