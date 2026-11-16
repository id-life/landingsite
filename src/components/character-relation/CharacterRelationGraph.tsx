'use client';

import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import RelationGraph, { RelationGraphInstance } from 'relation-graph-react';
import type {
  JsonLine,
  JsonNode,
  RGJsonData,
  RGNode,
  RGNodeSlotProps,
  RGOptions,
  RelationGraphExpose,
} from 'relation-graph-react';
import { CharacterRelationTransformedData } from './CharacterRelation';
import { cn } from '@/utils';
import { CHARACTER_RELATION_IMPRESSION } from '@/constants/character-relation';

import { color } from '@/styles/tokens';

const BASE_NODE_SIZE = 8;
const BASE_NODE_SIZE_DELTA = 0;

const SPECIAL_NODE_SIZE = 112;

/**
 * MOT-12: the force layout comes to rest. It used to run for maxLayoutTimes 500000 steps (one per animation frame,
 * about 2.3 hours), repositioning every node and re-laying-out the page 60 times a second for as long as the tab
 * stayed open. Now it stops once the graph has settled (the summed node movement per frame stays under SETTLED_PX for
 * SETTLED_FRAMES frames in a row), and in any case after MAX_LAYOUT_STEPS (about 15 s at 60 Hz). A drag restarts it
 * for at most RELAYOUT_MS so the neighbours follow, then it rests again.
 */
const MAX_LAYOUT_STEPS = 900;
const SETTLED_PX = 0.5;
const SETTLED_FRAMES = 30;
const RELAYOUT_MS = 2000;

interface CharacterRelationGraphProps {
  data?: CharacterRelationTransformedData;
}

