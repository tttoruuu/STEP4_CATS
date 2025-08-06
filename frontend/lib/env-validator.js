/**
 * 環境変数検証ユーティリティ
 * Next.jsの環境変数が正しく設定されているか確認
 */

const chalk = require('chalk');

class EnvValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * 必須環境変数のチェック
   */
  validateRequired(name, value) {
    if (!value || value === 'undefined') {
      this.errors.push(`❌ ${name} is not set`);
      return false;
    }
    return true;
  }

  /**
   * URL形式の検証
   */
  validateUrl(name, value) {
    if (!value) return false;
    
    try {
      new URL(value);
      return true;
    } catch {
      this.errors.push(`❌ ${name} is not a valid URL: ${value}`);
      return false;
    }
  }

  /**
   * 環境に応じた値の検証
   */
  validateEnvironmentValue(name, value, env) {
    if (env === 'production') {
      // 本番環境でlocalhostは警告
      if (value && value.includes('localhost')) {
        this.warnings.push(`⚠️  ${name} contains 'localhost' in production: ${value}`);
      }
      
      // 本番環境でHTTPは警告
      if (value && value.startsWith('http://') && !value.includes('localhost')) {
        this.warnings.push(`⚠️  ${name} uses HTTP instead of HTTPS in production: ${value}`);
      }
    }
    
    if (env === 'development') {
      // 開発環境で本番URLは警告
      if (value && value.includes('azurecontainerapps.io')) {
        this.warnings.push(`⚠️  ${name} points to production in development: ${value}`);
      }
    }
  }

  /**
   * メイン検証関数
   */
  validate() {
    const env = process.env.NODE_ENV || 'development';
    const isProduction = env === 'production';
    
    console.log(chalk.blue.bold('\n🔍 Validating environment variables...\n'));
    console.log(chalk.gray(`Environment: ${env}\n`));

    // 必須環境変数
    const requiredVars = {
      'NEXT_PUBLIC_API_URL': process.env.NEXT_PUBLIC_API_URL,
    };

    // オプション環境変数
    const optionalVars = {
      'NEXT_PUBLIC_APP_NAME': process.env.NEXT_PUBLIC_APP_NAME || 'MIRAIM',
      'NEXT_PUBLIC_APP_VERSION': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    };

    // 必須変数の検証
    Object.entries(requiredVars).forEach(([name, value]) => {
      if (this.validateRequired(name, value)) {
        if (name.includes('URL')) {
          this.validateUrl(name, value);
        }
        this.validateEnvironmentValue(name, value, env);
      }
    });

    // オプション変数の検証
    Object.entries(optionalVars).forEach(([name, value]) => {
      if (value && name.includes('URL')) {
        this.validateUrl(name, value);
      }
      this.validateEnvironmentValue(name, value, env);
    });

    // 結果の表示
    this.displayResults();

    // エラーがある場合は終了コード1で終了
    if (this.errors.length > 0) {
      process.exit(1);
    }
  }

  /**
   * 検証結果の表示
   */
  displayResults() {
    // 現在の設定を表示
    console.log(chalk.cyan.bold('Current Configuration:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(`NEXT_PUBLIC_API_URL: ${chalk.yellow(process.env.NEXT_PUBLIC_API_URL || 'not set')}`);
    console.log(`NODE_ENV: ${chalk.yellow(process.env.NODE_ENV || 'not set')}`);
    console.log(`ENVIRONMENT: ${chalk.yellow(process.env.ENVIRONMENT || 'not set')}`);
    console.log(chalk.gray('─'.repeat(50)));
    console.log();

    // エラーの表示
    if (this.errors.length > 0) {
      console.log(chalk.red.bold('❌ Errors found:'));
      this.errors.forEach(error => console.log(chalk.red(error)));
      console.log();
    }

    // 警告の表示
    if (this.warnings.length > 0) {
      console.log(chalk.yellow.bold('⚠️  Warnings:'));
      this.warnings.forEach(warning => console.log(chalk.yellow(warning)));
      console.log();
    }

    // サマリー
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log(chalk.green.bold('✅ All environment variables are properly configured!\n'));
    } else if (this.errors.length > 0) {
      console.log(chalk.red.bold(`❌ Validation failed with ${this.errors.length} error(s)\n`));
    } else {
      console.log(chalk.green.bold(`✅ Validation passed with ${this.warnings.length} warning(s)\n`));
    }
  }
}

// CLIから実行された場合
if (require.main === module) {
  const validator = new EnvValidator();
  validator.validate();
}

module.exports = EnvValidator;