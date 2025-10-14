import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { CharacterCard, type CardItem } from '../../components/character-card/character-card';

interface Clan {
  id: number;
  name: string;
  characters: number[];
}

interface Character {
  id: number;
  name: string;
  images?: string[];
}

@Component({
  selector: 'app-clans',
  imports: [CommonModule, FormsModule, Navbar, Footer, CharacterCard],
  templateUrl: './clans.html',
  styleUrl: './clans.scss'
})
export class Clans {
  
  protected readonly searchTerm = signal('');
  protected readonly clans = signal<Clan[]>([]);
  protected readonly clanImages = signal<Map<number, string>>(new Map());
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(1);
  
  protected readonly filteredClans = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.clans();
    
    return this.clans().filter(clan => 
      clan.name.toLowerCase().includes(term)
    );
  });

  constructor() {
    this.loadClans();
  }

  protected async loadClans(page: number = 1): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    
    try {
      const response = await fetch(
        `https://dattebayo-api.onrender.com/clans?page=${page}&limit=20`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao carregar clãs');
      }
      
      const data = await response.json();
      const clansData = data.clans ?? [];
      
      // Remover clãs duplicados (manter apenas o primeiro de cada nome)
      const uniqueClans = clansData.reduce((acc: Clan[], clan: Clan) => {
        const exists = acc.find(c => c.name.toLowerCase() === clan.name.toLowerCase());
        if (!exists) {
          acc.push(clan);
        }
        return acc;
      }, []);
      
      this.clans.set(uniqueClans);
      this.currentPage.set(data.currentPage);
      this.totalPages.set(Math.ceil(data.total / data.pageSize));
      
      // Carregar imagens dos personagens representantes
      await this.loadClanImages(uniqueClans);
    } catch (err) {
      this.error.set('Erro ao carregar clãs. Tente novamente.');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadClanImages(clans: Clan[]): Promise<void> {
    const imageMap = new Map<number, string>();
    
    for (const clan of clans) {
      if (clan.characters && clan.characters.length > 0) {
        // Pega um personagem aleatório do array
        const randomIndex = Math.floor(Math.random() * clan.characters.length);
        const characterId = clan.characters[randomIndex];
        
        try {
          const response = await fetch(
            `https://dattebayo-api.onrender.com/characters/${characterId}`
          );
          
          if (response.ok) {
            const character: Character = await response.json();
            const image = character.images && character.images.length > 0 
              ? character.images[0] 
              : '/imgs/no_image.png';
            imageMap.set(clan.id, image);
          } else {
            imageMap.set(clan.id, '/imgs/no_image.png');
          }
        } catch (err) {
          console.error(`Erro ao carregar imagem do clã ${clan.name}:`, err);
          imageMap.set(clan.id, '/imgs/no_image.png');
        }
      } else {
        imageMap.set(clan.id, '/imgs/no_image.png');
      }
    }
    
    this.clanImages.set(imageMap);
  }

  protected nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.loadClans(this.currentPage() + 1);
    }
  }

  protected prevPage(): void {
    if (this.currentPage() > 1) {
      this.loadClans(this.currentPage() - 1);
    }
  }

  protected toCardItem(clan: Clan): CardItem {
    const image = this.clanImages().get(clan.id) || '/imgs/no_image.png';
    
    return {
      id: clan.id,
      name: clan.name,
      images: [image],
      subtitle: `${clan.characters.length} membros`
    };
  }
}
