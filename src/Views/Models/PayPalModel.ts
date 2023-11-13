export interface Link {
  href: string;
  method: string;
  rel: string;
}

export interface ItemTotal {
  currency_code: string;
  value: string;
}

export interface Breakdown {
  item_total: ItemTotal;
}

export interface Amount {
  breakdown: Breakdown;
  currency_code: string;
  value: string;
}

export interface UnitAmount {
  currency_code: string;
  value: string;
}

export interface Item {
  description: string;
  name: string;
  quantity: string;
  unit_amount: UnitAmount;
}

export interface Payee {
  email_address: string;
  merchant_id: string;
}

export interface PurchaseUnit {
  amount: Amount;
  items: Item[];
  payee: Payee;
  reference_id: string;
}

export interface PayPalOrder {
  intent: string;
  create_time: string;
  id: string;
  links: Link[];
  purchase_units: PurchaseUnit[];
  status: string;
}
export interface ApprovedPayPal {
  orderID: string;
  payerID: string;
  paymentID: any;
  billingToken: any;
  facilitatorAccessToken: string;
}
