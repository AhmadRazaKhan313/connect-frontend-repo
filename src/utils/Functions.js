import { PAYMENT_METHODS } from './Constants';

export const getPaymentMethodNameByKey = (key) => {
    return PAYMENT_METHODS.find((item) => item.key === key).value;
};

export const capitalize = (str) => {
    return str.replace(/\b(\w)/g, (s) => s.toUpperCase());
};

export const getColorByStatus = (row) => {
    return row?.deleted === true || row?.status === 'deleted' ? 'red' : 'black'
}
