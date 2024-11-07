import { Vector3 } from 'three';

/**
 * 计算从点B沿AB方向延伸指定距离的点C
 * @param pointA 起始点A (例如相机位置)
 * @param pointB 参考点B (例如模型位置)
 * @param distance 从B点延伸的距离
 * @returns 计算得到的点C的位置
 */
export function getExtendedPoint(pointA: Vector3, pointB: Vector3, distance: number = 10): Vector3 {
  // 确保使用Vector3对象
  const a = new Vector3(pointA.x, pointA.y, pointA.z);
  const b = new Vector3(pointB.x, pointB.y, pointB.z);

  // 计算从A到B的方向向量
  const direction = new Vector3().subVectors(b, a).normalize();

  // 从B点沿方向延伸distance距离
  return new Vector3().addVectors(b, direction.multiplyScalar(distance));
}

/**
 * 计算带有完整偏移的延伸点
 * @param pointA 起始点
 * @param pointB 参考点
 * @param forwardDistance 前进距离
 * @param sideDistance 左右偏移（正右负左）
 * @param upDistance 上下偏移（正上负下）
 */
export function getExtendedPointWithOffset(
  pointA: Vector3,
  pointB: Vector3,
  forwardDistance: number,
  sideDistance: number,
  upDistance: number,
): Vector3 {
  const a = new Vector3(pointA.x, pointA.y, pointA.z);
  const b = new Vector3(pointB.x, pointB.y, pointB.z);

  const forward = new Vector3().subVectors(b, a).normalize();
  const up = new Vector3(0, 1, 0);
  const right = new Vector3().crossVectors(forward, up).normalize();

  return new Vector3()
    .addVectors(b, forward.multiplyScalar(forwardDistance))
    .add(right.multiplyScalar(sideDistance))
    .add(up.multiplyScalar(upDistance));
}
