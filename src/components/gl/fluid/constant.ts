export const OPTS = {
  // 混合系数 - 值越大，新的流体颜色与现有颜色混合得越多
  blend: 0.5,
  // 流体强度 - 控制流体的整体亮度和可见度
  intensity: 2,
  // 力度系数 - 控制鼠标移动对流体的影响力度
  force: 20,
  // 扭曲程度 - 控制流体的扭曲变形程度
  distortion: 0.17,
  // 涡度 - 控制流体的旋转运动程度，值越大旋转越明显
  curl: 1.9,
  // 影响半径 - 控制鼠标交互影响的范围大小
  radius: 0.03,
  // 旋转强度 - 控制流体的螺旋状运动强度
  swirl: 1,

  // 压力系数 - 控制流体的压力扩散程度
  pressure: 0.8,
  // 密度消散率 - 控制流体颜色的衰减速度（值越小消散越快）
  densityDissipation: 0.96,
  // 速度消散率 - 控制流体运动的衰减速度（值越小停止越快）
  velocityDissipation: 1,

  // 流体颜色 - 定义流体的基础颜色
  fluidColor: '#3300ff',
  // 背景颜色
  backgroundColor: '#070410',

  // 是否显示背景
  showBackground: false,
  // 是否启用彩虹模式（流体呈现彩虹色）
  rainbow: true,

  // 染料分辨率 - 控制流体渲染的精细程度
  dyeRes: 512,
  // 模拟分辨率 - 控制流体物理模拟的精细程度
  simRes: 128,
} as const;
