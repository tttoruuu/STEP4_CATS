import { conversationAPI } from './api';

/**
 * 拡張TTSサービス - MP3フォールバック機能付き
 */
export const enhancedTTSAPI = {
  /**
   * テキストを音声に変換（MP3優先、TTS APIフォールバック）
   */
  textToSpeech: async (text, options = {}) => {
    const { 
      preferMp3 = true, 
      voice = 'alloy', 
      model = 'tts-1', 
      speed = 1.0 
    } = options;

    // 音声マッピングデータ
    const audioMappings = {
      "そうなんですね。もう少し詳しく教えていただけますか？": "/audio/conversation/sou_nan_desu_ne.mp3",
      "なるほど、それは大変でしたね。": "/audio/conversation/naruhodo_taihen.mp3",
      "素晴らしいですね！どんなところが特に好きですか？": "/audio/conversation/subarashii_doko_suki.mp3",
      "それは興味深いですね。もっと聞かせてください。": "/audio/conversation/kyoumi_bukai.mp3",
      "お気持ちよくわかります。": "/audio/conversation/okimochi_wakarimasu.mp3",
      "それから、どうなりましたか？": "/audio/conversation/sorekara_dou.mp3",
      "どんな気持ちでしたか？": "/audio/conversation/donna_kimochi.mp3",
      "それは楽しそうですね！": "/audio/conversation/tanoshisou.mp3"
    };

    // MP3ファイルを優先的に使用
    if (preferMp3 && audioMappings[text]) {
      try {
        const mp3Path = audioMappings[text];
        console.log('MP3ファイル使用:', mp3Path);
        
        // MP3ファイルの存在確認
        const response = await fetch(mp3Path, { method: 'HEAD' });
        if (response.ok) {
          return mp3Path;
        }
      } catch (error) {
        console.warn('MP3ファイル読み込みエラー:', error);
      }
    }

    // TTS APIにフォールバック
    try {
      console.log('TTS API使用:', text.substring(0, 30) + '...');
      return await conversationAPI.textToSpeech(text, {
        voice,
        model,
        speed
      });
    } catch (error) {
      console.error('TTS APIエラー:', error);
      
      // 最終フォールバック: デフォルト音声
      const defaultAudio = '/audio/conversation/default_response.mp3';
      console.log('デフォルト音声使用:', defaultAudio);
      return defaultAudio;
    }
  },

  /**
   * 音声ファイルの事前読み込み
   */
  preloadAudio: async (texts) => {
    const audioMappings = {
      "そうなんですね。もう少し詳しく教えていただけますか？": "/audio/conversation/sou_nan_desu_ne.mp3",
      "なるほど、それは大変でしたね。": "/audio/conversation/naruhodo_taihen.mp3",
      "素晴らしいですね！どんなところが特に好きですか？": "/audio/conversation/subarashii_doko_suki.mp3",
      "それは興味深いですね。もっと聞かせてください。": "/audio/conversation/kyoumi_bukai.mp3",
      "お気持ちよくわかります。": "/audio/conversation/okimochi_wakarimasu.mp3",
      "それから、どうなりましたか？": "/audio/conversation/sorekara_dou.mp3",
      "どんな気持ちでしたか？": "/audio/conversation/donna_kimochi.mp3",
      "それは楽しそうですね！": "/audio/conversation/tanoshisou.mp3"
    };

    const preloadPromises = texts.map(text => {
      const mp3Path = audioMappings[text];
      if (mp3Path) {
        return new Promise((resolve) => {
          const audio = new Audio(mp3Path);
          audio.preload = 'auto';
          audio.addEventListener('canplaythrough', () => resolve({ text, status: 'loaded' }), { once: true });
          audio.addEventListener('error', () => resolve({ text, status: 'error' }), { once: true });
        });
      }
      return Promise.resolve({ text, status: 'not_found' });
    });

    return Promise.all(preloadPromises);
  }
};

export default enhancedTTSAPI;