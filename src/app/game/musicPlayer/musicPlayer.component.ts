import { Component, Input, OnInit } from '@angular/core';
import { Track } from 'ngx-audio-player/lib/model/track.model';

@Component({
  selector: 'app-musicPlayer',
  templateUrl: './musicPlayer.component.html',
  styleUrls: [ './musicPlayer.component.scss' ]
})


export class MusicPlayerComponent  {


 @Input() songs: any[] = [];



song: any[] = [
  {title: 'test1', link: '../../assets/test1.mp3'},
  {title: 'test2', link: '../../assets/test2.mp3'},
  {title: 'test2', link: '../../assets/test2.mp3'},
]
 
}
