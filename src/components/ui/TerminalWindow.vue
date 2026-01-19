<template>
  <div :class="['terminal-window', `terminal-${size}`]">
    <div class="terminal-header">
      <div class="terminal-buttons">
        <span class="btn-close"></span>
        <span class="btn-minimize"></span>
        <span class="btn-maximize"></span>
      </div>
      <div class="terminal-title">{{ title }}</div>
      <div class="terminal-spacer"></div>
    </div>
    
    <div class="terminal-content">
      <slot></slot>
    </div>
    
    <div class="terminal-footer" v-if="showFooter">
      <span class="status-indicator"></span>
      <span class="status-text">{{ statusText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  size?: 'small' | 'medium' | 'large'
  showFooter?: boolean
  statusText?: string
}

withDefaults(defineProps<Props>(), {
  title: 'TERMINAL',
  size: 'medium',
  showFooter: true,
  statusText: 'ACTIVE'
})
</script>

<style scoped>
.terminal-window {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  border-radius: 6px;
  box-shadow: 
    var(--shadow-primary),
    inset 0 0 15px rgba(159, 239, 0, 0.05);
  overflow: hidden;
  height: 100%;
}

/* Terminal 头部 */
.terminal-header {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  background: var(--gradient-header);
  border-bottom: 1px solid var(--color-border-light);
  flex-shrink: 0;
}

.terminal-buttons {
  display: flex;
  gap: 6px;
}

.terminal-buttons span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--glow-primary-soft);
}

.btn-close {
  background-color: var(--mac-btn-close);
  border-color: var(--mac-btn-close-border);
}

.btn-minimize {
  background-color: var(--mac-btn-minimize);
  border-color: var(--mac-btn-minimize-border);
}

.btn-maximize {
  background-color: var(--mac-btn-maximize);
  border-color: var(--mac-btn-maximize-border);
}

.terminal-title {
  flex: 1;
  text-align: center;
  color: var(--color-primary);
  font-family: var(--font-terminal);
  font-size: 11px;
  font-weight: bold;
  text-shadow: var(--text-shadow-primary);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.terminal-spacer {
  width: 60px;
}

/* Terminal 内容区 */
.terminal-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  color: var(--color-primary);
  font-family: var(--font-terminal);
  font-size: 13px;
  line-height: 1.6;
  text-shadow: var(--text-shadow-secondary);
}

/* 不同尺寸的调整 */
.terminal-small .terminal-content {
  font-size: 11px;
  padding: 10px;
}

.terminal-medium .terminal-content {
  font-size: 13px;
  padding: 15px;
}

.terminal-large .terminal-content {
  font-size: 14px;
  padding: 20px;
}

/* 滚动条样式 */
.terminal-content::-webkit-scrollbar {
  width: 6px;
}

.terminal-content::-webkit-scrollbar-track {
  background: var(--color-bg-overlay);
}

.terminal-content::-webkit-scrollbar-thumb {
  background: var(--glow-primary-subtle);
  border-radius: 3px;
}

.terminal-content::-webkit-scrollbar-thumb:hover {
  background: var(--glow-primary-soft);
}

/* Terminal 底部 */
.terminal-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: var(--gradient-footer);
  border-top: 1px solid var(--color-border-light);
  font-family: var(--font-terminal);
  font-size: 10px;
  flex-shrink: 0;
}

.status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-primary);
  box-shadow: 0 0 6px var(--glow-primary);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { 
    opacity: 1;
    box-shadow: 0 0 6px var(--glow-primary);
  }
  50% { 
    opacity: 0.6;
    box-shadow: 0 0 3px var(--glow-primary-soft);
  }
}

.status-text {
  color: var(--color-primary);
  text-shadow: var(--text-shadow-secondary);
  letter-spacing: 1px;
  text-transform: uppercase;
}
</style>
