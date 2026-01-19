<template>
  <MultiTerminalLayout>
    <!-- 左侧第一个终端：系统状态 -->
    <template #left-1>
      <div class="system-status">
        <p class="status-line">
          <span class="label">CPU:</span>
          <span class="value">{{ systemStatus.cpu }}%</span>
        </p>
        <p class="status-line">
          <span class="label">MEM:</span>
          <span class="value">{{ systemStatus.memory }}%</span>
        </p>
        <p class="status-line">
          <span class="label">NET:</span>
          <span :class="['value', systemStatus.network === 'STABLE' ? 'status-ok' : '']">
            {{ systemStatus.network }}
          </span>
        </p>
        <p class="status-line">
          <span class="label">PWR:</span>
          <span class="value status-ok">{{ systemStatus.power }}%</span>
        </p>
      </div>
    </template>

    <!-- 左侧第二个终端：任务日志 -->
    <template #left-2>
      <div class="task-log">
        <p v-for="(log, index) in taskLogs" :key="index" class="log-entry">
          <span class="log-time">{{ log.time }}</span>
          <span :class="['log-message', `log-${log.type}`]">{{ log.message }}</span>
        </p>
      </div>
    </template>

    <!-- 左侧第三个终端：资源监控 -->
    <template #left-3>
      <div class="resource-monitor">
        <p class="resource-item">
          <span class="resource-icon">◆</span>
          <span class="resource-name">数据碎片:</span>
          <span class="resource-value">{{ resources.fragments }}</span>
        </p>
        <p class="resource-item">
          <span class="resource-icon">◇</span>
          <span class="resource-name">能量单元:</span>
          <span class="resource-value">{{ resources.energy }}</span>
        </p>
        <p class="resource-item">
          <span class="resource-icon">◈</span>
          <span class="resource-name">访问权限:</span>
          <span class="resource-value">LV{{ resources.access }}</span>
        </p>
      </div>
    </template>

    <!-- 中间主终端 -->
    <template #center>
      <div class="main-console">
        <div class="console-header">
          <p class="welcome-message">&gt; [ARK] 连接已建立</p>
          <p class="welcome-message">&gt; [ARK] 系统初始化完成</p>
        </div>
        
        <div class="console-content">
          <p class="info-text">你已通过身份验证。A.R.K. 系统正在为你准备下一步任务...</p>
          <p class="info-text">请在周围的终端中查看相关信息。</p>
          <p class="info-text">&nbsp;</p>
          <p class="info-text prompt-line">
            <span class="prompt">&gt; </span>
            <span class="cursor">_</span>
          </p>
        </div>
      </div>
    </template>

    <!-- 右上终端：数据分析 -->
    <template #right-top>
      <div class="data-analysis">
        <p class="analysis-item">信号扫描: <span class="value-scanning">进行中...</span></p>
        <p class="analysis-item">威胁等级: <span class="value-safe">低</span></p>
        <p class="analysis-item">数据完整性: <span class="value-ok">98.7%</span></p>
      </div>
    </template>

    <!-- 右下终端：地图 -->
    <template #map>
      <SimpleMap />
    </template>
  </MultiTerminalLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MultiTerminalLayout from '../../../components/layout/MultiTerminalLayout.vue'
import SimpleMap from '../../../components/game/SimpleMap.vue'

// 系统状态
const systemStatus = ref({
  cpu: 45,
  memory: 62,
  network: 'STABLE',
  power: 87
})

// 任务日志
const taskLogs = ref([
  { time: '14:23:01', message: '身份验证完成', type: 'success' },
  { time: '14:23:15', message: '连接到主系统', type: 'info' },
  { time: '14:23:28', message: '加载区域数据', type: 'info' },
  { time: '14:23:42', message: '等待用户指令', type: 'warning' }
])

// 资源
const resources = ref({
  fragments: 0,
  energy: 100,
  access: 1
})

onMounted(() => {
  console.log('%c[ARK] 第二幕已激活', 'color: #00ff00; font-family: monospace; font-size: 16px; font-weight: bold;')
  
  // 模拟CPU使用率变化
  setInterval(() => {
    systemStatus.value.cpu = 40 + Math.floor(Math.random() * 20)
    systemStatus.value.memory = 58 + Math.floor(Math.random() * 15)
  }, 3000)
})
</script>

<style scoped>
/* 左侧终端样式 */
.system-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-line {
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 5px 0;
  border-bottom: 1px solid var(--color-border-lighter);
}

.label {
  color: var(--color-secondary);
  font-weight: bold;
}

.value {
  color: var(--color-primary);
}

.status-ok {
  color: var(--color-primary);
  text-shadow: var(--text-shadow-primary);
}

/* 任务日志样式 */
.task-log {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.log-entry {
  margin: 0;
  font-size: 11px;
  display: flex;
  gap: 8px;
}

.log-time {
  color: var(--color-tertiary);
  flex-shrink: 0;
}

.log-message {
  color: var(--color-primary);
}

.log-success {
  color: var(--color-primary);
}

.log-info {
  color: var(--color-primary-muted);
}

.log-warning {
  color: var(--color-warning);
}

.log-error {
  color: var(--color-error);
}

/* 资源监控样式 */
.resource-monitor {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resource-item {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.resource-icon {
  color: var(--color-primary);
  font-size: 16px;
  text-shadow: var(--text-shadow-primary);
}

.resource-name {
  color: var(--color-secondary);
  flex: 1;
}

.resource-value {
  color: var(--color-primary);
  font-weight: bold;
}

/* 主控制台样式 */
.main-console {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.console-header {
  border-bottom: 1px solid var(--color-border-light);
  padding-bottom: 15px;
}

.welcome-message {
  margin: 5px 0;
  color: var(--color-primary);
}

.console-content {
  flex: 1;
}

.info-text {
  margin: 10px 0;
  color: var(--color-primary-muted);
  line-height: 1.8;
}

.prompt-line {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.prompt {
  color: var(--color-primary);
  font-weight: bold;
  margin-right: 5px;
}

.cursor {
  color: var(--color-primary);
  animation: cursor-blink 1s step-end infinite;
}

@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 数据分析样式 */
.data-analysis {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.analysis-item {
  margin: 0;
  color: var(--color-secondary);
}

.value-scanning {
  color: var(--color-warning);
  animation: scanning 2s ease-in-out infinite;
}

@keyframes scanning {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.value-safe {
  color: var(--color-primary);
}

.value-ok {
  color: var(--color-primary);
}
</style>
