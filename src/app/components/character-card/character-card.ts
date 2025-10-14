import { Component, input } from '@angular/core';

export interface CardItem {
  id: number;
  name: string;
  images: string[];
  subtitle?: string;
}

@Component({
  selector: 'app-character-card',
  imports: [],
  templateUrl: './character-card.html',
  styleUrl: './character-card.scss'
})
export class CharacterCard {
  item = input.required<CardItem>();
}
