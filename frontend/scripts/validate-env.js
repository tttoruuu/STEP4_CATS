#!/usr/bin/env node

/**
 * ビルド時環境変数検証スクリプト
 * 本番環境とローカル環境の設定ミスを防ぐ
 */

const fs = require('fs');
const path = require('path');

// 設定値
const CONFIG = {
  PRODUCTION_BACKEND_URL: 'https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io',
  DEVELOPMENT_BACKEND_URL: 'http://localhost:8000',
  CONTAINER_APPS_PATTERNS: ['.azurecontainerapps.io', '.azurewebsites.net']
};

/**
 * 環境変数の検証
 */
function validateEnvironment() {
  console.log('\n🔧 環境変数検証を開始...\n');
  
  const nodeEnv = process.env.NODE_ENV;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  console.log(`NODE_ENV: ${nodeEnv}`);
  console.log(`NEXT_PUBLIC_API_URL: ${apiUrl || '(未設定)'}`);
  
  const validation = {
    isValid: true,
    errors: [],
    warnings: [],
    recommendations: []
  };

  // NODE_ENV確認
  if (!nodeEnv) {
    validation.errors.push('NODE_ENVが設定されていません');
    validation.isValid = false;
  }

  // 本番環境での検証
  if (nodeEnv === 'production') {
    console.log('\n📦 本番環境ビルドの検証...');
    
    if (!apiUrl) {
      validation.warnings.push('NEXT_PUBLIC_API_URLが未設定です。デフォルト値を使用します。');
      validation.recommendations.push(`デフォルト値: ${CONFIG.PRODUCTION_BACKEND_URL}`);
    } else {
      // 本番環境でのURL検証
      if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
        validation.errors.push('本番環境でローカルホストURLが設定されています');
        validation.isValid = false;
      }
      
      if (apiUrl.startsWith('http:') && !apiUrl.includes('localhost')) {
        validation.warnings.push('本番環境でHTTPプロトコルが使用されています。HTTPSを推奨します。');
        validation.recommendations.push(`推奨URL: ${apiUrl.replace('http:', 'https:')}`);
      }
      
      // Container Apps URLの確認
      const isContainerAppsUrl = CONFIG.CONTAINER_APPS_PATTERNS.some(pattern => 
        apiUrl.includes(pattern));
      
      if (isContainerAppsUrl) {
        console.log('✅ Container Apps URLが検出されました');
      } else {
        validation.warnings.push('Container Apps以外のURLが設定されています');
      }
    }
  }

  // 開発環境での検証
  if (nodeEnv === 'development') {
    console.log('\n🛠️ 開発環境の検証...');
    
    if (apiUrl && CONFIG.CONTAINER_APPS_PATTERNS.some(pattern => apiUrl.includes(pattern))) {
      validation.warnings.push('開発環境で本番APIエンドポイントが設定されています');
      validation.recommendations.push('本番APIを使用する場合は意図的な設定か確認してください');
    }
    
    if (!apiUrl) {
      validation.recommendations.push(`デフォルト値: ${CONFIG.DEVELOPMENT_BACKEND_URL}`);
    }
  }

  return validation;
}

/**
 * .env ファイルの確認
 */
function checkEnvFiles() {
  console.log('\n📁 .envファイルの確認...');
  
  const envFiles = [
    '.env',
    '.env.local',
    '.env.development',
    '.env.production'
  ];
  
  const existingFiles = [];
  const missingFiles = [];
  
  envFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      existingFiles.push(file);
      console.log(`✅ ${file} - 存在`);
      
      // ファイル内容の簡易チェック
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('NEXT_PUBLIC_API_URL')) {
          console.log(`   📝 ${file} に NEXT_PUBLIC_API_URL が含まれています`);
        }
      } catch (err) {
        console.log(`   ⚠️ ${file} の読み取りに失敗: ${err.message}`);
      }
    } else {
      missingFiles.push(file);
      console.log(`❌ ${file} - 存在しない`);
    }
  });
  
  return { existingFiles, missingFiles };
}

/**
 * package.json のスクリプト確認
 */
function checkPackageScripts() {
  console.log('\n📦 package.json のスクリプト確認...');
  
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const scripts = packageJson.scripts || {};
    
    if (scripts.build) {
      console.log(`✅ build スクリプト: ${scripts.build}`);
    } else {
      console.log('❌ build スクリプトが見つかりません');
    }
    
    if (scripts.start) {
      console.log(`✅ start スクリプト: ${scripts.start}`);
    } else {
      console.log('❌ start スクリプトが見つかりません');
    }
    
    // 検証スクリプトの確認
    if (scripts['validate-env']) {
      console.log(`✅ validate-env スクリプト: ${scripts['validate-env']}`);
    } else {
      console.log('ℹ️ validate-env スクリプトが見つかりません（任意）');
    }
    
  } catch (err) {
    console.error('❌ package.json の読み取りに失敗:', err.message);
  }
}

/**
 * 結果の出力
 */
function outputResults(validation, envFiles) {
  console.log('\n' + '='.repeat(50));
  console.log('📊 検証結果');
  console.log('='.repeat(50));
  
  if (validation.isValid) {
    console.log('✅ 環境設定は有効です');
  } else {
    console.log('❌ 環境設定に問題があります');
  }
  
  if (validation.errors.length > 0) {
    console.log('\n🚨 エラー:');
    validation.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }
  
  if (validation.warnings.length > 0) {
    console.log('\n⚠️ 警告:');
    validation.warnings.forEach((warning, index) => {
      console.log(`   ${index + 1}. ${warning}`);
    });
  }
  
  if (validation.recommendations.length > 0) {
    console.log('\n💡 推奨事項:');
    validation.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
  }
  
  console.log(`\n📁 .env ファイル: ${envFiles.existingFiles.length}/${envFiles.existingFiles.length + envFiles.missingFiles.length} 個存在`);
  
  console.log('\n' + '='.repeat(50));
  
  // 終了コード
  if (!validation.isValid) {
    console.log('❌ 検証失敗 - ビルドを中止することを推奨します');
    process.exit(1);
  } else {
    console.log('✅ 検証成功 - ビルドを続行できます');
    process.exit(0);
  }
}

/**
 * メイン処理
 */
function main() {
  console.log('🔧 Miraim フロントエンド環境検証ツール');
  console.log(`実行時刻: ${new Date().toLocaleString('ja-JP')}`);
  
  const validation = validateEnvironment();
  const envFiles = checkEnvFiles();
  checkPackageScripts();
  
  outputResults(validation, envFiles);
}

// スクリプトが直接実行された場合のみmainを呼び出し
if (require.main === module) {
  main();
}

module.exports = {
  validateEnvironment,
  checkEnvFiles,
  checkPackageScripts
};