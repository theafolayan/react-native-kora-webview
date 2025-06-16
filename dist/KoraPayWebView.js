"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_webview_1 = require("react-native-webview");
const DEFAULT_URL = 'https://korapay.com/pay';
function KoraPayWebView({ publicKey, email, amount, reference, currency = 'NGN', metadata, customPaymentUrl, visible, onSuccess, onCancel, onClose, customLoader, }) {
    const paymentUrl = (0, react_1.useMemo)(() => {
        if (customPaymentUrl)
            return customPaymentUrl;
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
    const handleMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.status === 'cancelled') {
                onCancel === null || onCancel === void 0 ? void 0 : onCancel();
                onClose === null || onClose === void 0 ? void 0 : onClose();
            }
            else if (data.status === 'success') {
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(data);
                onClose === null || onClose === void 0 ? void 0 : onClose();
            }
        }
        catch (error) {
            // ignore messages that aren't JSON
        }
    };
    const handleNavigation = (navState) => {
        const url = navState.url;
        if (url.includes('status=cancelled')) {
            onCancel === null || onCancel === void 0 ? void 0 : onCancel();
            onClose === null || onClose === void 0 ? void 0 : onClose();
        }
        else if (url.includes('status=success')) {
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess({ reference });
            onClose === null || onClose === void 0 ? void 0 : onClose();
        }
    };
    const renderLoader = () => (react_1.default.createElement(react_native_1.View, { style: styles.loaderContainer }, customLoader !== null && customLoader !== void 0 ? customLoader : react_1.default.createElement(react_native_1.ActivityIndicator, { size: "large" })));
    return (react_1.default.createElement(react_native_1.Modal, { visible: visible, transparent: true, animationType: "slide", onRequestClose: onClose },
        react_1.default.createElement(react_native_webview_1.WebView, { source: { uri: paymentUrl }, onMessage: handleMessage, onNavigationStateChange: handleNavigation, startInLoadingState: true, renderLoading: renderLoader })));
}
;
exports.default = KoraPayWebView;
const styles = react_native_1.StyleSheet.create({
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
