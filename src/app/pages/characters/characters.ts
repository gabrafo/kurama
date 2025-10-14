import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { CharacterCard, type CardItem } from '../../components/character-card/character-card';

interface Character {
  id: number;
  name: string;
  images: string[];
  debut?: {
    manga?: string;
    anime?: string;
  };
  personal?: {
    birthdate?: string;
    sex?: string;
    affiliation?: string | string[];
  };
}

interface ApiResponse {
  characters: Character[];
  currentPage: number;
  pageSize: number;
  total: number;
}

@Component({
  selector: 'app-characters',
  imports: [CommonModule, FormsModule, Navbar, Footer, CharacterCard],
  templateUrl: './characters.html',
  styleUrl: './characters.scss'
})
export class Characters {
  
  protected readonly searchTerm = signal('');
  protected readonly characters = signal<Character[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(1);
  
  protected readonly filteredCharacters = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.characters();
    
    return this.characters().filter(char => 
      char.name.toLowerCase().includes(term)
    );
  });

  protected getAffiliationText(character: Character): string {
    const affiliation = character.personal?.affiliation;
    if (!affiliation) return '';
    
    // Se for string, retorna direto
    if (typeof affiliation === 'string') {
      return affiliation;
    }
    
    // Se for array, junta com vírgula
    if (Array.isArray(affiliation)) {
      return affiliation.join(', ');
    }
    
    return '';
  }

  protected toCardItem(character: Character): CardItem {
    return {
      id: character.id,
      name: character.name,
      images: character.images,
      subtitle: this.getAffiliationText(character)
    };
  }

  constructor() {
    this.loadCharacters();
  }

  protected async loadCharacters(page: number = 1): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    
    try {
      const response = await fetch(
        `https://dattebayo-api.onrender.com/characters?page=${page}&limit=20`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao carregar personagens');
      }
      
      const data: ApiResponse = await response.json();
      this.characters.set(data.characters);
      this.currentPage.set(data.currentPage);
      this.totalPages.set(Math.ceil(data.total / data.pageSize));
    } catch (err) {
      this.error.set('Erro ao carregar personagens. Tente novamente.');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  protected nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.loadCharacters(this.currentPage() + 1);
    }
  }

  protected prevPage(): void {
    if (this.currentPage() > 1) {
      this.loadCharacters(this.currentPage() - 1);
    }
  }
}
