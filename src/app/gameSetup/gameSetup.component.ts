import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";
import { GameDataService } from "src/services/gamedata";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

@Component({
  selector: "app-gameSetup",
  templateUrl: "./gameSetup.component.html",
  styleUrls: ["./gameSetup.component.scss"],
})

export class GameSetupComponent implements OnInit {

  constructor(private gameDataService: GameDataService) {}
  
  genres: string[] = ["House", "Alternative", "J-Rock", "R&B"];
  selectedGenre: string = "";
  authLoading: boolean = false;
  configLoading: boolean = false;
  token: string = "";
  showElement: boolean = false;
  selectedGenreText: string = "Select Genre";
  
  ngOnInit(): void {
    this.authLoading = true;
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        this.token = storedToken.value;
        this.loadGenres(storedToken.value);

        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = newToken.value;
      this.loadGenres(newToken.value);
    });
  }

  loadGenres = async (t: any) => {
    this.configLoading = true;
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    console.log(response);
    this.genres = response.genres;
    this.configLoading = false;
  };

  setGenre(selectedGenre: any) {
    console.log()
    this.selectedGenre = selectedGenre.target.innerText;

    console.log(TOKEN_KEY);
    this.gameDataService.setGenre(selectedGenre);
    this.selectedGenreText = this.selectedGenre;
  }

  numberOfSongsCounter: number = 1;
  numberOfArtistsCounter: number = 2;
  incrementCounterSongs() {
    if (this.numberOfSongsCounter < 3) {
      this.numberOfSongsCounter++;
    }
  }
  decrementCounterSongs() {
    if (this.numberOfSongsCounter > 1) {
      this.numberOfSongsCounter--;
    }
  }
  incrementCounterArtists() {
    if (this.numberOfArtistsCounter < 4) {
      this.numberOfArtistsCounter++;
    }
  }
  decrementCounterArtists() {
    if (this.numberOfArtistsCounter > 2) {
      this.numberOfArtistsCounter--;
    }
  }

  showGenres(): void {
    this.showElement ? this.showElement = false : this.showElement = true
  }
  
 initializeGame(){
   let songsPerGuess = this.numberOfSongsCounter;
   let numOfArtistChoices = this.numberOfArtistsCounter;
   console.log(songsPerGuess);
   console.log(numOfArtistChoices);
   this.gameDataService.setNumberOfArtists(numOfArtistChoices)
   this.gameDataService.setNumberOfSongs(songsPerGuess)
   this.gameDataService.setGenre(this.selectedGenre)
 }
}