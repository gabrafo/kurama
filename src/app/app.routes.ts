import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Characters } from './pages/characters/characters';
import { TailedBeasts } from './pages/tailed-beasts/tailed-beasts';
import { Clans } from './pages/clans/clans';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'characters',
    component: Characters
  },
  {
    path: 'tailed-beasts',
    component: TailedBeasts
  },
  {
    path: 'clans',
    component: Clans
  }
];
