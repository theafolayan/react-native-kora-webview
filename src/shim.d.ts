export interface WebViewMessageEvent {
  nativeEvent: { data: string };
}

export interface WebViewNavigation {
  url: string;
}

declare module 'react-native';
declare module 'react-native-webview';
