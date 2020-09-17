import { Injectable } from '@angular/core';
import { interval, Observable,from } from 'rxjs';
import { Asset } from '../_models/asset';
import { map } from 'rxjs/operators';

@Injectable()
export class DataMockService {
   // private assets: Asset [] = []; 
    assets: Asset [] = [];
    private timeObservable = interval(1000);

    constructor(){
        this.assets = this.getAllAssets(200);
    }


    mockObservable = Observable.create(observer => {
        this.timeObservable.subscribe(() => {
          from(this.assets).pipe(map(val => {
            const random = Math.random();
            val.price = random >= 0.5 ? val.price + random : val.price - random;
            val.lastUpdate = Date.now();      
            // if(this.sortByColumn === 'price'){
            //   this.sortBy('price');
            // }if(this.sortByColumn === 'lastUpdate'){
            //   this.sortBy('lastUpdate');
            // }
            return val;
          }))      
          .subscribe(val => observer.next(val));
        });
      });

      public createAsset = (assetId, assetType) => {
        let asset : Asset = {
          id : assetId,
          assetName: assetType === 'Stock' ? ['AAPL','GOOGL','FB', 'TSLA', 'MSFT'][Math.floor(Math.random() * 4)] : ['EUR','USD','GBP', 'NIS', 'AUD'][Math.floor(Math.random() * 4)],
          price: Math.random()*10,
          lastUpdate: Date.now(),
          type: assetType
        };
        return asset; 
      };
      
      public getAllAssets = (n) => {
        const result = [];
        for (let i = 0; i < n; i++) {
          result.push(this.createAsset(i, 'Stock'));
          result.push(this.createAsset(i+n, 'Currency'));
        }       
        return result;
      }

}