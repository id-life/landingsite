import { addCharacterRelationData } from '@/apis';
import { AddCharacterRelationData } from '@/apis/types';
import { useMutation } from '@tanstack/react-query';

export function useMutationCharacterRelation() {
  return useMutation({
    mutationFn: (data: AddCharacterRelationData) => addCharacterRelationData(data),
  });
}
