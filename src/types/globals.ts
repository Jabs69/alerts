export type AlertType = 'PRICE_ABOVE' | 'PRICE_BELOW' | 'PRICE_EXACT'

export enum AlertNames {

  PRICE_ABOVE = 'Arriba de',
  PRICE_BELOW = 'Debajo de',
  PRICE_EXACT = 'Precio justo'

}

export interface Coin {

  id: string,
  name: string,
  api_symbol: string,
  symbol: string,
  market_cap_rank: number,
  thumb: string,
  large: string
  price:number
  priceChangePercent: number

}

export interface Alert {

  alert_id?: number
  symbol_id?: string
  alert_type: AlertType
  price: number

}

export interface AlertItem extends Alert {

  name: string
  large: string

}

export interface CoinGeckoResponse {
  coins: Coin[];
  exchanges: any[];
  icos: any[];
  categories: any[];
  nfts: any[];
}