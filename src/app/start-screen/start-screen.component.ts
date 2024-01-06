import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);

  constructor(private router: Router) {}

  ngOnInit(): void {}

  newGame() {
    //start game
    this.addGame();
  }

  async addGame() {
    let game = new Game();
    await addDoc(this.getGamesRef(), game.toJson()).then((gameInfo: any) => {
      console.log(gameInfo);
      this.router.navigateByUrl('/game/' + gameInfo.id);
    });
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }
}
