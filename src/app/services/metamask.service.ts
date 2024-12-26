import { Injectable } from '@angular/core';
import Web3 from 'web3';
@Injectable({
  providedIn: 'root'
})
export class MetamaskService {
  private web3: any;

  constructor() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.web3 = new Web3((window as any).ethereum);
    } else {
      console.error('MetaMask не встановлений');
    }
  }

  // Підключення до MetaMask та перевірка правильності мережі
  async enableMetaMaskAccount(): Promise<string[]> {
    try {
      // Запит на підключення акаунтів
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await this.web3.eth.getAccounts();

      // Перевірка мережі
      const networkId = await this.web3.eth.net.getId();
      console.log(networkId);
      if (networkId !== 5777n) { // ID Ganache за замовчуванням
        alert('Неправильна мережа. Підключіться до локальної мережі Ganache.');
        console.error('Неправильна мережа');
        return [];
      }
      console.log(accounts);
      return accounts;
    } catch (error) {
      console.error('Помилка підключення MetaMask', error);
      return [];
    }
  }

  // Отримання поточного акаунту
  async getSelectedAccount(): Promise<string> {
    const accounts = await this.web3.eth.getAccounts();
    return accounts[0]; // Повертає поточний акаунт
  }

  getWeb3Instance(): Web3 {
    return this.web3;
  }
}