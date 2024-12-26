import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { MetamaskService } from './metamask.service';
import Web3 from 'web3';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VotingService {
  private web3: Web3;
  private contract: any;
  private contractAddress = '0x10E3737F107D888893bB68DBD54d6880120EA615'; // Адреса контракту з Ganache

  constructor(private metamaskService: MetamaskService, private http: HttpClient) {
    this.web3 = this.metamaskService.getWeb3Instance();
  }

  // Завантаження ABI з assets
  async loadContractABI(): Promise<void> {
    try {
      const contractABI = await firstValueFrom(this.http.get<any>('/assets/Voting.json'));
      this.contract = new this.web3.eth.Contract(contractABI.abi, this.contractAddress);
    } catch (error) {
      console.error('Помилка завантаження ABI', error);
    }
  }

  // Перевірка реєстрації аккаунта
  async isRegistered(fromAddress: string): Promise<boolean> {
    try {
      const isRegistered = await this.contract.methods.isRegistered(fromAddress).call();
      console.log(isRegistered + " в сервісі зареєстровано");
      return isRegistered;
    } catch (error) {
      console.error('Помилка перевірки реєстрації', error);
      return false;
    }
  }

  // Реєстрація аккаунта
  async registerAccount(fromAddress: string): Promise<void> {
    try {
      await this.contract.methods.registerVoter(fromAddress).send({ from: fromAddress });
    } catch (error) {
      console.error('Помилка реєстрації аккаунта', error);
    }
  }

  // Голосування
  async vote(candidateId: number, fromAddress: string): Promise<void> {
    console.log("Голосування в сервісі");
    await this.contract.methods.vote(candidateId).send({ from: fromAddress });
  }

  async getCandidatesCount(): Promise<number> {
    try {
      const count = await this.contract.methods.candidatesCount().call();
      return count;
    } catch (error) {
      console.error('Помилка отримання кількості кандидатів', error);
      return 0;
    }
  }

  async getCandidate(candidateId: number): Promise<{ name: string; voteCount: number, photoUrl: string }> {
    if (!this.contract) {
      console.error('Контракт не завантажено');
      return { name: '', voteCount: 0, photoUrl: '' };
    }
    const result = await this.contract.methods.getCandidate(candidateId).call();
    const voteCount = Number(result[1]);
    return { name: result[0], voteCount: voteCount, photoUrl: result[2] };
  }

  // Метод перевірки, чи голосував користувач
  async hasVoted(fromAddress: string): Promise<boolean> {
    try {
      const hasVoted = await this.contract.methods.hasVoted(fromAddress).call();
      return hasVoted;
    } catch (error) {
      console.error('Помилка перевірки голосування', error);
      return false;
    }
  }
}
