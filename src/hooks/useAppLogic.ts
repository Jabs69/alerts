import { useState, useEffect, useCallback } from "react";
import { useDisclosure, useColorScheme, useLongPress } from "@mantine/hooks";
import { Coin, Alert, AlertItem, AlertToDelete } from "../types/globals";
import { add, deleteCoins, getAll } from "../services/coins";
import { createNewAlert, editAlert, getAlerts, deleteAlerts } from "../services/alerts";
import { usePwaBackNavigation } from "./useBackButtonPWA";
import { usePushNotifications } from "./usePushNotifications";

interface AppState {
  alerts: AlertItem[];
  coins: Coin[];
  selectedItem: Coin | AlertItem | null;
  opened: boolean;
  selection: boolean;
  activeTab: string | null;
  color: string;
  showNotificationModal: boolean;
  handlers: ReturnType<typeof useLongPress>;
  isSubscribed: boolean;
  isSupported: boolean;
}

interface AppActions {
  setActiveTab: (tab: string | null) => void;
  handleDeleteAlerts: () => Promise<void>;
  handleChecked: (data: Coin | AlertItem) => void;
  addCurrency: (coin: Coin) => Promise<void>;
  addAlert: (alert: Alert) => Promise<void>;
  handleEditAlert: (alert: Alert) => Promise<void>;
  handleOpen: (data: Coin | AlertItem) => void;
  handleClose: () => void;
  subscribeUser: () => void;
  setShowNotificationModal: (val: boolean) => void;
}

export function useAppLogic() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedItem, setSelectedItem] = useState<Coin | AlertItem | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [selection, setSelection] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[] | AlertToDelete[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('cryptos');
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const server = import.meta.env.VITE_API_URL;
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? '#fff' : '#000';
  
  const handlers = useLongPress(() => setSelection(true));
  const { isSubscribed, isSupported, subscribeUser } = usePushNotifications(`${server}/subscribe`);

  const handleClose = useCallback(() => {
    setSelectedItem(null);
    close();
  }, [close]);

  usePwaBackNavigation(selection, setSelection, opened, handleClose);

  useEffect(() => {
    if (isSupported && !isSubscribed && typeof Notification !== "undefined" && Notification.permission !== "granted") {
      setShowNotificationModal(true);
    } else {
      setShowNotificationModal(false);
    }
  }, [isSupported, isSubscribed]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCoins, resAlerts] = await Promise.all([getAll(), getAlerts()]);
        setCoins(resCoins);
        setAlerts(resAlerts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteAlerts = async () => {
    try {
      if (activeTab === 'alerts') {
        await deleteAlerts(selectedItems as AlertToDelete[]);
        setAlerts((prev) => prev.filter((alert) => {
          if (!alert.alert_id) return true;
          return !(selectedItems as AlertToDelete[]).some(s => s.ids.includes(alert.alert_id!));
        }));
      }
      else {
        const currCoins = selectedItems as string[];
        await deleteCoins(selectedItems as string[]);
        setCoins((prev) => prev.filter((coin) => !currCoins.includes(coin.id)));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSelection(false);
      setSelectedItems([]);
    }
  };

  const handleChecked = (data: Coin | AlertItem) => {
    if ('alert_id' in data && data.alert_id) {
      setSelectedItems(prev => {
        const alertsPrev = (prev as AlertToDelete[]) || [];
        const existing = alertsPrev.find(el => el.symbol === data.symbol);
        if (!existing) return [...alertsPrev, { symbol: data.symbol, ids: [data.alert_id!] }];
        return alertsPrev.map(el =>
          el.symbol === data.symbol ? { ...el, ids: [...el.ids, data.alert_id!] } : el
        );
      });
    } else if ('id' in data) {
      setSelectedItems(prev => [...(prev as string[]), data.id]);
    }
  };

  const addCurrency = async (coin: Coin) => {
    try {
      const res = await add(coin);
      if (res) setCoins(prev => [...prev, { ...coin, ...res }]);
    } catch (error) { console.error(error); }
  };

  const addAlert = async (alert: Alert) => {
    try {
      const res = await createNewAlert(alert);
      if (res) {
        setAlerts(prev => [...prev, { ...alert, ...res } as AlertItem]);
        close();
      }
    } catch (error) { console.error(error); }
  };

  const handleEditAlert = async (alert: Alert) => {
    try {
      await editAlert(alert);
      setAlerts(prev => prev.map((el) => el.alert_id !== alert.alert_id ? el : { ...el, ...alert } as AlertItem));
      close();
    } catch (error) { console.error(error); }
  };

  const handleOpen = (data: Coin | AlertItem) => {
    setSelectedItem(data);
    open();
  };

  return {
    state: { 
      alerts, coins, selectedItem, opened, selection, 
      activeTab, color, showNotificationModal, handlers, 
      isSubscribed, isSupported 
    } as AppState,
    actions: { 
      setActiveTab, handleDeleteAlerts, handleChecked, 
      addCurrency, addAlert, handleEditAlert, handleOpen, 
      handleClose, subscribeUser, setShowNotificationModal 
    } as AppActions
  };
}