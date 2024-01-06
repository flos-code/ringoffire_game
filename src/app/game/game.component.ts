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
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  Unsubscribe,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';

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
  // pickCardAnimation = false;
  game: Game;
  // currentCard: string = '';
  gameID: string = '';

  unsubGames: Unsubscribe | null = null;

  firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.game = new Game();
  }

  ngOnInit(): void {
    this.newGame();

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.gameID = params['id'];
        console.log(params['id']);
        this.unsubGames = this.subscribeToGame(params['id']);
      }
    });
  }

  newGame() {
    this.game = new Game();
    // this.addGame();
  }

  async addGame() {
    await addDoc(this.getGamesRef(), this.game.toJson());
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      let poppedCard = this.game.stack.pop();
      if (typeof poppedCard === 'string') {
        this.game.currentCard = poppedCard;
      }
      this.game.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  getSingleGameRef(colId: string, docId: string) {
    let data = doc(collection(this.firestore, colId), docId);
    return data;
  }

  subscribeToGame(gameId: string): Unsubscribe {
    return onSnapshot(
      this.getSingleGameRef('games', gameId),
      (gameData: any) => {
        console.log('Game Update', gameData.data());

        this.game.players = gameData.data().players;
        this.game.stack = gameData.data().stack;
        this.game.playedCards = gameData.data().playedCards;
        this.game.currentPlayer = gameData.data().currentPlayer;
        this.game.pickCardAnimation = gameData.data().pickCardAnimation;
        if (this.game.currentCard !== undefined) {
          this.game.currentCard = gameData.data().currentCard;
        } else {
          return;
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.unsubGames) {
      this.unsubGames();
    }
  }

  async saveGame() {
    if (this.gameID) {
      let docRef = this.getSingleGameRef('games', this.gameID);
      await updateDoc(docRef, this.getCleanJson()).catch((err) => {
        console.error(err);
      });
    }
  }

  getCleanJson() {
    return {
      players: this.game.players,
      stack: this.game.stack,
      playedCards: this.game.playedCards,
      currentPlayer: this.game.currentPlayer,
      pickCardAnimation: this.game.pickCardAnimation,
      currentCard: this.game.currentCard,
    };
  }
}
