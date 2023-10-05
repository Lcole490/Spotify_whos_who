import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-artistSelections',
  templateUrl: './artistSelections.component.html',
  styleUrls: [ './artistSelections.component.scss' ]
})

export class ArtistSelections implements OnInit {
  @Input() allArtists: any[] = [];
  @Input() correctArtist: any = {};
  @Input() isDisabled: boolean | null = null;
  @Output() userSelect: any = new EventEmitter<any>();
 
  constructor() { }

  ngOnInit() {}

  onUserSelection = (artist: string) => {
    if(artist === this.correctArtist.artists[0].name) {
      this.userSelect.emit(true)
    } else {
      this.userSelect.emit(false)
    }
  }
}