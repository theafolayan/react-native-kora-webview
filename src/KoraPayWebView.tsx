import React, { useMemo } from 'react';
import { Modal, StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewMessageEvent, WebViewNavigation } from './shim';

export interface KoraPayWebViewProps {
  publicKey: string;
  email: string;
  amount: number;
  reference: string;
  currency?: string;
  metadata?: Record<string, any>;
  customPaymentUrl?: string;
  visible: boolean;
  onSuccess?: (response: any) => void;
  onCancel?: () => void;
  onClose?: () => void;
  customLoader?: React.ReactNode;
}

const DEFAULT_URL = 'https://korapay.com/pay';

function KoraPayWebView({
  publicKey,
  email,
  amount,
  reference,
  currency = 'NGN',
  metadata,
  customPaymentUrl,
  visible,
  onSuccess,
  onCancel,
  onClose,
  customLoader,
}: KoraPayWebViewProps) {
  const paymentUrl = useMemo(() => {
    if (customPaymentUrl) return customPaymentUrl;
    const params = new URLSearchParams();
    params.append('key', publicKey);
    params.append('email', email);
    params.append('amount', String(amount));
    params.append('reference', reference);
    params.append('currency', currency);
    if (metadata) {
      params.append('metadata', encodeURIComponent(JSON.stringify(metadata)));
    }
    return `${DEFAULT_URL}?${params.toString()}`;
  }, [publicKey, email, amount, reference, currency, metadata, customPaymentUrl]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.status === 'cancelled') {
        onCancel?.();
        onClose?.();
      } else if (data.status === 'success') {
        onSuccess?.(data);
        onClose?.();
      }
    } catch (error) {
      // ignore messages that aren't JSON
    }
  };

  const handleNavigation = (navState: WebViewNavigation) => {
    const url = navState.url;
    if (url.includes('status=cancelled')) {
      onCancel?.();
      onClose?.();
    } else if (url.includes('status=success')) {
      onSuccess?.({ reference });
      onClose?.();
    }
  };

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      {customLoader ?? <ActivityIndicator size="large" />}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <WebView
        source={{ uri: paymentUrl }}
        onMessage={handleMessage}
        onNavigationStateChange={handleNavigation}
        startInLoadingState
        renderLoading={renderLoader}
      />
    </Modal>
  );
};

export default KoraPayWebView;

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
