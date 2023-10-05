import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})

export class GameDataService {
  private numberOfSongs: number = 1;
  private numberOfArtists: number = 2;
  private genre: string = '';

  constructor() {}

  getNumberOfSongs(): number {
    return this.numberOfSongs;
  }

  setNumberOfSongs(number: number): void {
    this.numberOfSongs = number
  }

  getNumberOfArtists(): number {
    return this.numberOfArtists;
  }

  setNumberOfArtists(number: number): void {
    this.numberOfArtists = number
  }

  getGenre(): string {
    return this.genre;
  }

  setGenre(genre: string): void {
    this.genre = genre
  }

}

