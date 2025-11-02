import { MantineProvider, ColorSchemeScript, Tabs, Container, Modal, Stack, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { useDisclosure, useColorScheme } from "@mantine/hooks";
import { Coin, Alert, AlertItem } from "./types/globals";
import { add, getAll } from "./services/coins";
import { createNewAlert, editAlert, getAlerts, deleteAlerts } from "./services/alerts";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ListElement from "./components/ListEl";
import AddCurrency from "./components/AddCurrency";
import IconBitcoin from "./icons/IconBitcoin";
import IconAlert from "./icons/IconAlert";
import RequestNotification from "./components/RequestNotification";
import { useLongPress } from "@mantine/hooks";
import { usePwaBackNavigation } from "./hooks/useBackButtonPWA";
import { usePushNotifications } from "./hooks/usePushNotifications";

export default function App() {

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedItem, setSelectedItem] = useState<Coin | AlertItem | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [selection, setSelection] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[] | number[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('cryptos');

  const server = import.meta.env.VITE_API_URL;

  const colorScheme = useColorScheme();
  const handlers = useLongPress(() => setSelection(true));

  usePwaBackNavigation(selection, setSelection, opened, handleClose);

  const { isSubscribed, isSupported, subscribeUser } = usePushNotifications(`${server}/subscribe`);
  const color = colorScheme === 'dark' ? '#fff' : '#000';
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    if (
      isSupported &&
      !isSubscribed &&
      typeof Notification !== "undefined" &&
      Notification.permission !== "granted"
    ) {
      setShowNotificationModal(true);
    } else {
      setShowNotificationModal(false);
    }
  }, [isSupported, isSubscribed]);

  async function handleDeleteAlerts() {
    try {
      if (activeTab === 'alerts') {
        deleteAlerts(selectedItems as number[])
        setAlerts((prev) => prev.filter((alert: Alert) => {
          if (alert.alert_id) return !(alert.alert_id in selectedItems)
        }))
      }
    }
    catch (error: any) {
      console.log(error);
    }
    finally {
      setSelection(false);
    }
  }

  function handleChecked(data: any) {
    if ('alert_id' in data) {
      setSelectedItems(prev => [...prev, data.alert_id])
    }
    else setSelectedItems(prev => [...prev, data.id])
  }

  async function addCurrency(coin: Coin) {
    try {
      const res = await add(coin);
      if (res) setCoins(prev => [...prev, { ...coin, ...res }]);
    } catch (error) {
      console.log(error);
    }
  }

  async function addAlert(alert: Alert) {
    try {
      const res = await createNewAlert(alert);
      if (res) {
        setAlerts(prev => [...prev, { ...alert, ...res }]);
        close();
      }
    }
    catch (error: any) {
      console.log(error);
    }
  }

  async function handleEditAlert(alert: Alert) {
    try {
      await editAlert(alert);
      setAlerts(prev => prev.map((el: AlertItem) => el.alert_id !== alert.alert_id ? el : { ...el, alert_type: alert.alert_type, price: alert.price }))
      close();
    }
    catch (error) {
      console.log(error);
    }
  }

  function handleOpen(data: Coin | AlertItem) {
    setSelectedItem(data);
    open();
  }

  function handleClose(): void {
    setSelectedItem(null);
    close();
  }

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await getAlerts();
        setAlerts(res);
      } catch (error) {
        console.log(error);
      }
    }
    async function getCoins() {
      try {
        const res = await getAll();
        setCoins(res);
      } catch (error) {
        console.log(error);
      }
    }
    getCoins();
    fetchAlerts();
  }, []);

  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider defaultColorScheme="auto">

        {showNotificationModal && (
          <Modal opened={true} title="Permitir notificaciones" size='lg' centered onClose={() => setShowNotificationModal(false)}>
            <RequestNotification onAccept={subscribeUser} onDecline={() => setShowNotificationModal(false)} />
          </Modal>
        )}

        <Header selection={selection} color={color} deleteIconAction={handleDeleteAlerts} />

        <Tabs value={activeTab} onChange={setActiveTab} variant="pills" inverted styles={{ list: { position: "fixed", bottom: 0, width: '100%' } }}>
          <Tabs.Panel value="cryptos">
            <Container>
              <SearchBar onSelect={addCurrency} />
            </Container>
            <Stack mt={32} gap={8} px={16}>
              {coins.map((el: Coin) => <ListElement data={el} key={el.id} selectItem={handleOpen} selection={selection} handlers={handlers} onChecked={handleChecked} />)}
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="alerts">
            <Stack mt={32} gap={8} px={16}>
              {alerts.map((el: AlertItem) => <ListElement data={el} key={el.alert_id} selectItem={handleOpen} selection={selection} handlers={handlers} onChecked={handleChecked} />)}
            </Stack>
          </Tabs.Panel>
          <Tabs.List grow>
            <Tabs.Tab value='cryptos'>
              <Stack justify="center" align="center" gap={0}>
                <IconBitcoin color={color} />
                <Text fz='xs'>Activos</Text>
              </Stack>
            </Tabs.Tab>
            <Tabs.Tab value='alerts'>
              <Stack justify="center" align="center" gap={0}>
                <IconAlert color={color} />
                <Text fz='xs'>Alertas</Text>
              </Stack>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <Modal opened={opened} onClose={handleClose} size="lg" title={selectedItem?.name} centered>
          <AddCurrency dataItem={selectedItem ?? {} as Coin | AlertItem} onSubmit={selectedItem && 'alert_id' in selectedItem ? handleEditAlert : addAlert} />
        </Modal>
      </MantineProvider >
    </>
  )
}