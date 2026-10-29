export interface ParsedSorobanEvent {
  topic: string;
  summary: string;
  timestamp: string;
  contractType: 'escrow' | 'passport' | 'financing' | 'designer';
}

export function parseContractEvent(rawTopic: string, rawData: any): ParsedSorobanEvent {
  const topicLower = rawTopic.toLowerCase();

  let contractType: ParsedSorobanEvent['contractType'] = 'escrow';
  let summary = 'Contract state update on Stellar';

  if (topicLower.includes('passport') || topicLower.includes('mint')) {
    contractType = 'passport';
    summary = `Digital garment passport minted (${rawData?.productId || 'Bio-Silk #001'})`;
  } else if (topicLower.includes('financ') || topicLower.includes('factoring')) {
    contractType = 'financing';
    summary = `Production financing capital deployed (${rawData?.amount || '500 XLM'})`;
  } else if (topicLower.includes('designer') || topicLower.includes('atelier')) {
    contractType = 'designer';
    summary = `New atelier registered on Stellar Threads`;
  } else {
    contractType = 'escrow';
    summary = `Escrow milestone progression reached`;
  }

  return {
    topic: rawTopic,
    summary,
    timestamp: new Date().toISOString(),
    contractType,
  };
}
