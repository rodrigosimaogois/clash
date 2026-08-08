import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarService } from '../../services/war.service';
import { WarDetailsResponse } from '../../models/war.model';

@Component({
  selector: 'app-war-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './war-details.component.html',
  styleUrls: ['./war-details.component.css']
})
export class WarDetailsComponent implements OnInit {
  inputTag: string = 'PUVPQPGL';
  warData: WarDetailsResponse | null = null;
  loading: boolean = false;
  errorMsg: string = '';

  constructor(private warService: WarService) {}

  ngOnInit(): void {
    this.searchWar();
  }

  searchWar(): void {
    if (!this.inputTag.trim()) return;

    this.loading = true;
    this.errorMsg = '';

    this.warService.getWarDetails(this.inputTag).subscribe({
      next: (data) => {
        this.warData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Erro ao buscar dados do clã. Verifique a Tag digitada.';
        this.loading = false;
        this.warData = null;
      }
    });
  }
}
