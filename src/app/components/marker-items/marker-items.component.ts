import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-marker-items',
  templateUrl: './marker-items.component.html',
  styleUrls: ['./marker-items.component.scss'],
  imports: [
    IonContent,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class MarkerItemsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
