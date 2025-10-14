import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { CharacterCard, type CardItem } from '../../components/character-card/character-card';

interface TailedBeast {
  id: number;
  name: string;
  images?: string[];
  debut?: {
    anime?: string;
    manga?: string;
  };
}

interface ApiResponse {
  tailedBeasts: TailedBeast[];
  currentPage: number;
  pageSize: number;
  total: number;
}

@Component({
  selector: 'app-tailed-beasts',
  imports: [CommonModule, FormsModule, Navbar, Footer, CharacterCard],
  templateUrl: './tailed-beasts.html',
  styleUrl: './tailed-beasts.scss'
})
export class TailedBeasts {
  
  protected readonly searchTerm = signal('');
  protected readonly tailedBeasts = signal<TailedBeast[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(1);
  
  protected readonly filteredTailedBeasts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.tailedBeasts();
    
    return this.tailedBeasts().filter(beast => 
      beast.name.toLowerCase().includes(term)
    );
  });

  constructor() {
    this.loadTailedBeasts();
  }

  protected async loadTailedBeasts(page: number = 1): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    
    try {
      const response = await fetch(
        `https://dattebayo-api.onrender.com/tailed-beasts?page=${page}&limit=20`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao carregar bijuus');
      }
      
  const data = await response.json();
  // Corrige o campo do array para 'tailed-beasts' (com hífen)
  this.tailedBeasts.set(data['tailed-beasts'] ?? []);
  this.currentPage.set(data.currentPage);
  this.totalPages.set(Math.ceil(data.total / data.pageSize));
    } catch (err) {
      this.error.set('Erro ao carregar bijuus. Tente novamente.');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  protected nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.loadTailedBeasts(this.currentPage() + 1);
    }
  }

  protected prevPage(): void {
    if (this.currentPage() > 1) {
      this.loadTailedBeasts(this.currentPage() - 1);
    }
  }

  protected toCardItem(beast: TailedBeast): CardItem {
    return {
      id: beast.id,
      name: beast.name,
      images: beast.images && beast.images.length > 0 ? beast.images : ['/imgs/no_image.png'],
      subtitle: beast.debut?.anime || beast.debut?.manga || undefined
    };
  }
}
