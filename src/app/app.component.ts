import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { interval } from 'rxjs/internal/observable/interval';
import { Asset } from './_models/asset';
import { DataMockService } from './_services/datamock.service';
import { map } from 'rxjs/operators';
import { DateFilter, Filter, FilterOn, NumberFilter, StringFilter } from './_models/filter';

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
  
  appliedFilters: FilterOn[] = []; 

  stringFilters = StringFilter.filters;
  numberFilters = NumberFilter.filters;
  dateFilters = DateFilter.filters;

  constructor(private dataMockService: DataMockService){    

  }

  ngOnInit(): void {
    this.dataMockSubscription = this.mockObservable.subscribe();
    this.displayAssets = this.dataMockService.assets.slice();
    const nfilter = this.numberFilters[1];
    const sfilter = this.stringFilters[0];
    this.appliedFilters = [{columnName:"id", key:5,filter:nfilter},{columnName:"assetName", key:"a",filter:sfilter}];
    this.applyFilter();
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

  public clearFilter(){
    this.displayAssets = this.dataMockService.assets.slice();
    this.appliedFilters.splice(0, this.appliedFilters.length);
    this.sortBy(this.sortByColumn);
  }

 
  public filter(dataType:string, operation: string, column:string, key:any){
    const type = dataType.toLowerCase();
    switch(type){      
      case "number":
          const numberFilter = this.stringFilters.find(a => a.name === operation);
          this.appliedFilters.push({columnName : column,key : key,filter: numberFilter});
          break;
      case "date":
          const dateFilter = this.stringFilters.find(a => a.name === operation);
          this.appliedFilters.push({columnName : column,key : key, filter:dateFilter});
          break;
      default:
          const stringFilter = this.stringFilters.find(a => a.name === operation);
          this.appliedFilters.push({columnName : column,key : key,filter:stringFilter});
          break;
    }
  }

  applyFilter(){
    this.appliedFilters.forEach(item => {
      this.displayAssets = this.displayAssets.filter( a => item.filter.logic(a[item.columnName], item.key));
    });
  }

  public sortBy (key:string){    
    if(this.sortByColumn === '' || this.sortByColumn !== key){
      this.sortByColumn = key;
      this.sortingOrderAsc = true;      
    }
    else{
      this.sortingOrderAsc = !this.sortingOrderAsc;       
    }    
    this.sortArray(this.displayAssets, key, this.sortingOrderAsc);    
  }

  public sortArray <T> (array: Array<T>, key:string, sortingByAsc: boolean){         
    array.sort( (obj1, obj2) => {
      return this.CompareObjectValues(obj1, obj2, key, sortingByAsc)
    });
  }

  public removeSort(){
    this.displayAssets = this.dataMockService.assets.slice();
    this.sortByColumn = '';
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

  
}
