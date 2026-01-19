<template>
  <div class="multi-terminal-layout">
    <!-- 扫描线和噪点效果 -->
    <div class="scanline"></div>
    <div class="noise"></div>
    
    <div class="layout-container">
      <!-- 左侧三个小终端 -->
      <div class="left-panel">
        <TerminalWindow 
          title="系统状态"
          size="small"
          class="terminal-left-1"
        >
          <slot name="left-1"></slot>
        </TerminalWindow>
        
        <TerminalWindow 
          title="任务日志"
          size="small"
          class="terminal-left-2"
        >
          <slot name="left-2"></slot>
        </TerminalWindow>
        
        <TerminalWindow 
          title="资源监控"
          size="small"
          class="terminal-left-3"
        >
          <slot name="left-3"></slot>
        </TerminalWindow>
      </div>
      
      <!-- 中间主终端 -->
      <div class="center-panel">
        <TerminalWindow 
          title="主控制台"
          size="large"
          class="terminal-center"
        >
          <slot name="center"></slot>
        </TerminalWindow>
      </div>
      
      <!-- 右侧终端 -->
      <div class="right-panel">
        <TerminalWindow 
          title="数据分析"
          size="small"
          class="terminal-right-top"
        >
          <slot name="right-top"></slot>
        </TerminalWindow>
        
        <TerminalWindow 
          title="区域地图"
          size="medium"
          class="terminal-right-bottom"
        >
          <slot name="right-bottom">
            <div class="map-container">
              <slot name="map"></slot>
            </div>
          </slot>
        </TerminalWindow>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TerminalWindow from '../ui/TerminalWindow.vue'
</script>

<style scoped>
.multi-terminal-layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-bg-primary);
  overflow: hidden;
}

/* 扫描线效果 */
.scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    var(--scanline-color) 51%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 100;
  animation: scanline-move 8s linear infinite;
}

@keyframes scanline-move {
  0% { background-position: 0 0; }
  100% { background-position: 0 100%; }
}

/* 噪点效果 */
.noise {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 99;
  animation: noise-move 0.5s steps(10) infinite;
}

@keyframes noise-move {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-2%, -2%); }
  20% { transform: translate(2%, 2%); }
  30% { transform: translate(-2%, 2%); }
  40% { transform: translate(2%, -2%); }
  50% { transform: translate(-1%, 1%); }
  60% { transform: translate(1%, -1%); }
  70% { transform: translate(-1%, -1%); }
  80% { transform: translate(1%, 1%); }
  90% { transform: translate(0%, -1%); }
}

/* 布局容器 */
.layout-container {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 15px;
  padding: 20px;
  height: 100vh;
  box-sizing: border-box;
}

/* 左侧面板 - 三个小终端 */
.left-panel {
  flex: 0 0 20%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.terminal-left-1,
.terminal-left-2,
.terminal-left-3 {
  flex: 1;
  min-height: 0;
}

/* 中间面板 - 主终端 */
.center-panel {
  flex: 0 0 50%;
  display: flex;
}

.terminal-center {
  flex: 1;
  min-height: 0;
}

/* 右侧面板 */
.right-panel {
  flex: 0 0 calc(30% - 30px);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.terminal-right-top {
  flex: 0 0 30%;
  min-height: 0;
}

.terminal-right-bottom {
  flex: 1;
  min-height: 0;
}

/* 地图容器 */
.map-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .layout-container {
    gap: 10px;
    padding: 15px;
  }
  
  .left-panel {
    flex: 0 0 18%;
  }
  
  .center-panel {
    flex: 0 0 52%;
  }
  
  .right-panel {
    flex: 0 0 calc(30% - 20px);
  }
}

@media (max-width: 1024px) {
  .layout-container {
    flex-direction: column;
    gap: 10px;
    padding: 10px;
  }
  
  .left-panel,
  .center-panel,
  .right-panel {
    flex: 1 1 auto;
    width: 100%;
  }
  
  .left-panel {
    flex-direction: row;
    height: 150px;
  }
  
  .right-panel {
    flex-direction: row;
    height: 200px;
  }
  
  .terminal-right-top {
    flex: 0 0 40%;
  }
}
</style>
