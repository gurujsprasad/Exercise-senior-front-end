import { Injectable } from '@angular/core';
import { interval, Observable,from } from 'rxjs';
import { Asset } from '../_models/asset';

@Injectable()
export class DataMockService {
   // private assets: Asset [] = []; 
    assets: Asset [] = [];
    
    constructor(){
        this.assets = this.getAllAssets(200);
    }

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