import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialogModule } from '@angular/material/dialog';
import { GameDescriptionComponent } from '../game-description/game-description.component';
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collectionData,
  doc,
  collection,
  addDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    GameDescriptionComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game: Game;
  currentCard: string = '';

  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog) {
    this.game = new Game();
  }
  ngOnInit(): void {
    this.newGame();
    this.subToGame();
  }

  subToGame() {
    let gameRef = collection(this.firestore, 'games');
    let gameData = collectionData(gameRef);
    gameData.subscribe((game) => {
      console.log('All Game Docs', game);
    });
    // return gameData;
  }

  newGame() {
    this.game = new Game();
    this.addGame();
  }

  async addGame() {
    await addDoc(this.getGamesRef(), { Hallo: 'Welt' });
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      let poppedCard = this.game.stack.pop();
      if (typeof poppedCard === 'string') {
        this.currentCard = poppedCard;
      }
      this.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }
}
