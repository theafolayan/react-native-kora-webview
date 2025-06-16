# react-native-korapay-webview

A fully typed, WebView-based React Native SDK to accept payments via [KoraPay](https://korapay.com).

Inspired by the simplicity of `react-native-paystack-webview`, this package adds modal support, auto-dismiss, custom loader, and flexible configuration out of the box.

---

## Features

- ✅ Modal-based WebView for KoraPay payments
- ✅ TypeScript-first design
- ✅ Auto-dismiss on payment success or cancellation
- ✅ `onSuccess`, `onCancel`, and `onClose` lifecycle hooks
- ✅ Optional `customLoader` support
- ✅ Accepts metadata and custom payment URLs

---

## Installation

```bash
npm install react-native-korapay-webview
# or
yarn add react-native-korapay-webview
```
Also install react-native-webview if not already installed:

```bash
npm install react-native-webview
```

## Basic Usage 
```javascript
import React, { useState } from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { KoraPayWebView } from 'react-native-korapay-webview';

export default function App() {
  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button title="Pay Now" onPress={() => setVisible(true)} />

      <KoraPayWebView
        visible={visible}
        publicKey="pk_test_xxxx"
        email="user@example.com"
        amount={5000} // in kobo
        currency="NGN"
        reference={`txn_${Date.now()}`}
        metadata={{ userId: 42 }}
        onSuccess={(res) => {
          console.log('Payment Success:', res);
          setVisible(false);
        }}
        onCancel={() => {
          console.log('Payment Cancelled');
          setVisible(false);
        }}
        onClose={() => {
          console.log('WebView Closed');
          setVisible(false);
        }}
        customLoader={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading Payment Page...</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
```

## Props Reference

| Prop           | Type                       | Required | Description                                    |
| :------------- | :------------------------- | :------- | :--------------------------------------------- |
| `publicK`      | `string`                   | ✅       | Your KoraPay public key                        |
| `email`        | `string`                   | ✅       | Customer's email                               |
| `amount`       | `number`                   | ✅       | Amount in kobo / lowest denomination           |
| `reference`    | `string`                   | ✅       | Unique transaction reference                   |
| `currency`     | `string`                   | ❌       | Defaults to "NGN"                              |
| `metadata`     | `Record<string, any>`      | ❌       | Additional metadata to include                 |
| `customPaymentUrl` | `string`               | ❌       | Optional custom KoraPay payment URL            |
| `visible`      | `boolean`                  | ✅       | Controls whether modal is shown                |
| `onSuccess`    | `(response: object) => void` | ❌       | Called on successful payment                   |
| `onCancel`     | `() => void`               | ❌       | Called when user cancels payment               |
| `onClose`      | `() => void`               | ❌       | Always called when modal closes                |
| `customLoader` | `React.ReactNode`          | ❌       | Custom loading UI while WebView loads          |


## Use With Custom KoraPay Links
If you already generate hosted payment links from your backend:

```tsx
<KoraPayWebView
  visible={true}
  customPaymentUrl="https://korapay.com/pay/abc123"
  onClose={() => setVisible(false)}
/>
```

## Security Consideration
Avoid generating sensitive values like references or metadata in the frontend. Always handle secure logic server-side.

