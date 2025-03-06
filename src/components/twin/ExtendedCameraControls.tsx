import { forwardRef } from 'react';
// import { eventBus } from '@/components/event-bus/eventBus';
// import { MessageType } from '@/components/event-bus/messageType';
import { CameraControls, CameraControlsProps } from '@react-three/drei';
import CameraControlsImpl from 'camera-controls';

type ExtendedCameraControlsProps = CameraControlsProps & {
  enabled?: boolean;
};

const ExtendedCameraControls = forwardRef<CameraControls, ExtendedCameraControlsProps>(({ enabled = true, ...props }, ref) => {
  return (
    <CameraControls
      ref={ref}
      minDistance={1}
      maxDistance={15}
      polarAngle={Math.PI / 2.3}
      mouseButtons={{
        left: CameraControlsImpl.ACTION.ROTATE,
        right: CameraControlsImpl.ACTION.NONE,
        wheel: CameraControlsImpl.ACTION.NONE,
        middle: CameraControlsImpl.ACTION.NONE,
      }}
      azimuthAngle={Math.PI / 12}
      onChange={(event: any) => {
        if (event.type !== 'control') return;
        // eventBus.next({ type: MessageType.SYNC_CAMERA, payload: event.target });
      }}
      // onEnd={(event: any) => {
      //   if (!event.target) return;
      //   event.target.setOrbitPoint(0, 0, 0);
      // }}
      enabled={enabled}
      {...props}
    />
  );
});

ExtendedCameraControls.displayName = 'ExtendedCameraControls';

export default ExtendedCameraControls;
