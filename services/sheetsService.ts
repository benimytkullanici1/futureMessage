
/**
 * Google Sheets API v4 Servisi
 * 
 * GÜVENLİK NOTU: 
 * Bu dosyadaki API_KEY istemci tarafında görünür. 
 * Güvenliği sağlamak için Google Cloud Console üzerinden:
 * 1. "HTTP Referrers" kısıtlaması ekleyerek sadece kendi alan adınızı (domain) yetkilendirin.
 * 2. "API Restrictions" kısmından sadece "Google Sheets API" erişimine izin verin.
 */

// Kendi bilgilerinizi buraya girin
const API_KEY = 'AIzaSyCoA5LPL8NHfXhzbSbVzJc9r6naEKXUogU'; 
const SHEET_ID = '1lc3pmmVZVSq_qf6w50ZSHKBW0sd9IV9w58cj1MTHkuY';
const SHEET_NAME = 'Sheet1'; 

export const fetchMessageFromSheet = async (rowNumber: number): Promise<string> => {
  try {
    // Sadece gerekli olan hücreyi (B sütunu, ilgili satır) sorguluyoruz.
    const range = `${SHEET_NAME}!B${rowNumber}:B${rowNumber}`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Sheets API Hatası:', errorData);
      
      // Daha kullanıcı dostu hata mesajları
      if (response.status === 403) {
        throw new Error('Erişim reddedildi. API anahtarı kısıtlamalarını veya tablo paylaşım ayarlarını kontrol edin.');
      }
      throw new Error('Mesaj veritabanından çekilemedi.');
    }

    const data = await response.json();
    
    if (!data.values || data.values.length === 0 || !data.values[0][0]) {
      throw new Error(`Belirtilen satırda (${rowNumber}) mesaj içeriği bulunamadı.`);
    }

    return data.values[0][0];
  } catch (error) {
    console.error('Servis hatası:', error);
    throw error;
  }
};
