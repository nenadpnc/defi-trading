import { Side, TokenType } from '../types';

const http = (url: string, address: string, data?: any, method = 'get') => {
  return fetch(url, {
    method,
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
      'x-signature': localStorage.getItem('signature') as string,
      'x-address': address
    }
  }).then((res) => {
    if (res.status >= 400) {
      return res.json().then((err) => Promise.reject(err));
    }
    return res.json();
  });
};

export const depositFunds = (address: string, amount: number, token: TokenType) => {
  return http(`/api/deposit`, address, { amount, token }, 'post');
}

export const getBalances = (address: string, token: TokenType) => {
  return http(`/api/balances?token=${token}`, address);
}

export const placeOrder = (address: string, amount: number, token: TokenType, side: Side) => {
  return http(`/api/placeOrder`, address, { amount, token, side }, 'post');
}

export const cancelOrder = (address: string, id: string) => {
  return http(`/api/cancelOrder?id=${id}`, address, undefined, 'delete');
}

export const getOrders = (address: string, token: TokenType) => {
  return http(`/api/orders?token=${token}`, address);
}
