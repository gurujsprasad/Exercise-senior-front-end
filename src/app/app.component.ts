import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Asset } from './_models/asset';
import { DataMockService } from './_services/datamock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {  
  title = 'exercise-senior-front-end';
  displayAssets: Asset [] = [];

  private dataMockSubscription: Subscription;

  constructor(private dataMockService: DataMockService){    
  }
  ngOnInit(): void {
    this.dataMockSubscription = this.dataMockService.mockObservable.subscribe();
    this.displayAssets = this.dataMockService.assets;
  }
  ngOnDestroy(): void {    
    this.dataMockSubscription.unsubscribe();
  }
}
