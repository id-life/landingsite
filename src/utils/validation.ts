/**
 * 验证邮箱格式是否正确
 * @param email 邮箱地址
 * @returns 如果邮箱格式正确返回true，否则返回false
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 获取邮箱验证错误信息
 * @param email 邮箱地址
 * @returns 错误信息字符串，如果邮箱有效则返回空字符串
 */
export const getEmailError = (email: string): string => {
  if (!email || email.trim() === '') {
    return 'Please enter email address';
  }
  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};
