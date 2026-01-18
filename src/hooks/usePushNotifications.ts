import { useState, useEffect, useCallback } from 'react';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_KEY;

export const usePushNotifications = (serverSubscribeEndpoint: string) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      
      navigator.serviceWorker.ready.then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      });
    } else {
      console.warn("Push notifications not supported or VAPID key is missing.");
    }
  }, []);

  const subscribeUser = useCallback(async () => {
    if (!isSupported) return;

    setLoading(true);
    setError(null);

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setError('Notification permission denied.');
        setLoading(false);
        return;
      }
      
      const registration = await navigator.serviceWorker.ready;
      const applicationServerKeyUint8 = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      const applicationServerKey = new Uint8Array(applicationServerKeyUint8).buffer;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      await fetch(serverSubscribeEndpoint, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setIsSubscribed(true);
      console.log('User successfully subscribed and data sent to server.');

    } catch (err: any) {
      console.error('Subscription failed:', err);
      setError(err.message || 'Failed to subscribe.');
      setIsSubscribed(false);
    } finally {
      setLoading(false);
    }
  }, [isSupported, serverSubscribeEndpoint]);

  return {
    isSupported,
    isSubscribed,
    loading,
    error,
    subscribeUser,
  };
};