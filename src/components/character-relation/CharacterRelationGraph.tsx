'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import RelationGraph, { RelationGraphInstance } from 'relation-graph-react';
import type {
  JsonLine,
  JsonNode,
  RGJsonData,
  RGLine,
  RGLink,
  RGNode,
  RGNodeSlotProps,
  RGOptions,
  RelationGraphExpose,
} from 'relation-graph-react';
import { CharacterRelationTransformedData } from './CharacterRelation';
import { cn } from '@/utils';
import { CHARACTER_RELATION_IMPRESSION } from '@/constants/character-relation';
import { useAtomValue } from 'jotai';
import { isCharacterRelationShowAtom, isMobileCharacterRelationShowAtom } from '@/atoms/character-relation';

const BASE_NODE_SIZE = 8;
const BASE_NODE_SIZE_DELTA = 0;

const SPECIAL_NODE_SIZE = 112;

interface CharacterRelationGraphProps {
  data?: CharacterRelationTransformedData;
}

const CharacterRelationGraph = (props: CharacterRelationGraphProps) => {
  const { data } = props;
  const graphRef = useRef<RelationGraphExpose>(null);

  const isCharacterRelationShow = useAtomValue(isCharacterRelationShowAtom);
  const isMobileCharacterRelationShow = useAtomValue(isMobileCharacterRelationShowAtom);

  const jsonData = useMemo<RGJsonData>(
    () => ({
      nodes: Object.entries(data?.individuals || {}).map<JsonNode>(([character, info]) => {
        const isSpecialNode = info.count > 5;
        const nodeSize = isSpecialNode ? SPECIAL_NODE_SIZE : BASE_NODE_SIZE + info.count * BASE_NODE_SIZE_DELTA;

        return {
          id: character,
          text: character,
          disableDefaultClickEffect: true,
          data: {
            count: info.count,
            type: info.type,
            isSpecialNode,
          },
          width: nodeSize,
          height: nodeSize,
        };
      }),

      lines:
        data?.relations.reduce<JsonLine[]>((result, curr) => {
          const id = `${curr.from}-${curr.to}`;
          const oppositeId = `${curr.to}-${curr.from}`;

          const existedLine = result.find((line) => line.id === id || line.id === oppositeId);

          if (existedLine) {
            existedLine.color = '#c11111';
          } else {
            const isImpressionGood = curr.impression === CHARACTER_RELATION_IMPRESSION.GOOD;

            const line: JsonLine = {
              id: `${curr.from}-${curr.to}`,
              from: curr.from,
              to: curr.to,
              text: '',
              isHideArrow: true,
              styleClass: 'z-10',
              color: isImpressionGood ? '#c11111' : '#00329a',
              data: {
                impression: curr.impression,
              },
              fromJunctionPoint: 'border',
              toJunctionPoint: 'border',
            };

            result.push(line);
          }

          return result;
        }, []) || [],
    }),
    [data],
  );

  useEffect(() => {
    renderGraph();

    function renderGraph() {
      // The node and line in the above data can refer to the options in "Node" and "Link & Line" for configuration.
      // Node: https://www.relation-graph.com/#/docs/node
      // Link & Line: https://www.relation-graph.com/#/docs/link
      graphRef.current?.setJsonData(jsonData, (instance: RelationGraphInstance) => {
        instance.setZoom(78);
        instance.moveToCenter();
      });
    }
  }, [jsonData]);

  useEffect(() => {
    if (isCharacterRelationShow || isMobileCharacterRelationShow) {
      graphRef.current?.getInstance().doLayout();
    }
  }, [isCharacterRelationShow, isMobileCharacterRelationShow]);

  // https://www.relation-graph.com/?open_in_browser=true#/docs/graph
  const options: RGOptions = {
    backgroundColor: 'transparent',
    allowShowMiniToolBar: false,
    disableZoom: false,
    disableNodeClickEffect: true,
    disableLineClickEffect: true,
    // isMoveByParentNode: true,
    defaultFocusRootNode: false,

    defaultLineShape: 1,
    defaultLineWidth: 2,

    defaultNodeColor: '',
    defaultNodeShape: 0,
    defaultNodeBorderWidth: 0,

    // https://www.relation-graph.com/?open_in_browser=true#/docs/layout
    layout: {
      layoutName: 'force',
      maxLayoutTimes: 50000,
      force_node_repulsion: 0.5,
      force_line_elastic: 1.8,
      allowAutoLayoutIfSupport: true,
    },
  };

  return <RelationGraph ref={graphRef} options={options} nodeSlot={CustomNode} />;
};
export default memo(CharacterRelationGraph);

function CustomNode(props: RGNodeSlotProps) {
  const { node } = props;

  const isVisitorOnly = node.data?.type === 'visitor';

  return !!node.data?.isSpecialNode && !isVisitorOnly ? (
    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[#d9b8be]">
      <div className="h-[76px] w-[76px] rounded-full bg-red-600/20"></div>
      <div className="absolute left-1/2 top-1/2 h-[40px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 px-[12px] font-poppins text-[28px] font-semibold leading-[40px] tracking-normal text-white shadow-[0px_4px_8px_0px_#00000040]">
        {node.text}
      </div>
    </div>
  ) : (
    <div className={cn('relative h-full w-full rounded-full', isVisitorOnly ? 'bg-[#00329a]' : 'bg-red-600')}>
      <div className="absolute right-0 top-1/2 -z-10 h-[28px] -translate-y-1/2 translate-x-[calc(100%-16px)] rounded-full bg-white pl-[24px] pr-[16px] font-poppins text-[16px] font-medium leading-[28px] tracking-normal text-black shadow-[0px_3px_6px_0px_#00000040]">
        {node.text}
      </div>
    </div>
  );
}
