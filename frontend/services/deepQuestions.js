import apiService from './api';

class DeepQuestionsService {
  /**
   * 深堀り質問一覧を取得
   * @param {Object} params - クエリパラメータ
   * @param {string} params.category - カテゴリーフィルター
   * @param {number} params.level - レベルフィルター
   * @param {number} params.limit - 取得件数制限
   */
  async getQuestions(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.category && params.category !== 'all') {
        queryParams.append('category', params.category);
      }
      if (params.level) {
        queryParams.append('level', params.level);
      }
      if (params.limit) {
        queryParams.append('limit', params.limit);
      }
      
      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `/api/deep-questions?${queryString}`
        : '/api/deep-questions';
        
      const response = await apiService.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('深堀り質問の取得に失敗:', error);
      throw error;
    }
  }

  /**
   * 特定の質問を取得
   * @param {number} questionId - 質問ID
   */
  async getQuestion(questionId) {
    try {
      const response = await apiService.get(`/api/deep-questions/${questionId}`);
      return response.data;
    } catch (error) {
      console.error('質問の取得に失敗:', error);
      throw error;
    }
  }

  /**
   * カテゴリー一覧を取得
   */
  async getCategories() {
    try {
      const response = await apiService.get('/api/deep-questions/categories');
      return response.data;
    } catch (error) {
      console.error('カテゴリーの取得に失敗:', error);
      throw error;
    }
  }

  /**
   * 回答を送信
   * @param {number} questionId - 質問ID
   * @param {string} selectedAnswer - 選択した答え (A, B, C, D)
   */
  async submitAnswer(questionId, selectedAnswer) {
    try {
      const response = await apiService.post('/api/deep-questions/progress', {
        question_id: questionId,
        selected_answer: selectedAnswer
      });
      return response.data;
    } catch (error) {
      console.error('回答の送信に失敗:', error);
      throw error;
    }
  }

  /**
   * ユーザーの進捗を取得
   */
  async getUserProgress() {
    try {
      const response = await apiService.get('/api/deep-questions/progress/user');
      return response.data;
    } catch (error) {
      console.error('進捗の取得に失敗:', error);
      throw error;
    }
  }

  /**
   * シャドウィング練習セッションを記録
   * @param {Object} sessionData - セッションデータ
   * @param {number} sessionData.questionId - 質問ID
   * @param {number} sessionData.durationSeconds - 練習時間（秒）
   * @param {number} sessionData.toneScore - トーンスコア
   * @param {number} sessionData.speedScore - スピードスコア
   */
  async createShadowingSession(sessionData) {
    try {
      const response = await apiService.post('/api/deep-questions/shadowing', {
        question_id: sessionData.questionId,
        duration_seconds: sessionData.durationSeconds,
        tone_score: sessionData.toneScore,
        speed_score: sessionData.speedScore
      });
      return response.data;
    } catch (error) {
      console.error('シャドウィングセッションの記録に失敗:', error);
      throw error;
    }
  }

  /**
   * ユーザーの統計情報を取得
   */
  async getUserStats() {
    try {
      const response = await apiService.get('/api/deep-questions/stats/user');
      return response.data;
    } catch (error) {
      console.error('統計情報の取得に失敗:', error);
      throw error;
    }
  }

  /**
   * フロントエンドの質問データ形式に変換
   * @param {Object} apiQuestion - APIから取得した質問データ
   */
  transformApiQuestion(apiQuestion) {
    return {
      id: apiQuestion.id,
      category: apiQuestion.category,
      level: apiQuestion.level,
      situation: apiQuestion.situation_text,
      partnerInfo: {
        name: apiQuestion.partnerInfo.name,
        age: apiQuestion.partnerInfo.age,
        occupation: apiQuestion.partnerInfo.occupation
      },
      statement: apiQuestion.statement,
      options: apiQuestion.options,
      audioUrl: apiQuestion.audioUrl,
      keyPoints: apiQuestion.keyPoints || []
    };
  }

  /**
   * フロントエンド形式に変換された質問リストを取得
   */
  async getTransformedQuestions(params = {}) {
    const questions = await this.getQuestions(params);
    return questions.map(q => this.transformApiQuestion(q));
  }
}

const deepQuestionsService = new DeepQuestionsService();
export default deepQuestionsService;