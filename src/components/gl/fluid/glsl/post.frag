uniform sampler2D tFluid;

uniform vec3 uColor;
uniform vec3 uBackgroundColor;

uniform float uDistort;
uniform float uIntensity;
uniform float uRainbow;
uniform float uBlend;
uniform float uShowBackground;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // 获取流体颜色
    vec3 fluidColor = texture2D(tFluid, uv).rgb;
    
    // 计算扭曲效果
    vec2 distortedUv = uv - fluidColor.rg * uDistort;
    vec4 texture = texture2D(inputBuffer, distortedUv);
    
    // 降低强度使效果更柔和
    float intensity = length(fluidColor) * uIntensity * 0.5;
    
    // 使用原始颜色但降低饱和度
    vec3 selectedColor = mix(texture.rgb, uColor * length(fluidColor), 0.3);
    
    // 创建柔和的流体效果颜色
    vec4 colorForFluidEffect;
    if(uRainbow == 1.0) {
        // 如果启用彩虹模式，降低颜色强度并与原始颜色混合
        colorForFluidEffect = vec4(mix(texture.rgb, fluidColor, 0.3), 1.0);
    } else {
        colorForFluidEffect = vec4(selectedColor, 1.0);
    }
    
    vec4 computedBgColor = vec4(uBackgroundColor, 1.);

    if(uShowBackground == 0.0) {
        // 使用更柔和的混合
        outputColor = mix(texture, colorForFluidEffect, intensity * 0.8);
        return;
    }

    // 降低混合强度
    vec4 computedFluidColor = mix(texture, colorForFluidEffect, uBlend * 0.8);

    vec4 finalColor;
    if(texture.a < 0.1) {
        finalColor = mix(computedBgColor, colorForFluidEffect, intensity * 0.58);
    } else {
        finalColor = mix(computedFluidColor, computedBgColor, 1.0 - texture.a);
    }

    outputColor = finalColor;
}
