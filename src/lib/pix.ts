export interface PixPayload {
  pixKey: string;
  description: string;
  merchantName: string;
  merchantCity: string;
  txid: string;
  amount: string;
}

export function generatePixPayload({
  pixKey,
  description,
  merchantName,
  merchantCity,
  txid,
  amount,
}: PixPayload): string {
  const ID_PAYLOAD_FORMAT_INDICATOR = '00';
  const ID_MERCHANT_ACCOUNT_INFORMATION = '26';
  const ID_MERCHANT_ACCOUNT_INFORMATION_GUI = '00';
  const ID_MERCHANT_ACCOUNT_INFORMATION_KEY = '01';
  const ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION = '02';
  const ID_MERCHANT_CATEGORY_CODE = '52';
  const ID_TRANSACTION_CURRENCY = '53';
  const ID_TRANSACTION_AMOUNT = '54';
  const ID_COUNTRY_CODE = '58';
  const ID_MERCHANT_NAME = '59';
  const ID_MERCHANT_CITY = '60';
  const ID_ADDITIONAL_DATA_FIELD_TEMPLATE = '62';
  const ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID = '05';
  const ID_CRC16 = '63';

  const payload: { [key: string]: string } = {};

  payload[ID_PAYLOAD_FORMAT_INDICATOR] = '01';

  const merchantAccountInfo: { [key: string]: string } = {};
  merchantAccountInfo[ID_MERCHANT_ACCOUNT_INFORMATION_GUI] = 'br.gov.bcb.pix';
  merchantAccountInfo[ID_MERCHANT_ACCOUNT_INFORMATION_KEY] = pixKey;

  if (description) {
    merchantAccountInfo[ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION] = description;
  }

  payload[ID_MERCHANT_ACCOUNT_INFORMATION] = Object.entries(merchantAccountInfo)
    .map(([id, value]) => `${id}${String(value.length).padStart(2, '0')}${value}`)
    .join('');

  payload[ID_MERCHANT_CATEGORY_CODE] = '0000';
  payload[ID_TRANSACTION_CURRENCY] = '986';
  payload[ID_TRANSACTION_AMOUNT] = amount;
  payload[ID_COUNTRY_CODE] = 'BR';
  payload[ID_MERCHANT_NAME] = merchantName;
  payload[ID_MERCHANT_CITY] = merchantCity;

  const additionalDataField: { [key: string]: string } = {};
  additionalDataField[ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID] = txid;
  payload[ID_ADDITIONAL_DATA_FIELD_TEMPLATE] = Object.entries(additionalDataField)
    .map(([id, value]) => `${id}${String(value.length).padStart(2, '0')}${value}`)
    .join('');

  let pixString = Object.entries(payload)
    .map(([id, value]) => `${id}${String(value.length).padStart(2, '0')}${value}`)
    .join('');

  pixString += ID_CRC16 + '04';

  const crc16 = calculateCRC16(pixString);
  pixString += crc16;

  return pixString;
}

function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
    }
  }

  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0');
}
