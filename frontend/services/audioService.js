import audioMapping from '../public/audio/conversation/mapping.json';

/**
 * 音声サービス - TTS APIとMP3ファイルのハイブリッドシステム
 */
export const audioService = {
  /**
   * テキストに基づいてMP3ファイルを検索
   */
  findMp3File: (text) => {
    // 完全一致を検索
    const exactMatch = audioMapping.mappings.texts[text];
    if (exactMatch) {
      return `/audio/conversation/${exactMatch}`;
    }

    // カテゴリベースの検索
    for (const [category, keywords] of Object.entries(audioMapping.mappings.categories)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          const categoryFile = audioMapping.mappings.default[category];
          if (categoryFile) {
            return `/audio/conversation/${categoryFile}`;
          }
        }
      }
    }

    // フォールバック
    if (audioMapping.fallback.enabled && audioMapping.fallback.defaultFile) {
      return `/audio/conversation/${audioMapping.fallback.defaultFile}`;
    }

    return null;
  },

  /**
   * MP3ファイルが存在するかチェック
   */
  checkMp3Exists: async (path) => {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * テキストを音声に変換（TTSまたはMP3）
   */
  textToAudio: async (text, options = {}) => {
    const { preferMp3 = true, ttsApi = null } = options;

    // MP3優先モードの場合
    if (preferMp3) {
      const mp3Path = audioService.findMp3File(text);
      if (mp3Path) {
        const exists = await audioService.checkMp3Exists(mp3Path);
        if (exists) {
          console.log('MP3ファイル使用:', mp3Path);
          return {
            type: 'mp3',
            url: mp3Path,
            source: 'local'
          };
        }
      }
    }

    // TTS APIを使用
    if (ttsApi) {
      try {
        console.log('TTS API使用');
        const audioUrl = await ttsApi(text, options);
        return {
          type: 'tts',
          url: audioUrl,
          source: 'api'
        };
      } catch (error) {
        console.error('TTS API エラー:', error);
        
        // TTSエラー時のフォールバック
        if (audioMapping.fallback.enabled) {
          const fallbackPath = `/audio/conversation/${audioMapping.fallback.silenceFile}`;
          return {
            type: 'fallback',
            url: fallbackPath,
            source: 'error',
            error: error.message
          };
        }
        
        throw error;
      }
    }

    // どちらも利用できない場合
    throw new Error('音声を生成できませんでした');
  },

  /**
   * 音声URLからAudioオブジェクトを作成
   */
  createAudioPlayer: (audioData) => {
    const audio = new Audio(audioData.url);
    audio.setAttribute('data-source', audioData.source);
    audio.setAttribute('data-type', audioData.type);
    return audio;
  },

  /**
   * バッチ音声ファイル事前読み込み
   */
  preloadAudioFiles: async (texts) => {
    const preloadPromises = texts.map(async (text) => {
      const mp3Path = audioService.findMp3File(text);
      if (mp3Path) {
        try {
          const audio = new Audio(mp3Path);
          audio.preload = 'auto';
          await new Promise((resolve) => {
            audio.addEventListener('canplaythrough', resolve, { once: true });
            audio.addEventListener('error', resolve, { once: true });
          });
          return { text, status: 'loaded', path: mp3Path };
        } catch (error) {
          return { text, status: 'error', error: error.message };
        }
      }
      return { text, status: 'not_found' };
    });

    return Promise.all(preloadPromises);
  }
};

export default audioService;