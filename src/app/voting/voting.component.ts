import { Component, OnInit } from '@angular/core';
import { MetamaskService } from '../services/metamask.service';
import { VotingService } from '../services/voting.service';


@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss'],
})
export class VotingComponent implements OnInit {
  accounts: string[] = [];
  candidates: any[] = [];
  candidate1Percent: number = 0;
  candidate2Percent: number = 0;

  constructor(private metamaskService: MetamaskService, private votingService: VotingService) {}

  async ngOnInit(): Promise<void> {
    this.accounts = await this.metamaskService.enableMetaMaskAccount();
    if (this.accounts.length === 0) {
      console.error('Не вдалося підключитися до MetaMask');
    } else {
      this.loadCandidates();
    }
  }

  async loadCandidates(): Promise<void> {
    const candidatesCount = await this.votingService.getCandidatesCount();
    this.candidates = [];
    let total = 0;
    console.log("components: ");
    for (let i = 1; i <= candidatesCount; i++) {
      const candidate = await this.votingService.getCandidate(i);
      this.candidates.push(candidate);
      console.log(this.candidates[i-1]?.percentage);
      total = total + candidate.voteCount;
    }
    this.candidate1Percent = (this.candidates[0].voteCount * 100) / total;
    this.candidate2Percent = (this.candidates[1].voteCount * 100) / total;
    console.log("components2: ");
    console.log("total: " + total);
    console.log("candidate 1 : " + this.candidates[0].voteCount);
    console.log("candidate 2 : " + this.candidates[1].voteCount);
    console.log(this.candidate1Percent + " dfd " + this.candidate2Percent);
  }

  async vote(candidateId: number): Promise<void> {
    const selectedAccount = await this.metamaskService.getSelectedAccount();
    if (selectedAccount) {
      const isRegistered = await this.votingService.isRegistered(selectedAccount);
      const isVoted = await this.votingService.hasVoted(selectedAccount);

      if (!isRegistered) {
        const confirmRegister = confirm('Ваша адреса буде зареєстрована для голосування.');
        if (confirmRegister) {
          try {
            await this.votingService.registerAccount(selectedAccount);
            console.log('Ви успішно зареєстровані!');
          } catch (error) {
            console.error('Помилка при реєстрації', error);
            return;
          }
        } else {
          console.log('Користувач відмовився від реєстрації');
          return;
        }
      }

      try {
        console.log(`Голосування за кандидата ${candidateId}`);
        await this.votingService.vote(candidateId, selectedAccount);
        console.log(`Голос за кандидата ${candidateId} віддано`);
        await this.loadCandidates();
      } catch (error) {
        console.error('Помилка при голосуванні', error);
      }
    } else {
      console.error('Обліковий запис MetaMask не знайдено');
    }
  }
}