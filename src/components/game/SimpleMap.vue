<template>
  <div class="simple-map">
    <div class="map-grid">
      <div 
        v-for="(row, y) in mapData" 
        :key="y" 
        class="map-row"
      >
        <span 
          v-for="(cell, x) in row" 
          :key="x" 
          :class="['map-cell', getCellClass(cell)]"
          :title="getCellTitle(cell)"
        >
          {{ cell }}
        </span>
      </div>
    </div>
    <div class="map-legend">
      <div class="legend-item">
        <span class="legend-symbol player">@</span>
        <span class="legend-text">你的位置</span>
      </div>
      <div class="legend-item">
        <span class="legend-symbol wall">#</span>
        <span class="legend-text">障碍</span>
      </div>
      <div class="legend-item">
        <span class="legend-symbol path">·</span>
        <span class="legend-text">可通行</span>
      </div>
      <div class="legend-item">
        <span class="legend-symbol target">X</span>
        <span class="legend-text">目标点</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  width?: number
  height?: number
  playerPos?: { x: number; y: number }
}

const props = withDefaults(defineProps<Props>(), {
  width: 20,
  height: 12,
  playerPos: () => ({ x: 10, y: 6 })
})

// 生成简单地图数据
const generateMap = () => {
  const map: string[][] = []
  
  for (let y = 0; y < props.height; y++) {
    const row: string[] = []
    for (let x = 0; x < props.width; x++) {
      // 边界是墙
      if (x === 0 || x === props.width - 1 || y === 0 || y === props.height - 1) {
        row.push('#')
      }
      // 玩家位置
      else if (x === props.playerPos.x && y === props.playerPos.y) {
        row.push('@')
      }
      // 一些随机障碍
      else if (Math.random() < 0.15) {
        row.push('#')
      }
      // 目标点（示例）
      else if (x === props.width - 3 && y === props.height - 3) {
        row.push('X')
      }
      // 可通行区域
      else {
        row.push('·')
      }
    }
    map.push(row)
  }
  
  return map
}

const mapData = ref(generateMap())

const getCellClass = (cell: string) => {
  switch (cell) {
    case '@': return 'player'
    case '#': return 'wall'
    case 'X': return 'target'
    case '·': return 'path'
    default: return ''
  }
}

const getCellTitle = (cell: string) => {
  switch (cell) {
    case '@': return '你的位置'
    case '#': return '障碍'
    case 'X': return '目标点'
    case '·': return '可通行'
    default: return ''
  }
}
</script>

<style scoped>
.simple-map {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  justify-content: center;
}

.map-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-terminal);
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 2px;
}

.map-row {
  display: flex;
  white-space: nowrap;
}

.map-cell {
  display: inline-block;
  width: 1.2em;
  text-align: center;
  text-shadow: 0 0 5px currentColor;
}

.map-cell.player {
  color: var(--color-primary);
  font-weight: bold;
  animation: player-blink 1s ease-in-out infinite;
}

@keyframes player-blink {
  0%, 100% { 
    opacity: 1;
    text-shadow: var(--text-shadow-strong);
  }
  50% { 
    opacity: 0.6;
    text-shadow: var(--text-shadow-primary);
  }
}

.map-cell.wall {
  color: var(--color-secondary);
}

.map-cell.path {
  color: var(--color-tertiary);
  opacity: 0.6;
}

.map-cell.target {
  color: var(--color-warning);
  font-weight: bold;
  text-shadow: 0 0 8px var(--color-warning);
  animation: target-glow 2s ease-in-out infinite;
}

@keyframes target-glow {
  0%, 100% { 
    text-shadow: 0 0 8px var(--color-warning);
  }
  50% { 
    text-shadow: 0 0 15px var(--color-warning), 0 0 20px var(--color-warning);
  }
}

/* 图例 */
.map-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  padding-top: 10px;
  border-top: 1px solid var(--color-border-lighter);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
}

.legend-symbol {
  font-family: var(--font-terminal);
  font-size: 14px;
  font-weight: bold;
  width: 20px;
  text-align: center;
}

.legend-symbol.player {
  color: var(--color-primary);
  text-shadow: var(--text-shadow-primary);
}

.legend-symbol.wall {
  color: var(--color-secondary);
}

.legend-symbol.path {
  color: var(--color-tertiary);
}

.legend-symbol.target {
  color: var(--color-warning);
  text-shadow: 0 0 5px var(--color-warning);
}

.legend-text {
  color: var(--color-primary);
  opacity: 0.8;
}
</style>
