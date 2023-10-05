import { Component, OnInit } from '@angular/core';
import { GameDataService } from 'src/services/gamedata';
import fetchFromSpotify, {request} from 'src/services/api';
import { random } from 'lodash';


const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";
@Component({
    selector: "app-game",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit {
    constructor(private gameDataService: GameDataService) { }
    authLoading: boolean = false;
    configLoading: boolean = false;
    token: String = "";
    id: String = "";
    artistList: any[] =[];
    isAnswerCorrect: boolean | null = null;
    chanceCounter: number = 0;
    isPlayAgain: boolean | null = null;

    genre: string = this.gameDataService.getGenre();
    numberOfSongs: number = this.gameDataService.getNumberOfArtists();
    numberOfArtists: number = this.gameDataService.getNumberOfArtists();

    //the correct artist object and associated data
    correctArtist: any = {}

    //holds the number of songs the user requested
    songList: any = []
    

    ngOnInit() {
      // this.genre= localStorage.getItem("genre") || " ";
      this.authLoading = true;
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        this.token = storedToken.value;
        // this.loadGenres(storedToken.value);
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
      // this.loadGenres(newToken.value);
      // this.loadOriginalSong(newToken.value);
      // this.loadAdditionalSongs(newToken.value);
      // this.loadOtherChoices(newToken.value);
      this.getNumberOfArtists(newToken.value);
    });
    }

    getNumberOfArtists = async (t: any) => {
      this.configLoading = true;
      const params = {
        limit: 20,
        seed_genres: this.genre,
        min_popularity: 10
      };
      const response = await fetchFromSpotify({
        token: t,
        endpoint: "recommendations",
        params: params
      })

      this.artistList = response.tracks.sort( function() { return 0.5 - Math.random() } ).slice(0, this.numberOfArtists)

      this.setCorrectArtist(t)
      this.configLoading = false;
    };

    setCorrectArtist = (t: string) => {
      const randomList = this.artistList.sort( function() { return 0.5 - Math.random() } )
      const i = Math.floor(Math.random() * randomList.length)
      this.correctArtist = randomList[i]
      console.log('correct', this.correctArtist)
      this.getCorrectArtistSongs(t)
    }

    getCorrectArtistSongs = async (t: any) => {
      this.configLoading = true;
      const params = {
        market: "US",
      };
      
      console.log('artist id', this.correctArtist)
      
      const response = await fetchFromSpotify({
        token: t,
        endpoint: `artists/${this.correctArtist.artists[0].id}/top-tracks`,
        params: params
      });
      console.log('rezzzz', response)

      const tracks = response.tracks.sort(function() { return 0.5 - Math.random() }).splice(0, this.numberOfSongs)
      console.log('tracks', tracks)
      tracks.map((track: any) => {
        console.log("Object of correct singer tracks", track);

        this.songList.push({'title': track.name,  'link': track.preview_url})
      })
      console.log("List of songs from correct artist", this.songList);
      this.configLoading = false;
    };

    userArtistSelection(newData: any) {
      this.isAnswerCorrect = newData
      if(this.isAnswerCorrect) {
        this.isPlayAgain = true;
      } else if(!this.isAnswerCorrect && this.chanceCounter < 1) {
        this.chanceCounter++
      } else {
        this.isPlayAgain = true;
        this.chanceCounter++
      }
    } 



}