import React from 'react';
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
declare function KoraPayWebView({ publicKey, email, amount, reference, currency, metadata, customPaymentUrl, visible, onSuccess, onCancel, onClose, customLoader, }: KoraPayWebViewProps): any;
export default KoraPayWebView;
