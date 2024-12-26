import { Component } from '@angular/core';
import { VotingService } from './services/voting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'voting-client';

  constructor(private votingService: VotingService) {}

  async ngOnInit(): Promise<void> {
    // Завантажуємо ABI контракту при ініціалізації
    await this.votingService.loadContractABI();
  }
}
