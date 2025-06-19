import { fetchCharacterRelationData } from '@/apis';
import {
  CharacterRelationTransformedData,
  Individuals,
  IndividualType,
} from '@/components/character-relation/CharacterRelation';
import { useQuery } from '@tanstack/react-query';

export function useFetchCharacterRelation() {
  return useQuery({
    queryKey: ['character-relation'],
    queryFn: () => fetchCharacterRelationData(),
    enabled: false,
    select: (res) => {
      const transformedData =
        res.code === 200
          ? res.data.reduce<CharacterRelationTransformedData>(
              (result, curr) => {
                handleIndividual(result.individuals, curr.character, 'visitor');

                curr.relation.forEach((r) => {
                  handleIndividual(result.individuals, r.character, 'introducer');
                  result.relations.push({
                    from: curr.character,
                    to: r.character,
                    impression: r.impression,
                  });
                });

                return result;
              },
              { individuals: {}, relations: [] },
            )
          : { individuals: {}, relations: [] };

      return transformedData;
    },
  });
}

function handleIndividual(individuals: Individuals, character: string, type: IndividualType) {
  if (!(character in individuals)) {
    individuals[character] = { count: 1, type };
  } else {
    individuals[character].count += 1;
    if (individuals[character].type !== 'all' && individuals[character].type !== type) {
      individuals[character].type = 'all';
    }
  }
}
