import request, { Response } from '@/apis/request';
import { TestDataRes } from '@/apis/types';

// TODO: Del fetch test
export const fetchTestData = (testId?: number) =>
  request.get<any, Response<TestDataRes[]>>('/api/test', { params: { testId } });
