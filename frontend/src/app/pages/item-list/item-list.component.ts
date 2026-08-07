import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  private itemService = inject(ItemService);

  items = signal<Item[]>([]);
  newItemName = '';

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.itemService.getItems().subscribe({
      next: (data) => this.items.set(data),
      error: (err) => console.error('Erro ao buscar dados:', err)
    });
  }

  addItem() {
    if (!this.newItemName.trim()) return;

    this.itemService.addItem(this.newItemName).subscribe({
      next: () => {
        this.newItemName = '';
        this.loadItems();
      },
      error: (err) => console.error('Erro ao adicionar:', err)
    });
  }

  deleteItem(id: number) {
    this.itemService.deleteItem(id).subscribe({
      next: () => this.loadItems(),
      error: (err) => console.error('Erro ao excluir:', err)
    });
  }
}