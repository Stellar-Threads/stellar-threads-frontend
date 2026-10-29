export interface EscrowMilestone {
  stage: number;
  name: string;
  disbursed: boolean;
  payoutStroops: string;
}

export interface GarmentPassportDetails {
  productId: string;
  brandName: string;
  originCountry: string;
  composition: string;
  circularState: 'Manufactured' | 'InCirculation' | 'Refurbished' | 'Recycled';
  nfcDigest: string;
}

export interface FactoringTerms {
  campaignId: number;
  principalStroops: string;
  yieldBps: number;
  daysToMaturity: number;
  repaymentTargetStroops: string;
}
