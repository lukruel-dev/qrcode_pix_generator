import { QrCodePix } from 'qrcode-pix';

export interface PixKey {
  id?: string;
  name: string;
  key: string;
  type: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM';
  city: string;
}

export function generatePixPayload(key: string, name: string, city: string, amount: number, transactionId: string = '***') {
  const qrCodePix = QrCodePix({
    version: '01',
    key: key,
    name: name,
    city: city,
    transactionId: transactionId,
    value: amount,
  });

  return qrCodePix.payload();
}
