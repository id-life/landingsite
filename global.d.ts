import type { FC, PropsWithChildren } from 'react';
import { ReactThreeFiber } from "@react-three/fiber";
import { EffectComposer, RenderPass, ShaderPass } from "three-stdlib";

declare global {
  export type Component<P = {}> = FC<ComponentType & P>;

  export type ComponentType<P = {}> = { className?: string } & PropsWithChildren & P;

  declare module '*.svg?component' {
    import { FC, SVGProps } from 'react';
    const content: FC<SVGProps<SVGElement>>;
    export default content;
  }
  namespace JSX {
    interface IntrinsicElements {
      waterPass: ReactThreeFiber.Node<ShaderPass, typeof ShaderPass>;
    }
  }
}
