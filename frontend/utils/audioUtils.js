/**
 * 音声ファイルURL生成ユーティリティ
 * 常にAzure Blob Storageから音声を取得
 */

// Azure Blob Storageの基本設定
const AZURE_BLOB_CONFIG = {
  storageAccount: 'blobeastasiafor9th',
  container: 'miraim-assets',
  baseUrl: 'https://blobeastasiafor9th.blob.core.windows.net/miraim-assets'
};

/**
 * 音声ファイルのURLを生成
 * @param {string} audioPath - 音声ファイルのパス (例: "/audio/shadowing/elicit_001.mp3")
 * @returns {string} 完全なURL
 */
export const getAudioUrl = (audioPath) => {
  // 既に完全URLの場合はそのまま返す
  if (audioPath && audioPath.startsWith('http')) {
    return audioPath;
  }

  // 常にAzure Blob Storageを使用
  const cleanPath = audioPath.startsWith('/') ? audioPath.slice(1) : audioPath;
  return `${AZURE_BLOB_CONFIG.baseUrl}/${cleanPath}`;
};

/**
 * シャドーイング音声の可用性をチェック
 * @param {string} audioPath - 音声ファイルのパス
 * @returns {Promise<boolean>} 音声ファイルが利用可能かどうか
 */
export const checkAudioAvailability = async (audioPath) => {
  try {
    const audioUrl = getAudioUrl(audioPath);
    
    // HEADリクエストでファイルの存在確認
    const response = await fetch(audioUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn(`音声ファイル確認エラー (${audioPath}):`, error);
    return false;
  }
};

/**
 * 音声再生のための統合ハンドラー
 * 常にAzure Blob Storageから音声を取得
 * @param {string} audioPath - 音声ファイルのパス
 * @returns {Promise<string>} 再生可能な音声URL
 */
export const getPlayableAudioUrl = async (audioPath) => {
  const azureUrl = getAudioUrl(audioPath);
  console.log('Azure Blob Storage音声を使用:', azureUrl);
  return azureUrl;
};

export default {
  getAudioUrl,
  checkAudioAvailability,
  getPlayableAudioUrl
};