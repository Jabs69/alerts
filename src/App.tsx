import { MantineProvider, ColorSchemeScript, Tabs, Container, Modal, Stack, Text } from "@mantine/core";
import { useAppLogic } from "./hooks/useAppLogic";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ListElement from "./components/ListEl";
import AddCurrency from "./components/AddCurrency";
import IconBitcoin from "./icons/IconBitcoin";
import IconAlert from "./icons/IconAlert";
import RequestNotification from "./components/RequestNotification";
import { Coin, AlertItem } from "./types/globals";

export default function App() {
  const { state, actions } = useAppLogic();
  const { alerts, coins, selectedItem, opened, selection, activeTab, color, showNotificationModal, handlers } = state;

  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider defaultColorScheme="auto">

        {showNotificationModal && (
          <Modal opened={true} title="Permitir notificaciones" size='lg' centered onClose={() => actions.setShowNotificationModal(false)}>
            <RequestNotification onAccept={actions.subscribeUser} onDecline={() => actions.setShowNotificationModal(false)} />
          </Modal>
        )}

        <Header selection={selection} color={color} deleteIconAction={actions.handleDeleteAlerts} />

        <Tabs value={activeTab} onChange={actions.setActiveTab} variant="pills" inverted styles={{ list: { position: "fixed", bottom: 0, width: '100%' } }}>
          <Tabs.Panel value="cryptos">
            <Container><SearchBar onSelect={actions.addCurrency} /></Container>
            <Stack mt={32} gap={8} px={16}>
              {coins.map((el: Coin) => (
                <ListElement key={el.id} data={el} selectItem={actions.handleOpen} selection={selection} handlers={handlers} onChecked={actions.handleChecked} />
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="alerts">
            <Stack mt={32} gap={8} px={16}>
              {alerts.map((el: AlertItem) => (
                <ListElement key={el.alert_id} data={el} selectItem={actions.handleOpen} selection={selection} handlers={handlers} onChecked={actions.handleChecked} />
              ))}
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

        <Modal opened={opened} onClose={actions.handleClose} size="lg" title={selectedItem?.name} centered>
          <AddCurrency 
            dataItem={selectedItem ?? {} as Coin | AlertItem} 
            onSubmit={selectedItem && 'alert_id' in selectedItem ? actions.handleEditAlert : actions.addAlert} 
          />
        </Modal>
      </MantineProvider >
    </>
  );
}