// https://github.com/seeksdream/relation-graph/issues/317
const CharacterRelationGraph = (props: CharacterRelationGraphProps) => {
  const { data } = props;
  const graphRef = useRef<RelationGraphExpose | null>(null);
  const redrawRef = useRef(0);
  const settleRef = useRef<{ frame: number; timer: ReturnType<typeof setTimeout> | undefined }>({
    frame: 0,
    timer: undefined,
  });

  /** Watch the layout and stop it once the nodes stop moving (or after `limitMs`, for a relayout after a drag). */
  const settle = useCallback((limitMs?: number) => {
    const watch = settleRef.current;
    cancelAnimationFrame(watch.frame);
    clearTimeout(watch.timer);
    let previous = new Map<string, [number, number]>();
    let quiet = 0;
    // setJsonData restarts the force layout on a timeout: only a layout seen running can be seen to have finished.
    let seenRunning = false;
    const step = () => {
      const instance = graphRef.current?.getInstance();
      if (!instance) return;
      seenRunning ||= Boolean(instance.options.autoLayouting);
      const next = new Map<string, [number, number]>();
      let moved = 0;
      for (const node of instance.getNodes() as RGNode[]) {
        const before = previous.get(node.id);
        if (before) moved += Math.abs(node.x - before[0]) + Math.abs(node.y - before[1]);
        next.set(node.id, [node.x, node.y]);
      }
      quiet = seenRunning && previous.size && moved < SETTLED_PX ? quiet + 1 : 0;
      previous = next;
      if (quiet >= SETTLED_FRAMES || (seenRunning && !instance.options.autoLayouting)) {
        instance.stopAutoLayout();
        clearTimeout(watch.timer);
        return;
      }
      watch.frame = requestAnimationFrame(step);
    };
    watch.frame = requestAnimationFrame(step);
    if (limitMs) {
      watch.timer = setTimeout(() => {
        cancelAnimationFrame(watch.frame);
        graphRef.current?.getInstance()?.stopAutoLayout();
      }, limitMs);
    }
  }, []);

  useEffect(() => {
    const watch = settleRef.current;
    const redraw = redrawRef;
    return () => {
      cancelAnimationFrame(watch.frame);
      clearTimeout(watch.timer);
      cancelAnimationFrame(redraw.current);
    };
  }, []);

  const onNodeDragEnd = useCallback(() => {
    const instance = graphRef.current?.getInstance();
    if (!instance) return;
    instance.startAutoLayout();
    settle(RELAYOUT_MS);
  }, [settle]);

  const jsonData = useMemo<RGJsonData>(() => {
    let maxCountNode: JsonNode | null = null;

    const nodes = Object.entries(data?.individuals || {}).map<JsonNode>(([character, info]) => {
      const isSpecialNode = info.count > 5;
      const nodeSize = isSpecialNode ? SPECIAL_NODE_SIZE : BASE_NODE_SIZE + info.count * BASE_NODE_SIZE_DELTA;
      const node: JsonNode = {
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

      if (!maxCountNode) {
        maxCountNode = node;
      } else {
        if (info.count > maxCountNode.data?.count) {
          maxCountNode = node;
        }
      }

      return node;
    });

    const lines =
      data?.relations.reduce<JsonLine[]>((result, curr) => {
        const id = `${curr.from}-${curr.to}`;
        const oppositeId = `${curr.to}-${curr.from}`;

        const existedLine = result.find((line) => line.id === id || line.id === oppositeId);
        const isSelfRelation = curr.from === curr.to;

        if (existedLine) {
          existedLine.color = color.accent;
        }
        // if the line is self-relation, skip adding it
        else if (isSelfRelation) {
        } else {
          const isImpressionGood = curr.impression === CHARACTER_RELATION_IMPRESSION.GOOD;

          const line: JsonLine = {
            id: `${curr.from}-${curr.to}`,
            from: curr.from,
            to: curr.to,
            text: '',
            isHideArrow: true,
            styleClass: 'z-10',
            color: isImpressionGood ? color.accent : color['data-navy'],
            data: {
              impression: curr.impression,
            },
            fromJunctionPoint: 'border',
            toJunctionPoint: 'border',
          };

          result.push(line);
        }

        return result;
      }, []) || [];

    return {
      rootId: maxCountNode ? (maxCountNode as JsonNode).id : undefined,
      nodes,
      lines,
    };
  }, [data]);

  useEffect(() => {
    renderGraph();

    function renderGraph() {
      // The node and line in the above data can refer to the options in "Node" and "Link & Line" for configuration.
      // Node: https://www.relation-graph.com/#/docs/node
      // Link & Line: https://www.relation-graph.com/#/docs/link
      graphRef.current?.setJsonData(jsonData, async (instance: RelationGraphInstance) => {
        // instance.moveToCenter();
        // instance.setZoom(78);
        instance.setZoom(0);
        settle();
        await instance.animateToZoom(75, 800);
      });
    }

    return () => {
      graphRef.current = null;
    };
  }, [jsonData, settle]);

  // useEffect(() => {
  //   if (isCharacterRelationShow || isMobileCharacterRelationShow) {
  //     graphRef.current?.getInstance().doLayout();
  //   }
  // }, [isCharacterRelationShow, isMobileCharacterRelationShow]);

  // https://www.relation-graph.com/?open_in_browser=true#/docs/graph
  const options: RGOptions = {
    backgroundColor: 'transparent',
    allowShowMiniToolBar: false,
    disableZoom: false,
    // The original's wheel step: relation-graph 2.1 zoomed 5 % a notch; 2.2 defaults to 10.
    mouseWheelSpeed: 5,
    disableNodeClickEffect: true,
    disableLineClickEffect: true,
    // isMoveByParentNode: true,
    defaultFocusRootNode: false,

    defaultLineShape: 1,
    defaultLineWidth: 2,

    defaultNodeColor: '',
    defaultNodeShape: 0,
    defaultNodeBorderWidth: 0,

    placeOtherGroup: true,

    // https://www.relation-graph.com/?open_in_browser=true#/docs/layout
    layout: {
      layoutName: 'force',
      maxLayoutTimes: MAX_LAYOUT_STEPS,
      force_node_repulsion: 0.8,
      force_line_elastic: 1,
      allowAutoLayoutIfSupport: true,
    },
  };

  // Touch pan and pinch (relation-graph-react 2.2): the library moves and zooms the canvas, but on a touch drag its
  // view is not redrawn until the gesture ends. Ask for a redraw once a frame while the canvas moves (the original's
  // 2.1 redrew on every move), so one finger pans and two zoom live, as on the original.
  const onCanvasDragging = useCallback(() => {
    if (redrawRef.current) return;
    redrawRef.current = requestAnimationFrame(() => {
      redrawRef.current = 0;
      graphRef.current?.getInstance()?.dataUpdated();
    });
  }, []);

  return (
    <RelationGraph
      ref={graphRef}
      options={options}
      nodeSlot={CustomNode}
      onNodeDragEnd={onNodeDragEnd}
      onCanvasDragging={onCanvasDragging}
      onZoomEnd={onCanvasDragging}
    />
  );
};
export default memo(CharacterRelationGraph);

function CustomNode(props: RGNodeSlotProps) {
  const { node } = props;

  const isVisitorOnly = node.data?.type === 'visitor';

  return !!node.data?.isSpecialNode && !isVisitorOnly ? (
    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-data-rose">
      <div className="h-[76px] w-[76px] rounded-full bg-accent/20"></div>
      <div className="absolute left-1/2 top-1/2 h-[40px] w-max -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent px-[12px] font-text text-[28px] font-semibold leading-[40px] tracking-normal text-white shadow-[0px_4px_8px_0px_#00000040]">
        {node.text}
      </div>
    </div>
  ) : (
    <div className={cn('relative h-full w-full rounded-full', isVisitorOnly ? 'bg-data-navy' : 'bg-accent')}>
      <div className="absolute right-0 top-1/2 -z-10 h-[28px] w-max -translate-y-1/2 translate-x-[calc(100%-16px)] rounded-full bg-white pl-[24px] pr-[16px] font-text text-[16px] font-medium leading-[28px] tracking-normal text-black shadow-[0px_3px_6px_0px_#00000040]">
        {node.text}
      </div>
    </div>
  );
}
