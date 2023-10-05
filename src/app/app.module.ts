import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GameSetupComponent } from './gameSetup/gameSetup.component';
import { GameDataService } from 'src/services/gamedata';
import { GameComponent } from './game/game.component';
import {ArtistSelections} from './game/artistSelections/artistSelections.component';
import { MusicPlayerComponent } from './game/musicPlayer/musicPlayer.component';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game-setup', component: GameSetupComponent},
  { path: 'game', component: GameComponent}
];

@NgModule({
  declarations: [AppComponent, HomeComponent, GameSetupComponent, GameComponent, MusicPlayerComponent, ArtistSelections],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes), NgxAudioPlayerModule, BrowserAnimationsModule],
  providers: [GameDataService],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule {}
