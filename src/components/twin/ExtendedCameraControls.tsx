import { forwardRef } from 'react';
import { CameraControls, CameraControlsProps } from '@react-three/drei';
import CameraControlsImpl from 'camera-controls';
import { eventBus } from '../event-bus/eventBus';
import { MessageType } from '../event-bus/messageType';

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
        eventBus.next({ type: MessageType.SYNC_CAMERA, payload: event.target });
      }}
      enabled={enabled}
      {...props}
    />
  );
});

ExtendedCameraControls.displayName = 'ExtendedCameraControls';

export default ExtendedCameraControls;
