import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { interval } from 'rxjs/internal/observable/interval';
import { Asset } from './_models/asset';
import { DataMockService } from './_services/datamock.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {  
  title = 'exercise-senior-front-end';
  displayAssets: Asset [] = [];
  sortByColumn: string = '';
  sortingOrderAsc: boolean = false;
  private timeObservable = interval(1000);
  private dataMockSubscription: Subscription;

  constructor(private dataMockService: DataMockService){    
  }
  ngOnInit(): void {
    this.dataMockSubscription = this.mockObservable.subscribe();
    this.displayAssets = this.dataMockService.assets;
  }
  ngOnDestroy(): void {    
    this.dataMockSubscription.unsubscribe();
  }  
  mockObservable = Observable.create(observer => {
    this.timeObservable.subscribe(() => {
      from(this.dataMockService.assets).pipe(map(val => {
        const random = Math.random();
        val.price = random >= 0.5 ? val.price + random : val.price - random;
        val.lastUpdate = Date.now();      
        if(this.sortByColumn === 'price'){
          this.sortBy('price');
        }if(this.sortByColumn === 'lastUpdate'){
          this.sortBy('lastUpdate');
        }
        return val;
      }))      
      .subscribe(val => observer.next(val));
    });
  });
  public sortBy (key:string){

    let sameColumnClicked = false;
    if(this.sortByColumn === '' || this.sortByColumn !== key){
      this.sortByColumn = key;
      this.sortingOrderAsc = true;      
    }
    else{
      this.sortingOrderAsc = !this.sortingOrderAsc;       
    }    
    this.sortArray(this.displayAssets, key, this.sortingOrderAsc);
    
  }

  private CompareObjectValues(object1: any, object2:any, key:string, sortingByAsc: boolean): number{

    if(object1.hasOwnProperty(key) && object2.hasOwnProperty(key)){
      const a = object1[key];
      const b = object2[key];
      if(a === null || a === undefined){
        if(b === null || b === undefined){
          return 0;
        }
        return -1;
      } else if(b === null || b === undefined){
          return 0;
      }

      if(sortingByAsc === true){
        return a > b ? 1 : -1;
      }else{
        return a > b ? -1: 1;
      }
    }else{
      return 0;
    }
  }

  public sortArray <T> (array: Array<T>, key:string, sortingByAsc: boolean){         
    array.sort( (obj1, obj2) => {
      return this.CompareObjectValues(obj1, obj2, key, sortingByAsc)
    });
  }
}
