import formidable from 'formidable';
import fs from 'fs';
import OpenAI from 'openai';
import { File } from 'buffer';

// Node.js 18でFileグローバルを設定
if (!global.File) {
  global.File = File;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log('Whisper API called, method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 環境変数からAPIキーを取得（複数の可能性をチェック）
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not set in environment variables');
    return res.status(500).json({ 
      error: 'OpenAI API key not configured',
      details: 'Please set OPENAI_API_KEY environment variable'
    });
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 25 * 1024 * 1024, // 25MB limit
    });

    const [fields, files] = await form.parse(req);
    
    console.log('Parsed files:', files);
    
    const audioFile = files.audio;
    if (!audioFile || !audioFile[0]) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const file = audioFile[0];
    console.log('Audio file path:', file.filepath);
    console.log('Audio file size:', file.size);
    
    // OpenAI Whisper APIを呼び出し
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(file.filepath),
      model: 'whisper-1',
      language: 'ja', // 日本語を指定
    });

    // 一時ファイルを削除
    fs.unlinkSync(file.filepath);

    console.log('Transcription result:', transcription.text);

    res.status(200).json({
      text: transcription.text,
    });
  } catch (error) {
    console.error('Whisper API error:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    // エラーレスポンス
    res.status(500).json({
      error: 'Speech recognition failed',
      details: error.message,
      apiKeyExists: !!process.env.OPENAI_API_KEY,
    });
  }
}