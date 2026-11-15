import { PredictionModel } from '@/atoms/twin';
import { track } from './track';

/** Stable ids of the Digital Twin prediction models, as they were reported before (DATA-11). */
export const TWIN_MODEL_IDS: Record<keyof typeof PredictionModel, string> = { M0: 'ORG', M1: 'C01', M2: 'C02', M3: 'C03' };

export const twinModelId = (model: PredictionModel | null | undefined) => {
  const key = (Object.keys(PredictionModel) as (keyof typeof PredictionModel)[]).find((k) => PredictionModel[k] === model);
  return key ? TWIN_MODEL_IDS[key] : undefined;
};

export function trackTwin(
  control: 'model' | 'skin' | 'anatomy_camera' | 'report',
  value: string,
  model?: PredictionModel | null,
) {
  const id = twinModelId(model);
  track('twin_interaction', id ? { control, value, model: id } : { control, value });
}
