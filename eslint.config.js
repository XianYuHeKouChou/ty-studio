import js from '@eslint/js'
import {defineConfig, globalIgnores} from 'eslint/config'
import pluginImport from 'eslint-plugin-import'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default defineConfig([
  {
    name: 'app/files',  // 配置名称（用于调试）
    files: ['**/*.{js,jsx,vue}'],  // 应用的文件模式
    ignores: ['**/*.d.ts'],  // 忽略的类型声明文件
    languageOptions: {
      globals: {
        ...globals.browser,  // 浏览器全局变量（window, document等）
      },
      ecmaVersion: 'latest',  // 使用最新的ECMAScript特性
      sourceType: 'module',   // 使用ES模块语法
    },
    plugins: {
      import: pluginImport,  // 导入/导出相关的linting规则
    },
    rules: {
      // 未使用变量警告（忽略以_开头的参数）
      'no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
      // 控制台语句限制（只允许warn和error）
      'no-console': ['warn', {allow: ['warn', 'error']}],
      // 导入排序规则
      'import/order': ['warn', {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always',      // 组间空行
        alphabetize: {order: 'asc', caseInsensitive: true},  // 字母排序
      }],
      // Vue相关规则
      'vue/no-mutating-props': 'warn',    // 禁止直接修改props
      'vue/require-default-prop': 'off',  // 关闭props必须默认值的要求
    },
  },
  globalIgnores(['**/dist/**', '**/coverage/**']),  // 忽略构建和测试覆盖率的文件
  js.configs.recommended,  // ESLint JavaScript推荐规则
  ...pluginVue.configs['flat/essential'],  // Vue.js基础规则集
])
