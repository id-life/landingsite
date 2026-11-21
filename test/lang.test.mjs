// ENG-03 A3: the parts that hold mostly Chinese text are marked zh-Hans; English or mixed-mostly-English stays unmarked.
import { describe, expect, test } from 'vitest';
import { isMostlyChinese, zhLang } from '@/utils/lang';

describe('zhLang', () => {
  test('mostly Chinese text is zh-Hans', () => {
    expect(zhLang('这是一段用于测试的中文句子')).toBe('zh-Hans');
    expect(zhLang('E1 用于测试的中文标题 Guest')).toBe('zh-Hans');
  });
  test('English or mostly English text is unmarked', () => {
    expect(zhLang('An interview about longevity science')).toBeUndefined();
    expect(zhLang('A long English sentence with one word 中文 in it')).toBeUndefined();
    expect(zhLang('')).toBeUndefined();
    expect(zhLang(undefined)).toBeUndefined();
  });
  test('numbers and punctuation alone are not Chinese', () => {
    expect(isMostlyChinese('2026/01/23 · 1Hr9Min')).toBe(false);
  });
});
